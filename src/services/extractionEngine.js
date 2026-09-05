/**
 * AXiM Neural Extraction Engine v1.0
 * Simulates the extraction of structured entity data from raw transcripts.
 */

export const extractEntityData = (transcript) => {
  const text = transcript.toLowerCase();
  
  // Simulated Regex Patterns
  const emailMatch = transcript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = transcript.match(/(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  
  // Callback Phone Numbers (E.164 normalization logic simulation)
  let normalizedPhone = phoneMatch ? phoneMatch[0] : null;
  if (normalizedPhone) {
    normalizedPhone = normalizedPhone.replace(/[^\d+]/g, '');
    if (!normalizedPhone.startsWith('+')) {
      if (normalizedPhone.length === 10) {
        normalizedPhone = '+1' + normalizedPhone;
      } else {
        normalizedPhone = '+' + normalizedPhone;
      }
    }
  }

  // Customer Account IDs / Invoice Numbers
  const accountIdMatch = transcript.match(/account (number |id )?[a-z0-9-]+/i) || transcript.match(/acct (number |id )?[a-z0-9-]+/i);
  const invoiceIdMatch = transcript.match(/invoice (number |id )?[a-z0-9-]+/i);
  const accountId = accountIdMatch ? accountIdMatch[0].split(' ').pop().toUpperCase() : null;
  const invoiceId = invoiceIdMatch ? invoiceIdMatch[0].split(' ').pop().toUpperCase() : null;

  // Intent detection for notes
  let notes = "Standard inquiry detected.";
  let intentClass = "General";
  let urgency = 1;

  if (text.includes('pricing') || text.includes('quote') || text.includes('buy') || text.includes('sales')) {
    notes = "High-intent sales lead: Requesting pricing models.";
    intentClass = "Sales Inquiry";
  } else if (text.includes('broken') || text.includes('error') || text.includes('help') || text.includes('technical')) {
    notes = "Technical issue: Needs priority support resolution.";
    intentClass = "Support";
  } else if (text.includes('cancel') || text.includes('refund') || text.includes('bill') || text.includes('invoice')) {
    notes = "Billing inquiry/Churn risk: Customer expressed financial concerns.";
    intentClass = "Billing";
  } else if (text.includes('escalate') || text.includes('manager') || text.includes('unacceptable')) {
    notes = "Escalation requested.";
    intentClass = "Escalation";
    urgency = 4;
  }

  // Urgency Score 1-5
  if (text.includes('urgent') || text.includes('down') || text.includes('critical') || text.includes('emergency')) {
    urgency = 5;
  } else if (text.includes('asap') || text.includes('important')) {
    urgency = Math.max(urgency, 3);
  }

  // Extract potential company names (simulated)
  const companies = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Co'];
  const company = companies.find(c => text.includes(c.toLowerCase())) || "Independent Entity";

  // Name extraction (very basic simulation)
  const names = ['John', 'Sarah', 'Michael', 'Emma', 'David'];
  const name = names.find(n => text.includes(n.toLowerCase())) || "Unknown Contact";

  return {
    name,
    company,
    email: emailMatch ? emailMatch[0] : null,
    phone: normalizedPhone,
    accountId,
    invoiceId,
    intentClass,
    urgency,
    notes
  };
};

export const getWorkersAiSchemaPayload = (transcript) => ({
  messages: [
    { role: 'system', content: 'You are an expert entity extraction agent for AXiM Voice Telephony.' },
    { role: 'user', content: `Extract contact name, company, email, phone, and intent summary from this transcript: "${transcript}"` }
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        company: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['name', 'company', 'notes']
    }
  }
});
