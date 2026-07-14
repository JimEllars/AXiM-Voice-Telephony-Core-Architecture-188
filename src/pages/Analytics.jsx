import React from 'react';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../common/SafeIcon';
import { FiTrendingUp, FiActivity, FiClock, FiDollarSign, FiZap, FiBarChart2, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const Analytics = () => {
  const volumeOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#18181b', borderColor: '#3f3f46', textStyle: { color: '#d4d4d8' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLine: { lineStyle: { color: '#3f3f46' } }, axisLabel: { color: '#71717a' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#27272a' } }, axisLabel: { color: '#71717a' } },
    series: [{
      name: 'Call Volume', type: 'line', smooth: true, itemStyle: { color: '#06b6d4' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(6,182,212,0.2)' }, { offset: 1, color: 'transparent' }] } },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }]
  };

  const nodeEfficiencyOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    radar: {
      indicator: [
        { name: 'US-EAST-1', max: 100 },
        { name: 'EU-WEST-2', max: 100 },
        { name: 'AP-SOUTH-1', max: 100 },
        { name: 'US-WEST-2', max: 100 },
        { name: 'SA-EAST-1', max: 100 }
      ],
      splitArea: { show: false },
      axisLine: { lineStyle: { color: '#27272a' } },
      splitLine: { lineStyle: { color: '#27272a' } }
    },
    series: [{
      type: 'radar',
      data: [
        { value: [98, 85, 72, 90, 65], name: 'Node Health', itemStyle: { color: '#6366f1' }, areaStyle: { color: 'rgba(99,102,241,0.2)' } }
      ]
    }]
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <SafeIcon icon={FiBarChart2} className="text-indigo-500" /> Mesh Intelligence
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Cross-node telephony performance and ROI analytics.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400">Export PDF</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Live Sync</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Mesh Minutes', value: '42,891', sub: '+12% from last week', icon: FiClock, color: 'text-cyan-400' },
          { label: 'AI Resolution Rate', value: '89.4%', sub: 'Target: 92.0%', icon: FiZap, color: 'text-fuchsia-400' },
          { label: 'Operational Savings', value: '$8,204', sub: 'Calculated carrier delta', icon: FiDollarSign, color: 'text-emerald-400' },
          { label: 'Active Node Count', value: '14', sub: 'Global distribution', icon: FiActivity, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={stat.label} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm" >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 ${stat.color}`}>
                <SafeIcon icon={stat.icon} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded italic">LIVE</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
            <div className="text-[10px] text-zinc-600 mt-2 font-mono">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-sm font-bold text-zinc-100 mb-8 flex items-center gap-2 uppercase tracking-widest italic">
            <SafeIcon icon={FiTrendingUp} className="text-cyan-400" /> Mesh Traffic Volume
          </h3>
          <div className="h-[350px]">
            <ReactECharts option={volumeOption} style={{ height: '100%' }} />
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-sm font-bold text-zinc-100 mb-8 flex items-center gap-2 uppercase tracking-widest italic">
            <SafeIcon icon={FiGlobe} className="text-indigo-400" /> Node Efficiency Radar
          </h3>
          <div className="h-[350px]">
            <ReactECharts option={nodeEfficiencyOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};