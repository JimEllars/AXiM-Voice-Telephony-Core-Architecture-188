import React from 'react';
import { NavLink } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import { FiActivity, FiVoicemail, FiShield, FiSettings, FiDatabase, FiPieChart } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';

export const Sidebar = () => {
  const { voicemails } = useVoiceStore();
  const unreadCount = voicemails.filter(v => !v.archived).length;

  const navItems = [
    { path: '/', label: 'Command Center', icon: FiActivity },
    { path: '/voicemails', label: 'Intelligence Vault', icon: FiVoicemail, badge: unreadCount > 0 ? unreadCount.toString() : null },
    { path: '/security', label: 'Asguard Firewall', icon: FiShield },
    { path: '/crm-sync', label: 'Deskera Sync', icon: FiDatabase },
    { path: '/settings', label: 'Node Config', icon: FiSettings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">Primary Systems</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={item.icon} className={item.path === '/' ? '' : 'opacity-70'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-fuchsia-500/20 text-fuchsia-400 py-0.5 px-2 rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">WSS Latency</span>
            <span className="text-xs text-emerald-400 font-mono">14ms</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1 mb-4">
            <div className="bg-emerald-400 h-1 rounded-full shadow-[0_0_8px_#34d399]" style={{ width: '15%' }}></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">AI Load</span>
            <span className="text-xs text-cyan-400 font-mono">22%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
            <div className="bg-cyan-400 h-1 rounded-full shadow-[0_0_8px_#22d3ee]" style={{ width: '22%' }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
};