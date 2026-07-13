import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiCpu, FiUser, FiX, FiPhoneIncoming } from 'react-icons/fi';
import { Badge } from '../common/Badge';

export const OnyxTranscriptStream = ({ call, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'onyx', text: 'Thank you for calling AXiM. How can I assist you today?' }
  ]);
  const messagesEndRef = useRef(null);

  // Simulate ongoing conversation
  useEffect(() => {
    const timer = setInterval(() => {
      const isCaller = Math.random() > 0.5;
      const newMsg = {
        id: Date.now(),
        sender: isCaller ? 'caller' : 'onyx',
        text: isCaller 
          ? 'Yes, I was wondering about the status of my recent invoice for the uniform delivery.' 
          : 'I can certainly help with that. Let me look up your account based on your caller ID.'
      };
      setMessages(prev => [...prev, newMsg]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-zinc-100">{call.callerId}</h3>
              <Badge variant="cyber" className="animate-pulse">Live AI Intervention</Badge>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Stream SID: str_{Math.random().toString(36).substring(7)}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 rounded-lg">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'caller' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'onyx' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-zinc-800 text-zinc-400'
              }`}>
                <SafeIcon icon={msg.sender === 'onyx' ? FiCpu : FiUser} />
              </div>
              <div className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'onyx' 
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50' 
                  : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono">WSS Active • Latency 14ms</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(217,70,239,0.4)]">
            <SafeIcon icon={FiPhoneIncoming} />
            Seize Call to Agent
          </button>
        </div>
      </motion.div>
    </div>
  );
};