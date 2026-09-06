export interface EmailPayload {
  from: string;
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailItMessage(payload: EmailPayload, env: any): Promise<boolean> {
  try {
    const response = await fetch('https://api.emailit.com/v1/email/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EMAILIT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`EmailIt API returned ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send via EmailIt, buffering to DLQ', error);

    // Buffer the payload into DLQ for automatic replay
    try {
      const dlqKey = `dlq:email:${Date.now()}`;
      await env.VOICE_DLQ_KV.put(dlqKey, JSON.stringify(payload));
    } catch (kvError) {
      console.error('Failed to write to VOICE_DLQ_KV', kvError);
    }

    return false;
  }
}
