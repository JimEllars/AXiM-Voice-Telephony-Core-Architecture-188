import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiArchive, FiTrash2, FiTag } from 'react-icons/fi';
import { useVoiceStore } from '../../store/useVoiceStore';
import { BulkTagModal } from './BulkTagModal';

export const BulkActions = ({ selectedIds, onClearSelection }) => {
  const { archiveVoicemail, deleteVoicemail, addNotification } = useVoiceStore();
  const [showTagModal, setShowTagModal] = useState(false);

  const handleBulkArchive = () => {
    selectedIds.forEach(id => archiveVoicemail(id));
    addNotification({ title: 'Bulk Archive', message: `${selectedIds.length} transmissions vaulted.`, type: 'success' });
    onClearSelection();
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteVoicemail(id));
    addNotification({ title: 'Bulk Purge', message: `${selectedIds.length} transmissions erased.`, type: 'error' });
    onClearSelection();
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-indigo-500/50 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(99,102,241,0.2)] z-50 flex items-center gap-6 animate-in slide-in-from-bottom-5">
        <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
          <span className="text-sm font-bold text-indigo-400 font-mono">{selectedIds.length}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em]">Selected</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTagModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold transition-all"
          >
            <SafeIcon icon={FiTag} /> Re-Tag
          </button>
          <button onClick={handleBulkArchive} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all">
            <SafeIcon icon={FiArchive} /> Archive
          </button>
          <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all">
            <SafeIcon icon={FiTrash2} /> Purge
          </button>
        </div>

        <button onClick={onClearSelection} className="text-[10px] uppercase font-bold text-zinc-600 hover:text-zinc-400 tracking-widest pl-4">
          Deselect
        </button>
      </div>

      {showTagModal && (
        <BulkTagModal 
          selectedIds={selectedIds} 
          onClose={() => {
            setShowTagModal(false);
            onClearSelection();
          }} 
        />
      )}
    </>
  );
};