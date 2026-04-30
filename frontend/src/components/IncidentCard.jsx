import React from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  PlayCircle, 
  CheckCircle 
} from 'lucide-react';

const IncidentCard = ({ incident, onUpdate }) => {
  
  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/incidents/${incident.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) onUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-rose-500 text-white';
      case 'IN_PROGRESS': return 'bg-amber-500 text-white';
      case 'RESOLVED': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="glass-card hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${getSeverityStyles(incident.severity)}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className={`status-pill ${getStatusStyles(incident.status)}`}>
                {incident.status.replace('_', ' ')}
              </span>
              <h3 className="font-bold text-slate-800 mt-1">{incident.title}</h3>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ID: {incident.id.substring(0, 8)}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-6 line-clamp-2">
          {incident.description || 'System anomaly detected in cluster node. Debouncing logic applied to aggregate signals.'}
        </p>

        <div className="flex items-center gap-6 text-xs font-semibold text-slate-400 mb-6">
          <div className="flex flex-col">
            <span className="uppercase tracking-tighter mb-1">Component</span>
            <span className="text-slate-700">{incident.component_id}</span>
          </div>
          <div className="flex flex-col">
            <span className="uppercase tracking-tighter mb-1">Triggered</span>
            <span className="text-slate-700">{new Date(incident.created_at).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-2">
            {incident.status === 'OPEN' && (
              <button 
                onClick={() => updateStatus('IN_PROGRESS')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Acknowledge
              </button>
            )}
            {incident.status === 'IN_PROGRESS' && (
              <button 
                onClick={() => updateStatus('RESOLVED')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Resolve
              </button>
            )}
          </div>
          
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
            <FileText className="w-3.5 h-3.5" /> Root Cause Analysis
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;