import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Trash2, EyeOff, Check, FileDown } from 'lucide-react';
import { UserProfile } from '../../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: Partial<UserProfile>) => void;
  onPurgeAllData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onPurgeAllData,
}) => {
  const [purgedNotice, setPurgedNotice] = useState(false);

  if (!isOpen) return null;

  const handlePurge = () => {
    if (confirm('Are you sure you want to permanently delete all scan records and local telemetry?')) {
      onPurgeAllData();
      setPurgedNotice(true);
      setTimeout(() => {
        setPurgedNotice(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#020617] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Privacy & Zero-Retention Security Hub</h3>
          </div>
          <p className="text-xs text-slate-400">
            FraudShield AI protects your sensitive personal messages and financial communications.
          </p>
        </div>

        {purgedNotice ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">All Data Purged Successfully</h4>
            <p className="text-xs text-slate-400">All local logs, artifacts, and scan traces have been wiped.</p>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Privacy Pillars */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Volatile Memory Processing</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Text payloads are evaluated strictly in transient memory. Raw inputs are never used to train third-party public foundation models.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <EyeOff className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Local Sandbox Isolation</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    URLs and QR code destinations are inspected via safe metadata extraction without triggering direct browser execution.
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Preferences */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Data Preferences
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-medium block">Store Scans Locally</span>
                  <span className="text-slate-500 text-[10px]">Keeps history in your browser for audit inspection</span>
                </div>
                <button
                  onClick={() => onUpdateUser({ storeScansLocally: !user.storeScansLocally })}
                  className={`px-3 py-1 rounded-lg font-bold font-mono text-[11px] transition-colors ${
                    user.storeScansLocally ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {user.storeScansLocally ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-medium block">Share Anonymized IoCs</span>
                  <span className="text-slate-500 text-[10px]">Contribute verified scam domains to community feed</span>
                </div>
                <button
                  onClick={() => onUpdateUser({ shareAnonymizedTelemetry: !user.shareAnonymizedTelemetry })}
                  className={`px-3 py-1 rounded-lg font-bold font-mono text-[11px] transition-colors ${
                    user.shareAnonymizedTelemetry ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {user.shareAnonymizedTelemetry ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Right to be Forgotten / Purge Action */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePurge}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All My Data & Clear Local History</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
