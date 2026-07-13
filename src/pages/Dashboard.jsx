import React, { useEffect } from 'react';
import { LiveCallMonitor } from '../components/monitor/LiveCallMonitor';
import { AsguardShieldMetrics } from '../components/hud/AsguardShieldMetrics';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
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
    <div className="space-y-6 pb-12">
      {/* Top Section: Health & Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <SystemHealth />
      </motion.div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <LiveCallMonitor />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AsguardShieldMetrics />
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Node Efficiency
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-500">AI Resolution Accuracy</span>
                    <span className="text-cyan-400 font-mono">92.4%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[92.4%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-500">Latency Threshold (ms)</span>
                    <span className="text-emerald-400 font-mono">14ms / 50ms</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[28%]" />
                  </div>
                </div>
                <div className="pt-2">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Talk Time</p>
                        <p className="text-xl font-bold text-zinc-200">208h 12m</p>
                     </div>
                     <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Avg Sentiment</p>
                        <p className="text-xl font-bold text-emerald-400">Positive</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <AnimatePresence>
        {selectedCallForIntervention && (
          <OnyxTranscriptStream 
            call={selectedCallForIntervention} 
            onClose={() => setSelectedCall(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};