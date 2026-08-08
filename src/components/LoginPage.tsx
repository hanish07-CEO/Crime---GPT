import React, { useState } from "react";
import { Shield, Lock, UserCheck, AlertTriangle, Fingerprint, LogIn, Key, Mail, Building, BadgeCheck, Loader2 } from "lucide-react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginPageProps {
  onLoginSuccess: (userProfile: any) => void;
  onContinueAsGuest?: () => void;
  userProfile?: any;
  onSignOut?: () => void;
}

export default function LoginPage({ onLoginSuccess, onContinueAsGuest, userProfile, onSignOut }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<"signin" | "register" | "badge">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("DS-2948");
  const [officerName, setOfficerName] = useState("Det. Jane Miller");
  const [department, setDepartment] = useState("Special Investigations Division");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const syncUserToFirestore = async (user: any, customData?: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const profileData = {
        uid: user.uid,
        email: user.email || `${badgeNumber.toLowerCase()}@metro.pd`,
        displayName: customData?.displayName || user.displayName || officerName || "Detective",
        badgeNumber: customData?.badgeNumber || badgeNumber || "DS-2948",
        department: customData?.department || department || "Special Investigations Division",
        clearanceLevel: "Level 4 - Top Secret / CJIS",
        updatedAt: new Date().toISOString(),
        ...(docSnap.exists() ? {} : { createdAt: new Date().toISOString() })
      };

      await setDoc(userRef, profileData, { merge: true });
      return profileData;
    } catch (err) {
      console.warn("Firestore sync warning:", err);
      return {
        uid: user.uid,
        email: user.email || `${badgeNumber}@metro.pd`,
        displayName: user.displayName || officerName,
        badgeNumber,
        department,
        clearanceLevel: "Level 4 - Top Secret / CJIS"
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
      setErrorMsg(err.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeQuickLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Demo officer quick login with synthetic user saved in Firestore
      const mockUid = `badge_${badgeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      const mockUser = {
        uid: mockUid,
        email: `${badgeNumber.toLowerCase()}@metropolice.gov`,
        displayName: officerName
      };
      const profile = await syncUserToFirestore(mockUser, {
        displayName: officerName,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans overflow-hidden">
      
      {/* Background Subtle Tactical Visual Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      {/* Classification Header Banner */}
      <div className="fixed top-0 left-0 right-0 bg-amber-500 text-slate-950 px-4 py-1 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase border-b border-amber-600 z-10 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
          <span>CRIMEGPT INTEL PORTAL // RESTRICTED ACCESS LAW ENFORCEMENT SYSTEM</span>
        </div>
        <div className="hidden sm:block">CJIS SECURITY POLICY v5.9</div>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6 my-12">
        
        {/* Logo and App Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/30 text-amber-500 shadow-lg shadow-amber-500/10 mb-1">
            <Shield className="h-10 w-10 stroke-[1.75]" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white font-mono uppercase">
            Crime<span className="text-amber-500">GPT</span>
          </h1>
          <p className="text-xs text-amber-400 font-mono font-bold uppercase tracking-widest">
            OFFICER CREDENTIAL & DATABASE LOGIN
          </p>
          <p className="text-[11px] text-slate-400">
            Authenticated via Google Workspace & Firebase Cloud Infrastructure
          </p>
        </div>

        {userProfile ? (
          /* Active Officer Authenticated Card */
          <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/40 space-y-4 shadow-xl">
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
                <span className="text-slate-200 font-bold">{userProfile.displayName || "Detective"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BADGE ID:</span>
                <span className="text-amber-400 font-bold">{userProfile.badgeNumber || "DS-2948"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DEPARTMENT:</span>
                <span className="text-slate-300">{userProfile.department || "Special Investigations"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DATABASE:</span>
                <span className="text-emerald-400 font-semibold">Google Firestore Live Sync</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>PROCEED TO INTEL WORKSPACE</span>
                <UserCheck className="h-4 w-4" />
              </button>

              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-red-400 font-mono text-xs rounded-lg border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Sign Out Officer Account</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setAuthMode("signin"); setErrorMsg(""); }}
            className={`py-2 rounded-lg font-bold transition-all ${
              authMode === "signin"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Google / Email
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("badge"); setErrorMsg(""); }}
            className={`py-2 rounded-lg font-bold transition-all ${
              authMode === "badge"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Badge ID
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
            className={`py-2 rounded-lg font-bold transition-all ${
              authMode === "register"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-lg text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google One-Click Login Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl border border-slate-600 hover:border-amber-500 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>SIGN IN WITH GOOGLE FRAMEWORK</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">Or Police Credentials</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>
        </div>

        {/* Email / Badge Form */}
        {authMode === "badge" ? (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-amber-400 font-bold uppercase mb-1">
                Badge / Officer Serial ID
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  placeholder="DS-2948"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Officer Full Name & Rank
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="Det. Jane Miller"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Department / Squad
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="Special Investigations Division"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBadgeQuickLogin}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              ) : (
                <Fingerprint className="h-4 w-4" />
              )}
              <span>AUTHENTICATE OFFICER BADGE</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Official Department Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="officer.miller@metropolice.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Security Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {authMode === "register" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Officer Badge ID
                  </label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{authMode === "register" ? "REGISTER NEW OFFICER ACCOUNT" : "SIGN IN TO CRIMEGPT CORE"}</span>
            </button>
          </form>
        )}
        </>
        )}

        {/* Guest / Fast Preview Access Option */}
        {onContinueAsGuest && (
          <div className="text-center pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-[11px] font-mono text-slate-400 hover:text-amber-400 transition-colors underline cursor-pointer"
            >
              Continue as Guest / Demo Mode
            </button>
          </div>
        )}

        <p className="text-[9.5px] text-slate-500 text-center font-mono leading-tight">
          System activity is recorded under CJIS Audit Policy. Authorized precinct usage only.
        </p>

      </div>
    </div>
  );
}
