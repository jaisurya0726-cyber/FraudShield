/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  LayoutDashboard,
  History,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Scanners
import { ScannerTabs } from './components/Scanner/ScannerTabs';
import { MessageScanner } from './components/Scanner/MessageScanner';
import { EmailScanner } from './components/Scanner/EmailScanner';
import { UrlScanner } from './components/Scanner/UrlScanner';
import { ScreenshotScanner } from './components/Scanner/ScreenshotScanner';
import { QrScanner } from './components/Scanner/QrScanner';
import { PhoneScanner } from './components/Scanner/PhoneScanner';
import { PaymentScanner } from './components/Scanner/PaymentScanner';
import { ScanningAnimation } from './components/Scanner/ScanningAnimation';

// Results
import { RiskScoreCard } from './components/Results/RiskScoreCard';
import { ExplainableAiCard } from './components/Results/ExplainableAiCard';
import { SecurityAdvisorCard } from './components/Results/SecurityAdvisorCard';
import { TechnicalEvidenceCard } from './components/Results/TechnicalEvidenceCard';
import { ScoringBreakdownCard } from './components/Results/ScoringBreakdownCard';
import { FeedbackModal } from './components/Results/FeedbackModal';

// Views
import { ThreatFeedView } from './components/Threats/ThreatFeedView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { HistoryView } from './components/History/HistoryView';
import { AdminView } from './components/Admin/AdminView';

// Modals
import { VoiceAssistantModal } from './components/Voice/VoiceAssistantModal';
import { PrivacyDataModal } from './components/Privacy/PrivacyDataModal';

// Engine & Data
import { analyzePayload, AnalysisInput } from './services/analysisEngine';
import { ScanResult, ScanType, UserFeedback, UserProfile } from './types';
import { exportScanToPdf } from './utils/pdfExport';
import { DEMO_PRESETS } from './data/demoPresets';

export default function App() {
  const [currentView, setCurrentView] = useState<'scanner' | 'threats' | 'dashboard' | 'history' | 'admin'>('scanner');
  const [activeScannerTab, setActiveScannerTab] = useState<ScanType>('message');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanResult, setCurrentScanResult] = useState<ScanResult | null>(null);

  // Modals
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Persistence State
  const [scansHistory, setScansHistory] = useState<ScanResult[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [userProfile] = useState<UserProfile>({
    id: 'user_local_sec',
    email: 'local-security-user@fraudshield.ai',
    isProUser: true,
    telemetryOptIn: false,
    preferredLanguage: 'English',
  });

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const storedScans = localStorage.getItem('fraudshield_scans');
      if (storedScans) {
        setScansHistory(JSON.parse(storedScans));
      }
      const storedFb = localStorage.getItem('fraudshield_feedbacks');
      if (storedFb) {
        setFeedbacks(JSON.parse(storedFb));
      }
    } catch (e) {
      console.warn('Failed to load local history:', e);
    }
  }, []);

  const handleScan = async (input: AnalysisInput) => {
    setIsScanning(true);
    setCurrentScanResult(null);

    try {
      const result = await analyzePayload(input);
      setCurrentScanResult(result);

      // Save to history
      const updatedHistory = [result, ...scansHistory.filter(s => s.id !== result.id)];
      setScansHistory(updatedHistory);
      try {
        localStorage.setItem('fraudshield_scans', JSON.stringify(updatedHistory.slice(0, 50)));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    } catch (err) {
      console.error('Scan execution error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFeedbackSubmit = (isAccurate: boolean, userCategory: string, userComment: string) => {
    if (!currentScanResult) return;
    const newFb: UserFeedback = {
      id: `fb_${Date.now()}`,
      scanId: currentScanResult.id,
      isAccurate,
      userProvidedCategory: userCategory,
      comment: userComment,
      timestamp: new Date().toISOString(),
    };
    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem('fraudshield_feedbacks', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearHistory = () => {
    setScansHistory([]);
    try {
      localStorage.removeItem('fraudshield_scans');
    } catch (e) {}
  };

  const handleClearAllData = () => {
    setScansHistory([]);
    setFeedbacks([]);
    setCurrentScanResult(null);
    try {
      localStorage.clear();
    } catch (e) {}
  };

  const handleScanCampaign = (sampleText: string, type: 'message' | 'email' | 'url') => {
    setCurrentView('scanner');
    setActiveScannerTab(type);
    handleScan({
      type,
      content: sampleText,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Sleek Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        user={userProfile}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: SCANNER HUB */}
        {currentView === 'scanner' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Sleek Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none" />
              <div className="max-w-2xl space-y-3 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Explainable Multi-Vector Cyber Defense</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Protect Yourself from Modern Scams & Fraud
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Scan suspicious SMS, emails, bank links, job offers, QR codes, screenshots, and UPI requests. Get transparent risk scoring, technical signals, and emergency steps in real time.
                </p>
              </div>
            </div>

            {/* Scanner Tab Bar */}
            <ScannerTabs
              activeTab={activeScannerTab}
              onTabChange={(tab) => {
                setActiveScannerTab(tab);
                setCurrentScanResult(null);
              }}
            />

            {/* Active Scanner Form */}
            <div className="relative">
              {activeScannerTab === 'message' && (
                <MessageScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'email' && (
                <EmailScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'url' && (
                <UrlScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'image' && (
                <ScreenshotScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'qr' && (
                <QrScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'phone' && (
                <PhoneScanner onScan={handleScan} isScanning={isScanning} />
              )}
              {activeScannerTab === 'payment' && (
                <PaymentScanner onScan={handleScan} isScanning={isScanning} />
              )}
            </div>

            {/* Scanning Radar Progress Animation */}
            {isScanning && (
              <div className="pt-6">
                <ScanningAnimation />
              </div>
            )}

            {/* Scan Results Section */}
            {currentScanResult && !isScanning && (
              <div className="space-y-6 pt-4 animate-fadeIn" id="scan-results-container">
                {/* 1. Score & Badge Hero */}
                <RiskScoreCard
                  scan={currentScanResult}
                  onOpenFeedback={() => setFeedbackModalOpen(true)}
                  onExportPdf={() => exportScanToPdf(currentScanResult)}
                  onExportJson={() => {
                    const blob = new Blob([JSON.stringify(currentScanResult, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `scan-result-${currentScanResult.id}.json`;
                    a.click();
                  }}
                />

                {/* 2. Explainable AI Diagnostic */}
                <ExplainableAiCard scan={currentScanResult} />

                {/* 3. Security Advisor (Do's / Don'ts / Helplines) */}
                <SecurityAdvisorCard
                  advice={currentScanResult.securityAdvice}
                  category={currentScanResult.primaryCategory}
                />

                {/* 4. Deep Technical Evidence (Rules / ML / NLP / URL) */}
                <TechnicalEvidenceCard evidence={currentScanResult.technicalEvidence} />

                {/* 5. Mathematical Scoring Breakdown */}
                <ScoringBreakdownCard
                  breakdown={currentScanResult.scoreBreakdown}
                  totalScore={currentScanResult.riskScore}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LIVE THREAT FEED */}
        {currentView === 'threats' && (
          <ThreatFeedView onScanCampaign={handleScanCampaign} />
        )}

        {/* VIEW 3: DASHBOARD & TELEMETRY */}
        {currentView === 'dashboard' && (
          <DashboardView scans={scansHistory} />
        )}

        {/* VIEW 4: SCAN HISTORY */}
        {currentView === 'history' && (
          <HistoryView
            scans={scansHistory}
            onSelectScan={(scan) => {
              setCurrentScanResult(scan);
              setCurrentView('scanner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={handleClearHistory}
            onExportPdf={exportScanToPdf}
          />
        )}

        {/* VIEW 5: ADMIN & MODEL GOVERNANCE */}
        {currentView === 'admin' && (
          <AdminView feedbacks={feedbacks} />
        )}
      </main>

      {/* Interactive Voice Assistant Copilot Modal */}
      {voiceAssistantOpen && (
        <VoiceAssistantModal
          onClose={() => setVoiceAssistantOpen(false)}
          onScanQuery={(text) => {
            setVoiceAssistantOpen(false);
            setCurrentView('scanner');
            setActiveScannerTab('message');
            handleScan({ type: 'message', content: text });
          }}
        />
      )}

      {/* Privacy & Zero-Retention Trust Modal */}
      {privacyModalOpen && (
        <PrivacyDataModal
          onClose={() => setPrivacyModalOpen(false)}
          onClearAllData={handleClearAllData}
        />
      )}

      {/* User Feedback / False Positive Report Modal */}
      {feedbackModalOpen && currentScanResult && (
        <FeedbackModal
          scan={currentScanResult}
          onClose={() => setFeedbackModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Footer */}
      <Footer onOpenPrivacy={() => setPrivacyModalOpen(true)} />
    </div>
  );
}
