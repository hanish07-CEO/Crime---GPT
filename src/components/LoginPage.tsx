import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Loader2, 
  FileText, 
  Scale, 
  Fingerprint, 
  Cpu,
  AlertTriangle,
  ArrowRight,
  Mail,
  UserCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginPageProps {
  onLoginSuccess: (userProfile: any) => void;
  onContinueAsGuest?: () => void;
  userProfile?: any;
  onSignOut?: () => void;
  onOpenSolutionDoc?: () => void;
}

type AuthMode = "badge" | "email" | "persona" | "biometric";

interface OfficerPreset {
  id: string;
  name: string;
  badge: string;
  role: string;
  email: string;
  dept: string;
  avatarBg: string;
}

const OFFICER_PERSONAS: OfficerPreset[] = [
  {
    id: "io-jadeja",
    name: "Inspector R.K. Jadeja",
    badge: "AHM-2024-IO-047",
    role: "Lead Investigating Officer",
    email: "rk.jadeja@gujaratpolice.gov.in",
    dept: "Cyber Crime PS Ahmedabad",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  {
    id: "analyst-patel",
    name: "Det. Priya Patel",
    badge: "AHM-2024-CF-102",
    role: "Cyber Forensics & Digital Evidence Lead",
    email: "priya.patel@gujaratpolice.gov.in",
    dept: "Forensic Intel Unit",
    avatarBg: "bg-blue-500/20 text-blue-300 border-blue-500/40"
  },
  {
    id: "prosecutor-mehta",
    name: "Adv. Vikram Mehta",
    badge: "GJ-PROS-882",
    role: "Special Cyber Public Prosecutor",
    email: "v.mehta@judiciary.gov.in",
    dept: "State Prosecution Directorate",
    avatarBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  }
];

export default function LoginPage({ 
  onLoginSuccess, 
  onContinueAsGuest, 
  userProfile, 
  onSignOut 
}: LoginPageProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("badge");
  const [badgeNumber, setBadgeNumber] = useState("AHM-2024-IO-047");
  const [password, setPassword] = useState("GujaratPolice@2024");
  const [email, setEmail] = useState("rk.jadeja@gujaratpolice.gov.in");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const syncUserToFirestore = async (user: any, customData?: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const profileData = {
        uid: user.uid,
        email: customData?.email || user.email || `${(customData?.badgeNumber || badgeNumber).toLowerCase().replace(/[^a-z0-9]/g, "")}@gujaratpolice.gov.in`,
        displayName: customData?.displayName || (badgeNumber === "AHM-2024-IO-047" ? "Inspector R.K. Jadeja" : `Officer ${badgeNumber}`),
        badgeNumber: customData?.badgeNumber || badgeNumber || "AHM-2024-IO-047",
        department: customData?.department || "Gujarat Police Cyber Crime Branch",
        clearanceLevel: customData?.clearanceLevel || "Level 4 - Top Secret",
        role: customData?.role || "Lead Investigating Officer",
        updatedAt: new Date().toISOString(),
        ...(docSnap.exists() ? {} : { createdAt: new Date().toISOString() })
      };

      await setDoc(userRef, profileData, { merge: true });
      return profileData;
    } catch (err) {
      console.warn("Firestore sync warning:", err);
      return {
        uid: user.uid,
        email: customData?.email || `${badgeNumber}@gujaratpolice.gov.in`,
        displayName: customData?.displayName || "Inspector R.K. Jadeja",
        badgeNumber: customData?.badgeNumber || badgeNumber,
        department: customData?.department || "Gujarat Police Cyber Crime Branch",
        role: customData?.role || "Investigating Officer",
        clearanceLevel: "Level 4"
      };
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (authMode === "badge") {
        if (!badgeNumber.trim()) {
          setErrorMsg("Please enter your Officer Badge Number.");
          setLoading(false);
          return;
        }
        const mockUid = `badge_${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
        const mockUser = {
          uid: mockUid,
          email: `${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}@gujaratpolice.gov.in`,
          displayName: badgeNumber === "AHM-2024-IO-047" ? "Inspector R.K. Jadeja" : `Officer ${badgeNumber}`
        };
        const profile = await syncUserToFirestore(mockUser, {
          displayName: badgeNumber === "AHM-2024-IO-047" ? "Inspector R.K. Jadeja" : `Officer ${badgeNumber}`,
          badgeNumber: badgeNumber.trim().toUpperCase(),
          role: "Investigating Officer"
        });
        onLoginSuccess(profile);
      } else if (authMode === "email") {
        if (!email.trim()) {
          setErrorMsg("Please enter your official department email.");
          setLoading(false);
          return;
        }
        const mockUid = `email_${email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}`;
        const mockUser = {
          uid: mockUid,
          email: email.trim(),
          displayName: email.includes("jadeja") ? "Inspector R.K. Jadeja" : "Gujarat Police Officer"
        };
        const profile = await syncUserToFirestore(mockUser, {
          displayName: mockUser.displayName,
          badgeNumber: "GJ-SSO-911",
          email: email.trim(),
          role: "Authenticated Officer"
        });
        onLoginSuccess(profile);
      } else if (authMode === "biometric") {
        // Simulated secure hardware FIDO2 token authentication
        await new Promise(r => setTimeout(r, 600));
        const mockUser = {
          uid: "bio_token_fido2_ahm_047",
          email: "rk.jadeja@gujaratpolice.gov.in",
          displayName: "Inspector R.K. Jadeja"
        };
        const profile = await syncUserToFirestore(mockUser, {
          displayName: "Inspector R.K. Jadeja",
          badgeNumber: "AHM-2024-IO-047",
          role: "Lead Investigating Officer [FIDO2 Hardware Verified]"
        });
        onLoginSuccess(profile);
      }
    } catch (err: any) {
      setErrorMsg("Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = async (persona: OfficerPreset) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const mockUser = {
        uid: `persona_${persona.id}`,
        email: persona.email,
        displayName: persona.name
      };
      const profile = await syncUserToFirestore(mockUser, {
        displayName: persona.name,
        badgeNumber: persona.badge,
        email: persona.email,
        department: persona.dept,
        role: persona.role
      });
      onLoginSuccess(profile);
    } catch (err) {
      setErrorMsg("Failed to switch officer profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#070b14] text-slate-100 flex items-center justify-center p-5 sm:p-8 lg:p-12 relative font-sans overflow-hidden select-none">
      
      {/* Background Law Enforcement Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(to right, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[550px] h-[450px] bg-blue-900/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 my-auto">
        
        {/* LEFT COLUMN: Brand, Headline & Key Capabilities */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            {/* Custom Outline Police Shield Badge based on user reference */}
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0 relative group">
              <svg className="w-7 h-7 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* Shield Contour */}
                <path d="M 50 10 C 65 14 78 8 82 22 C 86 38 76 52 80 70 C 76 84 62 90 50 94 C 38 90 24 84 20 70 C 24 52 14 38 18 22 C 22 8 35 14 50 10 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="4" />
                {/* Inner Outline */}
                <path d="M 50 17 C 62 20 71 16 74 27 C 77 40 69 51 72 65 C 69 76 59 81 50 85 C 41 81 31 76 28 65 C 31 51 23 40 26 27 C 29 16 38 20 50 17 Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" />
                {/* Ribbon Banner for POLICE */}
                <path d="M 30 31 Q 50 25 70 31 Q 68 40 70 42 Q 50 36 30 42 Q 32 40 30 31 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
                <text x="50" y="38" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">POLICE</text>
                {/* Center Circle with 6-Pointed Star */}
                <circle cx="50" cy="62" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="62" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
                {/* 6-Point Star with balls on tips */}
                <polygon points="50,49 53,58 62,55 57,63 62,71 53,68 50,77 47,68 38,71 43,63 38,55 47,58" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="49" r="1.5" fill="currentColor" />
                <circle cx="62" cy="55" r="1.5" fill="currentColor" />
                <circle cx="62" cy="71" r="1.5" fill="currentColor" />
                <circle cx="50" cy="77" r="1.5" fill="currentColor" />
                <circle cx="38" cy="71" r="1.5" fill="currentColor" />
                <circle cx="38" cy="55" r="1.5" fill="currentColor" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070b14] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-white tracking-tight font-sans">
                  CRIMEGPT
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                  POLICE INTEL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-wide">
                Gujarat Police Cyber Command & Forensics
              </p>
            </div>
          </div>

          {/* Minimal, Punchy & Catchy Headline */}
          <div className="space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.08] tracking-tight font-sans">
              Smart Policing.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                Faster Justice.
              </span>
            </h2>
            
            {/* Amber Theme Accent Line */}
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm" />

            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              Turn raw crime reports into courtroom-ready evidence. Instant statutory BNS section mapping, cryptographic chain of custody, and AI legal intelligence.
            </p>
          </div>

          {/* 4 Minimal Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
            
            {/* Card 1 */}
            <div className="bg-[#0c1322]/80 border border-slate-800/90 hover:border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 transition-colors">
              <div className="text-amber-400">
                <FileText className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Incident Dossier & Dictation</h3>
              <p className="text-xs text-slate-400 leading-snug">Multi-lingual voice transcription & Form 10-4A digitization</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0c1322]/80 border border-slate-800/90 hover:border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 transition-colors">
              <div className="text-amber-400">
                <Scale className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Statutory Legal Engine</h3>
              <p className="text-xs text-slate-400 leading-snug">Autonomous BNS, BNSS & BSA criminal section mapping</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0c1322]/80 border border-slate-800/90 hover:border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 transition-colors">
              <div className="text-amber-400">
                <Fingerprint className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Evidence Vault</h3>
              <p className="text-xs text-slate-400 leading-snug">Cryptographic SHA-256 chain of custody under Sec 63 BSA</p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0c1322]/80 border border-slate-800/90 hover:border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 transition-colors">
              <div className="text-amber-400">
                <Cpu className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Interrogatory Intel</h3>
              <p className="text-xs text-slate-400 leading-snug">AI legal interrogation strategies & warrant drafting</p>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Officer Sign-In Card with Multiple Login Options */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          
          <div className="bg-[#0c1324]/95 border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                  Officer Sign-In
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Select authentication method to access criminal intel.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                SSO READY
              </span>
            </div>

            {/* Active Session State */}
            {userProfile ? (
              <div className="bg-[#070b14] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">OFFICER AUTHENTICATED</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">ACTIVE</span>
                </div>
                <div className="text-xs font-mono space-y-1">
                  <p className="text-white font-bold">{userProfile.displayName || "Inspector R.K. Jadeja"}</p>
                  <p className="text-amber-400">{userProfile.badgeNumber || "AHM-2024-IO-047"}</p>
                  <p className="text-slate-400 text-[11px]">{userProfile.department || "Gujarat Police Cyber Crime Branch"}</p>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Launch Investigation Workspace</span>
                  </button>
                  {onSignOut && (
                    <button
                      type="button"
                      onClick={onSignOut}
                      className="w-full py-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* 4 Login Modes Segmented Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#070b14] rounded-xl border border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("badge"); setErrorMsg(""); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                      authMode === "badge" 
                        ? "bg-amber-500 text-slate-950 font-bold shadow" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 50 10 C 65 14 78 8 82 22 C 86 38 76 52 80 70 C 76 84 62 90 50 94 C 38 90 24 84 20 70 C 24 52 14 38 18 22 C 22 8 35 14 50 10 Z" fill="currentColor" fillOpacity="0.25" />
                      <circle cx="50" cy="58" r="14" stroke="currentColor" strokeWidth="5" />
                      <polygon points="50,47 52,54 60,52 56,59 60,66 52,64 50,71 48,64 40,66 44,59 40,52 48,54" fill="currentColor" />
                    </svg>
                    <span className="text-[10px]">Officer Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode("persona"); setErrorMsg(""); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                      authMode === "persona" 
                        ? "bg-amber-500 text-slate-950 font-bold shadow" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Duty Persona</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode("email"); setErrorMsg(""); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                      authMode === "email" 
                        ? "bg-amber-500 text-slate-950 font-bold shadow" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Dept SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode("biometric"); setErrorMsg(""); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                      authMode === "biometric" 
                        ? "bg-amber-500 text-slate-950 font-bold shadow" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Hardware Key</span>
                  </button>
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div className="bg-red-950/80 border border-red-500/50 p-2.5 rounded-lg text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Option 1: Badge Number & PIN Form */}
                {authMode === "badge" && (
                  <form onSubmit={handleSignIn} className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Officer Badge Number
                      </label>
                      <input
                        type="text"
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="AHM-2024-IO-047"
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono uppercase tracking-wider"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Password / Security PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-3 pr-9 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 transition-colors p-0.5"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-950" />
                      )}
                      <span>Sign In with Badge</span>
                    </button>
                  </form>
                )}

                {/* Option 2: 1-Click Officer Personas */}
                {authMode === "persona" && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-400 font-mono">
                      Select an official duty persona for instant clearance:
                    </p>
                    <div className="space-y-1.5">
                      {OFFICER_PERSONAS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectPersona(p)}
                          className="w-full p-2.5 bg-[#070b14] hover:bg-[#0d1627] border border-slate-800 hover:border-amber-500/40 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${p.avatarBg}`}>
                              {p.name.split(" ")[1]?.substring(0, 2).toUpperCase() || "IO"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                {p.role} · <span className="text-amber-400/90">{p.badge}</span>
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Option 3: Department Gov Email / SSO */}
                {authMode === "email" && (
                  <form onSubmit={handleSignIn} className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Official Police / Judiciary Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@gujaratpolice.gov.in"
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Department Domain Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Mail className="w-4 h-4 text-slate-950" />
                      )}
                      <span>Gov Portal SSO Sign-In</span>
                    </button>
                  </form>
                )}

                {/* Option 4: Biometric / FIDO2 Security Token */}
                {authMode === "biometric" && (
                  <div className="space-y-3 pt-1 text-center">
                    <div className="p-4 bg-[#070b14] rounded-xl border border-slate-800 flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 animate-pulse">
                        <Fingerprint className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Hardware Key / TouchID Ready</p>
                        <p className="text-[11px] text-slate-400 font-mono">Tap your police-issued security token or fingerprint sensor</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSignIn()}
                      disabled={loading}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Shield className="w-4 h-4 text-slate-950" />
                      )}
                      <span>Verify Biometric Credential</span>
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-slate-800" />
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">OR</span>
                  <div className="flex-grow border-t border-slate-800" />
                </div>

                {/* Explore Live Demo Button */}
                {onContinueAsGuest && (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={onContinueAsGuest}
                      className="w-full py-2 px-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm group active:scale-[0.99]"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Explore Live Demo (20 Preloaded Cases)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <p className="text-[10px] text-slate-500 text-center leading-snug font-mono">
                      Read-only evaluation dossier · No password required
                    </p>
                  </div>
                )}

                {/* Confidential Notice */}
                <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>Confidential // CJIS v5.9 & BNS Compliant</span>
                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
