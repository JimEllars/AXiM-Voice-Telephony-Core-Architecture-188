import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiCpu, FiMessageSquare } from 'react-icons/fi';

export const CallSummary = ({ summary }) => {
  if (!summary) return null;
  
  return (
    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3 mb-4 flex gap-3 items-start">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
        <SafeIcon icon={FiCpu} className="text-sm" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 mb-0.5">Onyx AI Summary</div>
        <p className="text-xs text-zinc-300 leading-relaxed font-medium">
          {summary}
        </p>
      </div>
    </div>
  );
};