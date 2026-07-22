import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiPlay, FiPause, FiClock, FiUser, FiActivity, FiCpu, FiList, FiRefreshCw } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ResponseTemplateModal } from './ResponseTemplateModal';
import { ActionTimeline } from './ActionTimeline';
import { SentimentBadge } from './SentimentBadge';
import { ClassificationBadge } from './ClassificationBadge';
import { CallSummary } from './CallSummary';
import { PrioritySelector } from './PrioritySelector';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Badge } from '../common/Badge';
import { ActionTrailModal } from './ActionTrailModal';

export const TranscriptCard = ({ voicemail }) => {
  const { updateVoicemailClassification } = useVoiceStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  React.useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= voicemail.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!isPlaying && elapsedSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, voicemail.duration]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showTrailModal, setShowTrailModal] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  
  const classes = ['Billing', 'Support', 'Sales', 'Operations', 'General'];

  return (
    <>
      <div className={`bg-zinc-900/40 border rounded-xl p-5 backdrop-blur-sm transition-all group relative overflow-hidden ${voicemail.priority === 'urgent' ? 'border-rose-500/30' : 'border-zinc-800/80 hover:border-zinc-700'}`}>
        {voicemail.priority === 'urgent' && (
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 border transition-colors ${voicemail.priority === 'urgent' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-zinc-800 border-zinc-700 group-hover:border-indigo-500/50'}`}>
              <SafeIcon icon={FiUser} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">{voicemail.callerId}</h3>
                {voicemail.autoTriaged && (
                  <Badge variant="cyber" className="text-[8px] px-1 py-0 flex items-center gap-1 border-opacity-20">
                    <SafeIcon icon={FiCpu} className="text-[8px]" /> AUTO
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5 font-mono">
                <SafeIcon icon={FiClock} className="text-[10px]" /> {formatDistanceToNow(new Date(voicemail.date), { addSuffix: true })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => setShowTrailModal(true)}
                className="p-1.5 text-zinc-500 hover:text-indigo-400 bg-zinc-950 border border-zinc-800 rounded-lg transition-all"
                title="View Action Trail"
              >
                <SafeIcon icon={FiList} className="text-sm" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowClassMenu(!showClassMenu)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <ClassificationBadge 
                    classification={voicemail.classification} 
                    confidence={voicemail.confidence}
                    isManual={voicemail.isManualCorrection}
                  />
                </button>
                {showClassMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowClassMenu(false)} />
                    <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                      {classes.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            updateVoicemailClassification(voicemail.id, c);
                            setShowClassMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <PrioritySelector voicemailId={voicemail.id} currentPriority={voicemail.priority} />
            </div>
            <SentimentBadge sentiment={voicemail.sentiment} priority={voicemail.priority} />
          </div>
        </div>

        <CallSummary summary={voicemail.summary} />

        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/80 relative mb-4">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-zinc-950 px-2 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
            Full AI Transcript
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "{voicemail.transcript}"
          </p>
        </div>

        <ActionTimeline actions={voicemail.actionsTaken} />

        <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 mt-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-indigo-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} />
            </button>
            <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
              <div className={`h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000`} style={{ width: `${(elapsedSeconds / Math.max(1, voicemail.duration)) * 100}%` }}></div>
            </div>
            <span className="text-xs text-zinc-500 font-mono">00:{elapsedSeconds.toString().padStart(2, '0')} / 00:{voicemail.duration.toString().padStart(2, '0')}</span>
          </div>
          <button 
            onClick={() => setShowResponseModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-lg shadow-indigo-900/20 transition-all border border-indigo-400/30"
          >
            <SafeIcon icon={FiActivity} /> Action Center
          </button>
        </div>
      </div>

      {showResponseModal && (
        <ResponseTemplateModal voicemail={voicemail} onClose={() => setShowResponseModal(false)} />
      )}
      {showTrailModal && (
        <ActionTrailModal voicemail={voicemail} onClose={() => setShowTrailModal(false)} />
      )}
    </>
  );
};