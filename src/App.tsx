import React, { useState, useEffect } from "react";
import {
  Shield,
  FileText,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Scale,
  FileSignature,
  Loader2,
  Gavel,
  Sparkles,
  Copy,
  Plus,
  Trash2,
  ClipboardCheck,
  ChevronRight,
  ShieldCheck,
  Info,
  ExternalLink,
  Bot,
  UserCheck,
  LogOut,
  Building,
  BadgeCheck,
  Database,
  ArrowRight
} from "lucide-react";

import { CASE_TEMPLATES, CaseTemplate } from "./components/CaseTemplates";
import WorkspaceHeader from "./components/WorkspaceHeader";
import CaseHistory from "./components/CaseHistory";
import LegalAdvisorChat from "./components/LegalAdvisorChat";
import SolutionDocument from "./components/SolutionDocument";
import LoginPage from "./components/LoginPage";
import ModuleNavigation from "./components/ModuleNavigation";
import { CaseLog, ChatMessage, TimelineNode, EvidenceItem, PrelimillaryCharge, LegalAnalysis, AffidavitAndWarrant } from "./types";
import { auth, db, signOut } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const LOCAL_STORAGE_KEY = "crimegpt_cases";
const LOCAL_STORAGE_CHAT_KEY = "crimegpt_chat";

export default function App() {
  // Authentication & Officer Profile State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Modular View Switcher ("portal" | "dossier" | "workspace" | "solutionDocument")
  const [activeModule, setActiveModule] = useState<"portal" | "dossier" | "workspace" | "solutionDocument">("workspace");

  // Cases list
  const [cases, setCases] = useState<CaseLog[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");

  // Input states (for currently edited case)
  const [caseTitle, setCaseTitle] = useState("");
  const [incidentType, setIncidentType] = useState("Commercial Burglary");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [suspectsInput, setSuspectsInput] = useState<string>("");
  const [victimsInput, setVictimsInput] = useState<string>("");

  // Active status / Loading indicators
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isAnalyzingCase, setIsAnalyzingCase] = useState(false);
  const [isGeneratingAffidavit, setIsGeneratingAffidavit] = useState(false);
  
  // Tab control in workspace outputs
  const [activeOutputTab, setActiveOutputTab] = useState<"narrative" | "evidence" | "analysis" | "affidavit" | "solutionDocument" | "chat">("narrative");

  // Affidavit generation wizard parameters
  const [affiantName, setAffiantName] = useState("");
  const [affiantBadge, setAffiantBadge] = useState("");
  const [warrantType, setWarrantType] = useState("Search Warrant Affidavit");
  const [targetCharge, setTargetCharge] = useState("");

  // Chat Log State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);

  // Success/Notification states
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Firebase Auth State Listener & Firestore Data Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          let profile;
          if (docSnap.exists()) {
            profile = docSnap.data();
          } else {
            profile = {
              uid: currentUser.uid,
              email: currentUser.email || "officer@metropolice.gov",
              displayName: currentUser.displayName || "Detective Jane Miller",
              badgeNumber: "DS-2948",
              department: "Special Investigations Division",
              clearanceLevel: "Level 4 - Top Secret / CJIS",
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, profile);
          }
          setUserProfile(profile);

          // Sync & fetch cases from Firestore database
          const q = query(collection(db, "cases"), where("uid", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const firestoreCases: CaseLog[] = [];
          querySnapshot.forEach((d) => {
            firestoreCases.push(d.data() as CaseLog);
          });

          if (firestoreCases.length > 0) {
            setCases(firestoreCases);
            setSelectedCaseId(firestoreCases[0].id);
            loadCaseIntoForm(firestoreCases[0]);
          }
        } catch (err) {
          console.warn("Firestore sync error:", err);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load existing cases or initialize with templates on first start
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setCases(parsed);
          setSelectedCaseId(parsed[0].id);
          loadCaseIntoForm(parsed[0]);
        } else {
          initializeDefault();
        }
      } catch (err) {
        initializeDefault();
      }
    } else {
      initializeDefault();
    }

    // Load Chat history
    const savedChat = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
    if (savedChat) {
      try {
        setChatMessages(JSON.parse(savedChat));
      } catch (_) {}
    }
  }, []);

  const initializeDefault = () => {
    // Populate templates as first-time case logs
    const initialCases: CaseLog[] = CASE_TEMPLATES.map((t, idx) => ({
      id: `template-${idx}-${Date.now()}`,
      title: t.title,
      incidentType: t.incidentType,
      date: t.date,
      location: t.location,
      rawNotes: t.rawNotes,
      synopsis: "Securing primary facts of report to generate diagnostic intelligence pipeline.",
      narrative: `SUMMARY OF INCIDENT:\n\nThis draft case contains investigator field transcripts. Click upper 'Generate Incident Report' to parse raw notes using Gemini 3.5 AI.`,
      timeline: [],
      suspectDescription: "Pending analysis",
      evidenceList: [],
      prelimillaryCharges: [],
      createdAt: new Date().toISOString()
    }));

    setCases(initialCases);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCases));
    setSelectedCaseId(initialCases[0].id);
    loadCaseIntoForm(initialCases[0]);
  };

  // Helper to load case state back into edit inputs
  const loadCaseIntoForm = (c: CaseLog) => {
    setCaseTitle(c.title);
    setIncidentType(c.incidentType);
    setIncidentDate(c.date);
    setIncidentLocation(c.location);
    setRawNotes(c.rawNotes);
    
    // Default or restore Affidavit state
    setTargetCharge(c.prelimillaryCharges?.[0]?.chargeName || c.incidentType || "");
    if (!affiantName) setAffiantName("Detective Jane Miller");
    if (!affiantBadge) setAffiantBadge("DS-2948");
  };

  // Save current form inputs to active Case record
  const handleSaveDraft = async (overrideCases?: CaseLog[]) => {
    const targetCases = overrideCases || cases;
    if (!selectedCaseId) return;

    let targetCaseObj: CaseLog | undefined;
    const updated = targetCases.map((c) => {
      if (c.id === selectedCaseId) {
        targetCaseObj = {
          ...c,
          title: caseTitle,
          incidentType,
          date: incidentDate,
          location: incidentLocation,
          rawNotes,
        };
        return targetCaseObj;
      }
      return c;
    });

    setCases(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Google Firestore Database if officer is authenticated
    if (userProfile && targetCaseObj) {
      try {
        const caseRef = doc(db, "cases", targetCaseObj.id);
        await setDoc(caseRef, {
          ...targetCaseObj,
          uid: userProfile.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        showToast("Case synced to Google Firestore Database!", "success");
      } catch (err) {
        console.warn("Firestore save error:", err);
        showToast("Case draft stored in local vault", "success");
      }
    } else {
      showToast("Case draft stored securely in local vault", "success");
    }
  };

  // User selects template to apply directly to active case
  const applyTemplate = (tpl: CaseTemplate) => {
    setCaseTitle(tpl.title);
    setIncidentType(tpl.incidentType);
    setIncidentDate(tpl.date);
    setIncidentLocation(tpl.location);
    setRawNotes(tpl.rawNotes);
    showToast("Case template loaded into form workspace", "info");
  };

  // Handle sidebar selection Change
  const handleSelectCase = (id: string) => {
    // Save draft of current first
    handleSaveDraft();
    
    const target = cases.find((c) => c.id === id);
    if (target) {
      setSelectedCaseId(id);
      loadCaseIntoForm(target);
    }
  };

  // Create new empty case
  const handleCreateNewCase = () => {
    // save old current first
    if (selectedCaseId) {
      handleSaveDraft();
    }

    const newCase: CaseLog = {
      id: `case-${Date.now()}`,
      title: "New Investigation Draft",
      incidentType: "To Be Determined",
      date: new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
      location: "",
      rawNotes: "",
      synopsis: "",
      narrative: "",
      timeline: [],
      suspectDescription: "",
      evidenceList: [],
      prelimillaryCharges: [],
      createdAt: new Date().toISOString()
    };

    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setSelectedCaseId(newCase.id);
    loadCaseIntoForm(newCase);
    setActiveOutputTab("narrative");
    showToast("New blank case file instantiated", "success");
  };

  // Direct reset button handles
  const handleResetWorkspace = () => {
    handleCreateNewCase();
  };

  // Delete case file with Firestore & local persistence sync
  const handleDeleteCase = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const caseToDelete = cases.find((c) => c.id === id);
    const caseTitleStr = caseToDelete?.title || "Case Record";

    const filtered = cases.filter((c) => c.id !== id);
    setCases(filtered);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    // Async purge from Google Firestore Database if authenticated
    if (userProfile) {
      try {
        const caseRef = doc(db, "cases", id);
        await deleteDoc(caseRef);
      } catch (err) {
        console.warn("Firestore delete error:", err);
      }
    }

    if (selectedCaseId === id) {
      if (filtered.length > 0) {
        setSelectedCaseId(filtered[0].id);
        loadCaseIntoForm(filtered[0]);
      } else {
        // Self-heal with fresh empty case
        const initialCase: CaseLog = {
          id: `case-${Date.now()}`,
          title: "New Investigation Draft",
          incidentType: "To Be Determined",
          date: new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
          location: "",
          rawNotes: "",
          synopsis: "",
          narrative: "",
          timeline: [],
          suspectDescription: "",
          evidenceList: [],
          prelimillaryCharges: [],
          createdAt: new Date().toISOString()
        };
        setCases([initialCase]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([initialCase]));
        setSelectedCaseId(initialCase.id);
        loadCaseIntoForm(initialCase);
      }
    }
    showToast(`Case "${caseTitleStr}" permanently purged`, "success");
  };

  // API Call: Generate full Incident & Crime Narrative Report
  const generateNarrativeReport = async () => {
    if (!rawNotes.trim()) {
      showToast("Please provide incident transcript or raw field notes to generate report.", "error");
      return;
    }

    setIsGeneratingNarrative(true);
    showToast("Digitizing case records & calling Gemini legal model...", "info");

    try {
      const response = await fetch("/api/generate-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawNotes,
          incidentType,
          date: incidentDate,
          location: incidentLocation,
          involvedParties: []
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const rawText = await response.text();
        console.warn("Non-JSON server response:", rawText);
        throw new Error("Server returned non-JSON response. Please try again.");
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Gemini server error when generating case analysis.");
      }

      const reportData = await response.json();

      // Update local state and persist
      const updatedCases = cases.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            // Automatically capture dynamic charge as default for affidavit wizard
            synopsis: reportData.synopsis || "Determined synopsis pending.",
            narrative: reportData.narrative || "No narrative could be produced.",
            timeline: reportData.timeline || [],
            suspectDescription: reportData.suspectDescription || "None clearly identified.",
            evidenceList: reportData.evidenceList || [],
            prelimillaryCharges: reportData.prelimillaryCharges || [],
            title: c.title === "New Investigation Draft" && reportData.prelimillaryCharges?.[0]
              ? `Report: ${reportData.prelimillaryCharges[0].chargeName}`
              : c.title
          };
        }
        return c;
      });

      setCases(updatedCases);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));

      // Refresh form with potentially updated title/incident
      const updatedMatch = updatedCases.find(c => c.id === selectedCaseId);
      if (updatedMatch) {
         loadCaseIntoForm(updatedMatch);
         if (updatedMatch.prelimillaryCharges?.length > 0) {
           setTargetCharge(updatedMatch.prelimillaryCharges[0].chargeName);
         }
      }

      // Switch to output screen and set active module to workspace
      setActiveOutputTab("narrative");
      setActiveModule("workspace");
      showToast("Case report structured & legal charges mapped successfully!", "success");

    } catch (err: any) {
      console.error(err);
      showToast(`Error processing notes: ${err.message || "Failed to contact CrimeGPT framework."}`, "error");
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  // API Call: Deep Legal Intelligence & Case Suitability Audit
  const analyzeCaseProsecutionSuitability = async () => {
    const activeCase = cases.find(c => c.id === selectedCaseId);
    if (!activeCase || !activeCase.narrative || activeCase.narrative.startsWith("SUMMARY OF INCIDENT:\n\nThis draft case")) {
      showToast("Please 'Generate Incident Report' first so we have a detailed structured narrative.", "error");
      return;
    }

    setIsAnalyzingCase(true);
    showToast("Analyzing evidentiary criteria against constitutional guidelines...", "info");

    try {
      const response = await fetch("/api/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          synopsis: activeCase.synopsis,
          narrative: activeCase.narrative,
          prelimillaryCharges: activeCase.prelimillaryCharges,
          evidenceList: activeCase.evidenceList
        })
      });

      const ct1 = response.headers.get("content-type") || "";
      if (!ct1.includes("application/json")) {
        throw new Error("Unable to complete legal intelligence audit (invalid response).");
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Unable to complete legal intelligence suitability audit.");
      }

      const analysisData: LegalAnalysis = await response.json();

      const updatedCases = cases.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            analysis: analysisData
          };
        }
        return c;
      });

      setCases(updatedCases);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
      setActiveOutputTab("analysis");
      showToast(`Audit complete: Prosecution suitability indexed at ${analysisData.evidentiaryStrength}/100!`, "success");

    } catch (err: any) {
      console.error(err);
      showToast(`Audit failed: ${err.message || "An error occurred."}`, "error");
    } finally {
      setIsAnalyzingCase(false);
    }
  };

  // API Call: Generate Legal Affidavit for Court Warrant
  const generateWarrantAffidavit = async () => {
    const activeCase = cases.find(c => c.id === selectedCaseId);
    if (!activeCase || !activeCase.narrative || activeCase.narrative.startsWith("SUMMARY OF INCIDENT:\n\nThis draft case")) {
      showToast("A structured narrative is required first. Run 'Generate Incident Report' to begin.", "error");
      return;
    }

    setIsGeneratingAffidavit(true);
    showToast("Drafting probable cause affidavit with standard legal code phrases...", "info");

    try {
      const response = await fetch("/api/generate-affidavit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          synopsis: activeCase.synopsis,
          narrative: activeCase.narrative,
          targetCharge: targetCharge || incidentType,
          affiantName: affiantName || "Detective",
          affiantBadge: affiantBadge || "N/A",
          warrantType: warrantType,
          evidence: activeCase.evidenceList
        })
      });

      const ct2 = response.headers.get("content-type") || "";
      if (!ct2.includes("application/json")) {
        throw new Error("Affidavit service returned invalid response format.");
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Affidavit generation service returned error state.");
      }

      const affidavitData: AffidavitAndWarrant = await response.json();

      const updatedCases = cases.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            affidavit: affidavitData
          };
        }
        return c;
      });

      setCases(updatedCases);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
      setActiveOutputTab("affidavit");
      showToast("Official court warrant affidavit generated!", "success");

    } catch (err: any) {
      console.error(err);
      showToast(`Affidavit creation failed: ${err.message}`, "error");
    } finally {
      setIsGeneratingAffidavit(false);
    }
  };

  // API Call: Chat Assistant to handle custom inputs
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(newMessages));
    setIsChatSending(true);

    try {
      const response = await fetch("/api/legal-advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // send last 10 messages for context
          messages: newMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat engine returned bad response.");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "assistant",
        content: data.content || "I am processing that intelligence.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };

      const updatedHistory = [...newMessages, assistantMsg];
      setChatMessages(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "assistant",
        content: `Error contacting server-side model: ${err.message || "Failed request."}`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages([...newMessages, errMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Reset current legal chat history?")) {
      setChatMessages([]);
      localStorage.removeItem(LOCAL_STORAGE_CHAT_KEY);
    }
  };

  // Toast notifier helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => curr?.message === message ? null : curr);
    }, 4500);
  };

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Copy text to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Dynamic Toast banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-xl flex items-center gap-3 animate-fade-in max-w-sm ${
          notification.type === "success" 
            ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
            : notification.type === "error"
            ? "bg-red-950/90 border-red-500/30 text-red-300"
            : "bg-slate-900/90 border-amber-500/30 text-amber-300"
        }`}>
          {notification.type === "success" && <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />}
          {notification.type === "error" && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
          {notification.type === "info" && <Info className="h-5 w-5 text-amber-500 shrink-0" />}
          <p className="text-xs font-sans tracking-wide leading-relaxed">{notification.message}</p>
        </div>
      )}

      {/* Workspace App Header */}
      <WorkspaceHeader
        onReset={handleResetWorkspace}
        activeCaseTitle={activeCase?.title}
        onOpenSolutionDoc={() => setActiveModule("solutionDocument")}
        currentTab={activeModule}
        onOpenLoginPortal={() => setActiveModule("portal")}
      />

      {/* Primary Modular View Navigation Bar */}
      <ModuleNavigation
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userProfile={userProfile}
        onSignOut={async () => {
          try {
            await signOut(auth);
            setUserProfile(null);
            showToast("Officer signed out safely", "info");
          } catch (err) {
            setUserProfile(null);
          }
        }}
        onOpenLoginModal={() => setActiveModule("portal")}
      />

      {/* Login Modal Popup if triggered */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-900 p-2 rounded-full border border-slate-700"
            >
              ✕
            </button>
            <LoginPage
              userProfile={userProfile}
              onLoginSuccess={(profile) => {
                setUserProfile(profile);
                setShowLoginModal(false);
                setActiveModule("workspace");
                showToast("Officer authenticated & connected to Google database", "success");
              }}
              onContinueAsGuest={() => {
                setShowLoginModal(false);
                setActiveModule("workspace");
              }}
              onSignOut={async () => {
                await signOut(auth);
                setUserProfile(null);
                setShowLoginModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* MODULE 1: OFFICER PORTAL & LOGIN PAGE */}
      {activeModule === "portal" && (
        <div className="flex-1 bg-slate-950 overflow-y-auto">
          <LoginPage
            userProfile={userProfile}
            onLoginSuccess={(profile) => {
              setUserProfile(profile);
              setActiveModule("workspace");
              showToast("Officer authenticated & connected to Google database", "success");
            }}
            onContinueAsGuest={() => {
              setActiveModule("workspace");
              showToast("Proceeding to Intel Workspace", "info");
            }}
            onSignOut={async () => {
              try {
                await signOut(auth);
                setUserProfile(null);
                showToast("Officer signed out", "info");
              } catch (err) {
                setUserProfile(null);
              }
            }}
          />
        </div>
      )}

      {/* MODULE 4: SOLUTION DOCUMENT PROPOSAL & ROADMAP */}
      {activeModule === "solutionDocument" && (
        <div className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6">
          <SolutionDocument onCopy={copyToClipboard} />
        </div>
      )}

      {/* MODULE 2: INCIDENT DOSSIER (FIELD DATA ENTRY & INTAKE) */}
      {activeModule === "dossier" && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950">
          {/* Left Sidebar: Internal Case History (3 cols) */}
          <div className="lg:col-span-3 border-r border-slate-900 bg-slate-950 flex flex-col">
            <CaseHistory
              cases={cases}
              activeId={selectedCaseId}
              onSelect={handleSelectCase}
              onDelete={handleDeleteCase}
            />
            
            {/* Inner template loader helper */}
            <div className="p-4 border-t border-slate-900 bg-slate-950/50">
              <h4 className="text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-2">
                Apply Ready Case Files
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {CASE_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(tpl)}
                    className="w-full text-left bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded transition-colors text-[11px] text-slate-300 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate">{tpl.title}</span>
                    <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-500 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main 9-column Case Field Dossier Form */}
          <div className="lg:col-span-9 p-6 flex flex-col overflow-y-auto space-y-6 bg-slate-950">
            {/* Header with Quick Actions */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-900 gap-3">
              <div className="flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-amber-500" />
                <div>
                  <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                    INCIDENT DOSSIER // FIELD RECORD DATA ENTRY
                  </h2>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Input raw wiretap logs, field notes, and incident parameters for AI parsing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateNewCase}
                  className="px-3 py-1.5 text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> New Case
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDeleteCase(selectedCaseId, e)}
                  className="px-3 py-1.5 text-xs font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Permanently purge active case file"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Purge Case File
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule("workspace")}
                  className="px-3 py-1.5 text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Intel Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Dossier Inputs Grid */}
            <div className="space-y-5 text-xs font-sans max-w-4xl">
              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-amber-500/90 mb-1.5 font-bold">
                  [FIELD 10-1] Case Report Title
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Apex Office Burglary Investigation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 font-sans font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-amber-500/90 mb-1.5 font-bold">
                    [FIELD 10-2] Statutory Offense Category
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Commercial Burglary">Commercial Burglary</option>
                    <option value="Possession for Sale (Narcotics)">Controlled Substances (Sales)</option>
                    <option value="Elder Financial Abuse & Wire Fraud">Financial / Elder Abuse</option>
                    <option value="Armed Robbery / Assault">Armed Robbery</option>
                    <option value="Auto Theft / Grand Theft">Grand Larceny</option>
                    <option value="Domestic Dispute / Assault">Domestic Assault</option>
                    <option value="Assumed/To Be Determined">To Be Determined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-amber-500/90 mb-1.5 font-bold">
                    [FIELD 10-3] Incident Timestamp
                  </label>
                  <input
                    type="text"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    placeholder="2026-06-15 at 03:14 AM"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-amber-500/90 mb-1.5 font-bold">
                  [FIELD 10-4] Crime Scene Location & GPS
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-amber-500" />
                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    placeholder="e.g. 404 Silicon Way, Suite B"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-amber-500/90 font-bold">
                    [FIELD 10-5] Officer Transcripts & Wiretap Field Notes
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    RAW FIELD INPUT
                  </span>
                </div>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  rows={12}
                  placeholder="Input raw officer transcripts, radio call logs, witness quotes, gathered evidence summaries, suspect descriptions, forensic timeline markers, or interview audio dictation notes..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed text-xs resize-none placeholder:text-slate-600"
                />
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={generateNarrativeReport}
                  disabled={isGeneratingNarrative || !rawNotes.trim()}
                  className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-900 text-slate-950 disabled:text-slate-500 rounded-lg font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer"
                >
                  {isGeneratingNarrative ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Structuring Case Report with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-current" />
                      <span>Generate AI Crime Narrative Report & Open Intel Workspace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveDraft()}
                  className="px-5 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: INTEL WORKSPACE (AI ANALYSIS & LEGAL DOCUMENTS) */}
      {activeModule === "workspace" && (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950">
        
        {/* Left Sidebar: Internal Case History (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-900 bg-slate-950 flex flex-col">
          <CaseHistory
            cases={cases}
            activeId={selectedCaseId}
            onSelect={handleSelectCase}
            onDelete={handleDeleteCase}
          />
          
          {/* Inner template loader helper */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/50">
            <h4 className="text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-2">
              Apply Ready Case Files
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {CASE_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(tpl)}
                  className="w-full text-left bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded transition-colors text-[11px] text-slate-300 flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{tpl.title}</span>
                  <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-500 shrink-0 ml-1.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated 9-column Intelligence Workspace Output Panel */}
        <div className="lg:col-span-9 p-6 flex flex-col overflow-y-auto space-y-6 bg-slate-950">
          
          {/* Active Case Summary Banner & Mode Switcher */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] rounded border border-amber-500/30 uppercase">
                  ACTIVE INTEL FILE
                </span>
                <h2 className="text-sm font-bold text-white font-sans">
                  {activeCase?.title || "Untitled Investigation"}
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-3">
                <span>Offense: <strong className="text-amber-400">{activeCase?.incidentType || "Pending"}</strong></span>
                <span>•</span>
                <span>Location: {activeCase?.location || "Unspecified"}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModule("dossier")}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileSignature className="h-3.5 w-3.5 text-amber-500" />
              <span>Edit Field Dossier Inputs</span>
            </button>
          </div>

          {/* Navigation Tab Header */}
          <div className="flex border-b border-slate-900 overflow-x-auto scroller-none gap-2 pb-1">
            <button
              onClick={() => setActiveOutputTab("narrative")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider relative shrink-0 cursor-pointer font-mono transition-colors ${
                activeOutputTab === "narrative" ? "text-amber-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Incident Report
              {activeOutputTab === "narrative" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>

            <button
              onClick={() => setActiveOutputTab("evidence")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider relative shrink-0 cursor-pointer font-mono transition-colors ${
                activeOutputTab === "evidence" ? "text-amber-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Evidence & Offenses
              {activeOutputTab === "evidence" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>

            <button
              onClick={() => setActiveOutputTab("analysis")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider relative shrink-0 cursor-pointer font-mono transition-colors ${
                activeOutputTab === "analysis" ? "text-amber-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Prosecutorial Audit
              {activeOutputTab === "analysis" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>

            <button
              onClick={() => setActiveOutputTab("affidavit")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider relative shrink-0 cursor-pointer font-mono transition-colors ${
                activeOutputTab === "affidavit" ? "text-amber-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Affidavit Wizard
              {activeOutputTab === "affidavit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>

            <button
              onClick={() => setActiveOutputTab("chat")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider relative shrink-0 cursor-pointer font-mono flex items-center gap-1.5 transition-colors ${
                activeOutputTab === "chat" ? "text-amber-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              Intelligence Chat
              {activeOutputTab === "chat" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>
          </div>

          {/* TAB CONTENT: Incident Report Section */}
          {activeOutputTab === "narrative" && (
            <div className="space-y-4 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-lg border border-slate-900">
                <div>
                  <h3 className="font-semibold text-slate-200">Investigator's Narrative Statement</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">FORM 10-4A COURT DOCUMENTATION</p>
                </div>
                {activeCase?.narrative && (
                  <button
                    onClick={() => copyToClipboard(activeCase.narrative, "Full Narrative report")}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition-colors text-[10px] font-mono flex items-center gap-1 border border-slate-800 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Text
                  </button>
                )}
              </div>

              {activeCase?.synopsis ? (
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-900/80 space-y-2">
                  <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase">
                    Incident Case Synopsis
                  </span>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{activeCase.synopsis}"
                  </p>
                </div>
              ) : null}

              <div className="bg-slate-900/10 border border-slate-900 rounded-lg p-5 space-y-4">
                {activeCase?.narrative ? (
                  <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-xs font-mono font-normal">
                    {activeCase.narrative}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-10 w-10 mx-auto stroke-[1] mb-2 text-slate-700" />
                    <p className="font-semibold">Case report documentation empty</p>
                    <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-1">
                      Input transcript and notes on the left panel, and select "Generate AI Crime Narrative Report" to structure police documentation.
                    </p>
                  </div>
                )}
              </div>

              {/* TIMELINE TIMEMAP */}
              {activeCase?.timeline && activeCase.timeline.length > 0 && (
                <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-lg space-y-3">
                  <h3 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    Chrono Incident Matrix (Secured Logs)
                  </h3>
                  <div className="border-l border-slate-800 pl-4 space-y-4 my-2">
                    {activeCase.timeline.map((node, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1 px-[2px]">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm" />
                        </div>
                        <div className="text-[10px] font-mono font-semibold text-amber-500">
                          {node.time}
                        </div>
                        <div className="text-slate-300 text-xs mt-0.5">
                          {node.event}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: Evidence details, charges and physical descriptions */}
          {activeOutputTab === "evidence" && (
            <div className="space-y-4 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Logged Crime Evidence & Target Suspects</h3>
                  <p className="text-[10px] text-slate-400 font-mono">COURT DEPOSITED EXHIBITS</p>
                </div>
              </div>

              {/* Preliminary Mapped Penals */}
              <div className="bg-slate-900/40 border border-slate-900/80 rounded-lg p-4 space-y-3">
                <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase block">
                  Identified Preliminary Charges mapped by penal code
                </span>
                
                {activeCase?.prelimillaryCharges && activeCase.prelimillaryCharges.length > 0 ? (
                  <div className="space-y-2">
                    {activeCase.prelimillaryCharges.map((c, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">{c.chargeName}</span>
                          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[9px] font-mono font-semibold">
                            {c.suggestedCode}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {c.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic py-2 text-center text-[11px]">
                    No targeted criminal codes loaded. Run the narrative engine to identify offenses.
                  </p>
                )}
              </div>

              {/* Suspect Identifiers */}
              <div className="bg-slate-900/40 border border-slate-900/80 rounded-lg p-4 space-y-2">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">
                  Suspect Descriptors & Locatives
                </span>
                <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-3 rounded border border-slate-800 leading-relaxed">
                  {activeCase?.suspectDescription || "No target suspects parsed yet."}
                </p>
              </div>

              {/* Physical Evidence Vault */}
              <div className="bg-slate-900/40 border border-slate-900/80 rounded-lg p-4 space-y-3">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">
                  Logged Physical Evidence Registry
                </span>

                {activeCase?.evidenceList && activeCase.evidenceList.length > 0 ? (
                  <div className="divide-y divide-slate-900">
                    {activeCase.evidenceList.map((ev, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-slate-200">{ev.item}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Found: {ev.locationFound}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-400 rounded text-[9px] font-mono border border-slate-800 shrink-0 uppercase">
                          {ev.legalStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <p className="italic text-[11px]">No logged search seizure registry.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: Prosecutorial suitability analysis */}
          {activeOutputTab === "analysis" && (
            <div className="space-y-4 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Prosecutorial Review Board</h3>
                  <p className="text-[10px] text-slate-400 font-mono">PROBABLE CAUSE & COURT-READY SOUNDNESS ANALYSIS</p>
                </div>
                
                <button
                  onClick={analyzeCaseProsecutionSuitability}
                  disabled={isAnalyzingCase || !activeCase?.narrative || activeCase.narrative.startsWith("SUMMARY OF INCIDENT:\n\nThis draft case")}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-900 text-slate-950 disabled:text-slate-500 px-3 py-1.5 rounded font-bold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isAnalyzingCase ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Auditing Case...</span>
                    </>
                  ) : (
                    <>
                      <Gavel className="h-3 w-3" />
                      <span>Audit Court Soundness</span>
                    </>
                  )}
                </button>
              </div>

              {!activeCase?.analysis ? (
                <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-8 text-center text-slate-500">
                  <Gavel className="h-10 w-10 mx-auto stroke-[1] mb-2.5 text-slate-700" />
                  <p className="font-semibold">Case has not undergone prosecutorial compliance review.</p>
                  <p className="text-[10px] text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                    Review whether the elements of crimes are legally satisfied, check constitutional vulnerabilities (e.g. warrantless seizure issues), and map required follow-up investigative tasks.
                  </p>
                  <button
                    onClick={analyzeCaseProsecutionSuitability}
                    className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded text-[11px] border border-slate-850 cursor-pointer"
                  >
                    Initiate Legality Audit Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Gauge Dial / Evidentiary score block */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4.5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                        <Scale className="h-6 w-6 stroke-[1.5]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
                          Case Integrity Metric
                        </div>
                        <h4 className="text-xl font-bold text-white mt-0.5">
                          Prosecutorial Soundness Index
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold font-mono text-amber-400">
                        {activeCase.analysis.evidentiaryStrength}%
                      </div>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mt-1">
                        {activeCase.analysis.evidentiaryStrength >= 80 
                          ? "Filing Suitable" 
                          : activeCase.analysis.evidentiaryStrength >= 50
                          ? "Remand Requested" 
                          : "Evidentiary Insufficient"
                        }
                      </div>
                    </div>
                  </div>

                  {/* Elements of Crime Check panel */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-4 space-y-3">
                    <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                      Statutory Elements of the Crime Assessment
                    </h4>

                    <div className="space-y-3">
                      {activeCase.analysis.chargeAssessments.map((ca, i) => (
                        <div key={i} className="space-y-2 border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                          <div className="font-bold font-mono text-slate-200">
                            {ca.charge}
                          </div>
                          
                          <div className="space-y-2 bg-slate-950/60 p-2.5 rounded border border-slate-900">
                            {ca.elements.map((el, idx) => {
                              const isSatisfied = el.status.toLowerCase() === "satisfied";
                              const isWeak = el.status.toLowerCase() === "insufficient evidence";
                              return (
                                <div key={idx} className="flex gap-2.5 border-b border-slate-900/60 pb-2 last:border-0 last:pb-0">
                                  <div className="mt-0.5 shrink-0">
                                    {isSatisfied ? (
                                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                                    ) : isWeak ? (
                                      <XCircle className="h-4.5 w-4.5 text-red-500" />
                                    ) : (
                                      <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2.5">
                                      <span className="font-medium text-slate-200 text-[11px] leading-relaxed">{el.elementText}</span>
                                      <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded uppercase border shrink-0 ${
                                        isSatisfied 
                                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                          : isWeak
                                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                      }`}>
                                        {el.status}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed">
                                      {el.notes}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Gaps & Constitutional compliance Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-lg space-y-2">
                      <span className="text-[10px] font-mono tracking-wider text-red-400 uppercase block">
                        Evidentiary Deficiencies
                      </span>
                      {activeCase.analysis.evidentiaryGaps.length === 0 ? (
                        <p className="text-slate-500 text-[11px] italic">No active deficiencies tracked.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px] pl-1">
                          {activeCase.analysis.evidentiaryGaps.map((gap, i) => (
                            <li key={i} className="leading-relaxed">{gap}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-lg space-y-2">
                      <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase block">
                        Constitutional Compliance Risks
                      </span>
                      {activeCase.analysis.constitutionalRisks.length === 0 ? (
                        <p className="text-slate-500 text-[11px] italic">Fully compliant with standard procedural requirements.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px] pl-1">
                          {activeCase.analysis.constitutionalRisks.map((risk, i) => (
                            <li key={i} className="leading-relaxed">{risk}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* DETECTIVE DIRECTIVES LIST */}
                  <div className="bg-slate-900/40 border border-slate-900 p-4.5 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase block">
                      Target Intelligence Directives (Required Actions for Court Ready Status)
                    </span>
                    <div className="space-y-2.5">
                      {activeCase.analysis.investigationDirectives.map((dir, i) => (
                        <div key={i} className="flex gap-2 bg-slate-950 p-2.5 rounded border border-slate-900 text-slate-300 text-xs">
                          <span className="text-emerald-500 font-bold font-mono">0{i+1}.</span>
                          <span className="leading-relaxed">{dir}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: Court warrant affidavit builder */}
          {activeOutputTab === "affidavit" && (
            <div className="space-y-4 animate-fade-in text-xs font-sans">
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-900 space-y-3">
                <div className="flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-amber-500" />
                  <h3 className="font-bold text-slate-200">Legal Warrant Affidavit Wizard</h3>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Compose formal legal affidavits to submit to magistrates requesting investigative warrants (search, arrest, seizure) based on the current case narrative assets.
                </p>

                <div className="grid grid-cols-2 gap-3.5 pt-1 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wilder mb-1">
                      Affiant Investigator
                    </label>
                    <input
                      type="text"
                      value={affiantName}
                      onChange={(e) => setAffiantName(e.target.value)}
                      placeholder="Detective John Kelly"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wilder mb-1">
                      Badge / Shield Number
                    </label>
                    <input
                      type="text"
                      value={affiantBadge}
                      onChange={(e) => setAffiantBadge(e.target.value)}
                      placeholder="DS-4029"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wilder mb-1">
                      Affidavit Warrant Type
                    </label>
                    <select
                      value={warrantType}
                      onChange={(e) => setWarrantType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                    >
                      <option value="Search Warrant Affidavit">Search & Seizure Warrant</option>
                      <option value="Arrest Warrant Declaration">Arrest Warrant Declaration</option>
                      <option value="Subpoena duces tecum Application">Subpoena for Tech / Records</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wilder mb-1">
                      Offense Charge Header
                    </label>
                    <input
                      type="text"
                      value={targetCharge}
                      onChange={(e) => setTargetCharge(e.target.value)}
                      placeholder="e.g. PC 459 Burglary"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={generateWarrantAffidavit}
                    disabled={isGeneratingAffidavit || !activeCase?.narrative || activeCase.narrative.startsWith("SUMMARY OF INCIDENT:\n\nThis draft case")}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-900 text-slate-950 disabled:text-slate-500 font-bold py-2 px-4 rounded text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isGeneratingAffidavit ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Structuring Court Document...</span>
                      </>
                    ) : (
                      <>
                        <FileSignature className="h-4 w-4" />
                        <span>Formulate Standardized Legal Affidavit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {activeCase?.affidavit ? (
                <div className="space-y-4 animate-fade-in text-[11px] font-serif leading-relaxed text-slate-300 bg-amber-50/5 border border-amber-900/20 p-6 rounded-lg shadow-inner max-w-full">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 font-sans mb-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-semibold">
                      Legal Court Draft Form Completed
                    </span>
                    <button
                      onClick={() => {
                        const fullTxt = `${activeCase.affidavit?.title}\n\n${activeCase.affidavit?.introduction}\n\nSTATEMENT OF QUALIFICATIONS:\n${activeCase.affidavit?.affiantQualifications}\n\nSTATEMENT OF PROBABLE CAUSE:\n${activeCase.affidavit?.probableCauseNarrative}\n\nPRAYER FOR RELIEF:\n${activeCase.affidavit?.prayerForRelief}\n\n${activeCase.affidavit?.signatureBlock}`;
                        copyToClipboard(fullTxt, "Warrant Affidavit");
                      }}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-500 border border-slate-800 rounded font-mono text-[9px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="h-3 w-3" /> Copy Affidavit
                    </button>
                  </div>

                  {/* Title Block */}
                  <h2 className="text-center text-xs font-bold font-sans text-white uppercase tracking-wider border-b border-slate-850 pb-3 mb-4">
                    {activeCase.affidavit.title}
                  </h2>

                  {/* Introduction Block */}
                  <div className="mb-4">
                    <p className="indent-6">{activeCase.affidavit.introduction}</p>
                  </div>

                  {/* Affiant Background */}
                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold underline text-slate-200">I. TRAINING AND EXPERIENCE OF AFFIANT</h3>
                    <p className="indent-6 text-justify">{activeCase.affidavit.affiantQualifications}</p>
                  </div>

                  {/* Probable Cause Narrative */}
                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold underline text-slate-200">II. STATEMENT OF PROBABLE CAUSE</h3>
                    <p className="indent-6 text-justify whitespace-pre-line">{activeCase.affidavit.probableCauseNarrative}</p>
                  </div>

                  {/* Prayer for relief */}
                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold underline text-slate-200">III. PRAYER FOR RELIEF</h3>
                    <p className="indent-6 text-justify">{activeCase.affidavit.prayerForRelief}</p>
                  </div>

                  {/* Signatures */}
                  <div className="pt-4 border-t border-slate-850 grid grid-cols-2 gap-4 font-sans text-[10px] text-slate-400">
                    <div className="space-y-4">
                      <div>_______________________________________</div>
                      <div className="font-semibold uppercase">{activeCase.affidavit.signatureBlock.split("\n")?.[0] || "AFFIANT INVESTIGATOR"}</div>
                    </div>
                    <div className="space-y-4 text-right">
                      <div>_______________________________________</div>
                      <div className="font-semibold uppercase text-amber-500">HONORABLE MAGISTRATE JUDGE</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 border border-slate-900 rounded-lg bg-slate-900/10">
                  <FileSignature className="h-10 w-10 mx-auto stroke-[1] mb-2 text-slate-700" />
                  <p className="font-semibold">No active court affidavit drafted.</p>
                  <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-1">
                    Fill the parameters above and click "Formulate Standardized Legal Affidavit" to compile a Fourth Amendment standard document.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: Solution Project Document & Project Proposal with Roadmap SVG Infographic */}
          {activeOutputTab === "solutionDocument" && (
            <div className="animate-fade-in">
              <SolutionDocument onCopy={copyToClipboard} />
            </div>
          )}

          {/* TAB CONTENT: Embedded Legal Advisor Chat AI */}
          {activeOutputTab === "chat" && (
            <div className="h-[540px] animate-fade-in">
              <LegalAdvisorChat
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isSending={isChatSending}
                onClearChat={handleClearChat}
              />
            </div>
          )}

        </div>

      </div>
      )}

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>CrimeGPT Courtroom intelligence framework v3.5-flash</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
          ONLINE APIS METRIC: SECURED
        </span>
      </footer>
    </div>
  );
}
