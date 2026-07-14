import React, { useState } from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiChevronDown, FiAlertTriangle, FiZap, FiClock } from 'react-icons/fi';

export const PrioritySelector = ({ voicemailId, currentPriority }) => {
  const { updateVoicemailPriority } = useVoiceStore();
  const [isOpen, setIsOpen] = useState(false);

  const priorities = [
    { id: 'urgent', label: 'Urgent', icon: FiAlertTriangle, color: 'text-rose-400' },
    { id: 'high', label: 'High', icon: FiZap, color: 'text-amber-400' },
    { id: 'low', label: 'Low', icon: FiClock, color: 'text-zinc-500' }
  ];

  const current = priorities.find(p => p.id === currentPriority) || priorities[2];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 py-1 rounded-md border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800 transition-all text-[9px] font-bold uppercase tracking-widest ${current.color}`}
      >
        <SafeIcon icon={current.icon} />
        {current.label}
        <SafeIcon icon={FiChevronDown} className="text-zinc-600" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-20 overflow-hidden">
            {priorities.map(p => (
              <button
                key={p.id}
                onClick={() => { updateVoicemailPriority(voicemailId, p.id); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-[9px] uppercase font-bold flex items-center gap-2 transition-colors hover:bg-zinc-800 ${p.id === currentPriority ? p.color : 'text-zinc-500'}`}
              >
                <SafeIcon icon={p.icon} />
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};