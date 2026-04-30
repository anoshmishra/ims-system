import React from 'react';
import { Activity, ShieldCheck, Terminal } from 'lucide-react';

const LiveMonitor = ({ incidents }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Health</h3>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">99.98%</p>
        </div>
        <div className="glass-card p-6 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signals Ingested</h3>
            <Terminal className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{incidents.length}</p>
        </div>
        <div className="glass-card p-6 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Posture</h3>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">OPTIMIZED</p>
        </div>
      </div>

      <div className="glass-card bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest">Live Signal Feed</h3>
        </div>
        <div className="space-y-3 font-mono text-[11px]">
          {incidents.slice(0, 10).map((incident, idx) => (
            <div key={idx} className="flex gap-4 text-slate-400 border-l border-slate-800 pl-4 py-1">
              <span className="text-slate-600">[{new Date(incident.created_at).toLocaleTimeString()}]</span>
              <span className={incident.severity === 'CRITICAL' ? 'text-rose-500' : 'text-indigo-400'}>{incident.severity}</span>
              <span className="text-slate-300">INGESTED: {incident.title}</span>
              <span className="text-slate-500 italic">cid: {incident.component_id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;