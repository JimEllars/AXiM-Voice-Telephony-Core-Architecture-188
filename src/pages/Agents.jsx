import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiUsers, FiGlobe, FiCpu, FiUser, FiZap, FiMoreVertical, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { DeployAgentModal } from '../components/agents/DeployAgentModal';
import { AgentActivityReport } from '../components/agents/AgentActivityReport';
import { motion, AnimatePresence } from 'framer-motion';

export const Agents = () => {
  const { agents, departments, updateAgentDept, rebalanceAgent, agentAlerts } = useVoiceStore();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedAgentForReport, setSelectedAgentForReport] = useState(null);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiUsers} className="text-indigo-500" /> Agent Roster
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Orchestration of human and AI entities across the mesh.</p>
        </div>
        <button onClick={() => setShowDeployModal(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all">
          <SafeIcon icon={FiZap} /> Deploy New Entity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {agents.map((agent) => {
            const isOverloaded = agent.load > 85;
            const hasAlert = agentAlerts.some(a => a.agentId === agent.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={agent.id}
                className={`bg-zinc-900/40 border rounded-2xl p-6 group transition-all relative overflow-hidden ${isOverloaded ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-zinc-800 hover:border-indigo-500/30'}`}
              >
                {isOverloaded && (
                  <div className="absolute top-0 right-0 p-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${agent.role === 'AI Agent' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                      <SafeIcon icon={agent.role === 'AI Agent' ? FiCpu : FiUser} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100">{agent.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="cyber" className="text-[9px] uppercase">{departments.find(d => d.id === agent.deptId)?.name || 'General'}</Badge>
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 uppercase tracking-widest">
                          <SafeIcon icon={FiGlobe} className="text-[9px]" /> {agent.node}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setActiveMenu(activeMenu === agent.id ? null : agent.id)} className="p-1.5 text-zinc-600 hover:text-zinc-300">
                      <SafeIcon icon={FiMoreVertical} />
                    </button>
                    {activeMenu === agent.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden">
                          <div className="p-2 text-[9px] uppercase font-bold text-zinc-600 tracking-widest border-b border-zinc-800">Assign Department</div>
                          {departments.map(d => (
                            <button key={d.id} onClick={() => { updateAgentDept(agent.id, d.id); setActiveMenu(null); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-zinc-900 transition-colors ${agent.deptId === d.id ? 'text-indigo-400' : 'text-zinc-400'}`}>
                              {d.name}
                            </button>
                          ))}
                          {isOverloaded && (
                            <button 
                              onClick={() => { rebalanceAgent(agent.id); setActiveMenu(null); }}
                              className="w-full text-left px-4 py-2 text-xs text-amber-400 hover:bg-amber-400/10 transition-colors border-t border-zinc-800 font-bold"
                            >
                              Manual Rebalance
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Success</p>
                      <p className="text-sm font-bold text-emerald-400 font-mono">{agent.metrics.resolutionRate}%</p>
                    </div>
                    <div className={`p-3 rounded-xl border transition-colors ${isOverloaded ? 'bg-amber-500/10 border-amber-500/30' : 'bg-zinc-950/50 border-zinc-800/50'}`}>
                      <p className={`text-[9px] uppercase font-bold tracking-widest mb-1 ${isOverloaded ? 'text-amber-400' : 'text-zinc-500'}`}>Resource</p>
                      <p className={`text-sm font-bold font-mono ${isOverloaded ? 'text-amber-400' : 'text-zinc-200'}`}>{agent.load}%</p>
                    </div>
                  </div>

                  {isOverloaded && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-4 flex items-center gap-3">
                      <SafeIcon icon={FiAlertTriangle} className="text-amber-500 text-lg" />
                      <p className="text-[10px] text-zinc-400 leading-tight italic">Resource ceiling reached. Neural link stability is compromised.</p>
                    </div>
                  )}

                  <button onClick={() => setSelectedAgentForReport(agent)} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-zinc-700 transition-all flex items-center justify-center gap-2">
                    <SafeIcon icon={FiBarChart2} /> Deep Analytics
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {showDeployModal && <DeployAgentModal onClose={() => setShowDeployModal(false)} />}
      {selectedAgentForReport && <AgentActivityReport agent={selectedAgentForReport} onClose={() => setSelectedAgentForReport(null)} />}
    </div>
  );
};