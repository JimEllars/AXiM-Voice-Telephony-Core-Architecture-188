import React from 'react';
import { AgentPresence } from '../hud/AgentPresence';
import SafeIcon from '../../common/SafeIcon';
import { FiCpu, FiBell, FiTerminal, FiMenu, FiX, FiZap } from 'react-icons/fi';
import { CommandPalette } from '../dashboard/CommandPalette';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { getNavItems } from './Sidebar';
import { FiWifi, FiCloudOff, FiRefreshCw, FiServer } from 'react-icons/fi';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsEdgeModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const { voicemails, activeCalls } = useVoiceStore();
  const navItems = getNavItems(voicemails, activeCalls);
  const { connectionStatus, latency } = useVoiceStore();

  const getStatusColor = () => {
    if (connectionStatus === 'connected') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (connectionStatus === 'reconnecting') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'connected') return FiWifi;
    if (connectionStatus === 'reconnecting') return FiRefreshCw;
    return FiCloudOff;
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <SafeIcon icon={FiMenu} className="text-xl" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <SafeIcon icon={FiCpu} className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight leading-none">AXiM Voice</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono mt-0.5">Telephony Core Node</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-4">
            {/* Cloudflare Worker Status */}
            <button onClick={() => setIsEdgeModalOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
              <SafeIcon icon={FiServer} className="text-cyan-400 text-xs" />
              <span className="text-[10px] font-mono text-zinc-300">CF-EDGE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
            </button>

            {/* Latency & Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1 border rounded-lg transition-colors ${getStatusColor()}`}>
              <SafeIcon icon={getStatusIcon()} className={`text-xs ${connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                {connectionStatus === 'connected' ? `${latency}ms` : connectionStatus}
              </span>
            </div>
          </div>
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <SafeIcon icon={FiCpu} className="text-white text-lg" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-zinc-100 tracking-tight leading-none">AXiM Voice</h1>
                    <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono mt-0.5">Telephony Core Node</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <SafeIcon icon={item.icon} className={isActive ? 'text-indigo-400' : 'opacity-70'} />
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className={`${item.badgeVariant === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} py-0.5 px-2 rounded-full text-[10px] font-bold`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-800/50">
                <div className="bg-indigo-950/20 rounded-lg p-4 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <SafeIcon icon={FiZap} className="text-indigo-400 text-xs" />
                    <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Nexus Internal</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight italic">Secure Bridge: US-EAST-1 Active</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEdgeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEdgeModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-w-md w-full"
              >
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                  <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <SafeIcon icon={FiServer} className="text-cyan-400" />
                    Cloudflare Edge Telemetry
                  </h3>
                  <button onClick={() => setIsEdgeModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Ingress Endpoint</p>
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded border border-zinc-800">
                      <code className="text-xs text-cyan-400">https://voice.axim.us.com/answer</code>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">HTTP 200 OK</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Duplex Stream Path</p>
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded border border-zinc-800">
                      <code className="text-xs text-indigo-400">wss://voice.axim.us.com/stream</code>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">101 Switching Protocols</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Noota Transcription API</p>
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded border border-zinc-800">
                      <code className="text-xs text-fuchsia-400">https://api.noota.io/v1</code>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Operational</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Asguard Firewall KV</p>
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded border border-zinc-800">
                      <code className="text-xs text-amber-400">ASGUARD_KV Active</code>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Sub-10ms Drop Protocol</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};