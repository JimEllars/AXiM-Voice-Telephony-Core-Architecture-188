import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload } from 'react-icons/fi';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'axim-telephony-audit.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const { auditLogs } = useVoiceStore();

  return (
    <>
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
        <button onClick={() => setIsModalOpen(true)} className="text-[10px] text-zinc-500 hover:text-cyan-400 uppercase font-bold tracking-widest transition-colors">
          View Full Event History
        </button>
      </div>
    </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <SafeIcon icon={FiActivity} className="text-cyan-400" />
                  Audit History
                </h3>
                <div className="flex gap-4">
                  <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-500/50 transition-colors text-zinc-300 text-sm">
                    <SafeIcon icon={FiDownload} /> Export JSON
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
              </div>

              <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-4 pt-2 gap-4">
                {['All', 'security', 'sync', 'message', 'system'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <span className="capitalize">{tab}</span>
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {auditLogs.filter(log => activeTab === 'All' || log.type === activeTab).map((log) => (
                  <div key={log.id} className="flex gap-4 items-start bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                      <TypeIcon type={log.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-zinc-200">{log.event}</p>
                        <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap ml-2">
                          {new Date(log.time).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Source: <span className="font-mono text-cyan-400">{log.source}</span></p>
                    </div>
                  </div>
                ))}
                {auditLogs.filter(log => activeTab === 'All' || log.type === activeTab).length === 0 && (
                  <div className="text-center py-10 text-zinc-500">No logs found for this category.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};