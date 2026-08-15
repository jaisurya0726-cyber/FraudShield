export interface NlpAnalysisResult {
  language: string;
  urgencyDensity: number; // 0.0 to 1.0
  financialThreatDensity: number; // 0.0 to 1.0
  sentimentScore: number; // -1.0 (fear/threat) to +1.0 (neutral/calm)
  manipulationFlags: string[];
}

const URGENCY_WORDS = [
  'immediate', 'immediately', 'urgent', 'urgently', 'today', 'now', '24 hours', '48 hours',
  'expire', 'expiring', 'last chance', 'instant', 'hurry', 'action required', 'alert', 'warning',
  'turant', 'aaj', 'ventane', 'ippude'
];

const THREAT_WORDS = [
  'blocked', 'suspended', 'deactivated', 'locked', 'frozen', 'arrest', 'penalty', 'fine',
  'legal action', 'court', 'police', 'customs', 'seized', 'terminated', 'disconnected',
  'band', 'jail', 'case'
];

const CREDENTIAL_WORDS = [
  'password', 'pin', 'otp', 'cvv', 'card number', 'pan', 'aadhaar', 'ssn', 'login', 'credentials',
  'verify', 'kyc', 'secret code', 'passcode'
];

const REWARD_WORDS = [
  'bonus', 'reward', 'congratulations', 'won', 'lottery', 'winner', 'cashback', 'guaranteed',
  'free', 'profit', 'double', 'gift', 'lucky draw', 'crore', 'lakhs'
];

export function analyzeNlpFeatures(text: string): NlpAnalysisResult {
  if (!text) {
    return {
      language: 'English',
      urgencyDensity: 0,
      financialThreatDensity: 0,
      sentimentScore: 0,
      manipulationFlags: [],
    };
  }

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const totalWords = Math.max(words.length, 1);

  // Language Heuristic
  let language = 'English';
  if (/[\u0C00-\u0C7F]/.test(text) || /\b(mee|meeseva|ventane|cheyandi|dhorikindi|dabbu|aypothundi)\b/i.test(text)) {
    language = 'Telugu / Tenglish';
  } else if (/[\u0900-\u097F]/.test(text) || /\b(aapka|turant|kare|bhejo|paisa|khata|aaj|band|jayega)\b/i.test(text)) {
    language = 'Hindi / Hinglish';
  }

  // Calculate Densities
  let urgencyHits = 0;
  for (const w of URGENCY_WORDS) {
    if (lower.includes(w)) urgencyHits++;
  }

  let threatHits = 0;
  for (const w of THREAT_WORDS) {
    if (lower.includes(w)) threatHits++;
  }

  let credHits = 0;
  for (const w of CREDENTIAL_WORDS) {
    if (lower.includes(w)) credHits++;
  }

  let rewardHits = 0;
  for (const w of REWARD_WORDS) {
    if (lower.includes(w)) rewardHits++;
  }

  const urgencyDensity = Math.min(1.0, Number((urgencyHits / (totalWords * 0.15 + 1)).toFixed(2)));
  const financialThreatDensity = Math.min(1.0, Number(((threatHits + credHits) / (totalWords * 0.2 + 1)).toFixed(2)));
  
  // Fear vs Greed vs Neutral sentiment
  let sentimentScore = 0;
  if (threatHits > 0 || urgencyHits > 1) {
    sentimentScore = -0.3 - (threatHits * 0.2);
  } else if (rewardHits > 0) {
    sentimentScore = 0.4 + (rewardHits * 0.2);
  }
  sentimentScore = Math.max(-1.0, Math.min(1.0, Number(sentimentScore.toFixed(2))));

  const manipulationFlags: string[] = [];
  if (urgencyHits > 0) manipulationFlags.push('High Artificial Urgency (Time Pressure)');
  if (threatHits > 0) manipulationFlags.push('Fear Induction (Account Suspension / Legal Penalty)');
  if (credHits > 0) manipulationFlags.push('Unauthorized Data Solicitation (OTP / KYC / PIN)');
  if (rewardHits > 0) manipulationFlags.push('Greed Exploitation (Unrealistic Rewards / Lotteries)');
  if (words.some(w => w.includes('http') || w.includes('bit.ly') || w.includes('.com') || w.includes('.xyz') || w.includes('.top'))) {
    manipulationFlags.push('Unverified External Link Anchor');
  }

  return {
    language,
    urgencyDensity,
    financialThreatDensity,
    sentimentScore,
    manipulationFlags,
  };
}
