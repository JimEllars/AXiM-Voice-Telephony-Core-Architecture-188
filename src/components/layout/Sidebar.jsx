import React from 'react';
import { NavLink } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import { FiActivity, FiVoicemail, FiShield, FiSettings, FiShare2, FiZap, FiBarChart2, FiUsers, FiGlobe, FiDatabase, FiMessageSquare, FiRadio } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';

export const getNavItems = (voicemails, activeCalls) => {
  const unreadCount = voicemails.filter(v => !v.archived).length;
  const liveCount = activeCalls.length;
  return [
    { path: '/', label: 'Command Center', icon: FiActivity },
    { path: '/live', label: 'Live Monitor', icon: FiRadio, badge: liveCount > 0 ? liveCount.toString() : null, badgeVariant: 'success' },
    { path: '/voicemails', label: 'Intelligence Vault', icon: FiVoicemail, badge: unreadCount > 0 ? unreadCount.toString() : null },
    { path: '/comms', label: 'Mesh Comms', icon: FiMessageSquare },
    { path: '/knowledge', label: 'Knowledge Base', icon: FiDatabase },
    { path: '/entities', label: 'Lead Intelligence', icon: FiDatabase },
    { path: '/analytics', label: 'Mesh Analytics', icon: FiBarChart2 },
    { path: '/nodes', label: 'Node Commander', icon: FiGlobe },
    { path: '/agents', label: 'Agent Roster', icon: FiUsers },
    { path: '/security', label: 'Asguard Firewall', icon: FiShield },
    { path: '/crm-health', label: 'Sync Health', icon: FiActivity },
    { path: '/crm-sync', label: 'Node Config', icon: FiShare2 },
    { path: '/deskera', label: 'Deskera Pipeline', icon: FiDatabase },
    { path: '/settings', label: 'Automation Rules', icon: FiSettings },
  ];
};

export const Sidebar = () => {
  const { voicemails, activeCalls } = useVoiceStore();
  const navItems = getNavItems(voicemails, activeCalls);

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3 flex justify-between items-center">
          Primary Systems
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
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
        </nav>
      </div>
      <div className="p-4 border-t border-zinc-800/50">
        <div className="bg-indigo-950/20 rounded-lg p-4 border border-indigo-500/20 transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon icon={FiZap} className="text-indigo-400 text-xs" />
            <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Nexus Internal</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight italic">Secure Bridge: US-EAST-1 Active</p>
        </div>
      </div>
    </aside>
  );
};