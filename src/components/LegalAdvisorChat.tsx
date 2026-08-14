import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Scale, CornerDownLeft, Bot, User, RefreshCw, AlertTriangle } from "lucide-react";

interface LegalAdvisorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  onClearChat: () => void;
  caseTitle?: string;
  incidentType?: string;
}

const PRESET_QUERIES = [
  "What is the standard 'plain view' doctrine threshold?",
  "What triggers the Terry v. Ohio stop and frisk rule?",
  "Draft interview questions for a commercial burglary suspect",
  "Explain elements required to satisfy Elder Abuse Prosecution"
];

export default function LegalAdvisorChat({
  messages,
  onSendMessage,
  isSending,
  onClearChat,
  caseTitle,
  incidentType
}: LegalAdvisorChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handlePresetClick = (query: string) => {
    if (isSending) return;
    onSendMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-900 rounded-lg overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-900/80 p-4 border-b border-slate-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-amber-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white font-sans">CrimeGPT AI Assistant</h2>
              <span className="text-[9px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ISOLATED CASE CHAT STREAM
              </span>
            </div>
            {caseTitle && (
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>ACTIVE DOSSIER:</span>
                <span className="text-amber-400 font-bold truncate max-w-xs">{caseTitle}</span>
                {incidentType && <span className="text-slate-500">({incidentType})</span>}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClearChat}
          className="text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 transition-colors border border-slate-800 font-mono cursor-pointer"
        >
          Clear Log For This Case
        </button>
      </div>

      {/* Advisory Note */}
      <div className="bg-amber-500/5 px-4 py-3 border-b border-amber-500/10 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
          <strong className="text-amber-500">Notice for Investigators & Counsel:</strong> CrimeGPT is an automated criminal investigation documentation assistant. Content is synthesized from publicly documented legal frameworks and does not represent absolute, certified personal legal representation. Verification of state-specific statutory changes is advised.
        </p>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Bot className="h-10 w-10 text-slate-600 stroke-[1.5]" />
            <div className="max-w-md">
              <h3 className="text-sm font-medium text-slate-300 font-sans">Legal Intelligence Terminal</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Consult on general constitutional law questions, criminal defense attack vectors, statutory element verification, or investigative interview strategies.
              </p>
            </div>
            
            <div className="w-full max-w-sm mt-4 text-left">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-1">Suggested inquiries</span>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {PRESET_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(q)}
                    className="text-left text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 p-2.5 rounded hover:bg-slate-900 transition-colors text-slate-300 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 max-w-2xl ${isUser ? "ml-auto" : "mr-auto"}`}>
                <div className={`p-2 h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${
                  isUser ? "bg-amber-500/10 border border-amber-500/20 text-amber-500" : "bg-slate-800 border border-slate-700 text-slate-300"
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-lg text-xs leading-relaxed text-slate-200 border ${
                    isUser 
                      ? "bg-slate-900 border-slate-800 rounded-tr-none" 
                      : "bg-slate-900/40 border-slate-900 rounded-tl-none whitespace-pre-wrap"
                  }`}>
                    {m.content}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="p-2 h-8 w-8 rounded-full shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-300">
              <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
            </div>
            <span className="text-xs font-mono text-slate-400">Consulting statutory records...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-900 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Consult CrimeGPT AI on penal codes, case law, or constitutional guidelines..."
          disabled={isSending}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans tracking-wide placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 px-4 py-2 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Consult</span>
        </button>
      </form>
    </div>
  );
}
