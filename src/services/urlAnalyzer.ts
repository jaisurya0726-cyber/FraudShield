import { UrlAnalysisResult } from '../types';

const HIGH_RISK_TLDS = ['.xyz', '.top', '.work', '.click', '.loan', '.icu', '.gq', '.cf', '.tk', '.ml', '.ga', '.rest', '.quest', '.buzz', '.vip', '.cc', '.space'];
const TRUSTED_DOMAINS = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com', 'chase.com', 'bankofamerica.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'gov.in', 'gov', 'edu', 'org'];
const SUSPICIOUS_SUBSTRING_KEYWORDS = ['login', 'signin', 'verify', 'update', 'secure', 'account', 'banking', 'support', 'wallet', 'claim', 'refund', 'kyc', 'recovery', 'auth', 'bill-pay'];

export function analyzeUrlStructure(rawUrl: string): UrlAnalysisResult {
  let cleaned = rawUrl.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }

  let domain = '';
  let isHttps = false;
  let isIpAddress = false;
  let tld = '';
  const suspiciousChars: string[] = [];

  try {
    const parsed = new URL(cleaned);
    domain = parsed.hostname.toLowerCase();
    isHttps = parsed.protocol === 'https:';

    // IP address check
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(domain)) {
      isIpAddress = true;
      suspiciousChars.push('Raw IP Address used instead of branded domain');
    }

    // TLD extraction
    const parts = domain.split('.');
    if (parts.length > 1) {
      tld = '.' + parts.slice(-1)[0];
    }

    if (HIGH_RISK_TLDS.includes(tld)) {
      suspiciousChars.push(`High-risk Top-Level Domain (${tld}) frequently abused in phishing`);
    }

    // Subdomain count / depth
    if (parts.length > 3) {
      suspiciousChars.push(`Abnormal subdomain nesting depth (${parts.length - 2} levels)`);
    }

    // Punycode / Homograph check
    if (domain.startsWith('xn--') || /[^\x00-\x7F]/.test(domain)) {
      suspiciousChars.push('Homoglyph / Punycode characters detected (potential brand impersonation)');
    }

    // Suspicious keywords in subdomains or path
    const pathAndHost = (domain + parsed.pathname).toLowerCase();
    const matchedKeywords = SUSPICIOUS_SUBSTRING_KEYWORDS.filter(kw => pathAndHost.includes(kw));
    
    // Check if impersonating a trusted brand
    const impersonatedBrand = TRUSTED_DOMAINS.find(td => {
      const brand = td.split('.')[0];
      return pathAndHost.includes(brand) && !domain.endsWith(td);
    });

    if (impersonatedBrand) {
      suspiciousChars.push(`Brand spoofing signal: references "${impersonatedBrand}" but domain is actually "${domain}"`);
    }

    if (matchedKeywords.length > 1) {
      suspiciousChars.push(`Multiple deceptive security keywords: [${matchedKeywords.join(', ')}]`);
    }

    if (!isHttps) {
      suspiciousChars.push('Unencrypted HTTP protocol used for target link');
    }

    // Entropy calculation
    const entropy = calculateEntropy(domain);
    if (entropy > 3.8 && !TRUSTED_DOMAINS.some(td => domain.endsWith(td))) {
      suspiciousChars.push(`High domain character randomness (Entropy score: ${entropy.toFixed(2)})`);
    }

    // Determine reputation
    let reputationStatus: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNRATED' = 'UNRATED';
    if (TRUSTED_DOMAINS.some(td => domain === td || domain.endsWith('.' + td))) {
      reputationStatus = 'CLEAN';
    } else if (suspiciousChars.length >= 3 || isIpAddress || impersonatedBrand) {
      reputationStatus = 'MALICIOUS';
    } else if (suspiciousChars.length >= 1) {
      reputationStatus = 'SUSPICIOUS';
    } else {
      reputationStatus = 'UNRATED';
    }

    return {
      url: rawUrl,
      domain,
      tld,
      isHttps,
      isIpAddress,
      hasSuspiciousKeywords: matchedKeywords.length > 0,
      entropyScore: Number(entropy.toFixed(2)),
      suspiciousCharacteristics: suspiciousChars,
      reputationStatus,
      domainAgeEstimate: reputationStatus === 'MALICIOUS' ? '< 30 days (Heuristic Indicator)' : 'Standard Registry',
      redirectRiskEstimate: suspiciousChars.length >= 2 ? 'HIGH' : suspiciousChars.length === 1 ? 'MEDIUM' : 'LOW',
    };
  } catch {
    return {
      url: rawUrl,
      domain: rawUrl,
      tld: 'unknown',
      isHttps: false,
      isIpAddress: false,
      hasSuspiciousKeywords: false,
      entropyScore: 0,
      suspiciousCharacteristics: ['Malformed URL structure'],
      reputationStatus: 'SUSPICIOUS',
      redirectRiskEstimate: 'HIGH',
    };
  }
}

function calculateEntropy(str: string): number {
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / str.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}
