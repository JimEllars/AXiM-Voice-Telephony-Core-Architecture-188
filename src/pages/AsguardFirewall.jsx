import React, { useState, useEffect } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiShield, FiAlertOctagon, FiPlus, FiGlobe, FiEye, FiSearch, FiSliders, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { FirewallRuleCard } from '../components/security/FirewallRuleCard';
import { ThreatRadar } from '../components/security/ThreatRadar';
import { ThreatDetailsModal } from '../components/security/ThreatDetailsModal';

export const AsguardFirewall = () => {
  const { threats, threatMetrics, firewallRules, addFirewallRule, whitelistNumber, addThreat } = useVoiceStore();
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', description: '', type: 'Heuristic', action: 'Drop', target: 'Global' });


  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return;

    let client;
    import('@supabase/supabase-js').then(({ createClient }) => {
      client = createClient(supabaseUrl, supabaseKey);

      const channel = client.channel('public:ticket_ai_telemetry')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_ai_telemetry' }, payload => {
          if (payload.new && (payload.new.threat_detected === true || payload.new.severity === 'critical')) {
            const incomingThreat = {
              id: payload.new.id || `threat_${Date.now()}`,
              callerId: payload.new.caller_id || 'Unknown Entity',
              type: payload.new.threat_type || 'Heuristic Flag',
              score: payload.new.threat_score || Math.floor(Math.random() * 20) + 80,
              region: payload.new.origin_region || 'Unknown',
              reputation: payload.new.severity || 'Critical',
              ip: payload.new.ip_address || ''
            };
            addThreat(incomingThreat);
          }
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }).catch(err => console.error('[ASGUARD] Failed to load Supabase client:', err));
  }, [addThreat]);

  const handleCreateRule = (e) => {
    e.preventDefault();
    addFirewallRule(newRule);
    setShowAddModal(false);
    setNewRule({ name: '', description: '', type: 'Heuristic', action: 'Drop', target: 'Global' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiShield} className="text-indigo-500" /> Asguard Edge Firewall
          </h1>
          <p className="text-zinc-500 text-sm mt-1">AI-driven perimeter defense for the AXiM telephony mesh.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2">
          <SafeIcon icon={FiPlus} /> Create Security Policy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Blocks Today</div>
          <div className="text-2xl font-bold text-zinc-100">{threatMetrics.blockedToday}</div>
        </div>
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Active Policies</div>
          <div className="text-2xl font-bold text-indigo-400">{firewallRules.filter(r => r.enabled).length}</div>
        </div>
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Threat Score</div>
          <div className="text-2xl font-bold text-rose-500">{threatMetrics.avgThreatScore}</div>
        </div>
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Carrier Savings</div>
          <div className="text-2xl font-bold text-emerald-400">${threatMetrics.estimatedSavings.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 gap-6">
        {['radar', 'rules', 'ledger'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`pb-3 text-sm font-bold transition-colors relative uppercase tracking-widest ${activeTab === tab ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'radar' ? (
          <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-[0.2em] mb-8 italic">Neural Perimeter Scan</h3>
              <ThreatRadar threats={threats} />
              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="text-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 font-bold mb-1">SENSORS</p>
                  <p className="text-xs font-mono text-emerald-400 uppercase">Optimized</p>
                </div>
                <div className="text-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 font-bold mb-1">LATENCY</p>
                  <p className="text-xs font-mono text-cyan-400 uppercase">2ms</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <SafeIcon icon={FiActivity} className="text-rose-500" /> Recent Neutralized Targets
              </h3>
              {threats.slice(0, 6).map(threat => (
                <div key={threat.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${threat.score > 90 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                      <SafeIcon icon={FiAlertOctagon} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-200">{threat.callerId}</span>
                        <Badge variant="danger" className="text-[8px]">{threat.score} RISK</Badge>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-widest">{threat.type} • ORIGIN: {threat.region}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedThreat(threat)} className="p-2 text-zinc-600 hover:text-indigo-400 bg-zinc-800/50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <SafeIcon icon={FiEye} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'rules' ? (
          <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firewallRules.map(rule => <FirewallRuleCard key={rule.id} rule={rule} />)}
          </motion.div>
        ) : (
          <motion.div key="ledger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/60">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest italic">
                <SafeIcon icon={FiAlertOctagon} className="text-rose-500" /> Blocked Transmissions
              </h3>
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" placeholder="Filter threats..." className="bg-zinc-950/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs w-64 focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Source Number</th>
                    <th className="px-6 py-4">Classification</th>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4">Origin</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {threats.map(threat => (
                    <tr key={threat.id} className="hover:bg-indigo-500/5 transition-colors cursor-pointer" onClick={() => setSelectedThreat(threat)}>
                      <td className="px-6 py-4 font-mono text-zinc-200">{threat.callerId}</td>
                      <td className="px-6 py-4"><Badge variant="danger">{threat.type}</Badge></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${threat.score}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-rose-400">{threat.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{threat.region}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                          <SafeIcon icon={FiCheckCircle} /> Auto-Dropped
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedThreat && (
        <ThreatDetailsModal 
          threat={selectedThreat} 
          onClose={() => setSelectedThreat(null)} 
          onWhitelist={(num) => {
            whitelistNumber(num);
            setSelectedThreat(null);
          }}
        />
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <SafeIcon icon={FiSliders} className="text-indigo-400" /> Define Security Policy
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-zinc-100"><SafeIcon icon={FiAlertOctagon} /></button>
            </div>
            <form onSubmit={handleCreateRule} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block">Policy Name</label>
                <input required placeholder="e.g. Regional Compliance Block" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-400 hover:bg-zinc-800 transition-all">Discard</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/40 transition-all">Deploy Policy</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};