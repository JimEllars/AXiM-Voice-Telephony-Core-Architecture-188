import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiSettings, FiPhone, FiSave, FiMessageSquare, FiPlus, FiTrash2, FiZap, FiToggleLeft, FiToggleRight, FiChevronRight, FiCpu, FiShield } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion } from 'framer-motion';

export const Settings = () => {
  const { 
    routingSettings, 
    updateRouting, 
    templates, 
    addTemplate, 
    deleteTemplate, 
    autoRules, 
    addAutoRule, 
    deleteAutoRule, 
    toggleAutoRule,
    addNotification,
    logEvent
  } = useVoiceStore();

  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', type: 'SMS' });
  const [newRule, setNewRule] = useState({ name: '', trigger: '', templateId: '', actionType: 'SMS' });
  const [isCommitting, setIsCommitting] = useState(false);

  const handleCommit = () => {
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      addNotification({ title: 'Config Committed', message: 'Global mesh configuration updated across 14 nodes.', type: 'success' });
      logEvent('Global Node Configuration Committed', 'sync', 'Admin Terminal');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <SafeIcon icon={FiSettings} className="text-indigo-500" /> Mesh Configuration
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Global parameters for the AXiM Distributed Telephony Mesh.</p>
        </div>
        <button 
          onClick={handleCommit}
          disabled={isCommitting}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isCommitting ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deploying...</> : <><SafeIcon icon={FiSave} /> Commit to Mesh</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Rules Engine */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <SafeIcon icon={FiZap} />
                </div>
                <div>
                  <h2 className="font-bold text-zinc-100 italic">Automated Dispatch Engine</h2>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">Intent Detection & Sequence Execution</p>
                </div>
              </div>
              <button 
                onClick={() => updateRouting({ autoResponseEnabled: !routingSettings.autoResponseEnabled })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${routingSettings.autoResponseEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
              >
                <SafeIcon icon={routingSettings.autoResponseEnabled ? FiToggleRight : FiToggleLeft} className="text-xl" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{routingSettings.autoResponseEnabled ? 'Active' : 'Standby'}</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {autoRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleAutoRule(rule.id)} className={rule.enabled ? 'text-indigo-400' : 'text-zinc-600'}>
                      <SafeIcon icon={rule.enabled ? FiToggleRight : FiToggleLeft} className="text-2xl" />
                    </button>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${rule.enabled ? 'text-zinc-100' : 'text-zinc-500'}`}>{rule.name}</span>
                        <div className="flex gap-1.5">
                          {rule.actionType.split('_AND_').map(act => (
                            <Badge key={act} variant="cyber" className="text-[9px] px-1.5">{act}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-2 italic">
                        <SafeIcon icon={FiChevronRight} className="text-indigo-500/50" /> TRIGGER: {rule.trigger}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteAutoRule(rule.id)} className="p-2 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              ))}
              
              <form onSubmit={(e) => { e.preventDefault(); addAutoRule(newRule); setNewRule({ name: '', trigger: '', templateId: '', actionType: 'SMS' }); }} className="pt-6 border-t border-zinc-800 space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                  <SafeIcon icon={FiPlus} className="text-indigo-500" /> Define Sequence Chain
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Rule Name" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} />
                  <input placeholder="Triggers (e.g. urgent, bill)" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newRule.trigger} onChange={e => setNewRule({ ...newRule, trigger: e.target.value })} />
                  <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newRule.templateId} onChange={e => setNewRule({ ...newRule, templateId: e.target.value })}>
                    <option value="">Select Response Template</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newRule.actionType} onChange={e => setNewRule({ ...newRule, actionType: e.target.value })}>
                    <option value="SMS">SMS Only</option>
                    <option value="SMS_AND_CRM">SMS + CRM Task</option>
                    <option value="SMS_AND_ESCALATE">SMS + Escalation</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-indigo-500/20 transition-all">
                  Initialize Chain
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Global Mute */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest italic">
                <SafeIcon icon={FiShield} className="text-rose-500" /> Stealth Mode
              </h3>
              <button 
                onClick={() => updateRouting({ globalMute: !routingSettings.globalMute })}
                className={`transition-colors ${routingSettings.globalMute ? 'text-rose-500' : 'text-zinc-600'}`}
              >
                <SafeIcon icon={routingSettings.globalMute ? FiToggleRight : FiToggleLeft} className="text-3xl" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed italic">When enabled, all inbound transmissions are silently dropped without AI interaction. Use for maintenance windows.</p>
          </div>

          {/* AI Configuration */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest italic mb-6">
              <SafeIcon icon={FiCpu} className="text-indigo-400" /> Neural Core
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Confidence Threshold</label>
                <input type="range" className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-[9px] text-zinc-600 mt-1 font-mono">
                  <span>LO-FI (70%)</span>
                  <span>HI-FI (98%)</span>
                </div>
              </div>
              <div className="pt-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Primary Model</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300">
                  <option>ONYX-MK4 (Stable)</option>
                  <option>ONYX-MK5-ALPHA (Experimental)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};