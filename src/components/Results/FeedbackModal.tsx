import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, MessageSquare, Check, ShieldAlert } from 'lucide-react';
import { ScanResult } from '../../types';

interface FeedbackModalProps {
  scan: ScanResult;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: {
    scanId: string;
    isAccurate: boolean;
    userCorrection?: string;
    notes?: string;
  }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  scan,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [isAccurate, setIsAccurate] = useState<boolean | null>(null);
  const [userCorrection, setUserCorrection] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAccurate === null) return;

    onSubmitFeedback({
      scanId: scan.id,
      isAccurate,
      userCorrection: userCorrection || undefined,
      notes: notes || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#020617] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Provide Model Feedback</h3>
          </div>
          <p className="text-xs text-slate-400">
            Help train the active learning classifier and reduce false positives for the community.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Feedback Submitted</h4>
            <p className="text-xs text-slate-400">Thank you! Your feedback has updated the local telemetry weights.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Was this classification accurate? ({scan.riskLevel} - {scan.primaryCategory})
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAccurate(true)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                    isAccurate === true
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes, Accurate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAccurate(false)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                    isAccurate === false
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>No, Incorrect (False Positive/Negative)</span>
                </button>
              </div>
            </div>

            {isAccurate === false && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  What should this category or level have been?
                </label>
                <select
                  value={userCorrection}
                  onChange={(e) => setUserCorrection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select true classification...</option>
                  <option value="Safe / Legitimate Message">Safe / Legitimate Message</option>
                  <option value="Standard Transaction Notification">Standard Transaction Notification</option>
                  <option value="Marketing / Promotion (Not Scam)">Marketing / Promotion (Not Scam)</option>
                  <option value="Critical Scam (Urgent)">Critical Scam (Urgent)</option>
                  <option value="Phishing">Phishing</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Additional Comments / Verification Details
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. This was an actual message from my personal electricity utility provider..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAccurate === null}
                className="px-5 py-2 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
