/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  Layers,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import {
  ChatMessage,
  FlashcardItem,
  QuizQuestion,
  StudySession,
  StudyTab,
} from "./types";
import { SAMPLE_SESSIONS } from "./data/sampleSessions";
import { SourceInputModal } from "./components/SourceInputModal";
import { NotesView } from "./components/NotesView";
import { FlashcardsView } from "./components/FlashcardsView";
import { QuizView } from "./components/QuizView";
import { TutorChatView } from "./components/TutorChatView";

const STORAGE_KEY = "bilimstudio_sessions_v1";

export default function App() {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to sample sessions
    }
    return SAMPLE_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => sessions[0]?.id || SAMPLE_SESSIONS[0].id
  );
  const [activeTab, setActiveTab] = useState<StudyTab>("notes");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore storage quota errors caused by large cached audio
    }
  }, [sessions]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sourceLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionCreated = (newSession: StudySession) => {
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setActiveTab("notes");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id && remaining[0]) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleUpdateFlashcards = (sessionId: string, cards: FlashcardItem[]) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, flashcards: cards } : s))
    );
  };

  const handleUpdateQuiz = (
    sessionId: string,
    questions: QuizQuestion[],
    score?: { correct: number; total: number }
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              quiz: questions,
              lastQuizScore: score || s.lastQuizScore,
            }
          : s
      )
    );
  };

  const handleUpdateChatHistory = (
    sessionId: string,
    messages: ChatMessage[]
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, chatHistory: messages } : s
      )
    );
  };

  const handleCacheAudioSummary = (sessionId: string, audioBase64: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, audioSummaryBase64: audioBase64 } : s
      )
    );
  };

  const sourceTypeNameMap: Record<string, string> = {
    text: "Matn",
    pdf: "PDF Hujjat",
    audio: "Ovozli ma'ruza",
    url: "Veb-maqola",
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/90 bg-[#0B0F19]/95 sticky top-0 z-30 backdrop-blur-md">
        {/* Zone 1: Single text element Brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("notes");
          }}
          className="text-xl font-bold tracking-tight text-slate-100 font-display whitespace-nowrap shrink-0"
        >
          BilimStudio
        </a>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "notes"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-100"
            }`}
          >
            Konspekt va Lug'at
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flashcards")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "flashcards"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-100"
            }`}
          >
            Flesh-kartochkalar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "quiz"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-100"
            }`}
          >
            Test Sinovi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tutor")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "tutor"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-100"
            }`}
          >
            AI Ustoz
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Konspekt</span>
          </button>
        </div>
      </header>

      {/* Main 1440px Workspace Layout */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar: Saved Study Sessions Library */}
        <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-5 space-y-5 bg-[#0B0F19]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 font-display">
              O'quv Kutubxonasi
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {sessions.length} ta darslik
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Konspektlarni qidirish..."
              className="w-full pl-9 pr-3 py-2 bg-[#111827] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Session List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredSessions.map((item) => {
              const isSelected = item.id === activeSession?.id;
              const masteredCards = item.flashcards.filter(
                (c) => c.status === "mastered"
              ).length;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveSessionId(item.id)}
                  className={`group p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#111827] border-sky-500/50"
                      : "bg-[#111827]/40 border-slate-800/70 hover:bg-[#111827] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-medium leading-snug ${
                        isSelected ? "text-sky-300" : "text-slate-200"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(item.id, e)}
                        aria-label="Konspektni o'chirish"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Unboxed clean metadata with middle dot separator */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-mono tabular-nums">
                    <span>{sourceTypeNameMap[item.sourceType] || "Manba"}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readingTimeMinutes} daq</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {masteredCards}/{item.flashcards.length} karta
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Source Card */}
          <div className="p-4 bg-[#111827]/70 border border-slate-800/90 rounded-xl space-y-2.5">
            <div className="text-xs font-medium text-slate-200">
              Yangi mavzuni o'rganmoqchimisiz?
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maqola matni, PDF kitob, mikrofon orqali ovozli ma'ruza yoki veb-havolani yuklang.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              + Manba yuklash oynasini ochish
            </button>
          </div>
        </aside>

        {/* Right Main Stage */}
        <main className="lg:col-span-9 p-6 lg:p-8 space-y-6">
          {activeSession && (
            <>
              {/* Active Session Header */}
              <div className="pb-6 border-b border-slate-800/90 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{sourceTypeNameMap[activeSession.sourceType]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSession.sourceLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSession.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {activeSession.readingTimeMinutes} daqiqalik mutolaa
                  </span>
                  {activeSession.lastQuizScore && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-mono tabular-nums">
                        Oxirgi test: {activeSession.lastQuizScore.correct}/
                        {activeSession.lastQuizScore.total}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight">
                  {activeSession.title}
                </h1>

                {/* Mobile & Workspace Segmented Mode Switcher */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#111827] border border-slate-800 rounded-lg w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === "notes"
                        ? "bg-slate-800 text-sky-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Konspekt va Lug'at</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("flashcards")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                      activeTab === "flashcards"
                        ? "bg-slate-800 text-sky-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Flesh-kartochkalar ({activeSession.flashcards.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("quiz")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                      activeTab === "quiz"
                        ? "bg-slate-800 text-sky-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Test Sinovi ({activeSession.quiz.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tutor")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === "tutor"
                        ? "bg-slate-800 text-sky-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>AI Ustoz Chati</span>
                  </button>
                </div>
              </div>

              {/* Active Study Tool View */}
              {activeTab === "notes" && (
                <NotesView
                  session={activeSession}
                  onCacheAudioSummary={handleCacheAudioSummary}
                />
              )}

              {activeTab === "flashcards" && (
                <FlashcardsView
                  session={activeSession}
                  onUpdateFlashcards={handleUpdateFlashcards}
                />
              )}

              {activeTab === "quiz" && (
                <QuizView
                  session={activeSession}
                  onUpdateQuiz={handleUpdateQuiz}
                />
              )}

              {activeTab === "tutor" && (
                <TutorChatView
                  session={activeSession}
                  onUpdateChatHistory={handleUpdateChatHistory}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal for Adding New Study Source */}
      <SourceInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  );
}
