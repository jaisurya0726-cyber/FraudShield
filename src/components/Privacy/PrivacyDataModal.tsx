import React, { useState } from 'react';
import {
  X,
  Lock,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Server
} from 'lucide-react';

interface PrivacyDataModalProps {
  onClose: () => void;
  onClearAllData: () => void;
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({
  onClose,
  onClearAllData,
}) => {
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);
  const [dataPurged, setDataPurged] = useState(false);

  const handlePurge = () => {
    onClearAllData();
    setDataPurged(true);
    setTimeout(() => {
      setDataPurged(false);
      onClose();
    }, 1500);
  };

  const handleExportData = () => {
    const raw = localStorage.getItem('fraudshield_scans');
    const blob = new Blob([raw || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraudshield-audit-export-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#020617] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 sm:p-7 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs mb-1">
            <Lock className="w-4 h-4" />
            <span>DATA GOVERNANCE & ZERO-RETENTION</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Privacy & Trust Center
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            FraudShield AI operates on a strictly client-first, zero-retention privacy architecture.
          </p>
        </div>

        {/* Guarantees List */}
        <div className="space-y-3">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0 mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">No Persistent Cloud Storage</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Your scanned messages, images, and emails are evaluated ephemerally in memory. They are not stored on remote servers or sold to advertisers.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 shrink-0 mt-0.5">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Local-Only Session Logs</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Scan histories and audit items reside strictly within your browser's private storage (localStorage) and never leave your device.
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-white">Anonymized Threat Telemetry</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Share stripped indicator hashes to defend the wider community.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTelemetryEnabled(!telemetryEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              telemetryEnabled ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                telemetryEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            onClick={handlePurge}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all"
          >
            {dataPurged ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>All Data Purged!</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete All My Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
