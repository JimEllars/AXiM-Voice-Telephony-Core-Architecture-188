import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiTag, FiCreditCard, FiLifeBuoy, FiTrendingUp, FiTruck, FiHash } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';

export const BulkTagModal = ({ selectedIds, onClose }) => {
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

  const { bulkUpdateClassification, addNotification } = useVoiceStore();
  
  const tags = [
    { id: 'Billing', icon: FiCreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'Support', icon: FiLifeBuoy, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'Sales', icon: FiTrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'Operations', icon: FiTruck, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
    { id: 'General', icon: FiHash, color: 'text-zinc-400', bg: 'bg-zinc-400/10' }
  ];

  const handleApply = (tagId) => {
    bulkUpdateClassification(selectedIds, tagId);
    addNotification({
      title: 'Bulk Classification Complete',
      message: `Successfully tagged ${selectedIds.length} transmissions as ${tagId}.`,
      type: 'success'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 italic">
            <SafeIcon icon={FiTag} className="text-indigo-400" /> Neural Re-Tagging
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
            <SafeIcon icon={FiX} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-xs text-zinc-500 mb-6 font-mono uppercase tracking-widest italic">
            Applying protocol to {selectedIds.length} mesh entities...
          </p>
          
          <div className="space-y-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleApply(tag.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-indigo-500/50 hover:bg-zinc-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${tag.bg} ${tag.color} flex items-center justify-center border border-current border-opacity-20`}>
                    <SafeIcon icon={tag.icon} />
                  </div>
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white">{tag.id}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <button onClick={onClose} className="text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest">
            Abort Operation
          </button>
        </div>
      </motion.div>
    </div>
  );
};