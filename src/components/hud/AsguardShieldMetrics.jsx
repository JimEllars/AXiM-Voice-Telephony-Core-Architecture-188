import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiShield, FiTrendingDown } from 'react-icons/fi';

export const AsguardShieldMetrics = () => {
  const { threatMetrics } = useVoiceStore();

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#18181b', borderColor: '#3f3f46', textStyle: { color: '#d4d4d8' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', 'Now'],
      axisLine: { lineStyle: { color: '#3f3f46' } },
      axisLabel: { color: '#71717a', fontSize: 10, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#27272a', type: 'dashed' } },
      axisLabel: { color: '#71717a', fontSize: 10 }
    },
    series: [
      {
        name: 'Blocked Threats',
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#d946ef' }, // fuchsia-500
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(217, 70, 239, 0.3)' }, { offset: 1, color: 'rgba(217, 70, 239, 0)' }]
          }
        },
        data: [12, 18, 15, 45, 32, 28, Math.max(5, threatMetrics.blockedToday % 50)]
      }
    ]
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiShield} className="text-fuchsia-400" />
            Asguard Edge Firewall
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Spam & Threat Mitigation</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-100">{threatMetrics.blockedToday}</div>
          <div className="text-[10px] text-fuchsia-400 font-mono uppercase tracking-wider">Blocks Today</div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[120px] -ml-2">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-sm">
        <span className="text-zinc-400 text-xs">Estimated Carrier Savings</span>
        <span className="flex items-center gap-1 text-emerald-400 font-mono font-medium">
          <SafeIcon icon={FiTrendingDown} className="text-xs" />
          ${threatMetrics.estimatedSavings.toFixed(2)}
        </span>
      </div>
    </div>
  );
};