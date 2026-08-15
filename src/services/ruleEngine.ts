import { RuleIndicator, ScamCategory } from '../types';

interface RuleDefinition {
  id: string;
  name: string;
  category: ScamCategory;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  regex: RegExp;
  impactScore: number;
  explanation: string;
}

export const SCAM_RULES: RuleDefinition[] = [
  // Banking & Financial Urgency
  {
    id: 'BANK_URGENCY_BLOCK',
    name: 'Account Suspension Threat',
    category: 'BANKING FRAUD',
    severity: 'CRITICAL',
    regex: /(account\s+(will\s+be|has\s+been|is)\s*(blocked|suspended|deactivated|closed|frozen|locked)|block\s+today|within\s+24\s*h(ours|rs)|immediate\s+verification|immediately\s+at|khata\s+block|account\s+block\s+aypothundi)/i,
    impactScore: 28,
    explanation: 'Uses artificial urgency and fear of account suspension to coerce immediate victim reaction.',
  },
  {
    id: 'CREDENTIAL_HARVESTING',
    name: 'Sensitive Credential or OTP Solicitation',
    category: 'PHISHING',
    severity: 'CRITICAL',
    regex: /(send\s+otp|share\s+otp|enter\s+(pin|password|cvv|card\s*details)|update\s+(pan|aadhaar|ssn)|kyc\s+(expired|pending|update|mandatory)|verify\s+pan\s+card)/i,
    impactScore: 30,
    explanation: 'Directly attempts to harvest one-time passwords (OTP), PINs, or government identity tokens.',
  },
  {
    id: 'FAKE_DELIVERY_PAYMENT',
    name: 'Parcel Delivery Fee Trap',
    category: 'DELIVERY SCAM',
    severity: 'HIGH',
    regex: /(package\s+(is\s+waiting|on\s+hold|undelivered|delayed)|delivery\s+(failed|reschedule|address\s+wrong)|pay\s+(₹|\$|rs\.?|eur)?\s*(\d+(\.\d+)?)\s*(to\s+reschedule|delivery\s+fee|customs\s+fee|redelivery))/i,
    impactScore: 24,
    explanation: 'Mimics courier services (FedEx, India Post, DHL, USPS) demanding small fees to harvest credit cards.',
  },
  {
    id: 'FAKE_JOB_ADVANCE_FEE',
    name: 'Work From Home Advance Fee',
    category: 'JOB SCAM',
    severity: 'HIGH',
    regex: /(earn\s+(₹|\$|rs\.?)\s*(\d{3,6})\s*(per|a)\s*(day|week|month)|part\s*time\s*job|work\s*from\s*home|pay\s*(₹|\$|rs\.?)\s*(\d{2,5})\s*(registration|processing|security|kit)\s*fee|telegram\s*task\s*job|like\s*youtube\s*video\s*get\s*money)/i,
    impactScore: 26,
    explanation: 'Promises high daily pay for simple tasks, requiring an upfront registration or processing fee.',
  },
  {
    id: 'INVESTMENT_UNREALISTIC_RETURNS',
    name: 'Guaranteed Unrealistic Return Scheme',
    category: 'INVESTMENT SCAM',
    severity: 'CRITICAL',
    regex: /(guaranteed\s*(\d{1,3}%)?\s*(daily|hourly|weekly|monthly)\s*(returns|profit|income)|double\s+your\s+money|risk\s*free\s+trading|crypto\s+mining\s+profit|deposit\s+now\s+get\s+bonus|forex\s+vip\s+signal)/i,
    impactScore: 30,
    explanation: 'Promises risk-free or abnormally high guaranteed returns, typical of Ponzi/pig-butchering scams.',
  },
  {
    id: 'DIGITAL_ARREST_GOVT_IMPERSONATION',
    name: 'Law Enforcement / Digital Arrest Threat',
    category: 'GOVERNMENT IMPERSONATION',
    severity: 'CRITICAL',
    regex: /(police\s+department|cbi|fbi|irs|income\s+tax\s+department|customs\s+officer|arrest\s+warrant|digital\s+arrest|illegal\s+parcel|narcotics\s+found|court\s+notice|money\s+laundering\s+case)/i,
    impactScore: 32,
    explanation: 'Impersonates police, tax authorities, or customs demanding instant money transfer to prevent arrest.',
  },
  {
    id: 'TECH_SUPPORT_VIRUS_ALERT',
    name: 'Fake Virus / Tech Support Trap',
    category: 'TECH SUPPORT SCAM',
    severity: 'HIGH',
    regex: /(computer\s+is\s+infected|windows\s+security\s+alert|trojan\s+detected|call\s+microsoft\s+support|call\s+apple\s+care|system\s+hacked|anydesk|teamviewer|quicksupport)/i,
    impactScore: 25,
    explanation: 'Scareware claiming device infection and urging victim to install remote-desktop access tools.',
  },
  {
    id: 'LOTTERY_PRIZE_ADVANCE_FEE',
    name: 'Unsolicited Lottery / Lucky Draw Win',
    category: 'LOTTERY / PRIZE SCAM',
    severity: 'HIGH',
    regex: /(you\s+have\s+won|lucky\s+draw|winner\s+of\s+(₹|\$|rs\.?)?\s*(\d{4,8})|congratulations\s+selected|claim\s+your\s+car|kbc\s+lottery|processing\s+charge\s+to\s+release\s+prize)/i,
    impactScore: 25,
    explanation: 'Claims the recipient won an unentered contest and must pay tax/charges to claim nonexistent funds.',
  },
  {
    id: 'ELECTRICITY_POWER_CUT_SCAM',
    name: 'Utility Disconnection Notice',
    category: 'SOCIAL ENGINEERING',
    severity: 'HIGH',
    regex: /(electricity\s+(will\s+be\s+disconnected|power\s+cut)|bill\s+not\s+updated|tonight\s+at\s+9:30\s*pm|contact\s+officer\s+number|power\s+office\s+helpline)/i,
    impactScore: 27,
    explanation: 'Falsely threatens immediate power shutoff tonight unless user calls an unauthorized mobile number.',
  },
  {
    id: 'GENERIC_SHORTENER_LINK',
    name: 'Obfuscated / Shortened URL',
    category: 'MALICIOUS URL',
    severity: 'MEDIUM',
    regex: /(bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|goo\.gl|ow\.ly|s\.id|shorturl\.at)\/[a-zA-Z0-9_\-]+/i,
    impactScore: 18,
    explanation: 'Employs a public URL shortening service to conceal the actual scam destination server.',
  },
  {
    id: 'HINDI_URGENCY_SCAM',
    name: 'Vernacular Hindi/Hinglish Scam Pattern',
    category: 'SOCIAL ENGINEERING',
    severity: 'HIGH',
    regex: /(aapka\s+account\s+aaj\s+band\s+ho\s+jayega|turant\s+verify\s+kare|paisa\s+transfer\s+karo|otp\s+bhejo|lottery\s+lag\s+gayi|kyc\s+update\s+kare)/i,
    impactScore: 25,
    explanation: 'Regional vernacular scam phrasing targeting Hindi-speaking demographics.',
  },
  {
    id: 'TELUGU_URGENCY_SCAM',
    name: 'Vernacular Telugu/Tenglish Scam Pattern',
    category: 'SOCIAL ENGINEERING',
    severity: 'HIGH',
    regex: /(mee\s+bank\s+account\s+block|ventane\s+update\s+cheyandi|power\s+cut\s+aypothundi|udhyogam\s+dhorikindi|dabbu\s+pampandi|meeseva\s+update)/i,
    impactScore: 25,
    explanation: 'Regional vernacular scam phrasing targeting Telugu-speaking demographics.',
  },
];

export function runRuleEngine(content: string): RuleIndicator[] {
  if (!content) return [];
  const normalized = content.toLowerCase();
  const matchedRules: RuleIndicator[] = [];

  for (const rule of SCAM_RULES) {
    const match = normalized.match(rule.regex);
    if (match) {
      matchedRules.push({
        id: rule.id,
        ruleName: rule.name,
        matchedPattern: match[0],
        category: rule.category,
        severity: rule.severity,
        explanation: rule.explanation,
        impactScore: rule.impactScore,
      });
    }
  }

  return matchedRules;
}
