import React, { useState } from 'react';
import { X, ClipboardCheck, AlertCircle, Save, ShieldCheck } from 'lucide-react';

const RcaModal = ({ incident, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    root_cause: '',
    fix: '',
    prevention: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/incidents/${incident.id}/rca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit RCA:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Root Cause Analysis</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                Incident: {incident.component_id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" /> Technical Root Cause
            </label>
            <textarea
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[80px] transition-all"
              placeholder="Why did this happen?"
              value={formData.root_cause}
              onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Save className="w-3 h-3" /> Immediate Fix
            </label>
            <textarea
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[80px] transition-all"
              placeholder="What was done to restore service?"
              value={formData.fix}
              onChange={(e) => setFormData({ ...formData, fix: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Prevention Plan
            </label>
            <textarea
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[80px] transition-all"
              placeholder="How do we stop this from happening again?"
              value={formData.prevention}
              onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Finalize Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RcaModal;