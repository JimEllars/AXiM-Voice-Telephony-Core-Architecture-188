import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiPhone, FiActivity, FiEye } from 'react-icons/fi';
import { Badge } from '../common/Badge';

export const LiveCallMonitor = () => {
  const { activeCalls, setSelectedCall } = useVoiceStore();

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <SafeIcon icon={FiActivity} className="text-cyan-400" />
          Active Telephony Mesh
        </h2>
        <Badge variant="cyber">{activeCalls.length} Active Lines</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] tracking-wider font-mono">
            <tr>
              <th className="px-5 py-3 font-medium">Caller Identity</th>
              <th className="px-5 py-3 font-medium">Line Status</th>
              <th className="px-5 py-3 font-medium">Detected Intent</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            <AnimatePresence>
              {activeCalls.length === 0 && (
                <tr className="text-center">
                  <td colSpan="5" className="px-5 py-8 text-zinc-500 italic">No active calls currently in the mesh.</td>
                </tr>
              )}
              {activeCalls.map((call) => (
                <motion.tr 
                  key={call.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-zinc-200">{call.callerId}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{call.crmMatch || 'Unmatched Entity'}</div>
                  </td>
                  <td className="px-5 py-4">
                    {call.status === 'ringing' ? (
                      <Badge variant="warning" className="animate-pulse">Ringing</Badge>
                    ) : (
                      <Badge variant="success">Onyx Mk3 Active</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-zinc-400 font-mono text-xs bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                      {call.intent}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-zinc-300">
                    {formatDuration(call.duration)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCall(call)}
                      disabled={call.status === 'ringing'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-md border border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SafeIcon icon={FiEye} />
                      Observe
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};