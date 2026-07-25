import React from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiAlertTriangle, FiZap, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const PriorityTriageHUD = () => {
  const { voicemails } = useVoiceStore();
  
  const total = voicemails.length || 1;
  const avgConfidence = (voicemails.reduce((acc, v) => acc + (v.confidence || 90), 0) / total).toFixed(1);
  const positiveRatio = ((voicemails.filter(v => v.sentiment === 'positive').length / total) * 100).toFixed(0);

  const stats = {
    urgent: voicemails.filter(v => v.priority === 'urgent' && !v.archived).length,
    high: voicemails.filter(v => v.priority === 'high' && !v.archived).length,
    low: voicemails.filter(v => v.priority === 'low' && !v.archived).length,
    resolved: voicemails.filter(v => v.archived).length
  };

  const cards = [
    { label: 'Critical Triage', count: stats.urgent, icon: FiAlertTriangle, color: 'text-fuchsia-500', bg: 'bg-zinc-900', border: 'border-fuchsia-500/50' },
    { label: 'High Priority', count: stats.high, icon: FiZap, color: 'text-cyan-500', bg: 'bg-zinc-900', border: 'border-cyan-500/50' },
    { label: 'Standard', count: stats.low, icon: FiClock, color: 'text-zinc-400', bg: 'bg-zinc-900', border: 'border-zinc-700' },
    { label: 'Resolved/Vaulted', count: stats.resolved, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-zinc-900', border: 'border-emerald-500/30' }
  ];

  return (
    <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
    <div className="flex gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 p-4 rounded-2xl border bg-zinc-900 border-zinc-800 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <SafeIcon icon={FiZap} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-100 font-mono">{avgConfidence}%</div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Avg Confidence</p>
          </div>
        </div>
        <div className="w-1/2 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${avgConfidence}%` }} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-1 p-4 rounded-2xl border bg-zinc-900 border-zinc-800 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <SafeIcon icon={FiCheckCircle} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-100 font-mono">{positiveRatio}%</div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Positive Sentiment</p>
          </div>
        </div>
        <div className="w-1/2 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${positiveRatio}%` }} />
        </div>
      </motion.div>
    </div>
    </>
  );
};