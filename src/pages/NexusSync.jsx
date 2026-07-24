import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiShare2, FiRefreshCw, FiSearch, FiLayers, FiExternalLink, FiGrid, FiLink, FiCheck, FiSettings, FiDatabase, FiArrowRight, FiSliders } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export const NexusSync = () => {
  const { crmProvider, setCrmProvider, fieldMappings, updateMapping, auditLogs, addNotification, triggerCrmReconciliation } = useVoiceStore();
  const [activeTab, setActiveTab] = useState('ledger');

  const handleSync = async () => {
    addNotification({ title: 'Global Sync Initiated', message: `Bridging mesh data with ${crmProvider} production environment.`, type: 'info' });
    await triggerCrmReconciliation('global', crmProvider);
  };

  const connectorGallery = [
    { id: 'Nexus', name: 'Nexus CRM', desc: 'Internal AXiM Proprietary Mesh', icon: FiDatabase, status: 'Connected' },
    { id: 'Deskera', name: 'Deskera', desc: 'SME ERP & CRM Integration', icon: FiGrid, status: 'Standby' },
    { id: 'Salesforce', name: 'Salesforce', desc: 'Enterprise Client Connect', icon: FiLink, status: 'Available' },
    { id: 'HubSpot', name: 'HubSpot', desc: 'Inbound Marketing Sync', icon: FiRefreshCw, status: 'Available' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiShare2} className="text-indigo-500" /> CRM Data Bridge
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Multi-provider synchronization hub for the AXiM ecosystem.</p>
        </div>
        <button 
          onClick={handleSync}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <SafeIcon icon={FiRefreshCw} /> Force Mesh Sync
        </button>
      </div>

      <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 w-fit">
        {['ledger', 'connectors', 'mapping'].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeTab === t ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'connectors' ? (
          <motion.div key="connectors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectorGallery.map((conn) => (
              <div key={conn.id} className={`p-6 rounded-2xl border transition-all flex flex-col justify-between h-52 group ${crmProvider === conn.id ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-transform group-hover:scale-110 ${crmProvider === conn.id ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                      <SafeIcon icon={conn.icon} />
                    </div>
                    {crmProvider === conn.id && <Badge variant="cyber">Active</Badge>}
                  </div>
                  <h3 className="font-bold text-zinc-100">{conn.name}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tight leading-relaxed">{conn.desc}</p>
                </div>
                <button 
                  onClick={() => setCrmProvider(conn.id)} 
                  disabled={conn.status === 'Available'}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${crmProvider === conn.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-100'} disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  {crmProvider === conn.id ? 'Bridge Active' : conn.status === 'Standby' ? 'Initialize Bridge' : 'Configure Path'}
                </button>
              </div>
            ))}
          </motion.div>
        ) : activeTab === 'mapping' ? (
          <motion.div key="mapping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest italic">Neural Mapping Engine</h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">AXiM Mesh Field → {crmProvider} Object Schema</p>
              </div>
              <Badge variant="warning">Schema Version 4.2</Badge>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {fieldMappings.map((map) => (
                  <div key={map.id} className="flex items-center gap-6 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 group hover:border-indigo-500/30 transition-all">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-widest">Mesh Source</div>
                      <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-xs font-mono text-indigo-400">{map.source}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-zinc-700">
                      <SafeIcon icon={FiArrowRight} className="text-xl" />
                      <div className="text-[8px] font-bold uppercase tracking-tighter mt-1">{map.transform}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-widest">{crmProvider} Target</div>
                      <input 
                        className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                        defaultValue={map.target}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (!val) {
                            addNotification({ type: 'error', title: 'Invalid Mapping', message: 'Target schema field cannot be empty.' });
                          } else {
                            if (updateMapping) updateMapping(map.id, val);
                            addNotification({ type: 'success', title: 'Mapping Updated', message: 'Schema synchronization confirmed.' });
                          }
                        }}
                      />
                    </div>
                    <button className="p-2 text-zinc-600 hover:text-indigo-400 transition-colors">
                      <SafeIcon icon={FiSliders} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-center">
                <SafeIcon icon={FiCheck} className="text-3xl text-indigo-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-100">Schema Synchronized</h4>
                <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto italic">All telephony events will now automatically propagate to {crmProvider} using the defined neural transformations.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest italic">Sync Ledger</h3>
              <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Bridge Active
              </div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {auditLogs.filter(log => log.type === 'sync').map(log => (
                <div key={log.id} className="p-5 hover:bg-indigo-500/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-700">
                      <SafeIcon icon={FiCheck} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200">{log.event}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-widest">{log.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-mono italic">{new Date(log.time).toLocaleTimeString()}</div>
                    <Badge variant="cyber" className="mt-1.5">{crmProvider} PUSH</Badge>
                  </div>
                </div>
              ))}
              {auditLogs.filter(log => log.type === 'sync').length === 0 && (
                <div className="py-20 text-center text-zinc-600 text-xs italic">No sync events recorded in the current session.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};