import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Trash2, GraduationCap } from "lucide-react";
import { ChatMessage, StudySession } from "../types";

interface TutorChatViewProps {
  session: StudySession;
  onUpdateChatHistory: (sessionId: string, messages: ChatMessage[]) => void;
}

const QUICK_PROMPTS = [
  "Mavzuning eng qiyin qismini oddiy hayotiy misol bilan tushuntirib ber",
  "Ushbu konspekt bo'yicha menga 1 ta og'zaki imtihon savoli ber",
  "Asosiy formulalar va qoidalarni qisqa ro'yxat qilib ber",
  "Mavzudagi eng ko'p adashiladigan tushunchalar qaysilar?",
];

export const TutorChatView: React.FC<TutorChatViewProps> = ({
  session,
  onUpdateChatHistory,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.chatHistory.length, isLoading]);

  const handleSendMessage = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const now = new Date();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: now.toTimeString().slice(0, 5),
    };

    const updatedHistory = [...session.chatHistory, userMessage];
    onUpdateChatHistory(session.id, updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const detailsContext = [
        ...session.summary.sections.map(
          (s) => `${s.heading}: ${s.content} (${s.keyFormulaOrInsight})`
        ),
        ...session.summary.glossary.map((g) => `${g.term}: ${g.definition}`),
      ].join("\n");

      const response = await fetch("/api/study/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          history: session.chatHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          studyContext: {
            title: session.title,
            overview: session.summary.overview,
            details: detailsContext,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Javob olishda xatolik");
      }

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date().toTimeString().slice(0, 5),
      };

      onUpdateChatHistory(session.id, [...updatedHistory, modelMessage]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `Xatolik yuz berdi: ${err.message || "Server bilan aloqa uzildi."}`,
        timestamp: new Date().toTimeString().slice(0, 5),
      };
      onUpdateChatHistory(session.id, [...updatedHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const resetMessage: ChatMessage = {
      id: `msg-reset-${Date.now()}`,
      role: "model",
      text: `Muloqot tozalandi. **${session.title}** mavzusi bo'yicha yangi savolingizni berishingiz mumkin.`,
      timestamp: new Date().toTimeString().slice(0, 5),
    };
    onUpdateChatHistory(session.id, [resetMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800/90 rounded-xl overflow-hidden flex flex-col h-[680px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/15 border border-sky-500/30 rounded-lg text-sky-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 font-display">
              AI Ustoz Bilan Savol-Javob
            </h2>
            <p className="text-xs text-slate-400 truncate max-w-md">
              Mavzu: {session.title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Suhbatni tozalash</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-3 border-b border-slate-800/70 bg-[#0B0F19]/20 flex items-center gap-2 overflow-x-auto">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {session.chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[82%] p-4 rounded-xl text-sm leading-relaxed space-y-2 ${
                msg.role === "user"
                  ? "bg-sky-500 text-slate-950 font-medium"
                  : "bg-[#0B0F19] border border-slate-800 text-slate-200"
              }`}
            >
              {msg.text.split("\n").map((line, i) => (
                <p key={i} className="min-h-[1rem]">
                  {line}
                </p>
              ))}
            </div>
            <span className="text-[11px] font-mono tabular-nums text-slate-500 mt-1 px-1">
              {msg.role === "user" ? "Siz" : "AI Ustoz"} · {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-4 bg-[#0B0F19] border border-slate-800 rounded-xl w-fit text-xs text-slate-300">
            <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
            <span>AI Ustoz javob yozmoqda...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 border-t border-slate-800 bg-[#0B0F19]/60 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Darslik bo'yicha tushunmagan savolingizni yozing..."
          className="flex-1 px-4 py-2.5 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Yuborish</span>
        </button>
      </form>
    </div>
  );
};
