import React from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiGlobe, FiActivity, FiZap, FiServer, FiShield, FiRefreshCw, FiExternalLink, FiAlertCircle } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export const Nodes = () => {
  const { nodes, toggleNode, logEvent, addNotification, nodeAlerts, clearNodeAlert } = useVoiceStore();
  
  const handleReboot = () => {
    addNotification({
      title: 'Cluster Reboot',
      message: 'Initiating rolling restart across global mesh...',
      type: 'info'
    });
    logEvent('Rolling Global Reboot Initiated', 'sync', 'Admin Console');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiGlobe} className="text-indigo-500" /> Mesh Node Command
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Orchestrate distributed telephony infrastructure in real-time.</p>
        </div>
        <button 
          onClick={handleReboot}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <SafeIcon icon={FiRefreshCw} /> Reboot Cluster
        </button>
      </div>

      {/* Active Critical Alerts Section */}
      <AnimatePresence>
        {nodeAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="text-[10px] uppercase font-bold text-rose-500 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Critical Infrastructure Alerts
            </div>
            {nodeAlerts.map(alert => (
              <div key={alert.id} className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SafeIcon icon={FiAlertCircle} className="text-rose-400 text-xl" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">{alert.region}: Critical Jitter Detected</h4>
                    <p className="text-xs text-zinc-500">Latency spike detected at {new Date(alert.timestamp).toLocaleTimeString()} • Health: {alert.value}</p>
                  </div>
                </div>
                <button 
                  onClick={() => clearNodeAlert(alert.id)}
                  className="text-[10px] uppercase font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Acknowledge & Clear
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nodes.map((node) => {
          const isAlering = nodeAlerts.some(a => a.nodeId === node.id);
          
          return (
            <motion.div 
              layout 
              key={node.id} 
              className={`bg-zinc-900/40 border transition-all duration-500 rounded-2xl p-6 group relative overflow-hidden ${
                node.status === 'Online' 
                  ? isAlering ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'border-zinc-800' 
                  : 'border-zinc-900 opacity-60'
              }`}
            >
              {isAlering && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-colors ${
                  node.status === 'Online' 
                    ? isAlering ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}>
                  <SafeIcon icon={FiServer} />
                </div>
                <Badge variant={node.status === 'Online' ? (isAlering ? 'danger' : 'success') : 'default'}>
                  {node.status}
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-zinc-100">{node.region}</h3>
                <p className="text-xs text-zinc-500">{node.city}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                    <span>Node Health</span>
                    <span className={node.health < 92 ? 'text-rose-400' : node.health < 95 ? 'text-amber-400' : 'text-emerald-400'}>
                      {node.health.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={false} 
                      animate={{ 
                        width: `${node.health}%`,
                        backgroundColor: node.health < 92 ? '#f43f5e' : node.health < 95 ? '#f59e0b' : '#10b981'
                      }} 
                      className="h-full" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Latency</span>
                  <span className={`font-mono ${node.health < 92 ? 'text-rose-400' : 'text-cyan-400'}`}>{node.latency}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Resource Load</span>
                  <span className={`font-mono ${node.load > 85 ? 'text-rose-400' : 'text-zinc-300'}`}>{node.load.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => toggleNode(node.id)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    node.status === 'Online' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {node.status === 'Online' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-indigo-400 transition-colors">
                  <SafeIcon icon={FiExternalLink} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <SafeIcon icon={FiShield} className="text-4xl text-indigo-500/50 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-zinc-100 italic">Self-Healing Mesh Protocol</h3>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
          The AXiM Mesh automatically re-routes telephony traffic if a node's health drops below 92%. Currently, 
          {nodeAlerts.length > 0 ? ` ${nodeAlerts.length} nodes are reporting critical jitter.` : ' all regional clusters are operating within nominal parameters.'}
        </p>
      </div>
    </div>
  );
};