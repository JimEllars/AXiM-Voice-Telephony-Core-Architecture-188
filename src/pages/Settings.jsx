import React, { useState } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import SafeIcon from '../common/SafeIcon';
import { FiSettings, FiPhone, FiShield, FiSave, FiMessageSquare, FiPlus, FiTrash2, FiZap, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { Badge } from '../components/common/Badge';

export const Settings = () => {
  const { 
    routingSettings, 
    updateRouting, 
    templates, 
    addTemplate, 
    deleteTemplate,
    autoRules,
    addAutoRule,
    deleteAutoRule,
    toggleAutoRule
  } = useVoiceStore();

  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', type: 'SMS' });
  const [newRule, setNewRule] = useState({ name: '', trigger: '', templateId: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateRouting({ [name]: type === 'checkbox' ? checked : value });
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.content) return;
    addTemplate(newTemplate);
    setNewTemplate({ name: '', content: '', type: 'SMS' });
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.trigger || !newRule.templateId) return;
    addAutoRule(newRule);
    setNewRule({ name: '', trigger: '', templateId: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <SafeIcon icon={FiSettings} /> Node Configuration
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Manage global AXiM Voice parameters and response logic.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Routing Core */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiPhone} className="text-cyan-400" />
              <h2 className="font-semibold text-zinc-100">Operational Routing</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Auto-Response Engine</span>
              <button 
                onClick={() => updateRouting({ autoResponseEnabled: !routingSettings.autoResponseEnabled })}
                className={`p-1 transition-colors ${routingSettings.autoResponseEnabled ? 'text-cyan-400' : 'text-zinc-600'}`}
              >
                <SafeIcon icon={routingSettings.autoResponseEnabled ? FiToggleRight : FiToggleLeft} className="text-2xl" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">SIP Forwarding Number</label>
                <input 
                  type="text" 
                  name="forwardingNumber" 
                  value={routingSettings.forwardingNumber} 
                  onChange={handleInputChange} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">AI Persona Profile</label>
                <select 
                  name="aiPersona" 
                  value={routingSettings.aiPersona} 
                  onChange={handleInputChange} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                >
                  <option>Professional Receptionist</option>
                  <option>Sales Specialist</option>
                  <option>Technical Support Tier 1</option>
                  <option>Concierge AI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Response Rules */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-3">
            <SafeIcon icon={FiZap} className="text-cyan-400" />
            <h2 className="font-semibold text-zinc-100">AI Auto-Response Rules</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              {autoRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleAutoRule(rule.id)} className={rule.enabled ? 'text-cyan-400' : 'text-zinc-600'}>
                      <SafeIcon icon={rule.enabled ? FiToggleRight : FiToggleLeft} className="text-xl" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${rule.enabled ? 'text-zinc-200' : 'text-zinc-500'}`}>{rule.name}</span>
                        <Badge variant="cyan" className="text-[10px]">IF CONTAINS: {rule.trigger}</Badge>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        ACTION: Send "{templates.find(t => t.id === rule.templateId)?.name || 'Unknown'}"
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteAutoRule(rule.id)} className="p-2 text-zinc-500 hover:text-rose-400 transition-colors">
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateRule} className="pt-4 border-t border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SafeIcon icon={FiPlus} /> New Automation Trigger
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  placeholder="Rule Name"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                  value={newRule.name}
                  onChange={e => setNewRule({...newRule, name: e.target.value})}
                />
                <input 
                  placeholder="Keywords (comma separated)"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                  value={newRule.trigger}
                  onChange={e => setNewRule({...newRule, trigger: e.target.value})}
                />
                <select 
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                  value={newRule.templateId}
                  onChange={e => setNewRule({...newRule, templateId: e.target.value})}
                >
                  <option value="">Select Template</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-cyan-500/20 transition-all"
              >
                Deploy Rule
              </button>
            </form>
          </div>
        </div>

        {/* Response Templates */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-3">
            <SafeIcon icon={FiMessageSquare} className="text-emerald-400" />
            <h2 className="font-semibold text-zinc-100">Response Templates</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-zinc-200">{template.name}</span>
                      <Badge variant={template.type === 'SMS' ? 'cyber' : 'fuchsia'}>{template.type}</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 italic">"{template.content}"</p>
                  </div>
                  <button 
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateTemplate} className="pt-4 border-t border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SafeIcon icon={FiPlus} /> New Template
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  placeholder="Template Name (e.g. Sales Follow-up)"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={newTemplate.name}
                  onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                />
                <select 
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={newTemplate.type}
                  onChange={e => setNewTemplate({...newTemplate, type: e.target.value})}
                >
                  <option>SMS</option>
                  <option>Email</option>
                </select>
              </div>
              <textarea 
                placeholder="Template Content... use [Topic] for dynamic injection"
                rows="2"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none font-mono"
                value={newTemplate.content}
                onChange={e => setNewTemplate({...newTemplate, content: e.target.value})}
              />
              <button 
                type="submit"
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg border border-zinc-700 transition-all"
              >
                Save Template
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 transition-all"> Discard Changes </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"> <SafeIcon icon={FiSave} /> Commit Configuration </button>
        </div>
      </div>
    </div>
  );
};