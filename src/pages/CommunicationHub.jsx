import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiMessageSquare, FiSearch, FiCpu, FiUser, FiHash, FiZap, FiRadio } from 'react-icons/fi';
import { useVoiceStore } from '../store/useVoiceStore';
import { Badge } from '../components/common/Badge';
import { ChatWindow } from '../components/communication/ChatWindow';

export const CommunicationHub = () => {
  const { agents, departments } = useVoiceStore();
  const [search, setSearch] = useState('');

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-8">
      {/* Sidebar: Channels & Entities */}
      <div className="w-80 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <SafeIcon icon={FiMessageSquare} className="text-indigo-500" /> Mesh Comms
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1 italic">Secure Neural Interface</p>
        </div>

        <div className="relative group">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            placeholder="Search channels/entities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          {/* Channels */}
          <div>
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
              Mission Channels
              <SafeIcon icon={FiHash} className="text-[8px]" />
            </h3>
            <div className="space-y-1">
              {['Global-Link', 'Alpha-Node', 'Security-Mesh'].map(ch => (
                <button key={ch} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  ch === 'Global-Link' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'text-zinc-500 border-transparent hover:bg-zinc-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">#</span> {ch}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Entities */}
          <div>
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
              Active Entities
              <SafeIcon icon={FiRadio} className="text-[8px] text-emerald-500 animate-pulse" />
            </h3>
            <div className="space-y-2">
              {agents.map(agent => (
                <button key={agent.id} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-colors ${
                    agent.role === 'AI Agent' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    <SafeIcon icon={agent.role === 'AI Agent' ? FiCpu : FiUser} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{agent.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_8px_currentColor]`} />
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono italic mt-0.5">{agent.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-center">
          <SafeIcon icon={FiZap} className="text-indigo-400 text-lg mx-auto mb-2" />
          <p className="text-[10px] text-zinc-500 font-mono italic leading-relaxed">
            All mesh communications are E2EE and logged for auditing.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatWindow />
    </div>
  );
};