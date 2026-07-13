import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiSend, FiMessageSquare, FiMail, FiCheck } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Badge } from '../common/Badge';

export const ResponseTemplateModal = ({ voicemail, onClose }) => {
  const { templates } = useVoiceStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customContent, setCustomContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelect = (template) => {
    setSelectedTemplate(template);
    setCustomContent(template.content.replace('[Topic]', 'your recent inquiry').replace('[ID]', Math.floor(Math.random() * 9000 + 1000)));
  };

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 italic">Quick Response Dispatcher</h3>
            <p className="text-xs text-zinc-500 font-mono">Target: {voicemail.callerId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 rounded-lg transition-colors">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!isSuccess ? (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3 block">Available Templates</label>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-zinc-200">{template.name}</span>
                        <Badge variant={template.type === 'SMS' ? 'cyber' : 'fuchsia'}>{template.type}</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{template.content}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3 block">Compose Message</label>
                  <textarea
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    rows="4"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none font-mono"
                  />
                </motion.div>
              )}
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <SafeIcon icon={FiCheck} className="text-3xl" />
              </div>
              <h4 className="text-xl font-bold text-zinc-100">Response Dispatched</h4>
              <p className="text-zinc-500 text-sm mt-2 font-mono">Transmission SID: tx_{Math.random().toString(36).substr(2, 9)}</p>
            </div>
          )}
        </div>

        {!isSuccess && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
            <button
              disabled={!selectedTemplate || isSending}
              onClick={handleSend}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:grayscale"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SafeIcon icon={selectedTemplate?.type === 'SMS' ? FiMessageSquare : FiMail} />
              )}
              {isSending ? 'Transmitting...' : 'Dispatch Response'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};