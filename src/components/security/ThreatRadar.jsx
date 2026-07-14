import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiShield, FiCrosshair, FiAlertTriangle } from 'react-icons/fi';

export const ThreatRadar = ({ threats }) => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto bg-zinc-950 rounded-full border border-zinc-800/50 flex items-center justify-center overflow-hidden shadow-[inset_0_0_50px_rgba(99,102,241,0.05)]">
      {/* Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map(ring => (
          <div 
            key={ring} 
            className="absolute rounded-full border border-zinc-800/30" 
            style={{ width: `${ring * 33.3}%`, height: `${ring * 33.3}%` }} 
          />
        ))}
        {/* Crosshair */}
        <div className="absolute w-full h-[1px] bg-zinc-800/40" />
        <div className="absolute h-full w-[1px] bg-zinc-800/40" />
      </div>

      {/* Sweeping Pulse */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"
        style={{ rotate: pulse * 3.6 }}
      />

      {/* Center Icon */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
        <SafeIcon icon={FiShield} className="text-xl animate-pulse" />
      </div>

      {/* Threat Blips */}
      <AnimatePresence>
        {threats.slice(0, 8).map((threat, i) => {
          const angle = (i * 45) + (pulse % 360);
          const distance = 40 + (threat.score / 2);
          return (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
              style={{
                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * distance}px)`,
                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * distance}px)`
              }}
            >
              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full border border-rose-500/50 animate-ping" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute bottom-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2">
        Active Perimeter Scan
      </div>
    </div>
  );
};