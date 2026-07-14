import React, { useEffect } from 'react';
import { LiveCallMonitor } from '../components/monitor/LiveCallMonitor';
import { AsguardShieldMetrics } from '../components/hud/AsguardShieldMetrics';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { MeshTopology } from '../components/dashboard/MeshTopology';
import { NodeAlertBanner } from '../components/monitor/NodeAlertBanner';
import { AgentLoadAlerts } from '../components/agents/AgentLoadAlerts';
import { useVoiceStore } from '../store/useVoiceStore';
import { AnimatePresence, motion } from 'framer-motion';
import { OnyxTranscriptStream } from '../components/monitor/OnyxTranscriptStream';

export const Dashboard = () => {
  const { subscribeToTelephonyNetwork, selectedCallForIntervention, setSelectedCall } = useVoiceStore();

  useEffect(() => {
    const unsubscribe = subscribeToTelephonyNetwork();
    return () => unsubscribe();
  }, [subscribeToTelephonyNetwork]);

  return (
    <div className="space-y-6 pb-20">
      <NodeAlertBanner />
      <AgentLoadAlerts />
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SystemHealth />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LiveCallMonitor />
            <MeshTopology />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AsguardShieldMetrics />
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-24 h-24 bg-indigo-500 rounded-full blur-2xl" />
              </div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-6 uppercase tracking-widest italic">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Global Throughput
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    <span>Neural Link Confidence</span>
                    <span className="text-indigo-400 font-mono">98.2%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="bg-indigo-500 h-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    <span>Mesh Node Utilization</span>
                    <span className="text-cyan-400 font-mono">64.8%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '64.8%' }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} className="bg-cyan-500 h-full shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 group-hover:border-indigo-500/30 transition-all text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1">Active Lines</p>
                    <p className="text-2xl font-bold text-zinc-100 font-mono">2,412</p>
                  </div>
                  <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 group-hover:border-cyan-500/30 transition-all text-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1">Mesh Uptime</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono">99.99%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 h-full min-h-[600px]">
          <ActivityFeed />
        </div>
      </div>

      <AnimatePresence>
        {selectedCallForIntervention && (
          <OnyxTranscriptStream call={selectedCallForIntervention} onClose={() => setSelectedCall(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};