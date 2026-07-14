import React from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiAlertTriangle, FiZap, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const PriorityTriageHUD = () => {
  const { voicemails } = useVoiceStore();
  
  const stats = {
    urgent: voicemails.filter(v => v.priority === 'urgent' && !v.archived).length,
    high: voicemails.filter(v => v.priority === 'high' && !v.archived).length,
    low: voicemails.filter(v => v.priority === 'low' && !v.archived).length,
    resolved: voicemails.filter(v => v.archived).length
  };

  const cards = [
    { label: 'Critical Triage', count: stats.urgent, icon: FiAlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'High Priority', count: stats.high, icon: FiZap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Standard', count: stats.low, icon: FiClock, color: 'text-zinc-400', bg: 'bg-zinc-800/50', border: 'border-zinc-700/50' },
    { label: 'Resolved/Vaulted', count: stats.resolved, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={card.label} 
          className={`p-4 rounded-2xl border ${card.bg} ${card.border} backdrop-blur-sm group hover:scale-[1.02] transition-all cursor-default`}
        >
          <div className="flex justify-between items-start">
            <div className={`w-8 h-8 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center ${card.color}`}>
              <SafeIcon icon={card.icon} />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">{card.count}</div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-3 group-hover:text-zinc-300 transition-colors">
            {card.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};