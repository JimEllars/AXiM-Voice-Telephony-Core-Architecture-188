import React from 'react';
import { Badge } from '../common/Badge';
import SafeIcon from '../../common/SafeIcon';
import { FiCreditCard, FiLifeBuoy, FiTrendingUp, FiHash, FiZap, FiTruck, FiUserCheck } from 'react-icons/fi';

export const ClassificationBadge = ({ classification, confidence, isManual }) => {
  const getConfig = () => {
    switch (classification) {
      case 'Billing': return { icon: FiCreditCard, variant: 'warning', label: 'Billing' };
      case 'Support': return { icon: FiLifeBuoy, variant: 'cyber', label: 'Support' };
      case 'Sales': return { icon: FiTrendingUp, variant: 'success', label: 'Sales' };
      case 'Operations': return { icon: FiTruck, variant: 'fuchsia', label: 'Operations' };
      case 'Urgent': return { icon: FiZap, variant: 'danger', label: 'Urgent' };
      default: return { icon: FiHash, variant: 'default', label: 'General' };
    }
  };

  const config = getConfig();

  return (
    <div className="flex flex-col items-end gap-1">
      <Badge variant={config.variant} className="flex items-center gap-1.5 py-1 px-2 border-opacity-30">
        <SafeIcon icon={config.icon} className="text-[10px]" />
        <span className="uppercase tracking-wider font-bold text-[9px]">{config.label}</span>
      </Badge>
      {isManual ? (
        <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">
          <SafeIcon icon={FiUserCheck} /> Human Verified
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-600 uppercase">
          AI Confidence: <span className={confidence > 80 ? 'text-indigo-400' : 'text-amber-500'}>{confidence}%</span>
        </div>
      )}
    </div>
  );
};