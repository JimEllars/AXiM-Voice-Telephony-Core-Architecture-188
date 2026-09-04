/**
 * AXiM Neural Triage Engine v4.2
 * Uses weighted keyword density and intent proximity to determine 
 * classification and confidence levels.
 */

const CLASSIFICATION_WEIGHTS = {
  Billing: {
    keywords: ['invoice', 'bill', 'payment', 'charge', 'credit', 'subscription', 'price', 'cost', 'owe', 'refund', 'overdue'],
    weight: 1.2
  },
  Support: {
    keywords: ['help', 'broken', 'issue', 'problem', 'error', 'technical', 'fix', 'trouble', 'login', 'access', 'crash', 'bug'],
    weight: 1.0
  },
  Sales: {
    keywords: ['buy', 'purchase', 'pricing', 'quote', 'demo', 'enterprise', 'upgrade', 'contract', 'partnership', 'interested', 'demo'],
    weight: 1.5
  },
  Operations: {
    keywords: ['shipping', 'delay', 'warehouse', 'logistics', 'delivery', 'inventory', 'tracking', 'order', 'status', 'arrived'],
    weight: 1.1
  }
};

const PRIORITY_SCORING = {
  urgent: ['asap', 'immediately', 'urgent', 'critical', 'emergency', 'stop', 'failed', 'now', 'yesterday', 'broken'],
  high: ['important', 'soon', 'waiting', 'repeated', 'third time', 'unacceptable', 'frustrated']
};

export const analyzeTranscript = (transcript) => {
  const text = transcript.toLowerCase();
  const scores = {};
  
  // 1. Calculate weighted scores for each category
  Object.keys(CLASSIFICATION_WEIGHTS).forEach(category => {
    const { keywords, weight } = CLASSIFICATION_WEIGHTS[category];
    const matchCount = keywords.reduce((acc, kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    
    scores[category] = matchCount * weight;
  });

  // 2. Determine best fit and confidence
  const sortedCategories = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const bestCategory = sortedCategories[0][1] > 0 ? sortedCategories[0][0] : 'General';
  
  // Confidence is calculated as (Winner Score / Total Score) * 100
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.round((scores[bestCategory] / totalScore) * 100) : 0;

  // 3. Simple Sentiment Logic
  let sentiment = 'neutral';
  const negativeWords = ['angry', 'frustrated', 'terrible', 'bad', 'disappointed', 'delay', 'broken', 'fix', 'worst'];
  const positiveWords = ['great', 'interested', 'happy', 'thanks', 'perfect', 'ready', 'excellent', 'love'];
  
  const negMatches = negativeWords.filter(w => text.includes(w)).length;
  const posMatches = positiveWords.filter(w => text.includes(w)).length;
  
  if (negMatches > posMatches) sentiment = 'negative';
  else if (posMatches > negMatches) sentiment = 'positive';

  // 4. Priority Determination
  let priority = 'low';
  if (PRIORITY_SCORING.urgent.some(w => text.includes(w))) priority = 'urgent';
  else if (PRIORITY_SCORING.high.some(w => text.includes(w))) priority = 'high';

  return {
    classification: bestCategory,
    confidence: bestCategory === 'General' ? 0 : Math.max(confidence, 45), // Floor confidence at 45% for matches
    priority,
    sentiment,
    analyzedAt: new Date().toISOString()
  };
};
export const dispatchCrmEgress = async (voicemail, extractedEntities, status = 'triaged') => {
  try {
    const apiUrl = import.meta.env.VITE_CORE_API_URL || 'https://api.axim.us.com';
    const payload = {
      voicemailId: voicemail.id,
      callerId: voicemail.callerId,
      extractedEntities,
      assignedDepartment: voicemail.classification,
      status
    };

    // Using a mocked signature string for illustration,
    // real implementation would hash payload with secret.
    const signature = 'sha256=' + Date.now().toString(16);

    const res = await fetch(`${apiUrl}/api/v1/telephony/triage-egress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Axim-Signature': signature
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to dispatch CRM egress: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('[CRM_EGRESS_ERROR]', error);
    throw error;
  }
};
