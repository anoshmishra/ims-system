import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Search, 
  Filter,
  Zap
} from 'lucide-react';

const Dashboard = ({ incidents, refreshData, loading }) => {
  const stats = {
    total: incidents.length,
    critical: incidents.filter(i => i.severity === 'CRITICAL').length,
    pending: incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
    resolved: incidents.filter(i => i.status === 'RESOLVED').length
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const generateAIAnalysis = async (id) => {
    try {
      const response = await fetch(`/api/incidents/${id}/analyze`, { method: 'POST' });
      if (response.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing with Incident Data Lake...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={stats.total} icon={<BarChart3 className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Critical (P0)" value={stats.critical} icon={<AlertCircle className="w-5 h-5" />} color="bg-rose-500" />
        <StatCard title="Active Issues" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="bg-amber-500" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} color="bg-emerald-500" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Incident Feed</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time system health and anomaly detection</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">System Nominal</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
            No active incidents detected. All clusters are operating within normal parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {incidents.map((incident) => (
            <div key={incident.id} className={`glass-card p-6 bg-white border-l-4 rounded-xl shadow-sm transition-all border border-slate-100 ${
              incident.severity === 'CRITICAL' ? 'border-l-rose-500' : 'border-l-indigo-500'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      incident.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>{incident.severity}</span>
                    <span className="text-xs text-slate-400 font-mono">{incident.component_id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{incident.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap">{incident.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {incident.status === 'OPEN' && (
                    <button 
                      onClick={() => updateStatus(incident.id, 'IN_PROGRESS')}
                      className="text-xs font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {incident.status !== 'RESOLVED' && (
                    <button 
                      onClick={() => generateAIAnalysis(incident.id)}
                      className="flex items-center justify-center gap-2 text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >
                      <Zap className="w-3 h-3" /> Auto-Analyze
                    </button>
                  )}
                  {incident.status === 'RESOLVED' && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-card p-5 flex items-center gap-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
    <div className={`p-3 rounded-xl text-white ${color} shadow-lg shadow-current/20`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;