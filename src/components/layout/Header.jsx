import React from 'react';
import { AgentPresence } from '../hud/AgentPresence';
import SafeIcon from '../../common/SafeIcon';
import { FiCpu, FiBell, FiTerminal } from 'react-icons/fi';
import { CommandPalette } from '../dashboard/CommandPalette';

export const Header = () => {
  return (
    <>
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <SafeIcon icon={FiCpu} className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight leading-none">AXiM Voice</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono mt-0.5">Telephony Core Node</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-500 animate-in fade-in slide-in-from-top-1">
            <SafeIcon icon={FiTerminal} className="text-indigo-500" />
            <span className="opacity-60">Press</span>
            <span className="bg-zinc-800 px-1 rounded text-zinc-300">⌘ K</span>
            <span className="opacity-60">to search mesh</span>
          </div>

          <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <SafeIcon icon={FiBell} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fuchsia-500 border border-zinc-950"></span>
          </button>
          
          <div className="w-px h-6 bg-zinc-800"></div>
          
          <AgentPresence />
        </div>
      </header>
      <CommandPalette />
    </>
  );
};