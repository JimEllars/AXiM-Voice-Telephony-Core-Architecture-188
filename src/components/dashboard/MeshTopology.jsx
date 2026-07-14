import React from 'react';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../../common/SafeIcon';
import { FiGlobe, FiCpu, FiActivity } from 'react-icons/fi';

export const MeshTopology = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: { show: true, backgroundColor: '#18181b', borderColor: '#3f3f46', textStyle: { color: '#d4d4d8' } },
    series: [
      {
        type: 'graph',
        layout: 'force',
        symbolSize: 45,
        roam: false,
        label: { show: true, position: 'bottom', color: '#71717a', fontSize: 10, fontWeight: 'bold' },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        force: { repulsion: 2500, edgeLength: [100, 200] },
        draggable: true,
        data: [
          { name: 'US-EAST-1', value: 10, itemStyle: { color: '#6366f1' }, label: { show: true } },
          { name: 'EU-WEST-2', value: 5, itemStyle: { color: '#06b6d4' } },
          { name: 'US-WEST-2', value: 8, itemStyle: { color: '#d946ef' } },
          { name: 'AP-SOUTH-1', value: 3, itemStyle: { color: '#f59e0b' } },
          { name: 'ONYX-CORE', value: 50, symbolSize: 80, itemStyle: { color: '#ffffff', borderColor: '#6366f1', borderWidth: 2 } },
        ],
        links: [
          { source: 'ONYX-CORE', target: 'US-EAST-1', lineStyle: { width: 3, curveness: 0.2, color: '#6366f1' } },
          { source: 'ONYX-CORE', target: 'EU-WEST-2', lineStyle: { width: 2, curveness: -0.2, color: '#06b6d4' } },
          { source: 'ONYX-CORE', target: 'US-WEST-2', lineStyle: { width: 2, curveness: 0.1, color: '#d946ef' } },
          { source: 'ONYX-CORE', target: 'AP-SOUTH-1', lineStyle: { width: 1, curveness: -0.1, color: '#f59e0b' } },
        ],
        lineStyle: { opacity: 0.6, width: 1, curveness: 0 }
      }
    ]
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest">
          <SafeIcon icon={FiGlobe} className="text-indigo-500" /> Distributed Mesh Topology
        </h3>
        <span className="text-[10px] font-mono text-emerald-400 animate-pulse">SYNCED</span>
      </div>
      <div className="h-[350px]">
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-center">
          <div className="text-[9px] text-zinc-500 font-bold uppercase">Active Nodes</div>
          <div className="text-sm font-bold text-zinc-200">14</div>
        </div>
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-center">
          <div className="text-[9px] text-zinc-500 font-bold uppercase">Mesh Latency</div>
          <div className="text-sm font-bold text-cyan-400">12ms</div>
        </div>
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-center">
          <div className="text-[9px] text-zinc-500 font-bold uppercase">Throughput</div>
          <div className="text-sm font-bold text-fuchsia-400">4.2 GB/s</div>
        </div>
      </div>
    </div>
  );
};