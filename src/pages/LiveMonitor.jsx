import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiActivity, FiGlobe, FiCpu, FiUser, FiZap, FiPhoneCall, FiAlertTriangle } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { AudioSpectrum } from '../components/monitor/AudioSpectrum';

export const LiveMonitor = () => {
  const { activeCalls, setSelectedCall } = useVoiceStore();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <SafeIcon icon={FiActivity} className="text-emerald-400" /> Transcription War Room
          </h1>
          <p className="text-zinc-500 text-sm mt-1 italic">Real-time neural stream auditing across all global nodes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mesh Health: 98%</span>
          </div>
        </div>
      </div>

      {activeCalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
          <SafeIcon icon={FiPhoneCall} className="text-4xl text-zinc-700 mb-4 animate-bounce" />
          <h3 className="text-zinc-400 font-medium">Listening for Transmissions...</h3>
          <p className="text-zinc-600 text-sm mt-1">AXiM mesh is ready. Waiting for inbound telephony traffic.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {activeCalls.map(call => (
              <motion.div
                layout
                key={call.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[450px] group hover:border-indigo-500/30 transition-all shadow-2xl relative"
              >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-100 text-sm">{call.callerId}</h3>
                      <Badge variant="cyber" className="text-[8px] animate-pulse">LIVE</Badge>
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
                      <SafeIcon icon={FiGlobe} /> {call.node} • {call.intent}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCall(call)}
                    className="p-2 text-zinc-500 hover:text-indigo-400 bg-zinc-800 border border-zinc-700 rounded-lg transition-all"
                  >
                    <SafeIcon icon={FiZap} />
                  </button>
                </div>

                {/* Live Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.03)_0%,_transparent_50%)]">
                  {call.messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.sender === 'caller' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
                        msg.sender === 'onyx' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        <SafeIcon icon={msg.sender === 'onyx' ? FiCpu : FiUser} />
                      </div>
                      <div className={`max-w-[80%] p-2 rounded-xl text-[11px] leading-relaxed ${
                        msg.sender === 'onyx' ? 'bg-indigo-500/10 border border-indigo-500/20 text-zinc-200' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 italic'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Monitoring */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AudioSpectrum isActive={true} />
                    <span className="text-[10px] font-mono text-zinc-500">
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {call.sentiment === 'negative' && (
                      <div className="flex items-center gap-1 text-rose-400 text-[10px] font-bold uppercase animate-pulse">
                        <SafeIcon icon={FiAlertTriangle} /> High Risk
                      </div>
                    )}
                    <Badge variant={call.status === 'manual_intervention' ? 'success' : 'default'} className="text-[9px]">
                      {call.status === 'manual_intervention' ? 'OVERRIDDEN' : 'AI-MANAGED'}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};