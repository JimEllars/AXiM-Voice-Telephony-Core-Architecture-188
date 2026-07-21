import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiShield, FiGlobe, FiActivity, FiUserPlus, FiSlash, FiAlertCircle } from 'react-icons/fi';
import { Badge } from '../common/Badge';

export const ThreatDetailsModal = ({ threat, onClose, onWhitelist }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <SafeIcon icon={FiAlertCircle} className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 italic">Threat Profile</h2>
              <p className="text-xs text-zinc-500 font-mono">ID: {threat.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Reputation Score</p>
              <div className="text-3xl font-bold text-rose-500 font-mono">{threat.score}</div>
              <p className="text-[10px] text-rose-400/60 font-medium mt-1 italic">Level: {threat.reputation}</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Origin Region</p>
              <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                <SafeIcon icon={FiGlobe} className="text-indigo-400" /> {threat.region}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Status: Geographically Flagged</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
              <SafeIcon icon={FiActivity} className="text-cyan-400" /> Behavioral Analysis
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Classification', value: threat.type },
                { label: 'Detection Logic', value: 'Edge Heuristic v4.2' },
                { label: 'Carrier Link', value: 'International Gateway' },
                { label: 'Action Taken', value: 'Automatic Drop' }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="text-zinc-200 font-mono font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onWhitelist(threat.callerId)}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              <SafeIcon icon={FiUserPlus} /> Whitelist Entity
            </button>
            <button 
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all border border-zinc-700 flex items-center justify-center gap-2"
            >
              <SafeIcon icon={FiSlash} /> Permanent IP Ban
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};