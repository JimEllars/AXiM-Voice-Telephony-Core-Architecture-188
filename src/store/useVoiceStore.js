import { create } from 'zustand';
import { analyzeTranscript } from '../services/triageEngine';
import { extractEntityData, getWorkersAiSchemaPayload } from '../services/extractionEngine';

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
  crmContacts: [
    { id: "c1", name: "John Doe", company: "Acme Corp", phone: "+1 555-0101", status: "Active", lastInteraction: "10 mins ago" },
    { id: "c2", name: "Sarah Smith", company: "Globex", phone: "+1 555-0102", status: "Inactive", lastInteraction: "2 days ago" }
  ],
  syncLogs: [
    { id: "s1", contact: "John Doe", details: "Synced contact details from Onyx", time: "10 mins ago" },
    { id: "s2", contact: "Sarah Smith", details: "Updated phone number", time: "2 days ago" }
  ],
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
  connectionStatus: 'connected',
  latency: 45,
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

  dispatchTelemetryError: async (eventType, errorMessage) => {
    try {
      const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const payload = {
        telemetry_envelope: {
          project_id: "AXIM_VOICE_TELEPHONY",
          environment: import.meta.env.MODE || "production",
          timestamp: new Date().toISOString()
        },
        event_payload: {
          event_type: eventType,
          severity: "HIGH",
          component_origin: "useVoiceStore.js",
          error_message: errorMessage
        }
      };

      fetch(`${supabaseUrl}/functions/v1/telemetry-ingress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(payload)
      }).catch(err => console.error('[TELEMETRY] Dispatch failed:', err));
    } catch (e) {
      console.error('[TELEMETRY] Internal dispatch error:', e);
    }
  },

  processInboundVoicemail: async (voicemail) => {
    try {
      const analysis = analyzeTranscript(voicemail.transcript);
      let extraction = extractEntityData(voicemail.transcript);
      const workerUrl = import.meta.env.VITE_WORKER_INGRESS_URL || 'https://api.axim.us.com';

      try {
        const schemaPayload = getWorkersAiSchemaPayload(voicemail.transcript);
        const res = await fetch(`${workerUrl}/v1/ai/extract`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AXiM-Internal-Auth': import.meta.env.VITE_AXIM_INTERNAL_KEY || '',
            'X-AXiM-Gateway-Trace': `req_${Date.now()}_voice_telephony`
          },
          body: JSON.stringify(schemaPayload)
        });

        if (res.ok) {
          const aiData = await res.json();
          if (aiData && aiData.name) {
            extraction = { ...extraction, ...aiData };
          }
        }
      } catch (e) {
        console.warn('[WORKERS_AI] Edge JSON extraction failed, using regex fallback:', e);
      }
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

      if (extraction && (extraction.email || extraction.phone)) {
        const enrichmentPayload = {
          request_id: `req_voice_${Date.now()}`,
          department: analysis.classification === 'Sales' ? 'unifirst_sales' : 'support_c360',
          caller_app: 'axim-voice-telephony',
          return_channel: 'sync_response',
          payload: {
            first_name: extraction.name !== 'Unknown Contact' ? extraction.name.split(' ')[0] : '',
            last_name: extraction.name !== 'Unknown Contact' ? extraction.name.split(' ').slice(1).join(' ') : '',
            company: extraction.company !== 'Independent Entity' ? extraction.company : '',
            email: extraction.email || '',
            phone: extraction.phone || voicemail.callerId || '',
            notes: extraction.notes
          }
        };

        // Post to CRM Enrichment Bridge via fetch or Supabase Edge client
        const bridgeUrl = import.meta.env.VITE_CRM_BRIDGE_URL || 'https://api.axim.us.com/v1/webhooks/enrich';
        fetch(bridgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AXiM-Internal-Auth': import.meta.env.VITE_AXIM_INTERNAL_KEY || ''
          },
          body: JSON.stringify(enrichmentPayload)
        }).catch(err => console.error('[CRM_BRIDGE] Failed to dispatch voicemail entity:', err));

        set(state => ({ auditLogs: [{ id: Date.now(), event: `[CRM_BRIDGE] Extracted entity [${extraction.name}] dispatched for firmographic enrichment.`, type: 'system', source: 'CRM Enrichment', time: new Date().toISOString() }, ...state.auditLogs].slice(0, 50) }));
      }

      // Trigger Rules
      get().executeRules(newVm);
    } catch (error) {
      get().addNotification({ type: 'error', title: 'Processing Error', message: error.message || 'Failed to process inbound transmission' });
      get().dispatchTelemetryError('VOICEMAIL_PROCESSING_ERROR', error.message || 'Failed to process inbound transmission');
    }
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

        get().addNotification({
          type: 'success',
          title: 'Automation Triggered',
          message: `Rule "${rule.name}" fired. Dispatched ${template ? template.name : 'sequence'}.`
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
  addContextDoc: async (doc) => {
    const newDoc = { ...doc, id: `doc_${Date.now()}`, embeddingStatus: 'PENDING' };
    set(state => ({ contextDocuments: [newDoc, ...state.contextDocuments] }));

    try {
      const workerUrl = import.meta.env.VITE_WORKER_INGRESS_URL || 'https://api.axim.us.com';
      const res = await fetch(`${workerUrl}/v1/ai/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AXiM-Internal-Auth': import.meta.env.VITE_AXIM_INTERNAL_KEY || '',
          'X-AXiM-Gateway-Trace': `req_${Date.now()}_voice_telephony`
        },
        body: JSON.stringify({ model: '@cf/baai/bge-large-en-v1.5', text: doc.content })
      });

      if (res.ok) {
        set(state => ({
          contextDocuments: state.contextDocuments.map(d =>
            d.id === newDoc.id ? { ...d, embeddingStatus: 'VECTORIZED' } : d
          )
        }));
      }
    } catch (e) {
      console.warn('[WORKERS_AI] Embedding generation failed:', e);
    }
  },

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

  clearNodeAlert: (id) => set(state => ({ nodeAlerts: state.nodeAlerts.filter(a => a.id !== id) })),
  clearAgentAlert: (id) => set(state => ({ agentAlerts: state.agentAlerts.filter(a => a.id !== id) })),

  rebalanceAgent: (agentId) => {
    set(state => ({
      agents: state.agents.map(a => a.id === agentId ? { ...a, load: 40, status: 'Available' } : a),
      agentAlerts: state.agentAlerts.filter(a => a.agentId !== agentId),
      nodeAlerts: state.nodeAlerts.filter(a => a.nodeId !== agentId)
    }));
    get().logEvent('Agent load rebalanced', 'system', 'Load Balancer');
  },
  seizeCall: async (id, operatorId = 'COMMANDER_RIKER') => {
    set(state => ({
      activeCalls: state.activeCalls.map(c => c.id === id ? { ...c, status: 'manual_intervention' } : c)
    }));

    // WebRTC Audio Integration (Cloudflare Calls / Simulation)
    try {
      const audioElement = document.getElementById('live-call-audio');
      if (audioElement) {
        // Create a silent audio context oscillator to simulate an active track if physical mic fails
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const dest = ctx.createMediaStreamDestination();
        oscillator.connect(dest);
        oscillator.start();
        audioElement.srcObject = dest.stream;
        console.log('[WEBRTC] Intercepted seizeCall, audio stream attached');
      }
    } catch (err) {
      console.warn('[WEBRTC] Failed to bind local stream to DOM element', err);
    }


    try {
      const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const client = createClient(supabaseUrl, supabaseKey);
        await client.from('hitl_audit_logs').insert([{
          action_type: 'CALL_TAKEOVER_OVERRIDE',
          component_origin: 'AXiM Voice Telephony Core',
          target_id: id,
          resolved_by: operatorId,
          status: 'INTERVENED',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (e) {
      console.error('[HITL_LOG] Failed to log call takeover:', e);
    }

    get().logEvent(`Call Takeover Override executed by operator [${operatorId}] on call [${id}]`, 'security', 'Voice Cockpit');
  },

  // --- SIMULATION ---
  subscribeToTelephonyNetwork: () => {
    let reconnectAttempts = 0;
    const maxBackoff = 30000;

    const envSupabase = import.meta.env.VITE_SUPABASE_URL;
    const envWorker = import.meta.env.VITE_WORKER_INGRESS_URL;

    if (!envSupabase || !envWorker) {
       setTimeout(() => {
          set({ connectionStatus: 'connected' });
          get().addNotification({ type: 'info', title: 'Demo Mode', message: 'Running in Edge Simulation Mode' });
       }, 500);
    }

    const checkEdgeHealth = async () => {
      const workerUrl = import.meta.env.VITE_WORKER_INGRESS_URL || 'https://api.axim.us.com';
      try {
        const start = Date.now();
        const res = await fetch(`${workerUrl}/v1/health`, { method: 'GET' });
        const roundTripMs = Date.now() - start;

        if (res.ok) {
          set({
            connectionStatus: 'connected',
            latency: roundTripMs
          });
        } else {
          set({ connectionStatus: 'degraded' });
        }
      } catch (err) {
        set({ connectionStatus: 'offline' });
        get().dispatchTelemetryError('EDGE_HEALTH_CHECK_FAILED', err.message);
      }
    };

    const connect = async () => {
      try {
        const previousStatus = get().connectionStatus;
        set({ connectionStatus: 'reconnecting' });

        await checkEdgeHealth();

        const currentStatus = get().connectionStatus;
        if (currentStatus === 'connected') {
          if (previousStatus === 'offline' || previousStatus === 'reconnecting') {
            get().logEvent('Telemetry stream recovered from offline state.', 'system', 'Edge Node Check');
          }
          reconnectAttempts = 0;
          get().addNotification({ type: 'success', title: 'Mesh Connected', message: 'Realtime telemetry active' });
        }
      } catch (error) {
        set({ connectionStatus: 'offline' });
        get().addNotification({ type: 'error', title: 'Connection Failed', message: error.message });
        get().dispatchTelemetryError('NETWORK_DISCONNECT', error.message);
      }
    };

    connect();
    const healthInterval = setInterval(checkEdgeHealth, 10000);

    const interval = setInterval(() => {
      const { activeCalls, agents, connectionStatus } = get();
      
      if (connectionStatus !== 'connected') return;

      try {
        // Random Load Fluctuations
        const updatedAgents = agents.map(agent => ({
          ...agent,
          load: Math.min(Math.max(agent.load + (Math.floor(Math.random() * 8) - 3), 0), 100)
        }));

        // Latency jitter
        const currentLatency = get().latency;
        const newLatency = Math.max(10, Math.min(800, currentLatency + (Math.floor(Math.random() * 40) - 20)));

        const updatedNodes = get().nodes.map(node => {
          // Simulate latency per node, fluctuating around some base value
          // Instead of purely random, let's just make one occasionally spike
          const isSpike = Math.random() > 0.95;
          const currentLatency = parseInt(node.latency.replace('ms', ''));
          const nodeNewLatency = isSpike ? currentLatency + 250 + Math.floor(Math.random() * 100) : Math.max(10, Math.min(800, currentLatency + (Math.floor(Math.random() * 40) - 20)));

          if (nodeNewLatency > 300) {
            get().dispatchTelemetryError('NODE_LATENCY_SPIKE', `Node ${node.id} latency reached ${nodeNewLatency}ms`);

            // Add a node alert if not already present
            const existingAlert = get().nodeAlerts.find(a => a.id === `alert_${node.id}`);
            if (!existingAlert) {
              set(state => ({
                nodeAlerts: [...state.nodeAlerts, {
                  id: `alert_${node.id}`,
                  region: node.region,
                  nodeId: node.id,
                  type: 'Critical Latency',
                  severity: 'amber',
                  value: `${nodeNewLatency}ms`
                }]
              }));
            }
          }

          return { ...node, latency: `${nodeNewLatency}ms` };
        });

        set({ agents: updatedAgents, latency: newLatency, nodes: updatedNodes });

        // Simulate random disconnects for fault tolerance testing
        if (Math.random() > 0.98) {
          set({ connectionStatus: 'offline' });
          get().addNotification({ type: 'error', title: 'Connection Lost', message: 'Attempting to reconnect...' });
          get().dispatchTelemetryError('NETWORK_DISCONNECT', 'Simulated connection lost');

          reconnectAttempts++;
          const backoff = Math.min(1000 * Math.pow(2, reconnectAttempts), maxBackoff);
          setTimeout(connect, backoff);
          return;
        }

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
      } catch (error) {
        get().addNotification({ type: 'error', title: 'Telemetry Error', message: 'Failed to sync telemetry data' });
      }
    }, 4000);
    return () => { clearInterval(interval); clearInterval(healthInterval); };
  },

  // --- HELPERS ---
  fetchVoicemails: async () => {
    // Simulate fetching / resetting voicemail queue
    return new Promise((resolve) => {
      setTimeout(() => {
        // Force a re-render or reset of mock voicemails
        set(state => ({ voicemails: [...state.voicemails] }));
        resolve();
      }, 1000);
    });
  },
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
  updateMapping: (id, target) => set(state => ({ fieldMappings: state.fieldMappings.map(m => m.id === id ? { ...m, target } : m) })),
  bulkUpdateClassification: (ids, classification) => set(state => ({ voicemails: state.voicemails.map(v => ids.includes(v.id) ? { ...v, classification, isManualCorrection: true, confidence: 100 } : v )})),
  setSelectedCall: (call) => set({ selectedCallForIntervention: call }),

}));