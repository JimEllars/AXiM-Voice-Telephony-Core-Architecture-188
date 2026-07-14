import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiActivity, FiClock, FiCheckCircle, FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const CrmHealthMetrics = ({ health }) => {
  const stats = [
    { label: 'Sync Success', value: `${health.syncSuccessRate}%`, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Latency', value: health.avgLatency, icon: FiActivity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Queue Depth', value: health.queueDepth, icon: FiCpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Bridges', value: health.activeConnectors, icon: FiClock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current border-opacity-20 shadow-lg`}>
              <SafeIcon icon={stat.icon} />
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live</div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{stat.value}</div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};