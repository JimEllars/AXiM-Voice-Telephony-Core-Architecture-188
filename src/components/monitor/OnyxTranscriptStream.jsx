import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiCpu, FiUser, FiX, FiPhoneIncoming, FiMic, FiMicOff, FiTrendingUp, FiCrosshair, FiGlobe } from 'react-icons/fi';
import { Badge } from '../common/Badge';
import { useVoiceStore } from '../../store/useVoiceStore';
import { AudioSpectrum } from './AudioSpectrum';

export const OnyxTranscriptStream = ({ call, onClose }) => {
  const { seizeCall, addNotification, logEvent } = useVoiceStore();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'onyx', text: 'Thank you for calling AXiM. How can I assist you today?' }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef(null);

  const isManual = call.status === 'manual_intervention';

  useEffect(() => {
    if (!call?.id) return;
    const supabaseUrl = import.meta.env.VITE_AXIM_CORE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_AXIM_CORE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      if (isManual) return;
      const timer = setInterval(() => {
        const isCaller = Math.random() > 0.5;
        const newMsg = {
          id: Date.now(),
          sender: isCaller ? 'caller' : 'onyx',
          text: isCaller ? 'Yes, I was wondering about the status of my recent invoice for the uniform delivery.' : 'I can certainly help with that. Let me look up your account based on your caller ID.'
        };
        setMessages(prev => [...prev, newMsg]);
      }, 4000);
      return () => clearInterval(timer);
    }

    let channel;
    let client;
    let isMounted = true;
    import('@supabase/supabase-js').then(({ createClient }) => {
      if (!isMounted) return;
      client = createClient(supabaseUrl, supabaseKey);
      channel = client.channel(`transcript-${call.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'call_transcripts',
          filter: `call_id=eq.${call.id}`
        }, (payload) => {
          if (payload.new && payload.new.text) {
            setMessages(prev => [...prev, {
              id: payload.new.id || Date.now(),
              sender: payload.new.sender || 'onyx',
              text: payload.new.text
            }]);
          }
        })
        .subscribe();
    });

    return () => {
      isMounted = false;
      if (client && channel) {
        client.removeChannel(channel);
      }
    };
  }, [call?.id, isManual]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSeize = () => {
    seizeCall(call.id);
    addNotification({ type: 'success', title: 'Transfer Bridge Active', message: 'Warm transfer bridge confirmed.' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[750px]"
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl transition-colors ${isManual ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'}`}>
              <SafeIcon icon={isManual ? FiUser : FiCrosshair} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-zinc-100">{call.callerId}</h3>
                <Badge variant={isManual ? 'success' : 'cyber'} className="animate-pulse">
                  {isManual ? 'Manual Override' : 'Live Observation'}
                </Badge>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <SafeIcon icon={FiGlobe} className="text-[9px]" /> Node: {call.node} • Latency: 12ms
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-900 border border-zinc-800 rounded-xl transition-all">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <div className="bg-zinc-900/30 px-6 py-3 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Audio Stream</div>
            <AudioSpectrum isActive={true} />
          </div>
          <div className="flex gap-4 text-[9px] font-mono text-zinc-500">
            <span>BITRATE: 320 KBPS</span>
            <span className={isManual ? 'text-emerald-400' : 'text-indigo-400'}>
              {isManual ? 'OP_LOCAL_BRIDGE' : 'ENCRYPTION: AES-256'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_100%)]">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'caller' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg ${msg.sender === 'onyx' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                <SafeIcon icon={msg.sender === 'onyx' ? FiCpu : FiUser} />
              </div>
              <div className="flex flex-col max-w-[70%]">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'onyx' ? 'bg-indigo-500/10 border border-indigo-500/20 text-zinc-200' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 italic'}`}>
                  {msg.text}
                </div>
                <span className={`text-[9px] mt-1 font-mono text-zinc-600 ${msg.sender === 'caller' ? 'text-right' : ''}`}>
                  {msg.sender === 'onyx' ? 'ONYX-AI-04' : 'SYSTEM-MATCH: ACME CORP'}
                </span>
              </div>
            </motion.div>
          ))}
          {isManual && (
            <div className="flex justify-center py-4">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest animate-pulse">
                Local Terminal Bridge Established • Direct Audio Enabled
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                if (!newMuted) {
                  logEvent('Call Override Initiated by Operator', 'security', 'Voice Cockpit');
                  addNotification({ type: 'success', title: 'Local Mic Active', message: 'Warm transfer bridge confirmed.' });
                }
              }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                <SafeIcon icon={isMuted ? FiMicOff : FiMic} />
                {isMuted ? 'Terminal Muted' : 'Local Mic Active'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-400 rounded-xl text-xs font-bold transition-all">
                <SafeIcon icon={FiTrendingUp} /> Real-time Sentiment
              </button>
            </div>
            <button 
              onClick={handleSeize}
              disabled={isManual}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isManual ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'}`}
            >
              <SafeIcon icon={FiPhoneIncoming} /> {isManual ? 'Manual Control Active' : 'Seize Control'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};