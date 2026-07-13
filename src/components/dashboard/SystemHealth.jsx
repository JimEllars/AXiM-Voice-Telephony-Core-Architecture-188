import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiActivity, FiServer, FiGlobe, FiCpu, FiWifi } from 'react-icons/fi';

const HealthNode = ({ icon, label, status, value, color }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-opacity-10 border border-current border-opacity-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
      <SafeIcon icon={icon} className="text-sm" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</span>
        <span className={`text-[10px] font-mono ${status === 'Online' ? 'text-emerald-400' : 'text-amber-400'}`}>{status}</span>
      </div>
      <div className="text-sm font-medium text-zinc-200">{value}</div>
    </div>
  </div>
);

export const SystemHealth = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <SafeIcon icon={FiActivity} className="text-cyan-400" /> Infrastructure Node Status
        </h3>
        <span className="text-[10px] font-mono text-zinc-600">Region: US-EAST-1 (Onyx-Cluster)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <HealthNode icon={FiServer} label="Core Telephony" status="Online" value="Twilio SIP Trunk" color="text-cyan-400" />
        <HealthNode icon={FiCpu} label="AI Inference" status="Online" value="Onyx Mk3 (210ms)" color="text-fuchsia-400" />
        <HealthNode icon={FiGlobe} label="CRM Sync" status="Online" value="Deskera API v4" color="text-emerald-400" />
        <HealthNode icon={FiWifi} label="WSS Stream" status="Active" value="14 Connected Nodes" color="text-amber-400" />
      </div>
    </div>
  );
};