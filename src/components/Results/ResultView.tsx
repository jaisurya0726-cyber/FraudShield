import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, FileText, CheckCircle2, Shield } from 'lucide-react';
import { ScanResult } from '../../types';
import { RiskScoreCard } from './RiskScoreCard';
import { ExplainableAiCard } from './ExplainableAiCard';
import { SecurityAdviceCard } from './SecurityAdviceCard';
import { TechnicalEvidenceCard } from './TechnicalEvidenceCard';
import { FeedbackModal } from './FeedbackModal';

interface ResultViewProps {
  scan: ScanResult;
  onNewScan: () => void;
  onFeedbackSubmit: (feedback: any) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  scan,
  onNewScan,
  onFeedbackSubmit,
}) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleExportPdf = () => {
    // Generate clean printable view for browser print to PDF
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fraudshield-scan-${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Return to Scanner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewScan}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Scanner</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Item</span>
          </button>
        </div>
      </div>

      {/* 1. Primary Risk Score & Classification Gauge */}
      <RiskScoreCard
        scan={scan}
        onOpenFeedback={() => setFeedbackOpen(true)}
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
      />

      {/* 2. Explainable AI Reasoning Card */}
      <ExplainableAiCard scan={scan} />

      {/* 3. Actionable Security Guidance & Incident Response */}
      <SecurityAdviceCard advice={scan.securityAdvice} riskLevel={scan.riskLevel} />

      {/* 4. Technical Evidence & Diagnostic Metrics */}
      <TechnicalEvidenceCard evidence={scan.technicalEvidence} />

      {/* Feedback Modal */}
      <FeedbackModal
        scan={scan}
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmitFeedback={onFeedbackSubmit}
      />
    </div>
  );
};
