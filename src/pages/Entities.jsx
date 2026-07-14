import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiUsers, FiSearch, FiMail, FiPhone, FiExternalLink, FiFilter, FiCpu } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { EntityDetailModal } from '../components/entities/EntityDetailModal';

export const Entities = () => {
  const { entities } = useVoiceStore();
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  const filtered = entities.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <SafeIcon icon={FiUsers} className="text-indigo-500" /> Entity Intelligence
          </h1>
          <p className="text-zinc-500 text-sm mt-1">AI-extracted lead data and contact relationships.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search entities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 w-64" 
            />
          </div>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
            <SafeIcon icon={FiFilter} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((entity, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={entity.id} 
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 group hover:border-indigo-500/30 transition-all cursor-pointer"
            onClick={() => setSelectedEntity(entity)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-zinc-800 flex items-center justify-center text-2xl text-zinc-400 group-hover:scale-110 transition-transform font-bold">
                  {entity.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{entity.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{entity.company}</p>
                </div>
              </div>
              <Badge variant={entity.sentiment === 'Positive' ? 'success' : 'default'}>{entity.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                  <SafeIcon icon={FiMail} className="text-cyan-400" /> Email
                </p>
                <p className="text-xs text-zinc-300 truncate">{entity.extractedData.email || 'N/A'}</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                  <SafeIcon icon={FiPhone} className="text-emerald-400" /> Primary Line
                </p>
                <p className="text-xs text-zinc-300">{entity.extractedData.phone}</p>
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon icon={FiCpu} className="text-indigo-400 text-xs" />
                <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Neural Insights</span>
              </div>
              <p className="text-xs text-zinc-400 italic leading-relaxed line-clamp-2">
                "{entity.extractedData.notes}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-600 font-mono italic">Last Activity: {entity.lastContact}</span>
              <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                Full Profile <SafeIcon icon={FiExternalLink} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEntity && (
          <EntityDetailModal 
            entity={selectedEntity} 
            onClose={() => setSelectedEntity(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};