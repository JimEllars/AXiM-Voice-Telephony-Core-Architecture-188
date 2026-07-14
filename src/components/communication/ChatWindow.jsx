import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiSend, FiPaperclip, FiMoreVertical, FiCpu, FiUser, FiTerminal, FiSmile } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';
import { format } from 'date-fns';

export const ChatWindow = () => {
  const { messages, sendMessage, agents, activeThreadId } = useVoiceStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950/50 rounded-3xl border border-zinc-800 overflow-hidden">
      {/* Thread Header */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <SafeIcon icon={FiTerminal} className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest italic">Global Mesh Link</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Active Channel: Operational-01</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2">
            {agents.map(a => (
              <div key={a.id} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden" title={a.name}>
                <SafeIcon icon={a.role === 'AI Agent' ? FiCpu : FiUser} className="text-[10px] text-zinc-400" />
              </div>
            ))}
          </div>
          <button className="p-2 text-zinc-500 hover:text-zinc-300">
            <SafeIcon icon={FiMoreVertical} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => {
          const sender = agents.find(a => a.id === msg.senderId);
          const isMe = msg.type === 'user';
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                isMe ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}>
                <SafeIcon icon={sender?.role === 'AI Agent' ? FiCpu : FiUser} className="text-sm" />
              </div>
              
              <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : ''}`}>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-lg ${
                  isMe ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                    {sender?.name || 'Unknown Entity'}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-600">
                    {format(new Date(msg.time), 'HH:mm')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-900/40">
        <form onSubmit={handleSend} className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit secure message to mesh..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-4 pr-32 py-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="button" className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors">
              <SafeIcon icon={FiPaperclip} />
            </button>
            <button type="button" className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors">
              <SafeIcon icon={FiSmile} />
            </button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2 ml-1">
              <SafeIcon icon={FiSend} /> 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};