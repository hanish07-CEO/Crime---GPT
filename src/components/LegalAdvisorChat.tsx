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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll the internal chat container, never scroll the outer window
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const textToSend = inputText.trim();
    setInputText("");
    onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isSending) {
        handleSubmit(e);
      }
    }
  };

  const handlePresetClick = (query: string) => {
    if (isSending) return;
    onSendMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-900 rounded-lg overflow-hidden relative">
      {/* Header bar */}
      <div className="bg-slate-900/90 p-3 sm:p-4 border-b border-slate-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-amber-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-white font-sans">CrimeGPT AI Legal Advisor</h2>
              <span className="text-[8.5px] sm:text-[9px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            {caseTitle && (
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>ACTIVE CASE:</span>
                <span className="text-amber-400 font-bold truncate max-w-[150px] sm:max-w-xs">{caseTitle}</span>
                {incidentType && <span className="text-slate-500 hidden sm:inline">({incidentType})</span>}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClearChat}
          className="text-[10px] text-slate-400 hover:text-white px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/80 font-mono cursor-pointer"
        >
          Clear Chat
        </button>
      </div>

      {/* Advisory Note */}
      <div className="bg-amber-500/5 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-amber-500/10 flex items-start gap-2 shrink-0">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-sans leading-relaxed">
          <strong className="text-amber-500">Statutory Assistant:</strong> AI synthesis of criminal codes, Fourth/Fifth Amendment standards, and investigative protocols.
        </p>
      </div>

      {/* Message Feed */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 min-h-0 tactical-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-3 sm:p-6 space-y-3.5">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <Bot className="h-8 w-8 text-amber-400 stroke-[1.5]" />
            </div>
            <div className="max-w-md">
              <h3 className="text-sm font-semibold text-slate-200 font-sans">AI Legal Intelligence Assistant</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                Ask any question regarding penal codes (IPC/BNS/US Codes), search warrant requirements, chain of custody, or cross-examination questions.
              </p>
            </div>
            
            <div className="w-full max-w-sm mt-2 text-left">
              <span className="text-[9.5px] font-mono tracking-wider text-slate-500 uppercase px-1">Quick Inquiries</span>
              <div className="grid grid-cols-1 gap-1.5 mt-1.5">
                {PRESET_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(q)}
                    className="text-left text-[11px] sm:text-xs bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded-lg hover:bg-slate-850 transition-colors text-slate-300 cursor-pointer active:scale-[0.99] flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <CornerDownLeft className="h-3 w-3 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-2.5 max-w-[90%] sm:max-w-2xl ${isUser ? "ml-auto" : "mr-auto"}`}>
                <div className={`p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full shrink-0 flex items-center justify-center ${
                  isUser ? "bg-amber-500/10 border border-amber-500/20 text-amber-500" : "bg-slate-800 border border-slate-700 text-cyan-400"
                }`}>
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`px-3.5 py-2.5 rounded-xl text-[11.5px] sm:text-xs leading-relaxed border ${
                    isUser 
                      ? "bg-amber-500/10 text-amber-100 border-amber-500/30 rounded-tr-none" 
                      : "bg-slate-900 text-slate-200 border-slate-800 rounded-tl-none whitespace-pre-wrap"
                  }`}>
                    {m.content}
                  </div>
                  <span className="text-[8.5px] sm:text-[9px] font-mono text-slate-500 mt-1">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-2.5 mr-auto items-center">
            <div className="p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 text-amber-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-slate-400">CrimeGPT is analyzing legal statutes...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-2.5 sm:p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          enterKeyHint="send"
          autoComplete="off"
          placeholder="Ask penal codes, legal precedents, or interview strategies..."
          disabled={isSending}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm sm:text-xs text-white focus:outline-none focus:border-amber-500 font-sans tracking-wide placeholder:text-slate-500 disabled:opacity-50 min-h-[42px]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 px-3.5 sm:px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[42px]"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Consult</span>
        </button>
      </form>
    </div>
  );
}
