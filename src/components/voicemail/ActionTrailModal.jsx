import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiActivity, FiCpu, FiRefreshCw, FiShield, FiClock, FiFileText } from 'react-icons/fi';
import { formatDistanceToNow, format } from 'date-fns';

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'ai': return <SafeIcon icon={FiCpu} className="text-indigo-400" />;
    case 'sync': return <SafeIcon icon={FiRefreshCw} className="text-emerald-400" />;
    case 'security': return <SafeIcon icon={FiShield} className="text-rose-400" />;
    default: return <SafeIcon icon={FiActivity} className="text-zinc-500" />;
  }
};

export const ActionTrailModal = ({ voicemail, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex justify-end">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="px-6 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 italic flex items-center gap-2">
              <SafeIcon icon={FiActivity} className="text-indigo-500" /> Interaction Trail
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">ID: {voicemail.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="relative space-y-8 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
            {voicemail.trail.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={step.id} 
                className="relative pl-12 group"
              >
                <div className={`absolute left-2.5 top-1.5 w-5 h-5 rounded-full z-10 flex items-center justify-center border shadow-lg transition-transform group-hover:scale-125 ${
                  step.type === 'ai' ? 'bg-indigo-600 border-indigo-400' : 
                  step.type === 'sync' ? 'bg-emerald-600 border-emerald-400' : 
                  step.type === 'security' ? 'bg-rose-600 border-rose-400' :
                  'bg-zinc-800 border-zinc-700'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 group-hover:border-zinc-700 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-zinc-200">{step.event}</h4>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {format(new Date(step.time), 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                    {step.detail}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center">
                      <TypeIcon type={step.type} />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">
                      {step.type === 'ai' ? 'Neural Core' : step.type === 'sync' ? 'Data Bridge' : 'System Proc'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiFileText} className="text-indigo-400 text-xs" />
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Forensic Summary</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed italic">
              This transmission has undergone {voicemail.trail.filter(t => t.type === 'ai').length} neural transformations and is currently synchronized with the global mesh.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};