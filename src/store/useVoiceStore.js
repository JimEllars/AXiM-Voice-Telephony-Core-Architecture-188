import { create } from 'zustand';
import { analyzeTranscript } from '../services/triageEngine';
import { extractEntityData } from '../services/extractionEngine';

const initialDepartments = [
  { id: 'dept_1', name: 'Sales', color: 'text-emerald-400', icon: 'TrendingUp', description: 'Enterprise acquisition.' },
  { id: 'dept_2', name: 'Support', color: 'text-cyan-400', icon: 'LifeBuoy', description: 'Technical troubleshooting.' },
  { id: 'dept_3', name: 'Operations', color: 'text-fuchsia-400', icon: 'Truck', description: 'Logistics management.' },
  { id: 'dept_4', name: 'Billing', color: 'text-amber-400', icon: 'CreditCard', description: 'Financial compliance.' }
];

const initialAgents = [
  { id: 'agent_1', name: 'Commander Riker', role: 'Human Overseer', status: 'Available', load: 45, node: 'US-EAST-1', metrics: { callsHandled: 142, avgHandlingTime: '4m 12s', resolutionRate: 94.2 }, deptId: 'dept_2' },
  { id: 'agent_2', name: 'ONYX-AI-01', role: 'AI Agent', status: 'Busy', load: 88, node: 'EU-WEST-2', metrics: { callsHandled: 1240, avgHandlingTime: '1m 05s', resolutionRate: 89.8 }, deptId: 'dept_1' },
];

export const useVoiceStore = create((set, get) => ({
  activeCalls: [],
  agents: initialAgents,
  nodes: [
    { id: 'node_1', region: 'US-EAST-1', city: 'N. Virginia', health: 98, load: 45, status: 'Online', latency: '12ms', uptime: '99.99%' },
    { id: 'node_2', region: 'EU-WEST-2', city: 'London', health: 94, load: 72, status: 'Online', latency: '28ms', uptime: '99.95%' },
    { id: 'node_3', region: 'AP-SOUTH-1', city: 'Mumbai', health: 99, load: 12, status: 'Online', latency: '145ms', uptime: '98.40%' },
  ],
  nodeAlerts: [],
  agentAlerts: [],
  departments: initialDepartments,
  voicemails: [],
  entities: [],
  contextDocuments: [],
  auditLogs: [],
  notifications: [],
  crmProvider: 'Nexus',
  agentStatus: 'Available',
  threatMetrics: { blockedToday: 158, estimatedSavings: 32.40, avgThreatScore: 78, highRiskRegions: ['RU', 'CN', 'NG'] },
  crmHealth: { syncSuccessRate: 99.4, avgLatency: '1.2s', queueDepth: 0, activeConnectors: 2, lastGlobalSync: new Date().toISOString(), providerStatus: { Nexus: 'Operational', Deskera: 'Standby', Salesforce: 'Degraded', HubSpot: 'Operational' } },
  routingSettings: { autoResponseEnabled: true, globalMute: false },
  templates: [
    { id: 't1', name: 'Standard Follow-up', type: 'SMS', content: 'Thanks for reaching out! One of our agents will contact you shortly.' },
    { id: 't2', name: 'Priority Support', type: 'Email', content: 'We have received your urgent support request. A technician is assigned.' }
  ],
  autoRules: [
    { id: 'rule_1', name: 'Urgent Sales Trigger', trigger: 'pricing', templateId: 't1', actionType: 'SMS_AND_CRM', enabled: true }
  ],
  fieldMappings: [
    { id: 'map_1', source: 'caller_id', target: 'phone_number', transform: 'E.164 Clean', status: 'Valid' },
  ],
  messages: [],

  // --- CORE ACTIONS ---
  processInboundVoicemail: (voicemail) => {
    const analysis = analyzeTranscript(voicemail.transcript);
    const extraction = extractEntityData(voicemail.transcript);
    const id = `vm_${Date.now()}`;
    const time = new Date().toISOString();
    
    const newVm = {
      ...voicemail,
      ...analysis,
      id,
      date: time,
      actionsTaken: [],
      archived: false,
      autoTriaged: true,
      isManualCorrection: false,
      summary: extraction.notes,
      trail: [
        { id: `tr_1`, event: 'Inbound Transmission Received', type: 'system', detail: `Captured via ${voicemail.node || 'Global-Mesh'}`, time },
        { id: `tr_2`, event: 'Neural Triage Initiated', type: 'ai', detail: `ONYX-MK4: ${analysis.confidence}% confidence in ${analysis.classification}.`, time },
        { id: `tr_3`, event: 'Entity Extraction', type: 'ai', detail: `Extracted: ${extraction.name} from ${extraction.company}.`, time }
      ]
    };

    // Update State
    set(state => ({ 
      voicemails: [newVm, ...state.voicemails],
      entities: extraction.email ? [
        {
          id: `ent_${Date.now()}`,
          name: extraction.name,
          company: extraction.company,
          status: 'Lead',
          sentiment: analysis.sentiment === 'positive' ? 'Positive' : 'Neutral',
          lastContact: 'Just Now',
          extractedData: extraction
        },
        ...state.entities
      ] : state.entities
    }));

    // Trigger Rules
    get().executeRules(newVm);
  },

  executeRules: (voicemail) => {
    const { autoRules, templates, routingSettings } = get();
    if (!routingSettings.autoResponseEnabled) return;

    autoRules.forEach(rule => {
      if (!rule.enabled) return;
      
      const triggerWords = rule.trigger.split(',').map(t => t.trim().toLowerCase());
      const matches = triggerWords.some(word => voicemail.transcript.toLowerCase().includes(word));

      if (matches) {
        const template = templates.find(t => t.id === rule.templateId);
        const actionDetail = `Rule "${rule.name}" triggered: ${rule.actionType}`;
        
        get().executeFollowUp(voicemail.id, {
          id: `act_${Date.now()}`,
          type: rule.actionType.includes('SMS') ? 'SMS' : 'Email',
          detail: template ? `Sent: ${template.name}` : 'Automated Sequence Initiated',
          time: new Date().toISOString(),
          status: 'completed'
        });

        get().logEvent(actionDetail, 'sync', 'Automation Engine');
      }
    });
  },

  executeFollowUp: (vmId, action) => set(state => ({
    voicemails: state.voicemails.map(v => 
      v.id === vmId ? { ...v, actionsTaken: [action, ...v.actionsTaken] } : v
    )
  })),

  // --- KNOWLEDGE BASE ---
  addContextDoc: (doc) => set(state => ({
    contextDocuments: [{ ...doc, id: `doc_${Date.now()}` }, ...state.contextDocuments]
  })),

  deleteContextDoc: (id) => set(state => ({
    contextDocuments: state.contextDocuments.filter(d => d.id !== id)
  })),

  // --- AGENT & NODE ACTIONS ---
  generateAgentAlert: (agentId, load) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (!agent) return;

    const newAlert = {
      id: `alert_agent_${Date.now()}`,
      agentId,
      agentName: agent.name,
      load,
      type: 'Resource Critical',
      timestamp: new Date().toISOString()
    };

    set(state => ({ 
      agentAlerts: [newAlert, ...state.agentAlerts],
      auditLogs: [{ id: Date.now(), event: `Critical Load Alert: ${agent.name} (${load}%)`, type: 'security', source: 'Load Balancer', time: new Date().toISOString() }, ...state.auditLogs]
    }));
  },

  clearAgentAlert: (id) => set(state => ({ agentAlerts: state.agentAlerts.filter(a => a.id !== id) })),

  rebalanceAgent: (agentId) => {
    set(state => ({
      agents: state.agents.map(a => a.id === agentId ? { ...a, load: 40, status: 'Available' } : a),
      agentAlerts: state.agentAlerts.filter(a => a.agentId !== agentId)
    }));
  },

  // --- SIMULATION ---
  subscribeToTelephonyNetwork: () => {
    const interval = setInterval(() => {
      const { activeCalls, agents } = get();
      
      // Random Load Fluctuations
      const updatedAgents = agents.map(agent => ({
        ...agent,
        load: Math.min(Math.max(agent.load + (Math.floor(Math.random() * 8) - 3), 0), 100)
      }));
      set({ agents: updatedAgents });

      // Inbound Call Simulation
      if (Math.random() > 0.92 && activeCalls.length < 5) {
        const id = `call_${Date.now()}`;
        const newCall = {
          id,
          callerId: `+1 (${Math.floor(Math.random()*900)+100}) 555-${Math.floor(Math.random()*9000)+1000}`,
          status: 'active',
          intent: 'Connecting...',
          duration: 0,
          node: 'US-EAST-1',
          messages: [{ id: 1, sender: 'onyx', text: 'Thank you for calling AXiM. Routing to node...' }],
          sentiment: 'neutral'
        };
        set(state => ({ activeCalls: [...state.activeCalls, newCall] }));
      }
      
      set(state => ({
        activeCalls: state.activeCalls.map(call => ({ ...call, duration: call.duration + 1 })).filter(call => call.duration < 120)
      }));
    }, 4000);
    return () => clearInterval(interval);
  },

  // --- HELPERS ---
  addNotification: (n) => set(state => ({ notifications: [{ id: Date.now(), ...n, time: new Date() }, ...state.notifications].slice(0, 5) })),
  removeNotification: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),
  logEvent: (event, type = 'info', source = 'System') => set(state => ({ auditLogs: [{ id: Date.now(), event, type, source, time: new Date().toISOString() }, ...state.auditLogs].slice(0, 50) })),
  addAgent: (agent) => set(state => ({ agents: [...state.agents, { ...agent, id: `agent_${Date.now()}`, status: 'Available', load: 0, metrics: { resolutionRate: 0, callsHandled: 0, avgHandlingTime: '0s' } }] })),
  updateAgentDept: (agentId, deptId) => set(state => ({ agents: state.agents.map(a => a.id === agentId ? { ...a, deptId } : a) })),
  updateRouting: (settings) => set(state => ({ routingSettings: { ...state.routingSettings, ...settings } })),
  addAutoRule: (rule) => set(state => ({ autoRules: [{ ...rule, id: `rule_${Date.now()}`, enabled: true }, ...state.autoRules] })),
  deleteAutoRule: (id) => set(state => ({ autoRules: state.autoRules.filter(r => r.id !== id) })),
  toggleAutoRule: (id) => set(state => ({ autoRules: state.autoRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r) })),
  sendMessage: (text) => set(state => ({ messages: [...state.messages, { id: Date.now(), senderId: 'agent_1', text, time: new Date().toISOString(), type: 'user' }] })),
  archiveVoicemail: (id) => set(state => ({ voicemails: state.voicemails.map(v => v.id === id ? { ...v, archived: true } : v) })),
  deleteVoicemail: (id) => set(state => ({ voicemails: state.voicemails.filter(v => v.id !== id) })),
  updateVoicemailPriority: (id, priority) => set(state => ({ voicemails: state.voicemails.map(v => v.id === id ? { ...v, priority } : v) })),
  updateVoicemailClassification: (id, classification) => set(state => ({ voicemails: state.voicemails.map(v => v.id === id ? { ...v, classification, isManualCorrection: true, confidence: 100 } : v )})),
  bulkUpdateClassification: (ids, classification) => set(state => ({ voicemails: state.voicemails.map(v => ids.includes(v.id) ? { ...v, classification, isManualCorrection: true, confidence: 100 } : v )})),
  setSelectedCall: (call) => set({ selectedCallForIntervention: call }),
  seizeCall: (id) => set(state => ({ activeCalls: state.activeCalls.map(c => c.id === id ? { ...c, status: 'manual_intervention' } : c) })),
}));