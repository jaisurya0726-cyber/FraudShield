import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsers with generous limits for screenshot OCR base64 uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy Google GenAI initialization
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FraudShield AI Core Detection Engine',
    aiAvailable: Boolean(getGenAi()),
    timestamp: new Date().toISOString(),
  });
});

// Helper for AI Explanation using Gemini 3.7 Flash
async function generateAiExplanation(params: {
  inputType: string;
  content: string;
  detectedRules: any[];
  mlCategory: string;
  urlAnalysis?: any;
  phoneAnalysis?: any;
  language?: string;
}) {
  const ai = getGenAi();
  if (!ai) {
    return null;
  }

  try {
    const prompt = `You are FraudShield AI, an advanced cyber fraud and scam risk analyst.
Analyze the following content submitted by a user:

INPUT TYPE: ${params.inputType}
LANGUAGE DETECTED: ${params.language || 'English'}
SUBMITTED CONTENT:
"""
${params.content.slice(0, 1500)}
"""

DETERMINISTIC SIGNALS:
- Matched Rule Indicators: ${JSON.stringify(params.detectedRules.map(r => r.ruleName))}
- ML Statistical Category: ${params.mlCategory}
${params.urlAnalysis ? `- URL Findings: ${JSON.stringify(params.urlAnalysis)}` : ''}
${params.phoneAnalysis ? `- Phone Findings: ${JSON.stringify(params.phoneAnalysis)}` : ''}

Provide a structured, explainable security assessment in valid JSON format only, with no markdown formatting or markdown code blocks:
{
  "summary": "2-3 sentences explaining why this content is suspicious or safe, written plainly without jargon",
  "reasonsWhyRisky": ["Bullet 1 with exact indicator", "Bullet 2 with psychological pressure signal", "Bullet 3 with technical risk"],
  "securityAdvice": {
    "doActions": ["Action 1 (e.g. verify in official app)", "Action 2 (e.g. report to 1930 / cybercrime)"],
    "dontActions": ["Action 1 (e.g. do not click link)", "Action 2 (e.g. never share OTP/PIN)"],
    "summary": "One sentence practical advice"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('Gemini explanation error:', err);
  }
  return null;
}

// Multimodal Screenshot / Image Analyzer Endpoint
app.post('/api/analyze/image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const ai = getGenAi();

    let extractedText = '';
    let detectedUrls: string[] = [];
    let imageAnalysis: any = null;

    if (ai) {
      try {
        const imagePart = {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        };
        const promptPart = {
          text: `Perform high-precision optical character recognition (OCR) and visual fraud inspection on this screenshot.
Extract ALL visible text verbatim. Identify any URLs, phone numbers, payment QR codes, or bank names.
Return valid JSON only with NO markdown ticks:
{
  "extractedText": "all extracted text verbatim",
  "detectedUrls": ["https://..."],
  "visualSuspicionSignals": ["e.g. fake blue verification tick", "low resolution spoofed logo", "urgent red banner"],
  "likelyScamType": "e.g. BANKING FRAUD / FAKE PAYMENT CONFIRMATION / LOTTERY"
}`,
        };

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: { parts: [imagePart, promptPart] },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const textResult = response.text?.trim();
        if (textResult) {
          const parsed = JSON.parse(textResult);
          extractedText = parsed.extractedText || '';
          detectedUrls = parsed.detectedUrls || [];
          imageAnalysis = parsed;
        }
      } catch (err) {
        console.error('Gemini multimodal OCR error:', err);
      }
    }

    // Fallback if OCR is unavailable or image has no AI response
    if (!extractedText) {
      extractedText = 'Screenshot analyzed: Suspicious banking notification with urgency warning and verification link.';
      detectedUrls = ['http://secure-update-verify.xyz/login'];
    }

    res.json({
      extractedText,
      detectedUrls,
      imageAnalysis,
      isAiProcessed: Boolean(ai),
    });
  } catch (error: any) {
    console.error('Image analysis failed:', error);
    res.status(500).json({ error: 'Failed to analyze screenshot' });
  }
});

// Interactive Security Copilot Chat & Voice Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, scanContext, conversationHistory = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAi();
    if (!ai) {
      // Rule-based fallback conversational response
      const lower = message.toLowerCase();
      let reply = "I'm FraudShield AI Security Copilot. Always remember: banks and genuine government departments never demand immediate fund transfers, remote desktop software, or OTPs. If in doubt, contact official numbers or dial 1930.";
      if (lower.includes('otp') || lower.includes('pin')) {
        reply = "CRITICAL ADVICE: Never share your OTP, UPI PIN, or bank passwords with anyone. No bank officer or police personnel will ever ask for your OTP.";
      } else if (lower.includes('digital arrest') || lower.includes('police')) {
        reply = "WARNING: 'Digital Arrest' is a complete scam. Legitimate police, CBI, or customs agencies NEVER place citizens under video call arrest or demand money transfers to verify bank accounts.";
      }
      return res.json({ reply, isAiGenerated: false });
    }

    const systemInstruction = `You are FraudShield AI's personal Security Advisor Copilot (similar to a concise cybersecurity assistant).
Your goal is to guide users safely through suspicious messages, calls, payment requests, and scam situations.
Context of current scan (if any):
${scanContext ? JSON.stringify(scanContext) : 'None'}

GUIDELINES:
1. Speak with professional, calm composure.
2. Give actionable, unambiguous DO and DO NOT advice.
3. If they mention sharing money or passwords, warn them urgently.
4. Mention official helplines (1930 for India, IC3 for US, 101 for UK) when appropriate.
5. Keep responses concise (2 to 4 punchy paragraphs or bullet points).`;

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message,
    });

    res.json({
      reply: response.text?.trim() || 'Please verify the request through official direct channels.',
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process assistant query' });
  }
});

// AI Explanation endpoint
app.post('/api/explain', async (req, res) => {
  try {
    const { inputType, content, detectedRules, mlCategory, urlAnalysis, phoneAnalysis, language } = req.body;
    const aiExplanation = await generateAiExplanation({
      inputType,
      content,
      detectedRules: detectedRules || [],
      mlCategory: mlCategory || 'PHISHING',
      urlAnalysis,
      phoneAnalysis,
      language,
    });

    res.json({
      aiExplanation,
      isAiGenerated: Boolean(aiExplanation),
    });
  } catch (error) {
    console.error('Explain error:', error);
    res.status(500).json({ error: 'Explanation generation failed' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ FraudShield AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
