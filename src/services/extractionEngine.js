/**
 * AXiM Neural Extraction Engine v1.0
 * Simulates the extraction of structured entity data from raw transcripts.
 */

export const extractEntityData = (transcript) => {
  const text = transcript.toLowerCase();
  
  // Simulated Regex Patterns
  const emailMatch = transcript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = transcript.match(/(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  
  // Intent detection for notes
  let notes = "Standard inquiry detected.";
  if (text.includes('pricing') || text.includes('quote')) notes = "High-intent sales lead: Requesting pricing models.";
  if (text.includes('broken') || text.includes('error')) notes = "Technical issue: Needs priority support resolution.";
  if (text.includes('cancel') || text.includes('refund')) notes = "Churn risk: Customer expressed dissatisfaction.";

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
    phone: phoneMatch ? phoneMatch[0] : null,
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
