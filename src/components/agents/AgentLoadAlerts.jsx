import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiAlertCircle, FiX, FiZap, FiRefreshCw } from 'react-icons/fi';

export const AgentLoadAlerts = () => {
  const { agentAlerts, clearAgentAlert, rebalanceAgent } = useVoiceStore();

  if (agentAlerts.length === 0) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[45] w-full max-w-2xl px-4 space-y-2">
      <AnimatePresence>
        {agentAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-md shadow-amber-900/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
                <SafeIcon icon={FiAlertCircle} className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm uppercase tracking-widest italic text-amber-400">Resource Critical</h4>
                  <span className="text-[10px] font-mono text-zinc-500">ENTITY: {alert.agentName}</span>
                </div>
                <p className="text-xs font-medium mt-0.5 text-zinc-300">
                  Load threshold exceeded: <span className="font-mono font-bold text-amber-500">{alert.load}%</span>. Neural mesh degradation imminent.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => rebalanceAgent(alert.agentId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/40"
              >
                <SafeIcon icon={FiRefreshCw} className="text-xs" /> Rebalance
              </button>
              <button onClick={() => clearAgentAlert(alert.id)} className="p-2 text-zinc-500 hover:text-zinc-100 transition-all">
                <SafeIcon icon={FiX} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};