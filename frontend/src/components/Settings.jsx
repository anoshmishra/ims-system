import React from 'react';

const Settings = () => {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Autonomous AI Configuration</h2>
        <div className="glass-card p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Auto-RCA Generation</p>
              <p className="text-sm text-slate-500">Automatically use LLM to generate Root Cause Analysis for P0/P1 incidents.</p>
            </div>
            <input 
              type="checkbox" 
              className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-indigo-600 transition-all relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all" 
              defaultChecked 
            />
          </div>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-700 mb-2">Anomaly Threshold</p>
            <input 
              type="range" 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
              min="0" 
              max="100" 
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase">
              <span>Sensitive</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Notification Channels</h2>
        <div className="glass-card p-6 bg-white border border-slate-200 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Email Alerts</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Slack Integration</span>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Configure</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;