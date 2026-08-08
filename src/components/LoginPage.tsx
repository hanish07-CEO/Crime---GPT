import React, { useState } from "react";
import { Lock, Eye, ShieldCheck, AlertTriangle, Fingerprint, LogIn, Key, Mail, Building, BadgeCheck, Loader2, Globe, FileCode2 } from "lucide-react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginPageProps {
  onLoginSuccess: (userProfile: any) => void;
  onContinueAsGuest?: () => void;
  userProfile?: any;
  onSignOut?: () => void;
  onOpenSolutionDoc?: () => void;
}

export default function LoginPage({ onLoginSuccess, onContinueAsGuest, userProfile, onSignOut, onOpenSolutionDoc }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<"badge" | "email" | "register">("badge");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("AHM-2024-IO-047");
  const [officerName, setOfficerName] = useState("Det. Officer / Inspector");
  const [department, setDepartment] = useState("Gujarat Police Cyber Crime Branch");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const syncUserToFirestore = async (user: any, customData?: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const profileData = {
        uid: user.uid,
        email: user.email || `${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}@metropolice.gov`,
        displayName: customData?.displayName || user.displayName || officerName || "Officer",
        badgeNumber: customData?.badgeNumber || badgeNumber || "AHM-2024-IO-047",
        department: customData?.department || department || "Gujarat Police Cyber Crime Branch",
        clearanceLevel: "Level 4 - Cyber Crime Unit / Top Secret",
        updatedAt: new Date().toISOString(),
        ...(docSnap.exists() ? {} : { createdAt: new Date().toISOString() })
      };

      await setDoc(userRef, profileData, { merge: true });
      return profileData;
    } catch (err) {
      console.warn("Firestore sync warning:", err);
      return {
        uid: user.uid,
        email: user.email || `${badgeNumber}@metropolice.gov`,
        displayName: user.displayName || officerName,
        badgeNumber,
        department,
        clearanceLevel: "Level 4 - Cyber Crime Unit"
      };
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserToFirestore(result.user);
      onLoginSuccess(profile);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setErrorMsg(err.message || "Failed to sign in with Google framework.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      let userCredential;
      if (authMode === "register") {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const profile = await syncUserToFirestore(userCredential.user, {
        displayName: officerName,
        badgeNumber,
        department
      });
      onLoginSuccess(profile);
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeNumber) {
      setErrorMsg("Please enter Officer Badge Number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const mockUid = `badge_${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      const mockUser = {
        uid: mockUid,
        email: `${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}@metropolice.gov`,
        displayName: officerName || "Officer " + badgeNumber
      };
      const profile = await syncUserToFirestore(mockUser, {
        displayName: officerName || "Officer " + badgeNumber,
        badgeNumber,
        department
      });
      onLoginSuccess(profile);
    } catch (err: any) {
      setErrorMsg("Failed to authenticate badge ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans overflow-hidden select-none">
      
      {/* Background Subtle Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Central Blue Glow Effect */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Main Login Container matching CrimeGPT-X visual design */}
      <div className="w-full max-w-[440px] bg-[#0c1322]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative z-10 space-y-5 my-8">
        
        {/* Futuristic Hexagon Logo with Radar Eye */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10 mb-1">
            <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5 12 2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 6a6 6 0 0 1 6 6" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            CrimeGPT-X
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-[0.25em] uppercase font-bold">
            POLICE INTELLIGENCE PLATFORM
          </p>

          {/* Secured Banner Badge */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secured · Gujarat Police Cyber Crime Branch</span>
            </div>
          </div>

          {/* Status Indicators Line */}
          <p className="text-[10px] text-cyan-500/80 font-mono tracking-wider pt-1">
            AUTH_MODULE: <span className="text-emerald-400">ONLINE</span> · ENCRYPTION: <span className="text-slate-300">AES-256</span> · NODE: <span className="text-slate-300">AHM-CCB-01</span>
          </p>
        </div>

        {userProfile ? (
          /* Authenticated State Card */
          <div className="bg-[#080d19] p-5 rounded-xl border border-emerald-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  OFFICER AUTHENTICATED
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">NAME:</span>
                <span className="text-slate-200 font-bold">{userProfile.displayName || "Officer"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BADGE ID:</span>
                <span className="text-cyan-400 font-bold">{userProfile.badgeNumber || "AHM-2024-IO-047"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DEPARTMENT:</span>
                <span className="text-slate-300">{userProfile.department || "Gujarat Police Cyber Crime"}</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ENTER CRIMEGPT-X PLATFORM</span>
                <ShieldCheck className="h-4 w-4" />
              </button>

              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-red-400 font-mono text-xs rounded-lg border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Sign Out Account</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Pills */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800/80 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => { setAuthMode("badge"); setErrorMsg(""); }}
                className={`py-1.5 rounded font-medium transition-all cursor-pointer ${
                  authMode === "badge"
                    ? "bg-blue-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Badge ID
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("email"); setErrorMsg(""); }}
                className={`py-1.5 rounded font-medium transition-all cursor-pointer ${
                  authMode === "email"
                    ? "bg-blue-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                className={`py-1.5 rounded font-medium transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-blue-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Register
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/80 border border-red-500/50 p-2.5 rounded-lg text-red-200 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Badge Login Form */}
            {authMode === "badge" && (
              <form onSubmit={handleBadgeLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Officer Badge Number
                  </label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    placeholder="AHM-2024-IO-047"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>Login to CrimeGPT-X</span>
                </button>
              </form>
            )}

            {/* Email Form */}
            {authMode === "email" && (
              <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="officer@gujaratpolice.gov.in"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  <span>Sign In with Email</span>
                </button>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign In via Google Workspace</span>
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {authMode === "register" && (
              <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Badge Number</label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                    placeholder="AHM-2024-IO-047"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                    placeholder="officer@gujaratpolice.gov.in"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                >
                  Create Officer Account
                </button>
              </form>
            )}

            {/* Department Footer Disclaimer */}
            <div className="text-center text-[11px] text-slate-400 space-y-0.5 pt-1">
              <p>Gujarat Police Department · Ahmedabad Cyber Crime Branch</p>
              <p className="text-slate-500 text-[10px]">Confidential — Unauthorized access is a cognizable offence</p>
            </div>

            {/* Administrator Info Note Box */}
            <div className="bg-[#080d18] border border-slate-800/80 p-2.5 rounded-lg text-center text-xs text-slate-400 font-sans">
              Need access? Contact your system administrator for credentials.
            </div>

            {/* Divider Line OR */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800/80" />
              <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">OR</span>
              <div className="flex-grow border-t border-slate-800/80" />
            </div>

            {/* Demo Button */}
            {onContinueAsGuest && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs rounded-lg border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md group"
                >
                  <Eye className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>View Demo</span>
                </button>

                <p className="text-[10.5px] text-slate-500 text-center leading-normal">
                  Explore a pre-loaded demo environment with sample cases, evidence, and AI analysis
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
