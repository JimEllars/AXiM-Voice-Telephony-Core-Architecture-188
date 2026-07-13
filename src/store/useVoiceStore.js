import { create } from 'zustand';

const initialCalls = [
  { id: 'call_1', callerId: '+1 (555) 019-2834', status: 'ringing', duration: 12, intent: 'Unknown', crmMatch: null },
  { id: 'call_2', callerId: '+1 (415) 882-9102', status: 'in-progress', duration: 45, intent: 'Invoice Inquiry', crmMatch: 'Acme Corp' },
];

const initialVoicemails = [
  { id: 'vm_1', callerId: '+1 (212) 555-0199', duration: 24, transcript: "Hi, this is Sarah from Logistics. I need to update the delivery address for the uniform rental order #4492. Please call me back.", audioUrl: '#', date: new Date(Date.now() - 3600000).toISOString(), crmId: 'cont_8812', autoResponded: true, responseType: 'SMS', archived: false },
  { id: 'vm_2', callerId: '+1 (305) 555-8812', duration: 15, transcript: "I'm trying to reach support regarding the recent billing discrepancy on my account.", audioUrl: '#', date: new Date(Date.now() - 7200000).toISOString(), crmId: null, autoResponded: false, archived: false },
];

const initialThreats = [
  { id: 'thr_1', callerId: '+1 (800) 123-4567', type: 'High Frequency Robocall', location: 'Russia (Proxy)', timestamp: new Date(Date.now() - 1200000).toISOString(), status: 'Auto-Dropped', reputation: 12 },
  { id: 'thr_2', callerId: '+1 (442) 991-0021', type: 'Social Engineering Pattern', location: 'United States', timestamp: new Date(Date.now() - 4500000).toISOString(), status: 'Flagged', reputation: 45 },
];

const initialContacts = [
  { id: 'cont_8812', name: 'Sarah Jenkins', company: 'Logistics Pro', phone: '+1 (212) 555-0199', status: 'Active', lastInteraction: '1 hour ago' },
  { id: 'cont_9921', name: 'Mark Thompson', company: 'Acme Corp', phone: '+1 (415) 882-9102', status: 'Active', lastInteraction: '45 mins ago' },
  { id: 'cont_1022', name: 'Elena Rodriguez', company: 'Global Tech', phone: '+1 (305) 555-1212', status: 'Lead', lastInteraction: '2 days ago' },
];

const initialTemplates = [
  { id: 'tmp_1', name: 'Callback Confirmation', content: 'Hi, this is AXiM Voice. We received your message regarding [Topic]. An agent will call you back at this number within 15 minutes.', type: 'SMS' },
  { id: 'tmp_2', name: 'Invoice Resolution', content: 'Hello, regarding your invoice inquiry, we have updated the records in Deskera CRM. You should receive an email confirmation shortly.', type: 'Email' },
  { id: 'tmp_3', name: 'Support Handoff', content: 'Your message has been escalated to Tier 2 support. Reference ID: AXM-[ID].', type: 'SMS' }
];

const initialAutoRules = [
  { id: 'rule_1', name: 'Billing Keyword', trigger: 'invoice, billing, payment', templateId: 'tmp_2', enabled: true },
  { id: 'rule_2', name: 'Emergency Support', trigger: 'urgent, emergency, broken', templateId: 'tmp_3', enabled: true }
];

export const useVoiceStore = create((set, get) => ({
  activeCalls: initialCalls,
  voicemails: initialVoicemails,
  threats: initialThreats,
  crmContacts: initialContacts,
  templates: initialTemplates,
  autoRules: initialAutoRules,
  agentStatus: 'Available',
  threatMetrics: { blockedToday: 142, estimatedSavings: 24.85 },
  systemMetrics: {
    avgWaitTime: '4.2s',
    aiResolutionRate: '88%',
    totalMinutes: 12450,
    activeNodes: 14
  },
  auditLogs: [
    { id: 'log_1', event: 'Firewall Breach Blocked', source: '+7 (900) 123-XX-XX', type: 'security', time: new Date().toISOString() },
    { id: 'log_2', event: 'CRM Sync Success', source: 'Deskera API', type: 'sync', time: new Date(Date.now() - 300000).toISOString() },
  ],
  selectedCallForIntervention: null,
  firewallPolicies: {
    blacklist: ['+1 (800) 555-9999', '+44 20 7946 0000'],
    whitelist: ['+1 (555) 000-1111'],
    geoBlocking: ['RU', 'CN', 'KP']
  },
  
  routingSettings: {
    welcomeMessage: "Thank you for calling AXiM. How can I assist you today?",
    aiPersona: "Professional Receptionist",
    forwardingNumber: "+1 (555) 999-0000",
    firewallSensitivity: 85,
    autoResponseEnabled: true
  },

  setAgentStatus: (status) => set({ agentStatus: status }),
  setSelectedCall: (call) => set({ selectedCallForIntervention: call }),
  
  archiveVoicemail: (id) => set(state => ({
    voicemails: state.voicemails.map(v => v.id === id ? { ...v, archived: true } : v)
  })),

  deleteVoicemail: (id) => set(state => ({
    voicemails: state.voicemails.filter(v => v.id !== id)
  })),

  addAuditLog: (log) => set(state => ({
    auditLogs: [{ id: `log_${Date.now()}`, ...log, time: new Date().toISOString() }, ...state.auditLogs].slice(0, 50)
  })),

  updateRouting: (newSettings) => set((state) => ({ 
    routingSettings: { ...state.routingSettings, ...newSettings } 
  })),

  addToBlacklist: (number) => {
    set(state => ({
      firewallPolicies: { ...state.firewallPolicies, blacklist: [...state.firewallPolicies.blacklist, number] }
    }));
    get().addAuditLog({ event: 'Number Blacklisted', source: number, type: 'security' });
  },

  removeFromBlacklist: (number) => set(state => ({
    firewallPolicies: { ...state.firewallPolicies, blacklist: state.firewallPolicies.blacklist.filter(n => n !== number) }
  })),

  addTemplate: (template) => set(state => ({ 
    templates: [...state.templates, { ...template, id: `tmp_${Date.now()}` }] 
  })),

  deleteTemplate: (id) => set(state => ({
    templates: state.templates.filter(t => t.id !== id)
  })),

  addAutoRule: (rule) => set(state => ({
    autoRules: [...state.autoRules, { ...rule, id: `rule_${Date.now()}`, enabled: true }]
  })),

  deleteAutoRule: (id) => set(state => ({
    autoRules: state.autoRules.filter(r => r.id !== id)
  })),

  toggleAutoRule: (id) => set(state => ({
    autoRules: state.autoRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
  })),

  subscribeToTelephonyNetwork: () => {
    const interval = setInterval(() => {
      const { activeCalls, routingSettings, autoRules, templates } = get();
      const updatedCalls = activeCalls.map(c => ({ ...c, duration: c.duration + 1 }));
      
      const resolvedCalls = updatedCalls.map(c => 
        c.status === 'ringing' && Math.random() > 0.8 
          ? { ...c, status: 'in-progress', intent: 'Scheduling' } 
          : c
      );

      const filteredCalls = resolvedCalls.filter(c => 
        !(c.status === 'in-progress' && Math.random() > 0.98)
      );

      // Randomly generate new voicemail
      if (Math.random() > 0.98) {
        const id = `vm_${Date.now()}`;
        const transcripts = [
          "I have an issue with the latest invoice I received.",
          "Emergency, the system is down at our main branch.",
          "Just calling to say hello and check in on the team.",
        ];
        const transcript = transcripts[Math.floor(Math.random() * transcripts.length)];
        
        let autoResponded = false;
        let responseType = null;

        if (routingSettings.autoResponseEnabled) {
          const matchingRule = autoRules.find(r => 
            r.enabled && r.trigger.split(',').some(kw => transcript.toLowerCase().includes(kw.trim().toLowerCase()))
          );
          if (matchingRule) {
            autoResponded = true;
            responseType = templates.find(t => t.id === matchingRule.templateId)?.type || 'SMS';
            get().addAuditLog({ event: 'AI Auto-Response Sent', source: responseType, type: 'sync' });
          }
        }

        const newVM = {
          id,
          callerId: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
          duration: Math.floor(Math.random() * 40) + 5,
          transcript,
          audioUrl: '#',
          date: new Date().toISOString(),
          crmId: Math.random() > 0.5 ? 'cont_auto' : null,
          autoResponded,
          responseType,
          archived: false
        };

        set(state => ({ voicemails: [newVM, ...state.voicemails] }));
      }

      if (Math.random() > 0.9 && filteredCalls.length < 5) {
        filteredCalls.push({
          id: `call_${Date.now()}`,
          callerId: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'ringing',
          duration: 0,
          intent: 'Routing...',
          crmMatch: Math.random() > 0.5 ? 'Unknown Contact' : 'Verified Partner'
        });
      }

      set({ activeCalls: filteredCalls });

      if (Math.random() > 0.95) {
        set(state => ({
          threatMetrics: {
            blockedToday: state.threatMetrics.blockedToday + 1,
            estimatedSavings: state.threatMetrics.estimatedSavings + 0.15
          }
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }
}));