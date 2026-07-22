import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiShield, FiTrendingDown } from 'react-icons/fi';

export const AsguardShieldMetrics = () => {
  const storeThreatMetrics = useVoiceStore(state => state.threatMetrics);
  const [localMetrics, setLocalMetrics] = useState({
    blockedToday: storeThreatMetrics.blockedToday || 0,
    estimatedSavings: storeThreatMetrics.estimatedSavings || 0,
    avgThreatScore: storeThreatMetrics.avgThreatScore || 0,
  });

  useEffect(() => {
    let client;
    let channel;

    const connectToRealtime = async () => {
      const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          client = createClient(supabaseUrl, supabaseKey);
          channel = client.channel('asguard-telemetry')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_ai_telemetry' }, (payload) => {
              if (payload.new && payload.new.type === 'THREAT_BLOCKED') {
                setLocalMetrics(prev => ({
                  ...prev,
                  blockedToday: prev.blockedToday + 1,
                  estimatedSavings: prev.estimatedSavings + (payload.new.savings_impact || 0.50),
                  avgThreatScore: payload.new.threat_score ? Math.round((prev.avgThreatScore + payload.new.threat_score) / 2) : prev.avgThreatScore
                }));
              }
            })
            .subscribe();
        } catch (e) {
          console.error('[ASGUARD] Failed to bind realtime telemetry:', e);
        }
      }
    };

    connectToRealtime();

    return () => {
      if (channel) {
        client?.removeChannel(channel);
      }
    };
  }, []);

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
        data: [12, 18, 15, 45, 32, 28, Math.max(5, localMetrics.blockedToday % 50)]
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
          <div className="text-2xl font-bold text-zinc-100">{localMetrics.blockedToday}</div>
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
          ${localMetrics.estimatedSavings.toFixed(2)}
        </span>
      </div>
    </div>
  );
};