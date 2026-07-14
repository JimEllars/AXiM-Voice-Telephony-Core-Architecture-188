import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiDatabase, FiArrowRight, FiCpu, FiLayers, FiShield } from 'react-icons/fi';

export const PipelineVisualizer = ({ crmProvider }) => {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <SafeIcon icon={FiDatabase} className="text-9xl text-indigo-500" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-4">
        {/* Source */}
        <div className="text-center group">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <SafeIcon icon={FiShield} className="text-3xl" />
          </div>
          <p className="mt-4 text-xs font-bold text-zinc-100 uppercase tracking-widest">Telephony Mesh</p>
          <p className="text-[9px] text-zinc-500 font-mono mt-1">US-EAST-1 Node</p>
        </div>

        {/* Connector */}
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            animate={{ x: [0, 10, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="text-zinc-700"
          >
            <SafeIcon icon={FiArrowRight} className="text-2xl" />
          </motion.div>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">WSS Payload</span>
        </div>

        {/* Neural Layer */}
        <div className="text-center group">
          <div className="w-20 h-20 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(217,70,239,0.2)]">
            <SafeIcon icon={FiCpu} className="text-3xl" />
          </div>
          <p className="mt-4 text-xs font-bold text-zinc-100 uppercase tracking-widest">Neural Transform</p>
          <p className="text-[9px] text-zinc-500 font-mono mt-1">Onyx Core MK3</p>
        </div>

        {/* Connector */}
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            animate={{ x: [0, 10, 0] }} 
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="text-zinc-700"
          >
            <SafeIcon icon={FiArrowRight} className="text-2xl" />
          </motion.div>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">REST Push</span>
        </div>

        {/* Destination */}
        <div className="text-center group">
          <div className="w-20 h-20 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <SafeIcon icon={FiLayers} className="text-3xl" />
          </div>
          <p className="mt-4 text-xs font-bold text-zinc-100 uppercase tracking-widest">{crmProvider} Production</p>
          <p className="text-[9px] text-zinc-500 font-mono mt-1">API v4.2 Stable</p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-center gap-12">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Encryption: AES-256-GCM</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Heartbeat: Nominal (4ms)</span>
        </div>
      </div>
    </div>
  );
};