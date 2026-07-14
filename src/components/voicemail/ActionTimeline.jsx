import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiCheckCircle, FiMessageSquare, FiMail, FiDatabase, FiAlertCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ActionIcon = ({ type }) => {
  switch (type) {
    case 'SMS': return <SafeIcon icon={FiMessageSquare} className="text-cyan-400" />;
    case 'Email': return <SafeIcon icon={FiMail} className="text-fuchsia-400" />;
    case 'CRM_TASK': return <SafeIcon icon={FiDatabase} className="text-emerald-400" />;
    case 'ESCALATION': return <SafeIcon icon={FiAlertCircle} className="text-rose-400" />;
    default: return <SafeIcon icon={FiCheckCircle} className="text-zinc-400" />;
  }
};

export const ActionTimeline = ({ actions }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-zinc-600" /> System Action Ledger
      </div>
      <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
        {actions.map((action) => (
          <div key={action.id} className="flex gap-3 items-start relative pl-8">
            <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-700 z-10" />
            <div className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 flex items-center justify-between group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2">
                <ActionIcon type={action.type} />
                <span className="text-[11px] text-zinc-300 font-medium">{action.detail}</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono">
                {formatDistanceToNow(new Date(action.time), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};