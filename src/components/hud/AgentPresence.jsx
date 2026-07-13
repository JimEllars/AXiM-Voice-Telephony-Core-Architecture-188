import React from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiChevronDown, FiUserCheck, FiPhoneCall, FiUserX } from 'react-icons/fi';

export const AgentPresence = () => {
  const { agentStatus, setAgentStatus } = useVoiceStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const statuses = [
    { id: 'Available', icon: FiUserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400' },
    { id: 'On Call', icon: FiPhoneCall, color: 'text-amber-400', bg: 'bg-amber-400' },
    { id: 'Offline', icon: FiUserX, color: 'text-zinc-500', bg: 'bg-zinc-500' },
  ];

  const current = statuses.find(s => s.id === agentStatus);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${current?.bg} animate-pulse shadow-[0_0_8px_currentColor]`} />
        <span className="text-sm font-medium text-zinc-200">{agentStatus}</span>
        <SafeIcon icon={FiChevronDown} className="text-zinc-500 text-xs ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50">
          {statuses.map(status => (
            <button
              key={status.id}
              onClick={() => { setAgentStatus(status.id); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <SafeIcon icon={status.icon} className={status.color} />
              {status.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};