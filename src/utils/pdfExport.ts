import { ScanResult } from '../types';

export const exportScanToPdf = (scan: ScanResult) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate and print the incident security report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fraud Incident Security Report - #${scan.id}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 40px;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          font-size: 24px;
          font-weight: 800;
          color: #4338ca;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .critical { background: #ffe4e6; color: #e11d48; }
        .high { background: #ffedd5; color: #ea580c; }
        .medium { background: #fef3c7; color: #d97706; }
        .low { background: #d1fae5; color: #059669; }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          background: #f8fafc;
        }
        .card h4 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 14px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .score {
          font-size: 36px;
          font-weight: 900;
        }
        .artifact {
          font-family: monospace;
          background: #0f172a;
          color: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-all;
        }
        ul {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
        }
        li {
          margin-bottom: 6px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
          font-size: 11px;
          color: #64748b;
          text-align: center;
        }
        @media print {
          body { margin: 20px; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">FraudShield AI • Incident Report</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
            Generated on ${new Date().toLocaleString()} | ID: #${scan.id}
          </div>
        </div>
        <div>
          <span class="badge ${scan.riskLevel.toLowerCase()}">
            ${scan.riskLevel} RISK (${scan.riskScore}/100)
          </span>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h4>Primary Threat Classification</h4>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${scan.primaryCategory}</div>
          <p style="font-size: 13px; color: #475569; margin-top: 8px;">${scan.explanationSummary}</p>
        </div>

        <div class="card">
          <h4>Technical Confidence & Modality</h4>
          <div class="score" style="color: #4338ca;">
            ${(scan.technicalEvidence.mlClassification.confidence * 100).toFixed(0)}%
          </div>
          <div style="font-size: 12px; color: #64748b;">
            Input Modality: ${scan.inputType.toUpperCase()} | Engine: ${scan.technicalEvidence.mlClassification.modelVersion}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <h4>Investigated Input Payload</h4>
        <div class="artifact">${scan.rawInput}</div>
      </div>

      <div class="grid">
        <div class="card" style="border-left: 4px solid #e11d48;">
          <h4 style="color: #e11d48;">Prohibited Actions (DO NOT)</h4>
          <ul>
            ${scan.securityAdvice.dontActions.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="card" style="border-left: 4px solid #059669;">
          <h4 style="color: #059669;">Recommended Protective Actions (DO)</h4>
          <ul>
            ${scan.securityAdvice.doActions.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <h4>Official Reporting Channels</h4>
        <ul>
          ${scan.securityAdvice.officialHelplines.map(h => `<li><strong>${h.name}</strong>: ${h.contact} - ${h.description}</li>`).join('')}
        </ul>
      </div>

      <div class="footer">
        FraudShield AI provides probabilistic defensive intelligence. Report generated for official incident documentation.
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 8px 16px; background: #4338ca; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          Print / Save as PDF
        </button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
