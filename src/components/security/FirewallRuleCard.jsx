import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiShield, FiToggleLeft, FiToggleRight, FiTrash2, FiActivity, FiGlobe, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';

export const FirewallRuleCard = ({ rule }) => {
  const { toggleFirewallRule, deleteFirewallRule } = useVoiceStore();

  const getTypeIcon = () => {
    switch (rule.type) {
      case 'Geographic': return FiGlobe;
      case 'AI-Model': return FiCpu;
      case 'Heuristic': return FiActivity;
      default: return FiShield;
    }
  };

  const getActionColor = () => {
    switch (rule.action) {
      case 'Drop': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Challenge': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all group ${rule.enabled ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-950 border-zinc-900 opacity-60'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${rule.enabled ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
          <SafeIcon icon={getTypeIcon()} className="text-lg" />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleFirewallRule(rule.id)}
            className={`transition-colors ${rule.enabled ? 'text-indigo-400' : 'text-zinc-600'}`}
          >
            <SafeIcon icon={rule.enabled ? FiToggleRight : FiToggleLeft} className="text-2xl" />
          </button>
          <button 
            onClick={() => deleteFirewallRule(rule.id)}
            className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <SafeIcon icon={FiTrash2} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-bold text-sm ${rule.enabled ? 'text-zinc-100' : 'text-zinc-500'}`}>{rule.name}</h3>
          <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-tighter ${getActionColor()}`}>
            {rule.action}
          </span >
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 italic">
          {rule.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-1 h-1 rounded-full ${rule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{rule.target}</span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">ID: {rule.id.split('_')[1]}</span>
      </div>
    </div>
  );
};