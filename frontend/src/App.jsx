import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LiveMonitor from './components/LiveMonitor';
import SettingsView from './components/Settings';
import { Shield, Bell, LayoutDashboard, Settings as SettingsIcon, Activity } from 'lucide-react';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <nav className="glass-card sticky top-0 z-50 px-6 py-4 rounded-none border-t-0 border-x-0 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-none">
                IMS <span className="text-indigo-600 font-medium">Enterprise</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                Incident Management System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeTab === 'monitor' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Activity className="w-4 h-4" /> Live Monitor
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <SettingsIcon className="w-4 h-4" /> Settings
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                {incidents.filter(i => i.status === 'OPEN').length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">Anosh Mishra</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Site Reliability Engineer</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            incidents={incidents} 
            refreshData={fetchIncidents} 
            loading={loading} 
          />
        )}
        {activeTab === 'monitor' && <LiveMonitor incidents={incidents} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            &copy; 2026 IMS Protocol v2.4.0 &bull; Secure Node
          </p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CORE SYSTEMS NOMINAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;