import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiMessageSquare, FiMail, FiCheck, FiDatabase, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Badge } from '../common/Badge';

export const ResponseTemplateModal = ({ voicemail, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { templates, executeFollowUp, crmProvider } = useVoiceStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAction = (type, detail) => {
    setIsProcessing(true);
    setTimeout(() => {
      executeFollowUp(voicemail.id, { type, detail, status: 'completed' });
      setIsProcessing(false);
      setSuccessMsg(`Action Dispatched: ${type}`);
      setTimeout(() => {
        setSuccessMsg('');
        if (type === 'SMS' || type === 'Email') onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div>
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              Action Center <SafeIcon icon={FiArrowRight} className="text-indigo-500" />
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">Intervention Target: {voicemail.callerId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          <AnimatePresence mode="wait">
            {successMsg ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <SafeIcon icon={FiCheck} className="text-3xl" />
                </div>
                <h4 className="text-xl font-bold text-zinc-100">{successMsg}</h4>
                <p className="text-zinc-500 text-sm mt-2 font-mono italic">Transmission synchronized with carrier mesh.</p>
              </motion.div>
            ) : (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4 block">Communication Channels</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button 
                        key={template.id} 
                        onClick={() => handleAction(template.type, `Sent template: ${template.name}`)}
                        className="text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={template.type === 'SMS' ? 'cyber' : 'fuchsia'}>{template.type}</Badge>
                          <SafeIcon icon={template.type === 'SMS' ? FiMessageSquare : FiMail} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-200 block mb-1">{template.name}</span>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed italic">"{template.content}"</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4 block">System Orchestration</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAction('CRM_TASK', `Manual ${crmProvider} task created`)}
                      className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <SafeIcon icon={FiDatabase} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-semibold text-zinc-200 block">Create Task</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Push to {crmProvider}</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleAction('ESCALATION', 'High priority agent escalation')}
                      className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-rose-500/50 hover:bg-zinc-800/50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <SafeIcon icon={FiAlertTriangle} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-semibold text-zinc-200 block">Escalate Tier</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Human Intervention</span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-between items-center px-6">
          <div className="flex items-center gap-2">
            {isProcessing && (
              <>
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest">Bridging Nexus Gateway...</span>
              </>
            )}
          </div>
          <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300 font-medium uppercase tracking-widest transition-colors">
            Cancel Intervention
          </button>
        </div>
      </motion.div>
    </div>
  );
};