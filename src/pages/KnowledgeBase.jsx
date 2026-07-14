import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiDatabase, FiFileText, FiUpload, FiTrash2, FiSearch, FiLayers, FiAlertCircle, FiTrendingUp, FiLifeBuoy, FiTruck, FiCreditCard, FiUser, FiCpu } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  TrendingUp: FiTrendingUp, LifeBuoy: FiLifeBuoy, Truck: FiTruck, CreditCard: FiCreditCard
};

export const KnowledgeBase = () => {
  const { departments, contextDocuments, agents, addContextDoc, deleteContextDoc } = useVoiceStore();
  const [view, setView] = useState('department'); // 'department' or 'agent'
  const [selectedId, setSelectedId] = useState('dept_1');
  const [showUpload, setShowUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', type: 'Protocol', size: '1.5MB' });

  const filteredDocs = contextDocuments.filter(d => d.targetId === selectedId && d.targetType === view);
  
  const handleUpload = (e) => {
    e.preventDefault();
    addContextDoc({ ...newDoc, targetId: selectedId, targetType: view });
    setShowUpload(false);
    setNewDoc({ name: '', type: 'Protocol', size: '1.5MB' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiDatabase} className="text-indigo-500" /> Neural Context Base
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Compartmentalized intelligence for AXiM entities.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all">
          <SafeIcon icon={FiUpload} /> Inject New Context
        </button>
      </div>

      <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 w-fit">
        <button onClick={() => { setView('department'); setSelectedId('dept_1'); }} className={`px-4 py-2 text-[10px] uppercase font-bold rounded-lg transition-all ${view === 'department' ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Department Protocols
        </button>
        <button onClick={() => { setView('agent'); setSelectedId(agents[0]?.id); }} className={`px-4 py-2 text-[10px] uppercase font-bold rounded-lg transition-all ${view === 'agent' ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Agent Personas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {view === 'department' ? (
            departments.map(dept => (
              <button key={dept.id} onClick={() => setSelectedId(dept.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${selectedId === dept.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
                <SafeIcon icon={iconMap[dept.icon]} className={selectedId === dept.id ? dept.color : ''} />
                <span className="text-sm font-bold">{dept.name}</span>
              </button>
            ))
          ) : (
            agents.map(agent => (
              <button key={agent.id} onClick={() => setSelectedId(agent.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${selectedId === agent.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
                <SafeIcon icon={agent.role === 'AI Agent' ? FiCpu : FiUser} />
                <span className="text-sm font-bold">{agent.name}</span>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={selectedId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl group hover:border-indigo-500/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400">
                        <SafeIcon icon={FiFileText} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="cyber" className="text-[8px] px-1">{doc.type}</Badge>
                          <span className="text-[10px] text-zinc-600 font-mono">{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteContextDoc(doc.id)} className="p-2 text-zinc-700 hover:text-rose-400 transition-all">
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                ))}
              </div>
              {filteredDocs.length === 0 && (
                <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
                  <SafeIcon icon={FiAlertCircle} className="text-2xl text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm italic">No specific context found for this entity.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 italic">
                <SafeIcon icon={FiUpload} className="text-indigo-400" /> Inject Context
              </h3>
              <button onClick={() => setShowUpload(false)} className="text-zinc-500 hover:text-zinc-100"><FiTrash2 /></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Protocol Title</label>
                <input required placeholder="e.g. Sales Objection Handling" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Type</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
                  <option value="Protocol">Protocol</option>
                  <option value="Persona">Persona</option>
                  <option value="Raw Data">Raw Data</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/40 transition-all uppercase tracking-widest">Sync Context</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};