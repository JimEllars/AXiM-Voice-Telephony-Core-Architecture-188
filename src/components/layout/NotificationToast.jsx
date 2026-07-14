import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import SafeIcon from '../../common/SafeIcon';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export const NotificationToast = () => {
  const { notifications, removeNotification } = useVoiceStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-auto w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl flex gap-3 items-start backdrop-blur-md"
          >
            <div className={`mt-0.5 ${n.type === 'success' ? 'text-emerald-400' : n.type === 'error' ? 'text-rose-400' : 'text-cyan-400'}`}>
              <SafeIcon icon={n.type === 'success' ? FiCheckCircle : n.type === 'error' ? FiAlertCircle : FiInfo} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{n.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 italic">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="text-zinc-600 hover:text-zinc-400">
              <SafeIcon icon={FiX} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};