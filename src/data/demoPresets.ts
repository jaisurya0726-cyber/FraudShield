import { DemoPreset } from '../types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo_banking',
    title: 'Banking Suspension Scam',
    type: 'message',
    tag: 'Banking / Phishing',
    expectedRisk: 'CRITICAL',
    preview: 'Your SBI account will be blocked today. Verify immediately at http://sbi-yono-update.xyz',
    payload: {
      text: 'Dear customer, your SBI YONO account will be blocked today. Click immediately at http://sbi-yono-update.xyz to verify your PAN & Aadhaar details to restore access.',
      sender: 'VD-SBIBNK',
    },
  },
  {
    id: 'demo_delivery',
    title: 'Fake Courier Redelivery Fee',
    type: 'message',
    tag: 'Delivery Scam',
    expectedRisk: 'HIGH',
    preview: 'Your package is on hold. Pay ₹25 redelivery fee at http://indiapost-redelivery.top',
    payload: {
      text: 'IndiaPost: Your package tracking #IN892014 is on hold due to incorrect street address. Pay ₹25 redelivery charge to reschedule delivery: http://indiapost-redelivery.top/pay',
      sender: '+919812345678',
    },
  },
  {
    id: 'demo_job',
    title: 'Part-Time YouTube Task Job',
    type: 'message',
    tag: 'Job Scam',
    expectedRisk: 'HIGH',
    preview: 'Earn ₹3,000-₹5,000/day liking videos. Pay ₹999 registration fee to unlock VIP tasks.',
    payload: {
      text: '🌟 Exciting Part-Time Work From Home Job! Earn ₹3,000 to ₹8,000 per day simply by liking YouTube videos and rating Google Maps places. Pay ₹999 one-time registration kit fee to get your daily task ID on Telegram: https://t.me/GlobalTaskRecruit',
      sender: '+1 (555) 019-2834',
    },
  },
  {
    id: 'demo_investment',
    title: 'Guaranteed 20% Daily Crypto Return',
    type: 'payment',
    tag: 'Investment Scam',
    expectedRisk: 'CRITICAL',
    preview: 'Guaranteed 20% daily returns! Send ₹25,000 USDT to start VIP algorithmic trading.',
    payload: {
      text: 'Exclusive VIP Crypto Signal Group! Guaranteed 20% daily risk-free returns backed by AI trading bots. Deposit ₹25,000 into our liquidity contract to activate your automated daily payouts.',
      amount: '₹25,000',
      paymentNote: 'USDT / UPI VIP Investment Activation',
    },
  },
  {
    id: 'demo_digital_arrest',
    title: 'Digital Arrest / Police Notice',
    type: 'message',
    tag: 'Govt Impersonation',
    expectedRisk: 'CRITICAL',
    preview: 'CBI Police Notice: Narcotics parcel seized in your name. Stay on video call to avoid arrest.',
    payload: {
      text: 'HIGH PRIORITY: Mumbai Police Crime Branch & CBI Notice. An illegal international parcel containing 16 passports and narcotics has been intercepted in your name. Non-bailable arrest warrant issued. Connect immediately on Skype / WhatsApp video call for verification or transfer funds to RBI security escrow.',
      sender: '+91 99990 12345',
    },
  },
  {
    id: 'demo_electricity',
    title: 'Electricity Cut-off Tonight (9:30 PM)',
    type: 'message',
    tag: 'Social Engineering',
    expectedRisk: 'HIGH',
    preview: 'Power will be disconnected tonight at 9:30 PM. Call Officer at 9876543210 immediately.',
    payload: {
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from power office because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Sharma at 9876543210. Thank you.',
      sender: '+91 98765 43210',
    },
  },
  {
    id: 'demo_phishing_email',
    title: 'Microsoft 365 Password Expiration',
    type: 'email',
    tag: 'Email Phishing',
    expectedRisk: 'HIGH',
    preview: 'Urgent: Your Microsoft 365 password expires in 24 hours. Keep current password.',
    payload: {
      sender: 'it-admin@microsoft-security-auth-check.xyz',
      subject: 'ACTION REQUIRED: Microsoft 365 Password Expiring in 24 Hours',
      text: 'Dear Employee, your corporate Microsoft 365 password will expire today in 24 hours. To retain your current password and avoid losing email access, click below to verify your current login credentials immediately.\n\nKeep Current Password: http://login-microsoftonline-verify.xyz/auth',
    },
  },
  {
    id: 'demo_legit',
    title: 'Legitimate Bank E-Statement',
    type: 'message',
    tag: 'Legitimate / Safe',
    expectedRisk: 'LOW',
    preview: 'Your monthly account statement is available securely inside your official mobile app.',
    payload: {
      text: 'Dear customer, your monthly account statement for account ending in 4921 for the period July 2026 is now available. You can view or download it securely by logging into your official bank mobile application or website.',
      sender: 'HDFCBK',
    },
  },
];
