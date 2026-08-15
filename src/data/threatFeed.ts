import { ThreatCampaign } from '../types';

export const LIVE_THREAT_FEED: ThreatCampaign[] = [
  {
    id: 'tc_sbi_yono_wave',
    title: 'SBI YONO Urgent KYC / PAN Update Phishing Wave',
    description: 'Active smishing campaign sending fraudulent messages claiming netbanking accounts will be suspended unless a fake verification portal is accessed.',
    severity: 'CRITICAL',
    category: 'Banking & KYC',
    targetedInstitutions: ['State Bank of India', 'YONO SBI', 'HDFC Bank'],
    indicatorsOfCompromise: [
      'sbi-yono-update-online.xyz',
      'sbionline-kyc-portal.top',
      'http://192.168.1.105/yono-login.apk'
    ],
    activeSince: '3 hours ago',
    victimCountEstimate: '4,200+',
    region: 'India / APAC',
  },
  {
    id: 'tc_postal_customs_trap',
    title: 'India Post / Courier Redelivery Fee Trap',
    description: 'Deceptive SMS claiming incoming parcels are detained due to incorrect address information, demanding small ₹25-₹50 online payments that clone debit cards.',
    severity: 'HIGH',
    category: 'Courier & Logistics',
    targetedInstitutions: ['India Post', 'SpeedPost', 'BlueDart', 'DHL'],
    indicatorsOfCompromise: [
      'indiapost-pkg-track.top',
      'parcel-redelivery-hub.site',
      'speedpost-update-address.com'
    ],
    activeSince: '5 hours ago',
    victimCountEstimate: '8,500+',
    region: 'Global / Multi-National',
  },
  {
    id: 'tc_telegram_task_vip',
    title: 'Telegram VIP Daily Task & YouTube Like Scam',
    description: 'Recruiters on WhatsApp promising ₹3,000-₹8,000 daily earnings for liking videos, escalating into paid VIP tier deposits that cannot be withdrawn.',
    severity: 'CRITICAL',
    category: 'Job & Task Scam',
    targetedInstitutions: ['YouTube', 'Google Reviews', 'TikTok', 'Instagram'],
    indicatorsOfCompromise: [
      't.me/GlobalTaskRecruiterVIP',
      'vip-task-earning-hub.xyz',
      'crypto-task-settlement.org'
    ],
    activeSince: '1 day ago',
    victimCountEstimate: '15,000+',
    region: 'Global',
  },
  {
    id: 'tc_discom_power_cut',
    title: 'Electricity Board Power Disconnection Notice',
    description: 'Threatening SMS claiming household power will be disconnected at 9:30 PM tonight due to unpaid previous month bills, redirecting to fake support numbers.',
    severity: 'HIGH',
    category: 'Utility & Energy',
    targetedInstitutions: ['State Electricity Boards', 'Discoms', 'Tata Power', 'BSES'],
    indicatorsOfCompromise: [
      '+91 98765 43210',
      'discom-bill-update-quick.top',
      'electricity-helpline-desk.xyz'
    ],
    activeSince: '8 hours ago',
    victimCountEstimate: '3,100+',
    region: 'India',
  },
  {
    id: 'tc_crypto_arbitrage_trap',
    title: 'High-Yield USDT Arbitrage & Fake Trading Platform',
    description: 'Social engineering lure advertising guaranteed 15% daily returns through automated crypto arbitrage bots on unregulated imitation exchanges.',
    severity: 'CRITICAL',
    category: 'Crypto & Investment',
    targetedInstitutions: ['Binance (Impersonated)', 'ByBit', 'MetaMask'],
    indicatorsOfCompromise: [
      'binance-global-arbitrage.vip',
      'tron-usdt-smartyield.finance',
      '0x71C...392A (USDT Tether Wallet)'
    ],
    activeSince: '2 days ago',
    victimCountEstimate: '2,400+',
    region: 'North America / EU / Asia',
  },
  {
    id: 'tc_digital_arrest_police',
    title: 'Fake Narcotics Bureau "Digital Arrest" Extortion',
    description: 'Aggressive video/audio calls impersonating cyber crime or customs officers alleging suspicious parcels containing passports or drugs, demanding bail escrow.',
    severity: 'CRITICAL',
    category: 'Banking & KYC',
    targetedInstitutions: ['CBI', 'Customs Department', 'Cyber Crime Police', 'FedEx'],
    indicatorsOfCompromise: [
      '+91 88880 12345',
      'cbi-escrow-settlement-gov.site',
      'virtual-police-court-hearing.top'
    ],
    activeSince: '12 hours ago',
    victimCountEstimate: '1,800+',
    region: 'India / Southeast Asia',
  },
];
