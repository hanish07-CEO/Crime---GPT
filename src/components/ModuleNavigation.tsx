import React from "react";
import { UserCheck, FileEdit, Cpu, FileCode2, ChevronRight, Shield, LogOut, Sparkles } from "lucide-react";

export type AppModule = "portal" | "dossier" | "workspace" | "solutionDocument";

interface ModuleNavProps {
  activeModule: string;
  setActiveModule: (module: "portal" | "dossier" | "workspace" | "solutionDocument") => void;
  userProfile: any;
  onSignOut: () => void;
  onOpenLoginModal: () => void;
}

export default function ModuleNavigation({
  activeModule,
  setActiveModule,
  userProfile,
  onSignOut,
  onOpenLoginModal
}: ModuleNavProps) {
  return (
    <div className="bg-slate-900 border-b border-amber-500/30 px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-xs font-mono shadow-md sticky top-0 z-30 overflow-x-auto scroller-none">
      
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-x-auto scroller-none py-0.5">
        
        {/* Step 1: Officer Portal */}
        <button
          onClick={() => setActiveModule("portal")}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold shrink-0 text-[11px] sm:text-xs ${
            activeModule === "portal"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">1. OFFICER PORTAL</span>
          <span className="sm:hidden">1. PORTAL</span>
          {userProfile && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 2: Incident Dossier Input */}
        <button
          onClick={() => setActiveModule("dossier")}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold shrink-0 text-[11px] sm:text-xs ${
            activeModule === "dossier"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <FileEdit className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">2. INCIDENT DOSSIER</span>
          <span className="sm:hidden">2. DOSSIER</span>
        </button>

        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 3: Intelligence Workspace */}
        <button
          onClick={() => setActiveModule("workspace")}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold shrink-0 text-[11px] sm:text-xs ${
            activeModule === "workspace"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">3. INTEL WORKSPACE</span>
          <span className="sm:hidden">3. INTEL</span>
        </button>

        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 4: Solution Document & Roadmap */}
        <button
          onClick={() => setActiveModule("solutionDocument")}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold shrink-0 text-[11px] sm:text-xs ${
            activeModule === "solutionDocument"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <FileCode2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">4. SOLUTION DOC & ROADMAP</span>
          <span className="sm:hidden">4. DOCS</span>
        </button>
      </div>

      {/* Officer Auth Info Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {userProfile ? (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 px-2 sm:px-3 py-1 rounded-lg border border-slate-800 text-[10px] sm:text-[11px]">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-amber-400 font-bold">{userProfile.badgeNumber || "ACTIVE"}</span>
            <span className="text-slate-400 hidden lg:inline">({userProfile.displayName || userProfile.email})</span>
            <button
              onClick={onSignOut}
              title="Sign Out Officer"
              className="ml-0.5 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLoginModal}
            className="px-2.5 sm:px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign In / Officer Badge</span>
            <span className="sm:hidden">Sign In</span>
          </button>
        )}
      </div>

    </div>
  );
}
