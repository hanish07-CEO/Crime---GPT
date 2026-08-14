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
    <div className="h-screen max-h-screen w-full bg-[#040711] text-slate-100 flex items-center justify-center p-5 sm:p-8 lg:p-12 relative font-sans overflow-hidden select-none">
      
      {/* 1. Cyber Crime Scene Background with Cyber Hacker */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Deep Night Atmosphere & Horizon Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02050c] via-[#040816] to-[#010307]" />

        {/* Ambient Distant City Light & Cyber Fog */}
        <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-slate-950 via-[#060e22]/60 to-transparent" />
        
        {/* Distant City Skyline Silhouette & Communication Towers */}
        <svg className="absolute bottom-[18%] inset-x-0 w-full h-32 opacity-20" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M 0,120 L 0,85 L 45,85 L 45,60 L 80,60 L 80,95 L 120,95 L 120,50 L 150,50 L 150,80 L 210,80 L 210,40 L 240,40 L 240,90 L 320,90 L 320,70 L 370,70 L 370,100 L 450,100 L 450,55 L 480,55 L 480,85 L 560,85 L 560,45 L 590,45 L 610,30 L 630,45 L 630,90 L 720,90 L 720,65 L 770,65 L 770,95 L 850,95 L 850,40 L 890,40 L 890,80 L 980,80 L 980,55 L 1020,55 L 1020,90 L 1100,90 L 1100,60 L 1150,60 L 1150,85 L 1200,85 L 1200,120 Z" fill="#070d1e" />
          <line x1="610" y1="30" x2="610" y2="5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          <circle cx="610" cy="5" r="2" fill="#ef4444" className="animate-pulse" />
          <line x1="225" y1="40" x2="225" y2="15" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
          <circle cx="225" cy="15" r="1.5" fill="#ef4444" className="animate-pulse" />
          <line x1="870" y1="40" x2="870" y2="12" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
          <circle cx="870" cy="12" r="1.5" fill="#ef4444" className="animate-pulse" />
        </svg>

        {/* Digital Grid Horizon */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(245, 158, 11, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* ======================================================== */}
        {/* CYBER HACKER WORKSTATION / TERMINAL RIG IN BACKDROP */}
        {/* ======================================================== */}
        <div className="absolute top-[4%] sm:top-[6%] lg:top-[8%] right-[2%] sm:right-[5%] lg:right-[5%] pointer-events-none opacity-85 sm:opacity-95 flex flex-col items-center z-0 animate-hacker-glow">
          
          {/* Cyber Terminal Multi-Monitor Glow Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] bg-emerald-500/20 rounded-full blur-[90px]" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-56 bg-sky-500/15 rounded-full blur-[70px]" />
          
          <svg className="w-72 sm:w-80 lg:w-96 h-64 lg:h-72 drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hackerScreenBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#061c13" />
                <stop offset="100%" stopColor="#020d08" />
              </linearGradient>
              <linearGradient id="hackerHoodie" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="terminalCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082233" />
                <stop offset="100%" stopColor="#020f18" />
              </linearGradient>
            </defs>

            {/* --- MULTI-MONITOR RIG --- */}
            {/* Monitor 1 (Left Angled) */}
            <g transform="translate(15, 30) rotate(-6)">
              <rect x="0" y="0" width="75" height="55" rx="3" fill="url(#terminalCyan)" stroke="#0ea5e9" strokeWidth="1.2" />
              <rect x="4" y="4" width="67" height="47" fill="#03111b" />
              <circle cx="20" cy="18" r="3" fill="#38bdf8" />
              <circle cx="50" cy="15" r="2.5" fill="#ef4444" />
              <circle cx="38" cy="38" r="3.5" fill="#22c55e" />
              <line x1="20" y1="18" x2="38" y2="38" stroke="#22c55e" strokeWidth="0.8" />
              <line x1="50" y1="15" x2="38" y2="38" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 1" />
              <text x="6" y="48" fill="#38bdf8" fontSize="4.5" fontFamily="monospace" fontWeight="bold">INTERCEPT: ACTIVE</text>
              <rect x="32" y="55" width="10" height="12" fill="#090d16" />
            </g>

            {/* Monitor 2 (Center Main) */}
            <g transform="translate(100, 15)">
              <rect x="0" y="0" width="105" height="75" rx="4" fill="url(#hackerScreenBg)" stroke="#10b981" strokeWidth="1.5" />
              <rect x="5" y="5" width="95" height="65" rx="2" fill="#031109" />
              <rect x="5" y="5" width="95" height="9" fill="#082d1c" />
              <circle cx="11" cy="9.5" r="1.5" fill="#ef4444" />
              <circle cx="16" cy="9.5" r="1.5" fill="#f59e0b" />
              <circle cx="21" cy="9.5" r="1.5" fill="#22c55e" />
              <text x="32" y="11.5" fill="#6ee7b7" fontSize="4.5" fontFamily="monospace" fontWeight="bold">bash - root@shadow-c2:~#</text>
              <text x="10" y="22" fill="#34d399" fontSize="4" fontFamily="monospace" fontWeight="bold">&gt; ./breach_gateway --bns-auth</text>
              <text x="10" y="29" fill="#6ee7b7" fontSize="3.5" fontFamily="monospace">0x7F 0x45 0x4C 0x46 [INJECTED]</text>
              <text x="10" y="36" fill="#10b981" fontSize="3.5" fontFamily="monospace">Bypassing SSL Pinning... OK</text>
              <text x="10" y="43" fill="#a7f3d0" fontSize="3.5" fontFamily="monospace">CRIMEGPT EVIDENCE STREAM: LIVE</text>
              <text x="10" y="52" fill="#4ade80" fontSize="4" fontFamily="monospace" fontWeight="bold">&gt; root@shadow:~# _</text>
              <rect x="47" y="75" width="12" height="18" fill="#090d16" />
            </g>

            {/* Monitor 3 (Right Angled) */}
            <g transform="translate(215, 28) rotate(7)">
              <rect x="0" y="0" width="75" height="55" rx="3" fill="url(#hackerScreenBg)" stroke="#22c55e" strokeWidth="1.2" />
              <rect x="4" y="4" width="67" height="47" fill="#031109" />
              <text x="8" y="14" fill="#34d399" fontSize="4" fontFamily="monospace" fontWeight="bold">1011001 01</text>
              <text x="8" y="22" fill="#6ee7b7" fontSize="4" fontFamily="monospace" fontWeight="bold">0100110 11</text>
              <text x="8" y="30" fill="#10b981" fontSize="4" fontFamily="monospace" fontWeight="bold">KEY: 0x9A4F</text>
              <text x="8" y="40" fill="#a7f3d0" fontSize="4.5" fontFamily="monospace" fontWeight="bold">PORT 443 ON</text>
              <rect x="32" y="55" width="10" height="12" fill="#090d16" />
            </g>

            {/* Hooded Cyber Hacker Silhouette */}
            <rect x="30" y="145" width="245" height="8" fill="#0a0f1d" stroke="#334155" strokeWidth="1" />
            <rect x="110" y="142" width="70" height="4" fill="#1e293b" stroke="#10b981" strokeWidth="0.5" />
            <g transform="translate(90, 85)">
              <path d="M -15 110 C -5 65 20 50 45 48 C 65 48 95 65 105 110 Z" fill="url(#hackerHoodie)" stroke="#334155" strokeWidth="1" />
              <path d="M 22 45 C 22 20 32 8 45 8 C 58 8 68 20 68 45 C 68 55 58 60 45 60 C 32 60 22 55 22 45 Z" fill="url(#hackerHoodie)" stroke="#475569" strokeWidth="1.2" />
              <path d="M 28 42 C 28 26 36 17 45 17 C 54 17 62 26 62 42 C 60 48 52 52 45 52 C 38 52 30 48 28 42 Z" fill="#020617" />
              <ellipse cx="45" cy="40" rx="9" ry="7" fill="#10b981" opacity="0.4" filter="blur(2.5px)" />
              <ellipse cx="28" cy="98" rx="8" ry="4" fill="#334155" />
              <ellipse cx="62" cy="98" rx="8" ry="4" fill="#334155" />
            </g>
          </svg>

          <div className="flex items-center gap-2 -mt-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide">OPERATOR: SHADOW_NODE // ACTIVE INTERCEPT</span>
          </div>
        </div>

        {/* Tactical Telemetry Overlays */}
        <div className="absolute top-5 left-6 flex items-center gap-3 text-[10px] font-mono text-slate-500 pointer-events-none tracking-widest hidden md:flex">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CYBER INTERCEPT // POLICE PATROL RADAR ACTIVE // BNS ENFORCEMENT</span>
        </div>

        <div className="absolute top-5 right-6 text-[10px] font-mono text-slate-500 pointer-events-none tracking-wider hidden md:flex items-center gap-2">
          <span className="text-amber-400/80">LAT: 23.0225° N, 72.5714° E</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400/80">LIVE CYBER PATROL</span>
        </div>
      </div>

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

          {/* Minimal, Punchy Headline with Prominent Police Cruiser Beside It */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-[#0a1020]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xl shadow-black/40">
            
            {/* Subtle Police Emergency Beacon Ambient Glow across header container */}
            <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-8 right-12 w-48 h-20 animate-police-ground blur-2xl pointer-events-none" />

            {/* Left side: Text */}
            <div className="space-y-2 max-w-sm">
              <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-black text-white leading-[1.08] tracking-tight font-sans">
                Smart Policing.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                  Faster Justice.
                </span>
              </h2>
              
              {/* Amber Theme Accent Line */}
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm" />

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Turn raw crime reports into courtroom-ready evidence with instant statutory BNS mapping and secure chain of custody.
              </p>
            </div>

            {/* Right side: High-Visibility Police Car with Blinking Red & Green Lights */}
            <div className="flex flex-col items-center shrink-0 self-center sm:self-auto relative group">
              
              {/* Ground flash */}
              <div className="absolute -bottom-2 w-44 h-8 rounded-full animate-police-ground blur-lg pointer-events-none" />

              {/* Headlight beam */}
              <div 
                className="absolute top-6 -right-16 w-36 h-12 opacity-35 pointer-events-none hidden sm:block"
                style={{
                  background: 'radial-gradient(ellipse at left, rgba(254, 240, 138, 0.5) 0%, rgba(254, 240, 138, 0.1) 40%, transparent 80%)',
                  transform: 'rotate(-4deg)'
                }}
              />

              {/* Police Interceptor Vector */}
              <svg className="w-44 sm:w-48 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="carBodyDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="60%" stopColor="#0b1120" />
                    <stop offset="100%" stopColor="#030712" />
                  </linearGradient>
                  <linearGradient id="carWhiteDoor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <linearGradient id="windshieldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#030712" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Ground Shadow */}
                <ellipse cx="110" cy="98" rx="90" ry="7" fill="#000000" opacity="0.85" />

                {/* Car Roof & Body */}
                <path d="M 50 62 L 72 38 L 138 38 L 165 62 L 195 65 L 205 76 L 205 86 L 25 86 L 25 76 L 38 65 Z" fill="url(#carBodyDark)" stroke="#475569" strokeWidth="1.2" />
                
                {/* Windshield */}
                <path d="M 74 41 L 136 41 L 158 61 L 60 61 Z" fill="url(#windshieldGlass)" stroke="#1e293b" strokeWidth="1" />
                <line x1="105" y1="41" x2="105" y2="61" stroke="#0f172a" strokeWidth="2.5" />

                {/* White Law Enforcement Door */}
                <path d="M 76 62 L 140 62 L 138 82 L 74 82 Z" fill="url(#carWhiteDoor)" opacity="0.9" />
                <text x="107" y="73.5" textAnchor="middle" fill="#090d16" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">POLICE</text>
                <text x="107" y="79.5" textAnchor="middle" fill="#1e293b" fontSize="4.2" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">CYBER UNIT</text>

                {/* Front Bumper & Bull Bar */}
                <path d="M 200 68 L 210 68 L 210 88 L 200 88 Z" fill="#090d16" stroke="#475569" strokeWidth="1" />
                <line x1="205" y1="64" x2="205" y2="92" stroke="#94a3b8" strokeWidth="2" />
                <line x1="198" y1="74" x2="212" y2="74" stroke="#64748b" strokeWidth="1.5" />

                {/* Front Headlight with glow */}
                <polygon points="198,66 205,66 204,74 196,73" fill="#fef08a" opacity="0.95" />
                <circle cx="202" cy="70" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #fef08a)" />

                {/* Rear Red Light */}
                <polygon points="25,68 30,68 29,74 25,74" fill="#ef4444" opacity="0.9" />

                {/* Wheels & Rims */}
                <g transform="translate(55, 86)">
                  <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#334155" strokeWidth="2" />
                  <circle cx="0" cy="0" r="7" fill="#475569" />
                  <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
                </g>
                <g transform="translate(168, 86)">
                  <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#334155" strokeWidth="2" />
                  <circle cx="0" cy="0" r="7" fill="#475569" />
                  <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
                </g>

                {/* Lightbar Base Mount */}
                <rect x="92" y="34" width="26" height="4" fill="#0f172a" rx="1" stroke="#334155" strokeWidth="0.5" />

                {/* =================================================== */}
                {/* EMERGENCY LIGHTBAR: BLINKING RED (LEFT) & GREEN (RIGHT) */}
                {/* =================================================== */}
                {/* RED STROBE LIGHT */}
                <g className="animate-strobe-red">
                  <rect x="94" y="31" width="10" height="5" fill="#ef4444" rx="1.5" />
                  <circle cx="99" cy="33.5" r="4" fill="#ffffff" opacity="0.95" />
                  <circle cx="99" cy="33.5" r="12" fill="#ef4444" opacity="0.4" filter="blur(3px)" />
                  <circle cx="99" cy="33.5" r="24" fill="#dc2626" opacity="0.2" filter="blur(6px)" />
                </g>

                {/* Spacer */}
                <rect x="104" y="31" width="2" height="5" fill="#1e293b" />

                {/* GREEN STROBE LIGHT */}
                <g className="animate-strobe-green">
                  <rect x="106" y="31" width="10" height="5" fill="#22c55e" rx="1.5" />
                  <circle cx="111" cy="33.5" r="4" fill="#ffffff" opacity="0.95" />
                  <circle cx="111" cy="33.5" r="12" fill="#22c55e" opacity="0.4" filter="blur(3px)" />
                  <circle cx="111" cy="33.5" r="24" fill="#16a34a" opacity="0.2" filter="blur(6px)" />
                </g>
              </svg>

              {/* Status Badge beneath the car */}
              <div className="flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700/80 text-[9px] font-mono text-slate-300 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">UNIT-04</span>
                <span className="text-slate-500">|</span>
                <span>CYBER PATROL</span>
              </div>
            </div>

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
          
          <div className="bg-[#090f1d]/35 border border-white/15 hover:border-emerald-500/40 rounded-2xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.75)] backdrop-blur-md space-y-4 relative overflow-hidden transition-all">
            
            {/* Ambient Glass Highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                  Officer Sign-In
                </h2>
                <p className="text-xs text-slate-300 font-sans">
                  Select authentication method to access criminal intel.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold backdrop-blur-sm">
                SSO READY
              </span>
            </div>

            {/* Active Session State */}
            {userProfile ? (
              <div className="bg-[#070b14]/45 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/40 space-y-3">
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
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#070b14]/45 backdrop-blur-sm rounded-xl border border-slate-700/50">
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
                        className="w-full bg-[#070b14]/50 backdrop-blur-sm border border-slate-700/70 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-[#070b14]/75 font-mono uppercase tracking-wider transition-colors"
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
                          className="w-full bg-[#070b14]/50 backdrop-blur-sm border border-slate-700/70 rounded-xl px-3 pr-9 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-[#070b14]/75 font-mono transition-colors"
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
                          className="w-full p-2.5 bg-[#070b14]/45 backdrop-blur-sm hover:bg-[#0d1627]/70 border border-slate-800/80 hover:border-amber-500/40 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
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
                        className="w-full bg-[#070b14]/50 backdrop-blur-sm border border-slate-700/70 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-[#070b14]/75 font-mono transition-colors"
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
                        className="w-full bg-[#070b14]/50 backdrop-blur-sm border border-slate-700/70 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-[#070b14]/75 font-mono transition-colors"
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
                    <div className="p-4 bg-[#070b14]/45 backdrop-blur-sm rounded-xl border border-slate-800/80 flex flex-col items-center gap-2.5">
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
                  <div className="flex-grow border-t border-slate-700/50" />
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">OR</span>
                  <div className="flex-grow border-t border-slate-700/50" />
                </div>

                {/* Explore Live Demo Button */}
                {onContinueAsGuest && (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={onContinueAsGuest}
                      className="w-full py-2 px-3.5 bg-slate-900/45 backdrop-blur-sm hover:bg-slate-800/70 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm group active:scale-[0.99]"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Explore Live Demo</span>
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
