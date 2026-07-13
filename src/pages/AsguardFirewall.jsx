import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiShield, FiAlertOctagon, FiCheckCircle, FiMoreVertical, FiFilter, FiSlash, FiTarget, FiPlus, FiX } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export const AsguardFirewall = () => {
  const { threats, threatMetrics, firewallPolicies, addToBlacklist, removeFromBlacklist } = useVoiceStore();
  const [activeTab, setActiveTab] = useState('threats');
  const [newBlacklist, setNewBlacklist] = useState('');

  const handleAddBlacklist = (e) => {
    e.preventDefault();
    if (!newBlacklist) return;
    addToBlacklist(newBlacklist);
    setNewBlacklist('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiShield} className="text-fuchsia-500" /> Asguard Edge Firewall
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time threat mitigation and robocall interception.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <SafeIcon icon={FiFilter} /> Filters
          </button>
          <button className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-fuchsia-500/20">
            Export Threat Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase font-mono tracking-widest mb-1">Blocked Today</div>
          <div className="text-3xl font-bold text-zinc-100">{threatMetrics.blockedToday}</div>
          <div className="mt-2 text-emerald-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Protection
          </div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase font-mono tracking-widest mb-1">Carrier Savings</div>
          <div className="text-3xl font-bold text-zinc-100">${threatMetrics.estimatedSavings.toFixed(2)}</div>
          <div className="mt-2 text-zinc-500 text-xs">Based on $0.15 avg talk time</div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase font-mono tracking-widest mb-1">Threat Level</div>
          <div className="text-3xl font-bold text-amber-500">MODERATE</div>
          <div className="mt-2 text-zinc-500 text-xs">Elevated robocall activity</div>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 gap-6">
        <button 
          onClick={() => setActiveTab('threats')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'threats' ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Recent Interceptions
          {activeTab === 'threats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />}
        </button>
        <button 
          onClick={() => setActiveTab('policies')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'policies' ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Firewall Policies
          {activeTab === 'policies' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'threats' ? (
          <motion.div 
            key="threats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
          >
            <div className="px-5 py-4 border-b border-zinc-800/80">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <SafeIcon icon={FiAlertOctagon} className="text-rose-500" /> Blocked Transmission Log
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] tracking-wider font-mono border-b border-zinc-800/50">
                  <tr>
                    <th className="px-5 py-3 font-medium">Source Number</th>
                    <th className="px-5 py-3 font-medium">Classification</th>
                    <th className="px-5 py-3 font-medium">Origin</th>
                    <th className="px-5 py-3 font-medium">Timestamp</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                    <th className="px-5 py-3 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {threats.map((threat) => (
                    <motion.tr key={threat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-zinc-200">{threat.callerId}</td>
                      <td className="px-5 py-4">
                        <Badge variant="danger">
                          {threat.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-zinc-400">{threat.location}</td>
                      <td className="px-5 py-4 text-zinc-500 font-mono text-xs">
                        {new Date(threat.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <SafeIcon icon={FiCheckCircle} className="text-xs" />
                          <span className="text-xs uppercase font-bold tracking-tighter">Auto-Dropped</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500">
                          <SafeIcon icon={FiMoreVertical} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="policies"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                <SafeIcon icon={FiSlash} className="text-rose-500" /> Active Blacklist
              </h3>
              <form onSubmit={handleAddBlacklist} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Enter number to block..." 
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500/50"
                  value={newBlacklist}
                  onChange={e => setNewBlacklist(e.target.value)}
                />
                <button className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20">
                  <SafeIcon icon={FiPlus} />
                </button>
              </form>
              <div className="space-y-2">
                {firewallPolicies.blacklist.map(number => (
                  <div key={number} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800 group">
                    <span className="text-sm font-mono text-zinc-300">{number}</span>
                    <button 
                      onClick={() => removeFromBlacklist(number)}
                      className="text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <SafeIcon icon={FiX} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                <SafeIcon icon={FiTarget} className="text-cyan-500" /> SIP Whitelist
              </h3>
              <p className="text-xs text-zinc-500 italic mb-4">Verified partners bypass all firewall processing.</p>
              <div className="space-y-2">
                {firewallPolicies.whitelist.map(number => (
                  <div key={number} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-sm font-mono text-zinc-300">{number}</span>
                    <Badge variant="cyber">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};