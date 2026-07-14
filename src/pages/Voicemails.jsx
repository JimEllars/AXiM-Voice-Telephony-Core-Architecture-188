import React, { useState, useMemo, useEffect } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import { TranscriptCard } from '../components/voicemail/TranscriptCard';
import { PriorityTriageHUD } from '../components/voicemail/PriorityTriageHUD';
import { BulkActions } from '../components/voicemail/BulkActions';
import SafeIcon from '../common/SafeIcon';
import { FiInbox, FiSearch, FiX, FiFilter, FiArchive, FiTrash2, FiRefreshCw, FiCheckSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Voicemails = () => {
  const { voicemails, archiveVoicemail, deleteVoicemail, reAnalyzeTranscripts, subscribeToTelephonyNetwork } = useVoiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToTelephonyNetwork();
    return () => unsub();
  }, []);

  const priorities = ['All', 'Urgent', 'High', 'Low'];

  const filteredVoicemails = useMemo(() => {
    return voicemails.filter(vm => {
      const matchesSearch = vm.callerId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           vm.transcript.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = classFilter === 'All' || vm.classification === classFilter;
      const matchesPriority = priorityFilter === 'All' || vm.priority.toLowerCase() === priorityFilter.toLowerCase();
      
      let matchesStatus = true;
      if (filter === 'active') matchesStatus = !vm.archived;
      if (filter === 'archived') matchesStatus = vm.archived;

      return matchesSearch && matchesClass && matchesPriority && matchesStatus;
    }).sort((a, b) => {
      const weights = { urgent: 3, high: 2, low: 1 };
      return (weights[b.priority] || 0) - (weights[a.priority] || 0);
    });
  }, [voicemails, searchQuery, filter, classFilter, priorityFilter]);

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      reAnalyzeTranscripts();
      setIsReanalyzing(false);
    }, 1500);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiInbox} className="text-cyan-400" /> Intelligence Vault
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Unified repository of AI-transcribed interactions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-400 transition-all flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className={isReanalyzing ? 'animate-spin' : ''} />
            {isReanalyzing ? 'Relinking Neural Mesh...' : 'Neural Re-Scan'}
          </button>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
            {['active', 'archived', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${filter === f ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative group">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search transcripts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <PriorityTriageHUD />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
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
                <div className="absolute top-4 left-4 z-10">
                  <button 
                    onClick={() => toggleSelect(vm.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.includes(vm.id) ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-800 border-zinc-700 text-transparent hover:border-zinc-500'}`}
                  >
                    <SafeIcon icon={FiCheckSquare} className="text-xs" />
                  </button>
                </div>
                
                <div className={selectedIds.includes(vm.id) ? 'ring-2 ring-indigo-500/50 rounded-xl' : ''}>
                  <TranscriptCard voicemail={vm} />
                </div>

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
              <h3 className="text-zinc-400 font-medium">Vault Filter Returned Empty</h3>
              <p className="text-zinc-600 text-sm mt-1">Adjust triage parameters to view transmissions.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <BulkActions selectedIds={selectedIds} onClearSelection={() => setSelectedIds([])} />
    </div>
  );
};