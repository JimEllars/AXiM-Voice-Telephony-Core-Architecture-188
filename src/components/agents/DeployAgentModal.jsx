import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiCpu, FiUser, FiZap, FiLayers } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';

export const DeployAgentModal = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      setForm({ name: '', role: 'AI Agent', node: 'US-EAST-1', deptId: 'dept_1' });
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { addAgent, nodes, departments } = useVoiceStore();
  const [form, setForm] = useState({ 
    name: '', 
    role: 'AI Agent', 
    node: 'US-EAST-1',
    deptId: 'dept_1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAgent(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 italic">
            <SafeIcon icon={FiZap} className="text-indigo-400" /> Deploy Mesh Entity
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100"><SafeIcon icon={FiX} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Entity Signature</label>
            <input 
              required 
              placeholder="e.g. ONYX-AI-09" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Department Assignment</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
              value={form.deptId} 
              onChange={e => setForm({ ...form, deptId: e.target.value })} 
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Entity Type</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })} 
              >
                <option value="AI Agent">AI Agent</option>
                <option value="Human Overseer">Human Overseer</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 block tracking-widest">Node Region</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
                value={form.node} 
                onChange={e => setForm({ ...form, node: e.target.value })} 
              >
                {nodes.map(n => <option key={n.id} value={n.region}>{n.region}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/40 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiLayers} /> Initialize Neural Link
          </button>
        </form>
      </motion.div>
    </div>
  );
};