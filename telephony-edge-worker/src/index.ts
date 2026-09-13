import { sendEmailItMessage, EmailPayload } from './emailService';

export interface Env {
  TELEPHONY_STATE_KV: KVNamespace;
  ASGUARD_THREAT_CACHE_KV: KVNamespace;
  VOICE_DLQ_KV: KVNamespace;
  VOICE_STATE_KV: KVNamespace;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  AXIM_SERVICE_KEY: string;
  EMAILIT_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  AXIM_INTERNAL_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (method === 'POST' && path === '/api/v1/telephony/ingress') {
        return await handleIngress(request, env, ctx);
      }

      if (method === 'POST' && path === '/api/v1/telephony/voicemail') {
        return await handleVoicemail(request, env, ctx);
      }

      const superviseMatch = path.match(/^\/api\/v1\/telephony\/calls\/(.+)\/supervise$/);
      if (method === 'POST' && superviseMatch) {
        return await handleSupervise(request, env, superviseMatch[1]);
      }

      if (method === 'GET' && path === '/api/v1/voicemail/action') {
        return await handleVoicemailAction(request, env);
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error('Edge worker error:', err);
      // Fallback TwiML
      const twiml = `<Response>
  <Say voice="Polly.Danielle">Thank you for calling AXiM Systems. Please leave a message after the tone.</Say>
  <Record action="/voicemail" maxLength="120" playBeep="true"/>
</Response>`;
      return new Response(twiml, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(handleScheduled(event, env));
  }
};

async function handleIngress(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const twilioSignature = request.headers.get('X-Twilio-Signature');
  const url = request.url;

  const formData = await request.formData().catch(() => new FormData());
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  if (env.TWILIO_AUTH_TOKEN && twilioSignature) {
    const isValid = await validateTwilioRequest(env.TWILIO_AUTH_TOKEN, twilioSignature, url, params);
    if (!isValid) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  const from = params['From'];

  // Asguard Firewall Check
  if (from) {
    const blockedStr = await env.ASGUARD_THREAT_CACHE_KV.get(`block:${from}`);
    if (blockedStr) {
      // Dispatch telemetry event for blocked threat
      ctx.waitUntil(
        fetch('https://api.axim.us.com/api/v1/telemetry/ingest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Axim-Signature': env.AXIM_INTERNAL_KEY || 'dev-key'
          },
          body: JSON.stringify({
            event_type: 'telephony_threat_blocked',
            phone_number: from,
            timestamp: new Date().toISOString()
          })
        }).catch(e => console.error('Failed to dispatch threat telemetry', e))
      );

      const twiml = `<Response><Reject reason="busy"/></Response>`;
      return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
    }
  }

  const callStatus = params['CallStatus'];
  if (callStatus === 'completed' || callStatus === 'failed' || callStatus === 'canceled' || callStatus === 'no-answer') {
     ctx.waitUntil(ctx_dispatchEcosystemEvents(params, env));
  }

  const host = new URL(request.url).host;
  let twiml = `<Response><Connect><Stream url="wss://${host}/media-stream"/></Connect></Response>`;

  // Wrap in try-catch to allow graceful fallback for downstream errors if needed, though Connect stream usually handles itself.
  // The fallback is primarily requested if downstream transcription/db timeouts occur.
  // We'll prepare a fallback block if something throws.

  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  });
}

async function validateTwilioRequest(authToken: string, signature: string, url: string, params: Record<string, string>): Promise<boolean> {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + params[key];
  }

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(authToken),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const mac = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(data));
  const base64Mac = btoa(String.fromCharCode(...new Uint8Array(mac)));

  return base64Mac === signature;
}

async function handleVoicemail(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // Capture completed voicemail URL and caller metadata
  const body = await request.json().catch(() => ({})) as any;

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/telephony_voicemails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      console.error('Failed to save voicemail to Supabase', e);
    }
  }

  // Dispatch transcription
  if (body.RecordingUrl) {
    ctx.waitUntil(
      fetch('https://api.axim.us.com/functions/v1/axim-transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Axim-Signature': env.AXIM_INTERNAL_KEY || 'dev-key'
        },
        body: JSON.stringify({ audioUrl: body.RecordingUrl, voicemailId: body.id || body.CallSid })
      }).catch(e => console.error('Failed to dispatch transcription', e))
    );
  }

  // Dispatch event to AXiM Core and Onyx AI using ctx.waitUntil to prevent premature abort
  ctx.waitUntil(ctx_dispatchEcosystemEvents(body, env));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function ctx_dispatchEcosystemEvents(body: any, env: Env) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Axim-Signature': env.AXIM_INTERNAL_KEY || 'dev-key'
  };

  try {
    await fetch('https://api.axim.us.com/functions/v1/satellite-telemetry', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error('Failed to dispatch to AXiM Core', e);
  }

  try {
    await fetch('https://bridge.axim.us.com/api/v1/ecosystem/event', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error('Failed to dispatch to Onyx AI', e);
  }
}

async function handleSupervise(request: Request, env: Env, callId: string): Promise<Response> {
  const body = await request.json().catch(() => ({})) as { action?: string; supervisorId?: string };
  console.log(`Supervisor ${body.supervisorId} requested action ${body.action} on call ${callId}`);

  return new Response(JSON.stringify({ success: true, action: body.action, callId }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleScheduled(event: ScheduledEvent, env: Env) {
  const dateStr = new Date().toISOString().split('T')[0];

  // Aggregate 24-hour telephony operations (stubbed for now)
  const metrics = {
    totalCalls: 150,
    missedCalls: 12,
    avgDuration: '4m 12s',
    voicemailsTriaged: 45,
    spamIntercepted: 28
  };

  const urgentVoicemails = [
    { id: 'vm_12345', callerId: '+1 555-0199', company: 'Acme Corp', intent: 'Urgent System Outage', urgencyScore: 95 }
  ];

  // Generate tokens for urgent voicemails
  let urgentHtml = '';
  const workerDomain = 'voice-worker.axim.us.com'; // Change appropriately in production based on routing

  for (const vm of urgentVoicemails) {
    const token = await generateHmacToken(vm.id, env.AXIM_INTERNAL_KEY);
    // Store in KV with 24-hour TTL (86400 seconds)
    await env.VOICE_STATE_KV.put(`action:${token}`, JSON.stringify(vm), { expirationTtl: 86400 });

    urgentHtml += `
      <div style="background:#27272a;padding:15px;margin-bottom:15px;border-radius:8px;">
        <h3 style="color:#ef4444;margin-top:0;">Urgent Voicemail Review (HITL)</h3>
        <p><strong>Caller:</strong> ${vm.callerId} (${vm.company})</p>
        <p><strong>Intent:</strong> ${vm.intent} | <strong>Score:</strong> ${vm.urgencyScore}</p>
        <div style="margin-top:10px;">
          <a href="https://${workerDomain}/api/v1/voicemail/action?token=${token}&decision=callback" style="display:inline-block;padding:8px 12px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:4px;margin-right:10px;">Trigger AI Callback / SMS</a>
          <a href="https://${workerDomain}/api/v1/voicemail/action?token=${token}&decision=escalate" style="display:inline-block;padding:8px 12px;background:#ef4444;color:#fff;text-decoration:none;border-radius:4px;margin-right:10px;">Escalate to Support</a>
          <a href="https://voice.axim.us.com/voicemails?id=${vm.id}" style="display:inline-block;padding:8px 12px;background:#10b981;color:#fff;text-decoration:none;border-radius:4px;">Listen in Cockpit</a>
        </div>
      </div>
    `;
  }

  const htmlBody = `
    <div style="background:#18181b;color:#f4f4f5;padding:20px;font-family:sans-serif;">
      <h2 style="color:#22d3ee;">[AXiM Voice Telephony Briefing] Daily Call Activity & Urgent Voicemail Digest</h2>

      <div style="margin-bottom: 20px;">
        <h3 style="color:#a1a1aa;">Telephony Operations</h3>
        <table style="width:100%; border-collapse:collapse; color:#f4f4f5;">
          <tr><td style="padding:8px; border-bottom:1px solid #3f3f46;">Calls Handled</td><td style="padding:8px; border-bottom:1px solid #3f3f46;">${metrics.totalCalls}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #3f3f46;">Missed Calls</td><td style="padding:8px; border-bottom:1px solid #3f3f46;">${metrics.missedCalls}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #3f3f46;">Avg Duration</td><td style="padding:8px; border-bottom:1px solid #3f3f46;">${metrics.avgDuration}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #3f3f46;">Voicemails Triaged (Noota)</td><td style="padding:8px; border-bottom:1px solid #3f3f46;">${metrics.voicemailsTriaged}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #3f3f46;">Spam Blocked (Asguard)</td><td style="padding:8px; border-bottom:1px solid #3f3f46;">${metrics.spamIntercepted}</td></tr>
        </table>
      </div>

      ${urgentHtml}
    </div>
  `;

  const emailPayload: EmailPayload = {
    from: "System Alerts <alerts@domain.com>",
    to: ["james.ellars@axim.us.com"],
    bcc: ["jrellars@gmail.com"],
    subject: `[AXiM Voice Telephony Briefing] Daily Call Activity & Urgent Voicemail Digest - ${dateStr}`,
    html: htmlBody,
    text: "Daily summary metrics. Please view in an HTML compatible email client."
  };

  await sendEmailItMessage(emailPayload, env);
}

async function handleVoicemailAction(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const decision = url.searchParams.get('decision');

  if (!token || !decision) {
    return new Response('Missing parameters', { status: 400 });
  }

  const vmDataStr = await env.VOICE_STATE_KV.get(`action:${token}`);
  if (!vmDataStr) {
    return new Response('Token invalid or expired', { status: 403 });
  }

  const vmData = JSON.parse(vmDataStr);

  // Execute action based on decision
  if (decision === 'callback') {
    // Fire to the SMS/Callback endpoint (example)
    try {
      await fetch('https://api.axim.us.com/functions/v1/trigger-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Axim-Signature': env.AXIM_INTERNAL_KEY || 'dev-key'
        },
        body: JSON.stringify({ voicemailId: vmData.id, action: 'sms_callback' })
      });
    } catch (e) {
      console.error('Failed to dispatch callback action', e);
    }
  } else if (decision === 'escalate') {
    // Fire to AXiM Support endpoint
    try {
      await fetch('https://support.axim.us.com/api/v1/tickets/escalate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Axim-Signature': env.AXIM_INTERNAL_KEY || 'dev-key'
        },
        body: JSON.stringify({ voicemailId: vmData.id, reason: 'hitl_escalation' })
      });
    } catch (e) {
      console.error('Failed to escalate to support', e);
    }
  } else {
    return new Response('Invalid decision', { status: 400 });
  }

  // Remove the token so it can't be reused
  await env.VOICE_STATE_KV.delete(`action:${token}`);

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; background: #18181b; color: #f4f4f5; text-align: center; padding: 50px; }
          .container { max-width: 500px; margin: 0 auto; background: #27272a; padding: 30px; border-radius: 8px; }
          h1 { color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Voicemail Action Dispatched Successfully</h1>
          <p>The action "${decision}" has been executed for voicemail ${vmData.id}.</p>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function generateHmacToken(id: string, secret: string = 'secret'): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const randomSalt = crypto.randomUUID();
  const data = encoder.encode(`${id}:${randomSalt}:${Date.now()}`);

  const signature = await crypto.subtle.sign('HMAC', keyMaterial, data);

  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${randomSalt}.${signatureHex}`;
}
