import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiDatabase, FiRefreshCw, FiUser, FiBriefcase, FiPhone, FiClock, FiCheckCircle, FiSearch, FiFilter } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';

export const DeskeraSync = () => {
  const { syncLogs, crmContacts, logEvent, addNotification, triggerCrmReconciliation } = useVoiceStore();
  const [activeTab, setActiveTab] = useState('logs');
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredContacts = crmContacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiDatabase} className="text-cyan-500" /> Deskera CRM Pipeline
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Automated contact matching and activity logging pipeline.</p>
        </div>
        <button disabled={isSyncing} onClick={async () => {
          setIsSyncing(true);
          try {
            await triggerCrmReconciliation('global', 'Deskera');
          } finally {
            setIsSyncing(false);
          }
        }} className={`px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <SafeIcon icon={FiRefreshCw} className={isSyncing ? 'animate-spin' : 'animate-spin-slow'} /> {isSyncing ? 'Syncing...' : 'Force Global Sync'}
        </button>
      </div>

      <div className="flex border-b border-zinc-800 gap-6">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'logs' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Activity Logs
          {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'contacts' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Synced Contacts
          {activeTab === 'contacts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Pipeline Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">API Gateway</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Webhooks</span>
                <Badge variant="success">Listening</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Sync Delay</span>
                <span className="text-xs font-mono text-cyan-400">1.2s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'logs' ? (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100 italic">Recent Operations</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
                </div>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {syncLogs.map((log) => (
                  <div key={log.id} className="p-5 hover:bg-zinc-800/20 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
                        <SafeIcon icon={FiCheckCircle} className="text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-zinc-200">{log.contact}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                        <SafeIcon icon={FiClock} className="text-[10px]" /> {log.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search synced contacts..." 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                  <SafeIcon icon={FiFilter} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-700">
                        <SafeIcon icon={FiUser} />
                      </div>
                      <Badge variant={contact.status === 'Active' ? 'success' : 'warning'}>{contact.status}</Badge>
                    </div>
                    <h4 className="text-zinc-100 font-medium">{contact.name}</h4>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <SafeIcon icon={FiBriefcase} className="text-[10px]" /> {contact.company}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <SafeIcon icon={FiPhone} className="text-[10px]" /> {contact.phone}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-mono">Last seen: {contact.lastInteraction}</span>
                      <button onClick={() => triggerCrmReconciliation(contact.id, 'Deskera')} className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sync Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};