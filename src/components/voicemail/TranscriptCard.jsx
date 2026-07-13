import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiPlay, FiPause, FiExternalLink, FiClock, FiUser, FiSend, FiZap } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ResponseTemplateModal } from './ResponseTemplateModal';
import { Badge } from '../common/Badge';

export const TranscriptCard = ({ voicemail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  return (
    <>
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm hover:border-zinc-700 transition-colors group relative overflow-hidden">
        {voicemail.autoResponded && (
          <div className="absolute top-0 right-0">
            <div className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 border-l border-b border-cyan-500/30">
              <SafeIcon icon={FiZap} className="text-[10px]" /> AI AUTO-RESPONDED ({voicemail.responseType})
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700 group-hover:border-cyan-500/50 transition-colors">
              <SafeIcon icon={FiUser} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-200">{voicemail.callerId}</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                <SafeIcon icon={FiClock} className="text-[10px]" /> 
                {formatDistanceToNow(new Date(voicemail.date), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {voicemail.crmId && (
              <button className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1.5 rounded hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                Deskera CRM <SafeIcon icon={FiExternalLink} />
              </button>
            )}
            <button 
              onClick={() => setShowResponseModal(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1.5 rounded border border-zinc-700 transition-colors"
            >
              {voicemail.autoResponded ? 'Follow-up' : 'Respond'} <SafeIcon icon={FiSend} />
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/80 mb-4 relative">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-zinc-950 px-2 text-[10px] uppercase tracking-widest font-mono text-zinc-500">
            Noota AI Transcript
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "{voicemail.transcript}"
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors">
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} />
            </button>
            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-600 w-1/3"></div>
            </div>
            <span className="text-xs text-zinc-500 font-mono">00:{voicemail.duration}</span>
          </div>
          {voicemail.autoResponded && (
            <Badge variant="cyber" className="text-[10px]">Onyx Mk3 Active</Badge>
          )}
        </div>
      </div>

      {showResponseModal && (
        <ResponseTemplateModal 
          voicemail={voicemail} 
          onClose={() => setShowResponseModal(false)} 
        />
      )}
    </>
  );
};