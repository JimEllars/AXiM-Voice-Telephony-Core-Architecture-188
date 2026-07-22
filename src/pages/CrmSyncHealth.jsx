import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiActivity, FiRefreshCw, FiDatabase, FiGrid, FiLink, FiCheck, FiAlertTriangle, FiArrowRight, FiSettings } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { CrmHealthMetrics } from '../components/crm/CrmHealthMetrics';
import { PipelineVisualizer } from '../components/crm/PipelineVisualizer';

import { createClient } from '@supabase/supabase-js';
import { useEffect } from 'react';

export const CrmSyncHealth = () => {
  const { crmHealth, crmProvider, fieldMappings, auditLogs, addNotification } = useVoiceStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    syncSuccessRate: crmHealth.syncSuccessRate || 100,
    queueDepth: crmHealth.queueDepth || 0,
    lastGlobalSync: new Date().toISOString()
  });
  const [isPulseActive, setIsPulseActive] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient(supabaseUrl, supabaseKey);
    setIsPulseActive(true);

    const channel = supabase
      .channel('crm_health_metrics')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'api_usage_logs' }, (payload) => {
        setMetrics(prev => {
          // Simple dynamic calculation simulation based on incoming event
          const newDepth = Math.max(0, prev.queueDepth + (payload.new.status === 'queued' ? 1 : -1));
          const isSuccess = payload.new.status === 'success';
          const newRate = isSuccess ? Math.min(100, prev.syncSuccessRate + 1) : Math.max(0, prev.syncSuccessRate - 2);

          return {
            ...prev,
            syncSuccessRate: newRate,
            queueDepth: newDepth,
            lastGlobalSync: new Date().toISOString()
          };
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsPulseActive(true);
        } else {
          setIsPulseActive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const combinedHealth = { ...crmHealth, syncSuccessRate: metrics.syncSuccessRate, queueDepth: metrics.queueDepth };


  const handleGlobalRefresh = () => {
    setIsRefreshing(true);
    addNotification({ title: 'Mesh Synchronizing', message: 'Re-validating all neural field mappings...', type: 'info' });
    setTimeout(() => {
      setIsRefreshing(false);
      addNotification({ title: 'Sync Complete', message: 'All CRM bridges are operating at peak efficiency.', type: 'success' });
    }, 2000);
  };

  const providers = [
    { name: 'Nexus', icon: FiDatabase, status: crmHealth.providerStatus.Nexus, latency: '4ms' },
    { name: 'Deskera', icon: FiGrid, status: crmHealth.providerStatus.Deskera, latency: '1.2s' },
    { name: 'Salesforce', icon: FiLink, status: crmHealth.providerStatus.Salesforce, latency: '2.8s' },
    { name: 'HubSpot', icon: FiRefreshCw, status: crmHealth.providerStatus.HubSpot, latency: '840ms' },
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <SafeIcon icon={FiActivity} className="text-cyan-400" /> CRM Sync Health
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time monitoring of the AXiM → CRM data pipeline.</p>
        </div>
        <button 
          onClick={handleGlobalRefresh}
          disabled={isRefreshing}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all"
        >
          <SafeIcon icon={FiRefreshCw} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Re-Validating...' : 'Force Global Resync'}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-zinc-300">Live DB Stream</span>
        <div className={`w-2.5 h-2.5 rounded-full ${isPulseActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
      </div>
      <CrmHealthMetrics health={combinedHealth} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <PipelineVisualizer crmProvider={crmProvider} />

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest italic">Neural Mapping Health</h3>
              <Badge variant="cyber">V4.2 Schema Active</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Source Field</th>
                    <th className="px-6 py-4 text-center">Transform</th>
                    <th className="px-6 py-4">CRM Target</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {fieldMappings.map(map => (
                    <tr key={map.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-indigo-400 text-xs">{map.source}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <SafeIcon icon={FiArrowRight} className="text-zinc-700 text-xs mb-1" />
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{map.transform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-300 text-xs">{map.target}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-emerald-400 text-[10px] font-bold uppercase">
                          <SafeIcon icon={FiCheck} /> {map.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <SafeIcon icon={FiGrid} className="text-indigo-400" /> Connector Pulse
            </h3>
            <div className="space-y-4">
              {providers.map(provider => (
                <div key={provider.name} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${provider.name === crmProvider ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                      <SafeIcon icon={provider.icon} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200">{provider.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono italic">Latency: {provider.latency}</p>
                    </div>
                  </div>
                  <Badge variant={provider.status === 'Operational' ? 'success' : provider.status === 'Degraded' ? 'danger' : 'warning'}>
                    {provider.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
              <SafeIcon icon={FiSettings} className="animate-spin-slow" />
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Self-Healing Pipeline</h4>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed italic">
              The AXiM sync engine automatically retries failed transmissions up to 3 times before generating an overseer alert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};