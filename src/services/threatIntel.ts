import { ScamCategory, ThreatFeedItem } from '../types';

export const KNOWN_THREAT_FEEDS: ThreatFeedItem[] = [
  {
    id: 'THREAT-2026-9081',
    title: 'Surge in "Digital Arrest" Video Call Police Impersonation',
    category: 'GOVERNMENT IMPERSONATION',
    riskLevel: 'CRITICAL',
    source: 'CERT-In / Cyber Threat Intelligence',
    timestamp: '10 mins ago',
    confidence: 'CONFIRMED',
    region: 'India',
    indicators: ['WhatsApp Video Call from Police DP', 'Demand for RTGS/IMPS to "clear bank verification"', 'Forged CBI / Supreme Court Notice'],
    summary: 'Scammers impersonate police officers on Skype/WhatsApp, claiming an illegal courier with narcotics was intercepted in victim’s name, forcing victims to stay on video call ("digital arrest") and transfer life savings.',
    targetVictims: 'Senior citizens, working professionals, homemakers',
  },
  {
    id: 'THREAT-2026-8942',
    title: 'Phishing Campaign Spoofing India Post / USPS Redelivery Fees',
    category: 'DELIVERY SCAM',
    riskLevel: 'HIGH',
    source: 'Global Threat Watch & US-CERT',
    timestamp: '28 mins ago',
    confidence: 'CONFIRMED',
    region: 'Global',
    indicators: ['Domain: indiapost-track-pkg.top', 'SMS: "Package waiting, pay ₹25 redelivery"', 'Payment gateway phishing for credit cards & OTPs'],
    summary: 'Mass SMS broadcast claiming incomplete postal address for parcel delivery. Links redirect to fake postal tracking sites requiring small payment that steals card details.',
    targetVictims: 'Online shoppers awaiting e-commerce deliveries',
  },
  {
    id: 'THREAT-2026-8819',
    title: 'Telegram Daily Task "YouTube Like" Part-Time Job Scam',
    category: 'JOB SCAM',
    riskLevel: 'HIGH',
    source: 'Anti-Phishing Working Group (APWG)',
    timestamp: '1 hour ago',
    confidence: 'HIGH',
    region: 'Asia-Pacific',
    indicators: ['WhatsApp/Telegram recruitment message', 'Promises ₹2,000–₹5,000/day for liking videos', 'Demands prepaid VIP recharge to unlock withdrawal'],
    summary: 'Victims are paid small initial rewards (₹150–₹500) to build trust, then lured into depositing thousands into fake cryptocurrency or task investment merchant accounts.',
    targetVictims: 'College students, job seekers, homemakers',
  },
  {
    id: 'THREAT-2026-8744',
    title: 'Electricity Power Cut Tonight (9:30 PM) Scam Campaign',
    category: 'SOCIAL ENGINEERING',
    riskLevel: 'HIGH',
    source: 'State Discom Cyber Cell Advisory',
    timestamp: '2 hours ago',
    confidence: 'CONFIRMED',
    region: 'India',
    indicators: ['SMS from non-standard 10-digit number', 'Threat: "Power will be cut at 9:30 PM due to bill update"', 'Requests calling unauthorized officer number or installing APK'],
    summary: 'Scammers send fake discom warnings prompting panic calls. Callers instruct victims to install remote access apps (AnyDesk/QuickSupport) or click fake bill payment portals.',
    targetVictims: 'Residential utility consumers',
  },
  {
    id: 'THREAT-2026-8610',
    title: 'AI Deepfake CEO & Family Emergency Voice Clone Scams',
    category: 'ACCOUNT TAKEOVER',
    riskLevel: 'CRITICAL',
    source: 'Europol Cybercrime Center',
    timestamp: '4 hours ago',
    confidence: 'CONFIRMED',
    region: 'North America',
    indicators: ['Synthetic audio mimicking family member/boss in distress', 'Demands instant wire or crypto transfer', 'High background noise simulation'],
    summary: 'Threat actors use 3-second voice samples scraped from social media to clone voices and call relatives demanding emergency bail or hospital funds.',
    targetVictims: 'Family members, corporate finance teams',
  },
  {
    id: 'THREAT-2026-8501',
    title: 'Banking KYC Update / APK Malware Phishing via WhatsApp',
    category: 'BANKING FRAUD',
    riskLevel: 'CRITICAL',
    source: 'RBI Financial Fraud Bulletin',
    timestamp: '6 hours ago',
    confidence: 'CONFIRMED',
    region: 'India',
    indicators: ['"HDFC / SBI / ICICI Yono KYC Expired"', 'Shared .apk file labeled "BankSecurityUpdate.apk"', 'Reads SMS permissions to intercept OTPs silently'],
    summary: 'Victims receive WhatsApp messages with fake bank logos instructing them to install an APK file for KYC verification. The malware intercepts SMS OTPs and drains bank accounts.',
    targetVictims: 'Mobile banking users',
  },
];

export function checkThreatIntelligence(input: string): {
  matchedThreats: ThreatFeedItem[];
  riskBoost: number;
} {
  const lower = (input || '').toLowerCase();
  const matchedThreats: ThreatFeedItem[] = [];
  let riskBoost = 0;

  for (const item of KNOWN_THREAT_FEEDS) {
    let matchCount = 0;
    for (const indicator of item.indicators) {
      const kw = indicator.toLowerCase().split(' ')[0];
      if (kw.length > 3 && lower.includes(kw)) {
        matchCount++;
      }
    }
    if (lower.includes('digital arrest') || lower.includes('police') && item.category === 'GOVERNMENT IMPERSONATION') matchCount += 2;
    if (lower.includes('electricity') && lower.includes('cut') && item.category === 'SOCIAL ENGINEERING') matchCount += 2;
    if ((lower.includes('package') || lower.includes('delivery')) && (lower.includes('fee') || lower.includes('reschedule')) && item.category === 'DELIVERY SCAM') matchCount += 2;
    if ((lower.includes('part time') || lower.includes('youtube') || lower.includes('telegram')) && (lower.includes('job') || lower.includes('earn')) && item.category === 'JOB SCAM') matchCount += 2;

    if (matchCount >= 2) {
      matchedThreats.push(item);
      riskBoost += item.riskLevel === 'CRITICAL' ? 25 : 15;
    }
  }

  return {
    matchedThreats,
    riskBoost: Math.min(30, riskBoost),
  };
}
