import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiSearch, FiZap, FiTerminal, FiGlobe, FiShield, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { id: 'dash', label: 'Go to Command Center', icon: FiZap, action: () => navigate('/') },
    { path: '/security', label: 'Shield Configuration', icon: FiShield, action: () => navigate('/security') },
    { path: '/nodes', label: 'Scale Global Nodes', icon: FiGlobe, action: () => navigate('/nodes') },
  ].filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950/50">
          <SafeIcon icon={FiTerminal} className="text-indigo-500" />
          <input 
            autoFocus
            placeholder="Type a command or search mesh..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm placeholder:text-zinc-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">ESC</span>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
              <SafeIcon icon={FiX} />
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {commands.length > 0 ? commands.map((cmd) => (
            <button 
              key={cmd.label}
              onClick={() => { cmd.action(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-400 transition-all text-left group"
            >
              <SafeIcon icon={cmd.icon} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{cmd.label}</span>
            </button>
          )) : (
            <div className="p-8 text-center text-zinc-600 text-xs italic">No matching protocols found.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};