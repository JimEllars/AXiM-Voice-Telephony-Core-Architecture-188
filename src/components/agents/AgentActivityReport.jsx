import React from 'react';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../../common/SafeIcon';
import { FiTrendingUp, FiClock, FiCheckCircle, FiActivity, FiX, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const AgentActivityReport = ({ agent, onClose }) => {
  const performanceOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#18181b', borderColor: '#3f3f46', textStyle: { color: '#d4d4d8' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', 'Now'],
      axisLine: { lineStyle: { color: '#3f3f46' } },
      axisLabel: { color: '#71717a', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#27272a', type: 'dashed' } },
      axisLabel: { color: '#71717a', fontSize: 10 }
    },
    series: [
      {
        name: 'Resolution Efficiency',
        type: 'line',
        smooth: true,
        itemStyle: { color: '#6366f1' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.2)' }, { offset: 1, color: 'transparent' }]
          }
        },
        data: [85, 92, 88, 95, 91, 94, agent.metrics.resolutionRate]
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <SafeIcon icon={FiActivity} className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 italic">{agent.name} • Session Intel</h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.2em] mt-1">Entity ID: {agent.id} | Node: {agent.node}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <SafeIcon icon={FiTrendingUp} className="text-indigo-400" /> Resolution Velocity Spectrum
              </h3>
              <div className="h-[250px]">
                <ReactECharts option={performanceOption} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Throughput</p>
                <div className="text-2xl font-bold text-zinc-100 font-mono">{agent.metrics.callsHandled}</div>
                <p className="text-[10px] text-emerald-400 font-bold mt-2 italic">+14% vs Global Avg</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Avg Handling Time</p>
                <div className="text-2xl font-bold text-cyan-400 font-mono">{agent.metrics.avgHandlingTime}</div>
                <div className="h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[65%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-4">
                <SafeIcon icon={FiCheckCircle} className="text-emerald-400" /> Quality Ledger
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Sentiment Consistency', val: '98%' },
                  { label: 'Policy Adherence', val: '100%' },
                  { label: 'CRM Sync Accuracy', val: '96%' }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-zinc-200 font-mono font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-4 italic">
                <SafeIcon icon={FiShield} className="text-fuchsia-400" /> Recent Log
              </h3>
              <div className="space-y-3">
                {[
                  'Sync with US-EAST-1 complete',
                  'Resolved Billing Inquiry #492',
                  'Escalated Tier-3 technical issue',
                  'Session Heartbeat: NOMINAL'
                ].map((log, i) => (
                  <div key={i} className="text-[10px] text-zinc-500 font-mono flex gap-2">
                    <span className="text-fuchsia-500">▶</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20 transition-all uppercase tracking-widest"
          >
            Acknowledge Intel
          </button>
        </div>
      </motion.div>
    </div>
  );
};