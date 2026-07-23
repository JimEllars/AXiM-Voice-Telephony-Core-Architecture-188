import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiAlertTriangle, FiX, FiActivity, FiZap } from 'react-icons/fi';

export const NodeAlertBanner = () => {
  const { nodeAlerts, clearNodeAlert, rebalanceAgent } = useVoiceStore();

  if (nodeAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[45] w-full max-w-2xl px-4">
      <AnimatePresence>
        {nodeAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mb-2 p-4 rounded-xl border flex items-center justify-between shadow-2xl backdrop-blur-md ${
              alert.severity === 'critical' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-900/20' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-900/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border animate-pulse ${
                alert.severity === 'critical' ? 'bg-rose-500/20 border-rose-500/40' : 'bg-amber-500/20 border-amber-500/40'
              }`}>
                <SafeIcon icon={FiAlertTriangle} className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm uppercase tracking-widest italic">{alert.type}</h4>
                  <span className="text-[10px] font-mono opacity-60">NODE: {alert.region}</span>
                </div>
                <p className="text-xs font-medium mt-0.5">
                  Current Health: <span className="font-mono font-bold">{alert.value}</span> — Neural Mesh re-routing in progress.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {alert.severity === 'amber' && (
                <button
                  onClick={() => rebalanceAgent(alert.nodeId)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold rounded-lg transition-all"
                >
                  Rebalance
                </button>
              )}
              <button 
                onClick={() => clearNodeAlert(alert.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};