import React from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiActivity, FiShield, FiRefreshCw, FiMessageSquare, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'security': return <SafeIcon icon={FiShield} className="text-rose-400" />;
    case 'sync': return <SafeIcon icon={FiRefreshCw} className="text-cyan-400" />;
    case 'message': return <SafeIcon icon={FiMessageSquare} className="text-emerald-400" />;
    default: return <SafeIcon icon={FiActivity} className="text-zinc-400" />;
  }
};

export const ActivityFeed = () => {
  const { auditLogs } = useVoiceStore();

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 uppercase tracking-widest">
          <SafeIcon icon={FiActivity} className="text-cyan-500" /> Audit Log
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">Real-time Stream</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {auditLogs.map((log) => (
          <div key={log.id} className="flex gap-3 items-start group">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
              <TypeIcon type={log.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-zinc-200 truncate">{log.event}</p>
                <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(log.time), { addSuffix: true })}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">{log.source}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-zinc-800/50 text-center">
        <button className="text-[10px] text-zinc-500 hover:text-cyan-400 uppercase font-bold tracking-widest transition-colors">
          View Full Event History
        </button>
      </div>
    </div>
  );
};