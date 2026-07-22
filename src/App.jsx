import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Voicemails } from './pages/Voicemails';
import { AsguardFirewall } from './pages/AsguardFirewall';
import { NexusSync } from './pages/NexusSync';
import { CrmSyncHealth } from './pages/CrmSyncHealth';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { Agents } from './pages/Agents';
import { Entities } from './pages/Entities';
import { Nodes } from './pages/Nodes';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { CommunicationHub } from './pages/CommunicationHub';
import { LiveMonitor } from './pages/LiveMonitor';
import { NotificationToast } from './components/layout/NotificationToast';
import { DeskeraSync } from './pages/DeskeraSync';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col selection:bg-indigo-500/30">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-900/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/live" element={<LiveMonitor />} />
                <Route path="/voicemails" element={<Voicemails />} />
                <Route path="/comms" element={<CommunicationHub />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/entities" element={<Entities />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/nodes" element={<Nodes />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/security" element={<AsguardFirewall />} />
                <Route path="/crm-health" element={<CrmSyncHealth />} />
                <Route path="/crm-sync" element={<NexusSync />} />
                <Route path="/deskera" element={<DeskeraSync />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
        <NotificationToast />
      </div>
    </Router>
  );
}

export default App;