import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiUser, FiBriefcase, FiMail, FiPhone, FiActivity, FiTag, FiFileText } from 'react-icons/fi';
import { Badge } from '../common/Badge';

export const EntityDetailModal = ({ entity, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl text-indigo-400 font-bold">
              {entity.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 italic">{entity.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest">{entity.company}</p>
                <Badge variant={entity.sentiment === 'Positive' ? 'success' : 'default'}>{entity.status}</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                <SafeIcon icon={FiUser} className="text-indigo-400" /> Contact Intel
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiMail} className="text-zinc-500" />
                  <span className="text-sm text-zinc-200">{entity.extractedData.email || 'No email synced'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiPhone} className="text-zinc-500" />
                  <span className="text-sm text-zinc-200 font-mono">{entity.extractedData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiBriefcase} className="text-zinc-500" />
                  <span className="text-sm text-zinc-200">{entity.company}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                <SafeIcon icon={FiTag} className="text-cyan-400" /> Neural Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="cyber">Enterprise</Badge>
                <Badge variant="fuchsia">API_REQ</Badge>
                <Badge variant="success">HIGH_LTV</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl h-full">
              <h3 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                <SafeIcon icon={FiFileText} className="text-fuchsia-400" /> Extraction Notes
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed italic">
                "{entity.extractedData.notes || 'No significant intent patterns detected in recent transmissions.'}"
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                  <span>Sentiment Confidence</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">
            Close Intel
          </button>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20 transition-all uppercase tracking-widest">
            Push to Nexus CRM
          </button>
        </div>
      </motion.div>
    </div>
  );
};