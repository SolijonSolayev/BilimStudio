import React, { useState, useEffect } from "react";
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  Clock,
  Lightbulb,
  Plus,
} from "lucide-react";
import { FlashcardItem, StudySession } from "../types";

interface FlashcardsViewProps {
  session: StudySession;
  onUpdateFlashcards: (sessionId: string, cards: FlashcardItem[]) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  session,
  onUpdateFlashcards,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "learning" | "mastered">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Add custom card form state
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newHint, setNewHint] = useState("");

  const filteredCards = session.flashcards.filter((card) => {
    if (filterMode === "all") return true;
    if (filterMode === "learning") return card.status !== "mastered";
    return card.status === "mastered";
  });

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [filterMode, session.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        if (currentIndex < filteredCards.length - 1) {
          setIsFlipped(false);
          setShowHint(false);
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.code === "ArrowLeft") {
        if (currentIndex > 0) {
          setIsFlipped(false);
          setShowHint(false);
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredCards.length]);

  const currentCard = filteredCards[currentIndex];

  const handleMarkStatus = (status: "learning" | "mastered") => {
    if (!currentCard) return;
    const updated = session.flashcards.map((c) =>
      c.id === currentCard.id ? { ...c, status } : c
    );
    onUpdateFlashcards(session.id, updated);
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...session.flashcards].sort(() => Math.random() - 0.5);
    onUpdateFlashcards(session.id, shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const created: FlashcardItem = {
      id: `fc-custom-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      hint: newHint.trim() || "Asosiy tushunchani eslang",
      status: "unseen",
    };

    onUpdateFlashcards(session.id, [...session.flashcards, created]);
    setNewFront("");
    setNewBack("");
    setNewHint("");
    setIsAddingCard(false);
  };

  const masteredCount = session.flashcards.filter((c) => c.status === "mastered").length;
  const learningCount = session.flashcards.filter((c) => c.status !== "mastered").length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Mastery Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#111827] border border-slate-800/90 rounded-xl">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-[#0B0F19] border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              filterMode === "all"
                ? "bg-slate-800 text-sky-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Barchasi ({session.flashcards.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("learning")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              filterMode === "learning"
                ? "bg-slate-800 text-amber-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Takrorlash kerak ({learningCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("mastered")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              filterMode === "mastered"
                ? "bg-slate-800 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            O'zlashtirilgan ({masteredCount})
          </button>
        </div>

        {/* Deck Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Aralashtirish</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCard((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs text-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi kartochka</span>
          </button>
        </div>
      </div>

      {/* Add Custom Flashcard Drawer */}
      {isAddingCard && (
        <form
          onSubmit={handleAddCustomCard}
          className="p-5 bg-[#111827] border border-slate-800 rounded-xl space-y-4"
        >
          <h3 className="text-sm font-semibold text-slate-200 font-display">
            Shaxsiy Flesh-kartochka Qo'shish
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Old tomoni (Savol yoki atama)
              </label>
              <input
                type="text"
                required
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Masalan: Entropiya nima?"
                className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Orqa tomoni (Javob yoki ta'rif)
              </label>
              <input
                type="text"
                required
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Tizimdagi tartibsizlik darajasini ifodalovchi termodinamik kattalik."
                className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingCard(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Main 3D Flashcard Stage */}
      {filteredCards.length === 0 ? (
        <div className="p-12 bg-[#111827] border border-slate-800 rounded-xl text-center space-y-3">
          <p className="text-sm text-slate-300">
            Ushbu filtr bo'yicha kartochkalar topilmadi.
          </p>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 rounded-lg"
          >
            Barcha kartochkalarni ko'rish
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Card Counter & Keyboard Hint */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono tabular-nums">
              <span>
                Kartochka: {currentIndex + 1} / {filteredCards.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Holati:{" "}
                {currentCard.status === "mastered"
                  ? "O'zlashtirilgan"
                  : currentCard.status === "learning"
                  ? "Takrorlash jarayonida"
                  : "Yangi"}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-500">
              Aylantirish: Space · Oldinga/Orqaga: ← / →
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="perspective-1000 cursor-pointer select-none"
          >
            <div
              className={`relative w-full min-h-[300px] transition-transform duration-200 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT FACE */}
              <div className="absolute inset-0 backface-hidden p-8 bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>SAVOL / ATAMA</span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Javobni ko'rish uchun bosing</span>
                  </span>
                </div>

                <div className="my-auto py-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 font-display leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/70">
                  {currentCard.hint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint((prev) => !prev);
                      }}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>
                        {showHint ? `Ishora: ${currentCard.hint}` : "Ishorani ko'rish (Hint)"}
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    #{currentIndex + 1}
                  </span>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 bg-[#131C31] border border-sky-500/40 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-sky-400">
                  <span>JAVOB VA IZOH</span>
                  <span className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Savolga qaytish</span>
                  </span>
                </div>

                <div className="my-auto py-6 text-center">
                  <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl mx-auto">
                    {currentCard.back}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                  Ushbu tushunchani qay darajada eslab qoldingiz? Quyidagi tugmalardan birini tanlang.
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Self-Assessment Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setShowHint(false);
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111827] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-xs text-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Oldingi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setShowHint(false);
                  setCurrentIndex((prev) =>
                    Math.min(filteredCards.length - 1, prev + 1)
                  );
                }}
                disabled={currentIndex === filteredCards.length - 1}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111827] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-xs text-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Keyingi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleMarkStatus("learning")}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Clock className="w-4 h-4" />
                <span>Takrorlash kerak</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkStatus("mastered")}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>To'liq bilaman</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
