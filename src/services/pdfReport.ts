import { jsPDF } from 'jspdf';
import { ScanResult } from '../types';

export function generatePdfReport(scan: ScanResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = scan.riskLevel === 'CRITICAL' ? [220, 38, 38] :
    scan.riskLevel === 'HIGH' ? [234, 88, 12] :
    scan.riskLevel === 'MEDIUM' ? [202, 138, 4] :
    scan.riskLevel === 'GUARDED' ? [59, 130, 246] : [16, 185, 129];

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FRAUDSHIELD AI', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('AI-Powered Scam, Phishing & Fraud Threat Assessment Report', 15, 26);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date(scan.timestamp).toLocaleString()}`, 130, 26);

  // Risk Score Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(15, 42, 180, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`RISK ASSESSMENT: ${scan.riskLevel}`, 22, 54);

  doc.setFontSize(14);
  doc.text(`SCORE: ${scan.riskScore} / 100`, 140, 54);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Category: ${scan.primaryCategory}  |  Input Mode: ${scan.inputType.toUpperCase()}  |  Language: ${scan.languageDetected}`, 22, 61);

  let curY = 74;

  // Executive Summary Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EXECUTIVE SUMMARY & EVIDENCE', 15, curY);
  curY += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(scan.explanationSummary, 180);
  doc.text(summaryLines, 15, curY);
  curY += summaryLines.length * 5 + 4;

  // Why Risky Points
  doc.setFont('helvetica', 'bold');
  doc.text('Key Risk Indicators Identified:', 15, curY);
  curY += 5;

  doc.setFont('helvetica', 'normal');
  scan.reasonsWhyRisky.forEach((reason) => {
    doc.text(`• ${reason}`, 18, curY);
    curY += 5;
  });
  curY += 4;

  // Recommended Security Actions
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text('2. RECOMMENDED ACTION PLAN (SECURITY ADVISOR)', 15, curY);
  curY += 6;

  doc.setFontSize(9.5);
  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  doc.text('DO NOT (PROHIBITED ACTIONS):', 15, curY);
  curY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  scan.securityAdvice.dontActions.forEach((item) => {
    doc.text(`✗ ${item}`, 18, curY);
    curY += 5;
  });
  curY += 3;

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text('DO (IMMEDIATE PROTECTIVE ACTIONS):', 15, curY);
  curY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  scan.securityAdvice.doActions.forEach((item) => {
    doc.text(`✓ ${item}`, 18, curY);
    curY += 5;
  });
  curY += 6;

  // Submitted Content Snippet
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text('3. ANALYZED CONTENT ARTIFACT', 15, curY);
  curY += 6;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  const snippetLines = doc.splitTextToSize(scan.rawInput.slice(0, 400), 170);
  const boxHeight = Math.max(18, snippetLines.length * 4.5 + 8);
  doc.rect(15, curY, 180, boxHeight, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('courier', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(snippetLines, 19, curY + 6);
  curY += boxHeight + 8;

  // Technical Model Diagnostics Table
  if (curY < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text('4. TECHNICAL AUDIT METADATA', 15, curY);
    curY += 5;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`ML Model: ${scan.technicalEvidence.mlClassification.modelVersion}  |  Confidence: ${(scan.technicalEvidence.mlClassification.confidence * 100).toFixed(0)}%  |  Urgency Vector: ${scan.technicalEvidence.nlpSignals.urgencyDensity}`, 15, curY);
    curY += 5;
  }

  // Legal / Responsible AI Disclaimer Footer
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('DISCLAIMER: FraudShield AI provides probabilistic risk assessments, not an absolute guarantee or legal judgment.', 15, 282);
  doc.text('Verify all financial and legal requests through authorized official hotlines. Emergency Helpline: 1930 / IC3.', 15, 287);

  // Save the PDF
  doc.save(`FraudShield_Security_Report_${scan.id}.pdf`);
}
