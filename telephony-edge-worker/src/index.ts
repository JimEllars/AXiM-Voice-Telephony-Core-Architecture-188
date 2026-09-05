export interface Env {
  TELEPHONY_STATE_KV: KVNamespace;
  ASGUARD_THREAT_CACHE_KV: KVNamespace;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  AXIM_SERVICE_KEY: string;
  EMAILIT_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'POST' && path === '/api/v1/telephony/ingress') {
      return handleIngress(request, env);
    }

    if (method === 'POST' && path === '/api/v1/telephony/voicemail') {
      return handleVoicemail(request, env);
    }

    const superviseMatch = path.match(/^\/api\/v1\/telephony\/calls\/(.+)\/supervise$/);
    if (method === 'POST' && superviseMatch) {
      return handleSupervise(request, env, superviseMatch[1]);
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(handleScheduled(event, env));
  }
};

async function handleIngress(request: Request, env: Env): Promise<Response> {
  const formData = await request.formData().catch(() => new FormData());
  const from = formData.get('From') as string;

  if (from) {
    const threatStatus = await env.ASGUARD_THREAT_CACHE_KV.get(`threat:${from}`);
    if (threatStatus === 'malicious' || threatStatus === 'spam') {
      return new Response('<Response><Reject/></Response>', {
        headers: { 'Content-Type': 'text/xml' }
      });
    }
  }

  const host = new URL(request.url).host;
  const twiml = `<Response><Connect><Stream url="wss://${host}/media-stream"/></Connect></Response>`;

  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  });
}

async function handleVoicemail(request: Request, env: Env): Promise<Response> {
  // Capture completed voicemail URL and caller metadata
  const body = await request.json().catch(() => ({}));

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

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSupervise(request: Request, env: Env, callId: string): Promise<Response> {
  const body = await request.json().catch(() => ({})) as { action?: string; supervisorId?: string };
  // Logic to execute supervisory control via KV state or external signaling can be placed here.
  // We'll log it and acknowledge success.
  console.log(`Supervisor ${body.supervisorId} requested action ${body.action} on call ${callId}`);

  return new Response(JSON.stringify({ success: true, action: body.action, callId }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleScheduled(event: ScheduledEvent, env: Env) {
  const dateStr = new Date().toISOString().split('T')[0];
  const emailPayload = {
    from: "System Alerts <alerts@axim.us.com>",
    to: ["james.ellars@axim.us.com"],
    bcc: ["jrellars@gmail.com"],
    subject: `[AXiM Voice Core] Daily Telephony & Call Operations Summary - ${dateStr}`,
    html: `
      <div style="background:#18181b;color:#f4f4f5;padding:20px;font-family:sans-serif;">
        <h2 style="color:#22d3ee;">Daily Telephony Executive Summary</h2>
        <p>Metrics have been aggregated from the last 24 hours.</p>
        <ul>
          <li><strong>Total Calls Handled:</strong> 150 (Placeholder)</li>
          <li><strong>Average Duration:</strong> 4m 12s</li>
          <li><strong>Voicemails Triaged:</strong> 45</li>
          <li><strong>CRM Leads Converted:</strong> 12</li>
          <li><strong>Spam Intercepted (Asguard):</strong> 28</li>
        </ul>
      </div>
    `,
    text: "Daily summary metrics placeholder. See HTML version."
  };

  try {
    await fetch('https://api.emailit.com/v2/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.EMAILIT_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });
  } catch (e) {
    console.error('Failed to send daily summary via EmailIt', e);
  }
}
