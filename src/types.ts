export interface TimelineNode {
  time: string;
  event: string;
}

export interface EvidenceItem {
  item: string;
  locationFound: string;
  legalStatus: string;
}

export interface PrelimillaryCharge {
  chargeName: string;
  suggestedCode: string;
  explanation: string;
}

export interface ChargeElement {
  elementText: string;
  status: string; // "Satisfied", "Insufficient Evidence", "Unclear/Needs Proof"
  notes: string;
}

export interface ChargeAssessment {
  charge: string;
  elements: ChargeElement[];
}

export interface LegalAnalysis {
  chargeAssessments: ChargeAssessment[];
  evidentiaryStrength: number; // 0 to 100
  evidentiaryGaps: string[];
  constitutionalRisks: string[];
  investigationDirectives: string[];
}

export interface AffidavitAndWarrant {
  title: string;
  introduction: string;
  affiantQualifications: string;
  probableCauseNarrative: string;
  prayerForRelief: string;
  signatureBlock: string;
}

export interface CaseLog {
  id: string;
  title: string;
  date: string;
  location: string;
  incidentType: string;
  rawNotes: string;
  synopsis: string;
  narrative: string;
  timeline: TimelineNode[];
  suspectDescription: string;
  evidenceList: EvidenceItem[];
  prelimillaryCharges: PrelimillaryCharge[];
  analysis?: LegalAnalysis;
  affidavit?: AffidavitAndWarrant;
  chatHistory?: ChatMessage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
