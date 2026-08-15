import {
  RiskLevel,
  ScanResult,
  ScanType,
  ScamCategory,
  ScoreFactor,
  SecurityAdvice,
} from '../types';
import { runRuleEngine } from './ruleEngine';
import { analyzeNlpFeatures } from './nlpEngine';
import { classifyWithMl } from './mlClassifier';
import { analyzeUrlStructure } from './urlAnalyzer';
import { checkThreatIntelligence } from './threatIntel';
import { analyzePhoneNumber } from './phoneChecker';

export interface AnalysisInput {
  type: ScanType;
  content: string;
  sender?: string;
  subject?: string;
  url?: string;
  phoneNumber?: string;
  amount?: string;
  paymentMethod?: string;
  imageBase64?: string;
  qrPayload?: string;
}

export async function runComprehensiveScan(input: AnalysisInput): Promise<ScanResult> {
  const combinedText = [
    input.content,
    input.sender ? `Sender: ${input.sender}` : '',
    input.subject ? `Subject: ${input.subject}` : '',
    input.url ? `URL: ${input.url}` : '',
    input.phoneNumber ? `Phone: ${input.phoneNumber}` : '',
    input.amount ? `Amount Requested: ${input.amount}` : '',
    input.qrPayload ? `Decoded QR Target: ${input.qrPayload}` : '',
  ].filter(Boolean).join('\n');

  // Layer 1: Rule Engine
  const ruleMatches = runRuleEngine(combinedText);

  // Layer 2: NLP Features
  const nlpSignals = analyzeNlpFeatures(combinedText);

  // Layer 3: ML Classification
  const mlClassification = classifyWithMl(combinedText);

  // Layer 4: URL Detection and Deep Inspection
  const extractedUrls: string[] = [];
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(?:com|xyz|top|site|net|org|in|co|cc|live|info|me|app|link)[^\s]*)/gi;
  const matches = combinedText.match(urlRegex) || [];
  if (input.url) extractedUrls.push(input.url);
  if (input.qrPayload && (input.qrPayload.startsWith('http') || input.qrPayload.includes('.'))) extractedUrls.push(input.qrPayload);
  matches.forEach(m => {
    if (!extractedUrls.includes(m)) extractedUrls.push(m);
  });

  const urlFindings = extractedUrls.map(u => analyzeUrlStructure(u));

  // Layer 5: Threat Intelligence Check
  const threatIntelResult = checkThreatIntelligence(combinedText);

  // Layer: Phone Number Check (if relevant)
  let phoneFindings = undefined;
  if (input.phoneNumber || input.type === 'phone' || /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(combinedText)) {
    const phoneToTest = input.phoneNumber || combinedText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || '';
    if (phoneToTest) {
      phoneFindings = analyzePhoneNumber(phoneToTest);
    }
  }

  // Layer 7: Mathematical Risk Scoring Engine (0 - 100)
  const scoringBreakdown: ScoreFactor[] = [];
  let calculatedScore = 0;

  // Factor 1: Rule Engine Impact (Max 35 pts)
  const ruleScore = Math.min(35, ruleMatches.reduce((sum, r) => sum + r.impactScore, 0));
  if (ruleScore > 0) {
    scoringBreakdown.push({
      name: 'Deterministic Scam Patterns',
      points: ruleScore,
      maxPoints: 35,
      description: `Matched ${ruleMatches.length} threat rule(s): ${ruleMatches.map(r => r.ruleName).slice(0, 2).join(', ')}`,
      severity: ruleScore >= 25 ? 'CRITICAL' : ruleScore >= 15 ? 'HIGH' : 'MEDIUM',
    });
    calculatedScore += ruleScore;
  }

  // Factor 2: ML Statistical Confidence (Max 25 pts)
  let mlPoints = 0;
  if (mlClassification.predictedCategory !== 'LEGITIMATE / SAFE') {
    mlPoints = Math.round(mlClassification.confidence * 25);
    scoringBreakdown.push({
      name: 'ML Classifier Probability',
      points: mlPoints,
      maxPoints: 25,
      description: `Statistical similarity to known ${mlClassification.predictedCategory} corpora (${(mlClassification.confidence * 100).toFixed(0)}% confidence)`,
      severity: mlPoints >= 20 ? 'HIGH' : 'MEDIUM',
    });
    calculatedScore += mlPoints;
  }

  // Factor 3: URL / Domain Reputation Heuristics (Max 25 pts)
  let urlPoints = 0;
  if (urlFindings.some(u => u.reputationStatus === 'MALICIOUS')) {
    urlPoints = 25;
  } else if (urlFindings.some(u => u.reputationStatus === 'SUSPICIOUS')) {
    urlPoints = 18;
  } else if (urlFindings.length > 0 && !urlFindings.every(u => u.reputationStatus === 'CLEAN')) {
    urlPoints = 10;
  }
  if (urlPoints > 0) {
    scoringBreakdown.push({
      name: 'URL & Domain Security Risk',
      points: urlPoints,
      maxPoints: 25,
      description: `Detected suspicious domain signals: ${urlFindings[0]?.suspiciousCharacteristics[0] || 'Unrated or high-risk domain'}`,
      severity: urlPoints >= 20 ? 'CRITICAL' : 'HIGH',
    });
    calculatedScore += urlPoints;
  }

  // Factor 4: NLP Pressure & Psychological Vector (Max 15 pts)
  let nlpPoints = Math.round((nlpSignals.urgencyDensity * 8) + (nlpSignals.financialThreatDensity * 7));
  nlpPoints = Math.min(15, nlpPoints);
  if (nlpPoints > 0) {
    scoringBreakdown.push({
      name: 'Social Engineering & Urgency Signals',
      points: nlpPoints,
      maxPoints: 15,
      description: `Detected ${nlpSignals.manipulationFlags.length} emotional pressure and coercion markers`,
      severity: nlpPoints >= 10 ? 'HIGH' : 'MEDIUM',
    });
    calculatedScore += nlpPoints;
  }

  // Factor 5: Threat Intelligence Correlation (Bonus up to 15 pts, capped at 100 total)
  if (threatIntelResult.riskBoost > 0) {
    scoringBreakdown.push({
      name: 'Active Threat Feed Correlation',
      points: threatIntelResult.riskBoost,
      maxPoints: 25,
      description: `Active campaign match: ${threatIntelResult.matchedThreats[0]?.title || 'Known signature'}`,
      severity: 'CRITICAL',
    });
    calculatedScore += threatIntelResult.riskBoost;
  }

  // Safe deduction for explicitly legitimate patterns with zero threat indicators
  if (ruleMatches.length === 0 && urlPoints === 0 && mlClassification.predictedCategory === 'LEGITIMATE / SAFE') {
    calculatedScore = Math.max(5, calculatedScore - 15);
  }

  const finalScore = Math.min(100, Math.max(0, calculatedScore));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 81) riskLevel = 'CRITICAL';
  else if (finalScore >= 61) riskLevel = 'HIGH';
  else if (finalScore >= 41) riskLevel = 'MEDIUM';
  else if (finalScore >= 21) riskLevel = 'GUARDED';
  else riskLevel = 'LOW';

  // Primary & Secondary Categories
  let primaryCategory: ScamCategory = 'LEGITIMATE / SAFE';
  if (ruleMatches.length > 0) {
    primaryCategory = ruleMatches[0].category;
  } else if (mlClassification.predictedCategory !== 'LEGITIMATE / SAFE') {
    primaryCategory = mlClassification.predictedCategory;
  } else if (urlPoints >= 18) {
    primaryCategory = 'MALICIOUS URL';
  }

  const secondaryCategories: string[] = Array.from(
    new Set([
      ...ruleMatches.map(r => r.category).filter(c => c !== primaryCategory),
      mlClassification.predictedCategory !== primaryCategory ? mlClassification.predictedCategory : '',
      urlPoints > 0 ? 'MALICIOUS URL' : '',
      nlpSignals.financialThreatDensity > 0.5 ? 'CREDENTIAL THEFT' : '',
    ].filter(Boolean))
  );

  // Key Indicators
  const keyIndicators: string[] = [
    ...ruleMatches.map(r => r.ruleName),
    ...nlpSignals.manipulationFlags,
    ...(urlFindings.flatMap(u => u.suspiciousCharacteristics)),
    ...(threatIntelResult.matchedThreats.map(t => `Threat Intelligence Match: ${t.title}`)),
  ];

  if (keyIndicators.length === 0) {
    keyIndicators.push('No acute malicious signatures detected in standard corpora');
  }

  // Default Explanations & Advice
  const reasonsWhyRisky: string[] = [];
  if (nlpSignals.urgencyDensity > 0.3) reasonsWhyRisky.push('Artificial urgency forcing rapid, unverified compliance.');
  if (ruleMatches.some(r => r.category === 'BANKING FRAUD' || r.category === 'PHISHING')) reasonsWhyRisky.push('Impersonation of banking institutions to harvest credentials.');
  if (urlFindings.some(u => u.reputationStatus !== 'CLEAN')) reasonsWhyRisky.push('Target link routes to an unverified or high-risk domain.');
  if (combinedText.toLowerCase().includes('otp') || combinedText.toLowerCase().includes('pin')) reasonsWhyRisky.push('Direct solicitation of secret authentication credentials (OTP / PIN).');
  if (reasonsWhyRisky.length === 0) {
    reasonsWhyRisky.push('Content contains low-confidence phrasing; exercise standard digital vigilance.');
  }

  const securityAdvice: SecurityAdvice = generateDefaultAdvice(primaryCategory, riskLevel);

  // Attempt server-side LLM enhancement (Layer 6)
  let explanationSummary = getStandardSummary(primaryCategory, riskLevel, finalScore);
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputType: input.type,
        content: combinedText,
        detectedRules: ruleMatches,
        mlCategory: primaryCategory,
        urlAnalysis: urlFindings,
        phoneAnalysis: phoneFindings,
        language: nlpSignals.language,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.aiExplanation) {
        if (data.aiExplanation.summary) explanationSummary = data.aiExplanation.summary;
        if (data.aiExplanation.reasonsWhyRisky?.length) {
          reasonsWhyRisky.splice(0, reasonsWhyRisky.length, ...data.aiExplanation.reasonsWhyRisky);
        }
        if (data.aiExplanation.securityAdvice?.doActions?.length) {
          securityAdvice.doActions = data.aiExplanation.securityAdvice.doActions;
        }
        if (data.aiExplanation.securityAdvice?.dontActions?.length) {
          securityAdvice.dontActions = data.aiExplanation.securityAdvice.dontActions;
        }
      }
    }
  } catch (err) {
    // Graceful offline/demo fallback
  }

  return {
    id: 'scan_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    inputType: input.type,
    rawInput: combinedText,
    previewSnippet: combinedText.slice(0, 180) + (combinedText.length > 180 ? '...' : ''),
    riskScore: finalScore,
    riskLevel,
    primaryCategory,
    secondaryCategories,
    keyIndicators: keyIndicators.slice(0, 8),
    explanationSummary,
    reasonsWhyRisky,
    securityAdvice,
    technicalEvidence: {
      ruleMatches,
      mlClassification: {
        predictedCategory: mlClassification.predictedCategory,
        confidence: mlClassification.confidence,
        modelVersion: mlClassification.modelVersion,
        featureProbabilities: mlClassification.featureProbabilities,
      },
      nlpSignals,
      urlFindings: urlFindings.length > 0 ? urlFindings : undefined,
      phoneFindings,
      ocrExtractedText: input.type === 'image' ? input.content : undefined,
    },
    scoringBreakdown,
    languageDetected: nlpSignals.language,
    screenshotDataUrl: input.imageBase64,
    qrDecodedPayload: input.qrPayload,
  };
}

function getStandardSummary(category: ScamCategory, riskLevel: RiskLevel, score: number): string {
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    return `This content exhibits high-confidence characteristics of a ${category.toLowerCase()}. Legitimate organizations will never demand urgent action, credential updates, or money transfers through unverified channels.`;
  }
  if (riskLevel === 'MEDIUM' || riskLevel === 'GUARDED') {
    return `Moderate risk signals detected. While some indicators may appear normal, exercise heightened caution before clicking any links or providing personal details.`;
  }
  return `Low risk signals detected. The submitted text does not match known scam signatures, but you should always verify senders through trusted channels.`;
}

function generateDefaultAdvice(category: ScamCategory, riskLevel: RiskLevel): SecurityAdvice {
  const isHigh = riskLevel === 'CRITICAL' || riskLevel === 'HIGH';

  const doActions = [
    'Verify through the official website or verified mobile app directly.',
    'Contact the organization using publicly listed customer service numbers.',
    'Report suspicious messages to national cybercrime authorities (1930 in India / IC3 in US).'
  ];

  const dontActions = [
    'Do NOT click any links or download attachments from this message.',
    'Do NOT share your OTP, UPI PIN, passwords, or CVV with anyone.',
    'Do NOT install any remote desktop applications (e.g. AnyDesk, TeamViewer, QuickSupport).'
  ];

  if (category === 'DELIVERY SCAM') {
    dontActions.push('Do NOT pay any small redelivery or address-update fee online.');
    doActions.push('Check tracking directly on official carrier website with your original tracking ID.');
  } else if (category === 'JOB SCAM') {
    dontActions.push('Never pay upfront registration, security deposit, or task kit fees.');
    doActions.push('Research the employer on LinkedIn and official corporate careers portals.');
  } else if (category === 'INVESTMENT SCAM') {
    dontActions.push('Do NOT transfer money into individual bank accounts or private crypto wallets.');
    doActions.push('Verify if the broker is licensed with SEBI, SEC, or FCA before investing.');
  } else if (category === 'GOVERNMENT IMPERSONATION') {
    dontActions.push('Never agree to "Digital Arrest" or transfer funds to "clear police inspection".');
    doActions.push('Immediately disconnect video calls and report to your nearest local police station.');
  }

  return {
    doActions,
    dontActions,
    officialHelplines: [
      { name: 'National Cyber Crime Portal', contact: '1930', description: 'Toll-free fraud reporting in India' },
      { name: 'US Internet Crime Complaint Center', contact: 'ic3.gov', description: 'FBI Internet Crime Portal' },
      { name: 'UK Action Fraud', contact: '0300 123 2040', description: 'National Fraud & Cyber Crime' },
    ],
    summary: isHigh ? 'High threat detected: Block sender immediately and do not interact.' : 'Exercise standard verification before responding.',
  };
}

export { runComprehensiveScan as analyzePayload };

