import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Voicemails } from './pages/Voicemails';
import { AsguardFirewall } from './pages/AsguardFirewall';
import { DeskeraSync } from './pages/DeskeraSync';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col selection:bg-cyan-500/30">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-900/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/voicemails" element={<Voicemails />} />
                <Route path="/security" element={<AsguardFirewall />} />
                <Route path="/crm-sync" element={<DeskeraSync />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;