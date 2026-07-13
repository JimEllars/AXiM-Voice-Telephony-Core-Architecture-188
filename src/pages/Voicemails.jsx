import React, { useState, useMemo } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import { TranscriptCard } from '../components/voicemail/TranscriptCard';
import SafeIcon from '../common/SafeIcon';
import { FiInbox, FiSearch, FiX, FiFilter, FiArchive, FiTrash2, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/common/Badge';

export const Voicemails = () => {
  const { voicemails, archiveVoicemail, deleteVoicemail } = useVoiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('active'); // active, archived, all

  const filteredVoicemails = useMemo(() => {
    return voicemails.filter(vm => {
      const matchesSearch = vm.callerId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vm.transcript.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === 'active') return matchesSearch && !vm.archived;
      if (filter === 'archived') return matchesSearch && vm.archived;
      return matchesSearch;
    });
  }, [voicemails, searchQuery, filter]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiInbox} className="text-cyan-400" /> Intelligence Vault
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Unified repository of AI-transcribed interactions.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
            {['active', 'archived', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${filter === f ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative group">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search transcript intelligence..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVoicemails.length > 0 ? (
            filteredVoicemails.map(vm => (
              <motion.div 
                key={vm.id} 
                layout 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative group"
              >
                <TranscriptCard voicemail={vm} />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!vm.archived && (
                    <button 
                      onClick={() => archiveVoicemail(vm.id)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg border border-zinc-700 transition-colors"
                      title="Archive"
                    >
                      <SafeIcon icon={FiArchive} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteVoicemail(vm.id)}
                    className="p-1.5 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg border border-zinc-700 hover:border-rose-500/30 transition-colors"
                    title="Delete Permanently"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl">
              <SafeIcon icon={FiInbox} className="text-4xl text-zinc-700 mb-4" />
              <h3 className="text-zinc-400 font-medium">Intelligence Vault Empty</h3>
              <p className="text-zinc-600 text-sm mt-1">No transmissions matching the current filter set.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};