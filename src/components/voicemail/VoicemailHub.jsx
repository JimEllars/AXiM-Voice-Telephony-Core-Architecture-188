import React, { useState, useMemo } from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import { TranscriptCard } from './TranscriptCard';
import SafeIcon from '../../common/SafeIcon';
import { FiInbox, FiSearch, FiX, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const VoicemailHub = () => {
  const { voicemails, fetchVoicemails } = useVoiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchVoicemails();
    setIsRefreshing(false);
  };

  const filteredVoicemails = useMemo(() => {
    return voicemails.filter(vm => 
      vm.callerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vm.transcript.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [voicemails, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiInbox} className="text-cyan-400" /> 
            Voicemail Inbox
          </h2>
          <p className="text-sm text-zinc-400 mt-1">AI Transcribed Audio Records</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="Refresh Inbox"
          >
            <SafeIcon icon={FiRefreshCw} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
              <SafeIcon icon={FiSearch} />
            </div>
            <input
              type="text"
              placeholder="Search ID or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-10 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <SafeIcon icon={FiX} />
              </button>
            )}
          </div>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
            <SafeIcon icon={FiFilter} />
          </button>
        </div>
      </div>

      {filteredVoicemails.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredVoicemails.map(vm => (
              <motion.div
                key={vm.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <TranscriptCard voicemail={vm} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
            <SafeIcon icon={FiSearch} className="text-2xl" />
          </div>
          <h3 className="text-zinc-200 font-medium">No results found</h3>
          <p className="text-zinc-500 text-sm mt-1">Try adjusting your search terms or filters.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors"
          >
            Clear Search
          </button>
        </motion.div>
      )}
    </div>
  );
};