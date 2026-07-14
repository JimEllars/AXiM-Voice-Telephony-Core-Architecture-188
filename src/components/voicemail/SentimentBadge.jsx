import React from 'react';
import { Badge } from '../common/Badge';
import SafeIcon from '../../common/SafeIcon';
import { FiSmile, FiMeh, FiFrown, FiAlertCircle } from 'react-icons/fi';

export const SentimentBadge = ({ sentiment, priority }) => {
  const getSentimentConfig = () => {
    switch (sentiment) {
      case 'positive': return { icon: FiSmile, variant: 'success', text: 'Positive' };
      case 'negative': return { icon: FiFrown, variant: 'danger', text: 'Frustrated' };
      default: return { icon: FiMeh, variant: 'default', text: 'Neutral' };
    }
  };

  const getPriorityConfig = () => {
    switch (priority) {
      case 'urgent': return { icon: FiAlertCircle, variant: 'danger', text: 'Urgent' };
      case 'high': return { icon: FiAlertCircle, variant: 'warning', text: 'High Priority' };
      default: return null;
    }
  };

  const s = getSentimentConfig();
  const p = getPriorityConfig();

  return (
    <div className="flex gap-2">
      {p && (
        <Badge variant={p.variant} className="flex items-center gap-1 py-1">
          <SafeIcon icon={p.icon} className="text-[10px]" />
          {p.text}
        </Badge>
      )}
      <Badge variant={s.variant} className="flex items-center gap-1 py-1">
        <SafeIcon icon={s.icon} className="text-[10px]" />
        {s.text}
      </Badge>
    </div>
  );
};