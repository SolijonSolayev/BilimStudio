import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  Award,
} from "lucide-react";
import { QuizQuestion, StudySession } from "../types";

interface QuizViewProps {
  session: StudySession;
  onUpdateQuiz: (
    sessionId: string,
    questions: QuizQuestion[],
    score?: { correct: number; total: number }
  ) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ session, onUpdateQuiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswers({});
    setErrorMsg(null);
  }, [session.id]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // Lock after first answer

    const updated = { ...selectedAnswers, [questionId]: optionIdx };
    setSelectedAnswers(updated);

    const answeredCount = Object.keys(updated).length;
    if (answeredCount === session.quiz.length) {
      const correctCount = session.quiz.reduce((acc, q) => {
        return acc + (updated[q.id] === q.correctIndex ? 1 : 0);
      }, 0);
      onUpdateQuiz(session.id, session.quiz, {
        correct: correctCount,
        total: session.quiz.length,
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const handleGenerateMoreQuestions = async () => {
    setIsGeneratingMore(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/study/more-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: session.title,
          overview: session.summary.overview,
          sectionsText: session.summary.sections
            .map((s) => `${s.heading}: ${s.content}`)
            .join("\n"),
          existingQuestions: session.quiz.map((q) => q.question),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Savollar qo'shishda xatolik");
      }

      const added: QuizQuestion[] = (data.questions || []).map(
        (q: any, idx: number) => ({
          id: `qz-more-${Date.now()}-${idx}`,
          question: q.question,
          options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
          explanation: q.explanation || "",
        })
      );

      if (added.length > 0) {
        onUpdateQuiz(session.id, [...session.quiz, ...added]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Qo'shimcha test tuzishda xatolik yuz berdi.");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const totalQuestions = session.quiz.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = session.quiz.reduce((acc, q) => {
    if (selectedAnswers[q.id] === undefined) return acc;
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const accuracyPercent =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Status & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#111827] border border-slate-800/90 rounded-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-100 font-display">
            Bilimni Tekshirish Testi (Quiz)
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <span>
              Javob berildi: {answeredCount} / {totalQuestions}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">
              To'g'ri javoblar: {correctCount}
            </span>
            <span aria-hidden="true">·</span>
            <span>Aniqlik: {accuracyPercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetQuiz}
            disabled={answeredCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B0F19] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Qayta topshirish</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateMoreQuestions}
            disabled={isGeneratingMore}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isGeneratingMore ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Yaratilmoqda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>+4 ta AI savol qo'shish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Completion Summary Banner */}
      {answeredCount === totalQuestions && totalQuestions > 0 && (
        <div className="p-6 bg-[#111827] border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/15 rounded-xl text-emerald-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 font-display">
                Test yakunlandi! Natijangiz: {correctCount} / {totalQuestions} ({accuracyPercent}%)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {accuracyPercent >= 80
                  ? "Ajoyib ko'rsatkich! Mavzuni juda yaxshi o'zlashtirgansiz."
                  : "Xato qilingan savollarning ilmiy izohlarini o'qib chiqib, testni qayta topshirib ko'ring."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Yana bir bor ishlash
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {session.quiz.map((q, qIdx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;

          return (
            <div
              key={q.id}
              className="p-6 bg-[#111827] border border-slate-800/90 rounded-xl space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono tabular-nums text-xs text-sky-400 mt-1 shrink-0">
                  {String(qIdx + 1).padStart(2, "0")}.
                </span>
                <h3 className="text-base font-medium text-slate-100 leading-snug">
                  {q.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userChoice === optIdx;
                  const isCorrectOption = q.correctIndex === optIdx;

                  let buttonStyle =
                    "bg-[#0B0F19] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100";

                  if (isAnswered) {
                    if (isCorrectOption) {
                      buttonStyle =
                        "bg-emerald-950/40 border-emerald-500/60 text-emerald-200";
                    } else if (isThisSelected && !isCorrectOption) {
                      buttonStyle =
                        "bg-rose-950/40 border-rose-500/60 text-rose-200";
                    } else {
                      buttonStyle =
                        "bg-[#0B0F19]/50 border-slate-800/50 text-slate-500";
                    }
                  }

                  const optionLetter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`flex items-start justify-between gap-3 p-3.5 border rounded-lg text-left text-sm transition-colors ${buttonStyle}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs opacity-70 mt-0.5 shrink-0">
                          {optionLetter})
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isCorrectOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isThisSelected && !isCorrectOption && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && q.explanation && (
                <div className="p-4 bg-[#0B0F19] border border-slate-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    {userChoice === q.correctIndex ? (
                      <span className="text-emerald-400">✓ To'g'ri javob izohi:</span>
                    ) : (
                      <span className="text-amber-400">! Ilmiy izoh:</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
