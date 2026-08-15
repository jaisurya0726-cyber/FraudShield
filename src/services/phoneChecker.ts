import { PhoneAnalysisResult } from '../types';

export function analyzePhoneNumber(rawPhone: string): PhoneAnalysisResult {
  const cleaned = rawPhone.replace(/[^\d+]/g, '');

  let countryCode = '+1';
  let countryName = 'United States / North America';
  let isValidFormat = false;

  if (cleaned.startsWith('+91') || (cleaned.length === 10 && /^[6-9]/.test(cleaned))) {
    countryCode = '+91';
    countryName = 'India';
    isValidFormat = cleaned.replace('+91', '').length === 10;
  } else if (cleaned.startsWith('+44')) {
    countryCode = '+44';
    countryName = 'United Kingdom';
    isValidFormat = cleaned.length >= 11;
  } else if (cleaned.startsWith('+1')) {
    countryCode = '+1';
    countryName = 'United States / Canada';
    isValidFormat = cleaned.replace('+1', '').length === 10;
  } else if (cleaned.startsWith('+971')) {
    countryCode = '+971';
    countryName = 'United Arab Emirates';
    isValidFormat = cleaned.length >= 12;
  } else if (cleaned.startsWith('+65')) {
    countryCode = '+65';
    countryName = 'Singapore';
    isValidFormat = cleaned.length >= 10;
  } else {
    isValidFormat = cleaned.length >= 8 && cleaned.length <= 15;
  }

  // Known VOIP / Virtual prefix patterns (e.g. +1 800, +91 virtual SMS gateways)
  const isVoipOrVirtual = cleaned.includes('1800') || cleaned.includes('888') || cleaned.includes('877') || cleaned.startsWith('+9198') === false && cleaned.startsWith('+91');

  // Simulated public reputation lookups based on number pattern characteristics
  let publicSpamReportsCount = 0;
  const reportedCategories: string[] = [];

  // Hash-based deterministic simulated report count so standard demo numbers produce consistent results
  let hash = 0;
  for (let i = 0; i < cleaned.length; i++) {
    hash = (hash << 5) - hash + cleaned.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  if (positiveHash % 3 === 0 || cleaned.includes('9999') || cleaned.includes('0000') || isVoipOrVirtual) {
    publicSpamReportsCount = 12 + (positiveHash % 87);
    reportedCategories.push('Robocall Telemarketing');
    reportedCategories.push('Fake Bank KYC SMS Sender');
    if (publicSpamReportsCount > 30) {
      reportedCategories.push('Digital Arrest Impersonation');
    }
  } else if (positiveHash % 5 === 0) {
    publicSpamReportsCount = 3 + (positiveHash % 9);
    reportedCategories.push('Unsolicited Loan Offers');
  }

  let reputationRating: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (publicSpamReportsCount > 25) {
    reputationRating = 'HIGH';
  } else if (publicSpamReportsCount > 2) {
    reputationRating = 'MEDIUM';
  }

  return {
    phoneNumber: rawPhone,
    countryCode,
    countryName,
    isValidFormat,
    isVoipOrVirtual,
    publicSpamReportsCount,
    reportedCategories,
    reputationRating,
    confidence: publicSpamReportsCount > 20 ? 'HIGH' : publicSpamReportsCount > 0 ? 'MODERATE' : 'LOW',
  };
}
