export type RiskLevel = 'LOW' | 'GUARDED' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScanType = 'message' | 'email' | 'url' | 'image' | 'qr' | 'phone' | 'payment';

export type ScamCategory =
  | 'PHISHING'
  | 'BANKING FRAUD'
  | 'PAYMENT SCAM'
  | 'INVESTMENT SCAM'
  | 'JOB SCAM'
  | 'ROMANCE SCAM'
  | 'DELIVERY SCAM'
  | 'LOTTERY / PRIZE SCAM'
  | 'TECH SUPPORT SCAM'
  | 'GOVERNMENT IMPERSONATION'
  | 'SOCIAL ENGINEERING'
  | 'CRYPTOCURRENCY SCAM'
  | 'IDENTITY THEFT'
  | 'ACCOUNT TAKEOVER'
  | 'FAKE KYC'
  | 'FAKE REFUND'
  | 'MALICIOUS URL'
  | 'LEGITIMATE / SAFE'
  | 'UNVERIFIED / SUSPICIOUS';

export interface ScoreFactor {
  name: string;
  points: number;
  maxPoints: number;
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export type ScoreBreakdownItem = {
  component: string;
  points: number;
  detail: string;
};

export interface UserFeedback {
  id: string;
  scanId: string;
  isAccurate: boolean;
  userProvidedCategory?: string;
  comment?: string;
  timestamp: string;
}

export interface ThreatCampaign {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: string;
  targetedInstitutions: string[];
  indicatorsOfCompromise: string[];
  activeSince: string;
  victimCountEstimate: string;
  region: string;
}


export interface RuleIndicator {
  id: string;
  ruleName: string;
  matchedPattern: string;
  category: ScamCategory;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  impactScore: number;
}

export interface UrlAnalysisResult {
  url: string;
  domain: string;
  tld: string;
  isHttps: boolean;
  isIpAddress: boolean;
  hasSuspiciousKeywords: boolean;
  entropyScore: number;
  suspiciousCharacteristics: string[];
  reputationStatus: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNRATED';
  domainAgeEstimate?: string;
  redirectRiskEstimate?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PhoneAnalysisResult {
  phoneNumber: string;
  countryCode: string;
  countryName: string;
  isValidFormat: boolean;
  isVoipOrVirtual: boolean;
  publicSpamReportsCount: number;
  reportedCategories: string[];
  reputationRating: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface SecurityAdvice {
  doActions: string[];
  dontActions: string[];
  officialHelplines: { name: string; contact: string; description: string }[];
  summary: string;
}

export interface TechnicalEvidence {
  ruleMatches: RuleIndicator[];
  mlClassification: {
    predictedCategory: ScamCategory;
    confidence: number;
    modelVersion: string;
    featureProbabilities: Record<string, number>;
  };
  nlpSignals: {
    language: string;
    urgencyDensity: number;
    financialThreatDensity: number;
    sentimentScore: number;
    manipulationFlags: string[];
  };
  urlFindings?: UrlAnalysisResult[];
  phoneFindings?: PhoneAnalysisResult;
  ocrExtractedText?: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  inputType: ScanType;
  rawInput: string;
  previewSnippet: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  primaryCategory: ScamCategory;
  secondaryCategories: string[];
  keyIndicators: string[];
  explanationSummary: string;
  reasonsWhyRisky: string[];
  securityAdvice: SecurityAdvice;
  technicalEvidence: TechnicalEvidence;
  scoringBreakdown: ScoreFactor[];
  languageDetected: string;
  isDemoResult?: boolean;
  userFeedback?: {
    isCorrect: boolean;
    userLabel: 'legitimate' | 'suspicious' | 'unknown';
    feedbackNote?: string;
    submittedAt: string;
  };
  screenshotDataUrl?: string;
  qrDecodedPayload?: string;
}

export interface ThreatFeedItem {
  id: string;
  title: string;
  category: ScamCategory;
  riskLevel: RiskLevel;
  source: string;
  timestamp: string;
  confidence: 'HIGH' | 'MEDIUM' | 'CONFIRMED';
  region: 'Global' | 'India' | 'North America' | 'Europe' | 'Asia-Pacific';
  indicators: string[];
  summary: string;
  targetVictims: string;
}

export interface DashboardStats {
  totalScans: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  safeCount: number;
  preventedPotentialLossEstimate: string;
  scansByDay: { date: string; count: number; highRisk: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  topIndicators: { indicator: string; count: number }[];
  modelAccuracy: number;
  falsePositiveRate: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role?: 'USER' | 'SECURITY_ANALYST' | 'ADMIN';
  isProUser?: boolean;
  telemetryOptIn?: boolean;
  alertThreshold?: 'ALL' | 'MEDIUM_AND_ABOVE' | 'HIGH_CRITICAL_ONLY';
  notificationsEnabled?: boolean;
  preferredLanguage?: string;
}

export interface DemoPreset {
  id: string;
  title: string;
  type: ScanType;
  tag: string;
  expectedRisk: RiskLevel;
  preview: string;
  payload: {
    text?: string;
    sender?: string;
    subject?: string;
    url?: string;
    phone?: string;
    paymentNote?: string;
    amount?: string;
    imagePlaceholder?: string;
  };
}
