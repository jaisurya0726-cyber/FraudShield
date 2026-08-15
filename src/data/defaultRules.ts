export interface HeuristicRule {
  id: string;
  name: string;
  category: string;
  severityWeight: number;
  description: string;
  patterns: string[];
  enabled: boolean;
}

export const DEFAULT_RULES: HeuristicRule[] = [
  {
    id: 'RULE_BANK_BLOCK',
    name: 'Bank Account Block Threat',
    category: 'Banking / KYC',
    severityWeight: 45,
    description: 'Detects urgent threats of bank account, PAN, or debit card blocking/suspension.',
    patterns: ['account\\s+(will\\s+be|is)\\s+(blocked|suspended|deactivated)', 'kyc\\s+pending'],
    enabled: true,
  },
  {
    id: 'RULE_ELECTRICITY_CUT',
    name: 'Electricity Disconnection Threat',
    category: 'Utilities',
    severityWeight: 40,
    description: 'Detects false notices claiming power will be disconnected at a specific hour.',
    patterns: ['electricity\\s+(will\\s+be|power)\\s+(disconnected|cut)', 'light\\s+cut\\s+tonight'],
    enabled: true,
  },
  {
    id: 'RULE_DELIVERY_FEE',
    name: 'Postal Delivery Redirection Fee',
    category: 'Courier / Logistics',
    severityWeight: 35,
    description: 'Detects requests for nominal parcel redelivery fees via unverified links.',
    patterns: ['package\\s+(cannot\\s+be|failed\\s+to)\\s+deliver', 'redelivery\\s+fee'],
    enabled: true,
  },
  {
    id: 'RULE_PARTTIME_JOB',
    name: 'Telegram / YouTube Job Scam',
    category: 'Employment',
    severityWeight: 40,
    description: 'Detects promises of high daily earnings for rating videos or liking social posts.',
    patterns: ['earn\\s+(₹|\\$)\\d+.*daily', 'part-time\\s+job.*telegram', 'like\\s+youtube\\s+videos'],
    enabled: true,
  },
  {
    id: 'RULE_CRYPTO_INVEST',
    name: 'Guaranteed Crypto Returns',
    category: 'Financial Investment',
    severityWeight: 50,
    description: 'Detects 100% guaranteed trading returns, VIP signals, or recovery agents.',
    patterns: ['guaranteed\\s+(profit|returns|100%)', 'deposit\\s+to\\s+unlock\\s+withdrawal'],
    enabled: true,
  },
  {
    id: 'RULE_UPI_REVERSE',
    name: 'UPI PIN Refund Reverse Scam',
    category: 'Payment / UPI',
    severityWeight: 50,
    description: 'Deceptive instructions claiming entering UPI PIN will receive funds into bank.',
    patterns: ['enter\\s+upi\\s+pin\\s+to\\s+receive', 'scan\\s+qr\\s+to\\s+credit'],
    enabled: true,
  },
];
