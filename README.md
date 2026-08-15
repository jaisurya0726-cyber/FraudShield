# FraudShield AI 🛡️
### AI-Powered Multi-Modal Scam, Phishing & Financial Fraud Detection Assistant

FraudShield AI is an intelligent cybersecurity intelligence and fraud mitigation platform designed to detect, analyze, and explain digital scams across multiple communication vectors in real time. It combines deterministic pattern heuristics, real-time threat intelligence feeds, and Gemini-powered Explainable AI to protect users against evolving financial fraud, social engineering, and cyber threats.

---

## 🌟 Key Capabilities

### 1. Multi-Vector Attack Surface Scanning
- **SMS & Messaging Forensics**: Detects bank KYC threats, fake electricity bill disconnection notices, task/part-time job scams, lottery schemes, and courier parcel fee traps.
- **Email & Phishing Payload Analysis**: Inspects spear-phishing messages, fraudulent invoices, CEO impersonation, and urgent credential requests.
- **Deep URL & Domain Inspection**: Identifies typosquatting, lookalike unicode domains, newly registered domains, URL shorteners, and deceptive query parameters.
- **QR Code & Payment Trap Analysis**: Decodes static/dynamic UPI QR codes to flag deceptive "reverse payment" requests and spoofed merchant handles.
- **Phone Number & Vishing Radar**: Cross-references inbound caller numbers against suspicious prefixes, high-risk spam blocks, and fraudulent caller ID patterns.
- **Visual OCR / Screenshot Scanner**: Extracts text and visual artifacts from mobile screenshots to uncover disguised smishing layouts and fake payment receipts.
- **Multilingual Voice Security Copilot**: Interactive real-time voice and audio assistant for rapid hands-free threat consultation and security guidance.

---

## ⚙️ Architecture & Detection Pipeline

FraudShield AI operates on a tiered detection pipeline combining sub-second deterministic heuristics with deep generative reasoning:

```
[Inbound Artifact] (Text / URL / QR / Phone / Image / Audio)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 1: High-Speed Deterministic Heuristic Engine           │
│ • Regex pattern matching (KYC, Urgency, APK downloads)      │
│ • TF-IDF lexical weight extraction & NLP urgency scoring   │
│ • Live Threat Intelligence IoC blocklist cross-referencing  │
│ • Domain forensics (Age, typosquatting, SSL/redirect flags) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 2: Generative Explainable AI (Google Gemini)           │
│ • Psychological coercion analysis & urgency tone scoring    │
│ • Plain-language risk explanation ("Why is this risky?")    │
│ • Contextual defensive guidance (Specific DOs & DO NOTs)    │
│ • Official emergency contact routing (Cyber Crime, Banks)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 3: Incident Report & Remediation Output                │
│ • 0–100 Aggregate Risk Score & Threat Classification        │
│ • Mathematical scoring breakdown & feature contribution     │
│ • Diagnostic forensic evidence table                        │
│ • One-click PDF audit report & JSON forensic export         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Application Modules

| Module | Description |
|---|---|
| **Multi-Modal Scanner** | Universal analysis workstation supporting text, URLs, QR codes, phone numbers, and OCR file uploads. |
| **Explainable AI Cards** | Plain-English threat explanations breaking down psychological traps and behavioral red flags. |
| **Security Advisor** | Concrete, prescriptive action plans detailing prohibited actions (DO NOT) and protective steps (DO). |
| **Live Threat Radar** | Real-time cyber threat feed tracking ongoing smishing waves, impersonation targets, and IoCs. |
| **Telemetry Dashboard** | 24-hour scan velocity, detection distribution, top scam vectors, and accuracy metrics. |
| **Audit Logs & History** | Local encrypted audit logs with search, risk filters, re-inspection, and downloadable PDF forensic dossiers. |
| **Model Admin & Calibration** | Granular control over regex rules, severity weights, risk thresholds, and active user feedback. |
| **Voice Security Copilot** | Conversational voice modal for immediate interactive security assessments. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion
- **Icons & Visuals**: Lucide React, Recharts
- **Backend / API**: Node.js, Express (dual dev & production SSR/SPA proxy)
- **AI / LLM Engine**: `@google/genai` (Google Gemini Flash)
- **Forensic Reporting**: jsPDF

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd fraudshield-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and provide your Google Gemini API key:
   ```bash
   cp .env.example .env
   ```
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Privacy & Data Protection

- **Client-Side Privacy Controls**: Scans can be conducted without storing sensitive message contents.
- **Local Audit Storage**: Scan history is stored locally in browser storage and can be wiped with a single click.
- **PII Scrubbing**: Sensitive identifiers (e.g., account numbers, passwords) are flagged for removal prior to external synthesis.

---

## 📄 License

This project is licensed under the MIT License.
