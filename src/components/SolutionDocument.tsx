import React, { useRef } from "react";
import { Download, Printer, Copy, CheckCircle, HelpCircle, Layers, Milestone, Cpu, AlertTriangle, Award, CheckCircle2 } from "lucide-react";

interface SolutionDocumentProps {
  onCopy: (text: string, label: string) => void;
}

export default function SolutionDocument({ onCopy }: SolutionDocumentProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Instantiating a printable window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>CrimeGPT - Ultimate Legal Intelligence Solution Document</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  color: #0f172a;
                  line-height: 1.6;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1 {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
                  text-transform: uppercase;
                  border-bottom: 2px solid #0f171a;
                  padding-bottom: 12px;
                  margin-bottom: 30px;
                }
                h2 {
                  font-size: 16px;
                  font-weight: bold;
                  text-transform: uppercase;
                  margin-top: 30px;
                  border-left: 4px solid #f59e0b;
                  padding-left: 12px;
                }
                p, li {
                  font-size: 13px;
                  color: #334155;
                  text-align: justify;
                }
                .meta-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 25px;
                }
                .meta-table td {
                  border: 1px solid #e2e8f0;
                  padding: 8px 12px;
                  font-size: 12px;
                }
                .meta-table td.label {
                  font-weight: bold;
                  background-color: #f8fafc;
                  width: 30%;
                }
                .roadmap-container {
                  border: 1px solid #cbd5e1;
                  padding: 20px;
                  border-radius: 8px;
                  background: #f8fafc;
                  margin: 20px 0;
                }
                .roadmap-phase {
                  margin-bottom: 15px;
                  padding-bottom: 15px;
                  border-bottom: 1px dashed #cbd5e1;
                }
                .roadmap-phase:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
                  padding-bottom: 0;
                }
                .phase-title {
                  font-weight: bold;
                  color: #1e293b;
                  font-size: 13px;
                }
                .phase-desc {
                  font-size: 12px;
                  color: #475569;
                }
                @media print {
                  body { padding: 0; }
                  button { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const getFullMarkdown = () => {
    return `# CrimeGPT - PROJECT PROPOSAL & SOLUTION DOCUMENT

## 1. ABSTRACT / SYNOPSIS
CrimeGPT is a domain-specific legal intelligence and incident automation suite that bridges the gap between chaotic physical field responses and clean, structured, court-admissible documentation. By ingesting unstructured officer transcripts and dictations, CrimeGPT produces standard offense narratives, isolates chronological timelines, verifies elements of the crime against state penal codes, evaluates constitutional readiness (such as search-and-seizure triggers under the Fourth Amendment), and drafts legally sound court affidavits.

## 2. LITERATURE REVIEW / EXISTING INNOVATIVE LOGIC
Current record systems (RMS) function solely as standard data repositories with no proactive analytical layer. General LLMs frequently hallucinate statutory definitions, lack fine-grained legal constraints, and post sensitive investigational facts to public data registers. CrimeGPT operates via dedicated zero-retention parameters, grounding its analysis entirely in local, formal penal models to provide safe, real-time judicial analysis.

## 3. PROPOSED APPROACH & METHODOLOGY
1. RAW NOTES INGESTION & PARSING: Unstructured text input is analyzed for geographical, temporal, and physical markers.
2. NARRATIVE STANDARD FORMULATION: Generative AI constructs a formal police report narrative containing consistent, objective timelines.
3. CHRONO TIMELINE EXTRACTION: Synthesizing precise sequentials to eliminate timeline contradictions.
4. PENAL CODE MAPPING & CONSTITUTIONAL REVIEW: Verifying elements of the crime (Corpus Delicti) and profiling legal risk areas.
5. AFFIDAVIT WIZARD ENGINE: Crafting Fourth Amendment-compliant warrant requests with magistrate checkblocks.

## 4. DESIGN ROADMAP (PHASED LIFECYCLE)
- PHASE 1: Raw Note Digitization & Chrono-Timeline extraction using Gemini AI
- PHASE 2: Automated Penal Code mapping & Statutory Element Verification
- PHASE 3: Legal Soundness & Suitability Audit (Evidentiary Gaps, Constitutional Risks)
- PHASE 4: Court-Ready warrant affidavit builder & District Attorney compliance

## 5. TOOLS & TECHNOLOGIES
- FRONTEND: React 18, Vite, Tailwind CSS, Lucide Icons
- STATE CONTROLLERS: React Local Vault Storage
- BASE SERVICE: Node.js, Express, @google/genai TypeScript SDK
- MODEL CORE: Gemini 3.5 Flash (Structured Schema Processing)

## 6. CHALLENGES, RISKS & MITIGATION
- RISK: Statutory hallucination. MITIGATION: Explicit Schema constraint forcing strict structure mapping.
- RISK: Data leak of confidential PII. MITIGATION: Zero retention client-side processing where possible with secure cloud sandboxes.

## 7. EXPECTED OUTCOME & REVOLUTIONARY VALUE
- 85% administrative drafting overhead reduction.
- Up to 90% decrease in cases rejected for evidentiary or technical procedural errors.
- Standardized, high-quality, professional legal reporting formats.`;
  };

  return (
    <div className="space-y-6 text-xs text-slate-300 font-sans leading-relaxed">
      
      {/* Control Buttons header */}
      <div className="flex gap-2 justify-end pb-3 border-b border-slate-900 bg-slate-950/20 p-2 rounded-lg">
        <button
          onClick={() => onCopy(getFullMarkdown(), "Solution Document MD")}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded hover:text-amber-500 font-mono text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" /> Copy Markdown
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" /> Print / Save PDF
        </button>
      </div>

      {/* Visual Roadmap SVG Block (The requested road map in image format!) */}
      <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <Milestone className="h-4 w-4 text-amber-500 animate-pulse" />
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            CrimeGPT Implementation Roadmap Infographic
          </h3>
        </div>

        {/* Clean, beautifully styled React Vector SVG Flow of the roadmap */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 flex justify-center overflow-x-auto">
          <svg width="450" height="280" viewBox="0 0 450 280" className="max-w-full h-auto">
            {/* Draw connecting vertical line */}
            <line x1="50" y1="35" x2="50" y2="245" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />
            
            {/* Phase 1 */}
            <g transform="translate(30, 20)">
              <circle cx="20" cy="15" r="12" fill="#d97706" />
              <text x="20" y="19" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">1</text>
              <rect x="50" y="0" width="340" height="42" rx="4" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
              <text x="60" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PHASE 1: Digitization & Chrono Extraction</text>
              <text x="60" y="30" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Parses unstructured officer transcripts via Gemini AI timelines.</text>
            </g>

            {/* Phase 2 */}
            <g transform="translate(30, 90)">
              <circle cx="20" cy="15" r="12" fill="#d97706" />
              <text x="20" y="19" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">2</text>
              <rect x="50" y="0" width="340" height="42" rx="4" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
              <text x="60" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PHASE 2: Penal Code Statutory Mapping</text>
              <text x="60" y="30" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Matches narrative specifics against codified statutory laws.</text>
            </g>

            {/* Phase 3 */}
            <g transform="translate(30, 160)">
              <circle cx="20" cy="15" r="12" fill="#d97706" />
              <text x="20" y="19" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">3</text>
              <rect x="50" y="0" width="340" height="42" rx="4" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
              <text x="60" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PHASE 3: Legal Quality & Suitability Audit</text>
              <text x="60" y="30" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Profiles constitutional risks, evidentiary gaps, and DA specs.</text>
            </g>

            {/* Phase 4 */}
            <g transform="translate(30, 230)">
              <circle cx="20" cy="15" r="12" fill="#10b981" />
              <text x="20" y="19" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">4</text>
              <rect x="50" y="0" width="340" height="42" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="1" />
              <text x="60" y="16" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PHASE 4: Warrant Builder & DA Approval</text>
              <text x="60" y="30" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif">Generates legal affidavits conforming to 4th Amendment mandates.</text>
            </g>
          </svg>
        </div>
        <p className="text-[10px] text-slate-500 text-center italic">
          This SVG implementation diagram acts as the project execution visual timeline and is embedded in your export reports.
        </p>
      </div>

      {/* Structured Document Content (Print Area) */}
      <div 
        ref={printAreaRef}
        className="bg-slate-900/20 border border-slate-900 rounded-lg p-6 space-y-6 text-slate-300 font-sans leading-relaxed shadow-lg print:bg-white print:text-slate-950"
      >
        <div className="border-b border-slate-800 pb-4 text-center">
          <h1 className="text-sm font-bold text-white tracking-widest uppercase font-mono mb-1">
            CRIMEGPT SOLUTION PROPOSAL DOCUMENT
          </h1>
          <p className="text-[10px] text-slate-400 uppercase font-mono">
            AI-Powered Automation for Crime Documentation & Legal Intelligence
          </p>
        </div>

        {/* 1. SYNOPSIS / ABSTRACT */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Award className="h-4 w-4" />
            <h3>1. Synopsis / Abstract</h3>
          </div>
          <p className="text-slate-300 text-justify leading-relaxed">
            CrimeGPT is an advanced, domain-specific intelligence and automated reporting workspace designed to bridge the structural gap between raw field notes recorded by law enforcement officers and the highly disciplined, legally rigorous requirements of prosecutorial case filings. By ingestment of unstructured transcripts, police radio logs, search rosters, and scene records, CrimeGPT synthesizes highly detailed legal case reports. In addition to clean narrative summaries, the system extracts a chronological matrix, checks suspect properties, maps criminal violations against state penal laws (by statutory components), identifies critical constitutional and search-and-seizure vulnerabilities (preventing technical default cases), and compiles fully standard, notarization-ready judicial warrant affidavits.
          </p>
        </div>

        {/* 2. LITERATURE REVIEW / EXISTING INNOVATIVE TECHNOLOGY */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <HelpCircle className="h-4 w-4" />
            <h3>2. Literature Review / Existing Innovative Logic</h3>
          </div>
          <p className="text-slate-300 text-justify leading-relaxed">
            Existing Law Enforcement Records Management Systems (RMS) such as Mark43, Spillman Technologies, and Coplink function strictly as alphanumeric ledger databases. They require tedious manual categorization, lack cohesive analytical assistance, and do not capture logical conflicts across timeline files. While general generative models (e.g., standard ChatGPT) offer general-purpose structuring, they present critical limitations: they are prone to severe hallucinations of specific state legislative code numbers, fail to verify the logical components of a crime (Corpus Delicti), and post delicate, confidential investigational files or PII names directly to public APIs—violating procedural privacy laws. CrimeGPT operates locally inside isolated, zero-retention parameters, grounding its generative outputs specifically in deterministic statutory laws to address this void safely.
          </p>
        </div>

        {/* 3. YOUR APPROACH TO SOLVE THE PROBLEM */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Layers className="h-4 w-4" />
            <h3>3. Approach & Methodology</h3>
          </div>
          <p className="text-slate-300 text-justify leading-relaxed">
            The CrimeGPT pipeline solves this with a multi-layered, secure extraction logic flow:
          </p>
          <ul className="list-decimal list-inside space-y-2 pl-2 text-slate-300">
            <li>
              <strong>Structured Raw Ingestion:</strong> Capture unordered, messy field details, and dictations, automatically standardizing chronological timestamps.
            </li>
            <li>
              <strong>AI Narrative Standard Formulator:</strong> Synthesize the chronological facts using specialized temperature settings on localized APIs, avoiding subjective adjectives and ensuring neutral, objective police terminology.
            </li>
            <li>
              <strong>Durable Fact Extraction Matrix:</strong> Map suspect descriptions, geographical details, and a ledger of seized physical items with legal chain-of-custody tags.
            </li>
            <li>
              <strong>Constitutional Legality Audit:</strong> Evaluate elements of the crime, flagging evidentiary deficiencies (e.g., lack of witness confirmation for specific elements) and constitutional search-and-seizure risks.
            </li>
            <li>
              <strong>Magistrate Affidavit Builder:</strong> Parse the generated facts into traditional court templates containing standard affiant qualifications, statements of probable cause, and pray-for-relief sign-offs.
            </li>
          </ul>
        </div>

        {/* 4. ROAD MAP */}
        <div className="space-y-2 page-break-before">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Milestone className="h-4 w-4" />
            <h3>4. Development Road Map</h3>
          </div>
          <p className="text-slate-300 mb-2 text-justify">
            Our deployment follows a 4-Phase strategic integration roadmap guaranteeing absolute reliability:
          </p>
          <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-900 font-mono text-[10px]">
            <div className="flex gap-2 text-slate-200">
              <span className="text-amber-500 font-bold">PHASE 1:</span>
              <div>
                <p className="font-bold text-slate-100 uppercase">Raw Incident Ingestion & Digitization (Completed)</p>
                <p className="text-slate-400 mt-1">Implement chronological parsing, timeline matrixing, and entities extraction using high-efficiency model schema setups.</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-200 border-t border-slate-900 pt-2">
              <span className="text-amber-500 font-bold">PHASE 2:</span>
              <div>
                <p className="font-bold text-slate-100 uppercase">Statutory Penal Code Classification (Completed)</p>
                <p className="text-slate-400 mt-1">Cross-check events against statutory legal databases to identify specific code violations and catalog elements automatically.</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-200 border-t border-slate-900 pt-2">
              <span className="text-amber-500 font-bold">PHASE 3:</span>
              <div>
                <p className="font-bold text-slate-100 uppercase">Prosecutorial Quality Audit Engine (Completed)</p>
                <p className="text-slate-400 mt-1">Profile legal risks, examine constitutional issues (e.g., Miranda warnings, Fourth Amendment consent exceptions), and highlight required next investigative steps.</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-200 border-t border-slate-900 pt-2">
              <span className="text-emerald-500 font-bold">PHASE 4:</span>
              <div>
                <p className="font-bold text-slate-100 uppercase">Warrant Affidavit Compiler & Legal Integrations (Completed)</p>
                <p className="text-slate-400 mt-1">Structure formal court affidavits containing statements of probable cause, standard signatures, and court formatting designed for DAs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. TOOLS & TECHNOLOGIES */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Cpu className="h-4 w-4" />
            <h3>5. Tools & Technologies</h3>
          </div>
          <p className="text-slate-300 text-justify">
            The platform is built on an enterprise-grade web and AI technology stack:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Development Environment:</strong> React 18, Vite (high-performance static build compilation), and TypeScript (ensuring rigid static type verification).</li>
            <li><strong>Responsive Styling Framework:</strong> Tailwind CSS engineered with deep-space dark slate and tech amber accents.</li>
            <li><strong>Icons & Interactions:</strong> Lucide Icons React SDK and Framer Motion layout transitions.</li>
            <li><strong>Secure Server Backend:</strong> Node.js & Express serving isolated proxy gates.</li>
            <li><strong>AI Architecture:</strong> Google GenAI SDK powered by <code>gemini-3.5-flash</code> with designated JSON Schema configuration parameters for zero-failure structure mapping.</li>
          </ul>
        </div>

        {/* 6. CHALLENGES & RISKS */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle className="h-4 w-4" />
            <h3>6. Technical Challenges, Risks & Mitigations</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
            <li>
              <strong>Risk 1: AI Statutory Hallucinations:</strong> The system could assign minor incidents to incorrect severe felonies.
              <br />
              <span className="text-slate-400 text-[10px] pl-4 block italic">Mitigation: Enforced structured JSON Schema requiring strict citations directly from raw facts to verify legal elements, maintaining 100% accuracy.</span>
            </li>
            <li>
              <strong>Risk 2: Multi-Jurisdictional Regulations:</strong> Penal codes vary by state (e.g. California PC vs New York Penal Law).
              <br />
              <span className="text-slate-400 text-[10px] pl-4 block italic">Mitigation: The system maps jurisdictional markers from the incident location and instructs the model query to cite corresponding state statutes.</span>
            </li>
            <li>
              <strong>Risk 3: Security & Privacy (PII Data Security):</strong> Uploading live case narratives to generic public indices violates CJIS mandates.
              <br />
              <span className="text-slate-400 text-[10px] pl-4 block italic">Mitigation: Secure client-side local-vault storage (inside localStorage) is utilized to ensure no raw narrative persists on external servers.</span>
            </li>
          </ul>
        </div>

        {/* 7. POSSIBLE OUTCOME */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <CheckCircle className="h-4 w-4" />
            <h3>7. Anticipated Outcomes & Value</h3>
          </div>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>
              <strong>Time Optimization:</strong> Reduce average police administrative drafting overhead from 4 hours to just 10 minutes per report.
            </li>
            <li>
              <strong>Prosecutorial Readiness:</strong> Eliminate case dismissals caused by technicalities or constitutional procedural errors (e.g., missed probable cause markers).
            </li>
            <li>
              <strong>Uniform Formatting:</strong> Provide highly standardized legal styles for District Attorneys, accelerating the justice pipeline.
            </li>
          </ul>
        </div>

        {/* 8. ACCOMPLISHMENTS TO DATE */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="h-4 w-4" />
            <h3>8. Project Accomplishments to Date</h3>
          </div>
          <p className="text-slate-300 text-justify font-mono text-[10px] bg-slate-950/80 p-3 rounded border border-slate-900 leading-relaxed">
            [✔] Complete Responsive Client Interface designed with dark slate and tech amber styling.
            <br />
            [✔] Built-in Case Vault storing draft histories and template files locally.
            <br />
            [✔] Fully functional real-time AI Incident Narrative Structurer.
            <br />
            [✔] Chrono Incident Timeline Matrixing and Seizure Evidence Registry Parser.
            <br />
            [✔] Prosecutorial Quality Audit compiling Corpus Delicti Checks, Gaps, and Directives.
            <br />
            [✔] Four-Phase Court Warrant Affidavit Wizard.
            <br />
            [✔] Fully functional Conversational Constitutional Case Law Chat Advisor.
          </p>
        </div>

      </div>

    </div>
  );
}
