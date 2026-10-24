import React, { useState, useRef } from "react";
import {
  Volume2,
  Loader2,
  Copy,
  Check,
  Download,
  Search,
  BookOpen,
  Play,
  Pause,
} from "lucide-react";
import { StudySession } from "../types";

interface NotesViewProps {
  session: StudySession;
  onCacheAudioSummary: (sessionId: string, audioBase64: string) => void;
}

const VOICE_OPTIONS = [
  { id: "Kore", label: "Kore (Aniq akademik)" },
  { id: "Puck", label: "Puck (Ravon suhandon)" },
  { id: "Zephyr", label: "Zephyr (Sokin ustoz)" },
  { id: "Charon", label: "Charon (Chuqur tahliliy)" },
];

export const NotesView: React.FC<NotesViewProps> = ({
  session,
  onCacheAudioSummary,
}) => {
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    session.audioSummaryBase64
      ? `data:audio/wav;base64,${session.audioSummaryBase64}`
      : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState("");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audioUrl when switching study sessions
  React.useEffect(() => {
    setIsPlaying(false);
    setAudioError(null);
    if (session.audioSummaryBase64) {
      setAudioUrl(`data:audio/wav;base64,${session.audioSummaryBase64}`);
    } else {
      setAudioUrl(null);
    }
  }, [session.id, session.audioSummaryBase64]);

  const handlePlayAudioSummary = async (customText?: string, sectionIdx?: number) => {
    setAudioError(null);

    // If audio already exists and user clicked main summary toggle
    if (!customText && audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    const textToSpeak =
      customText ||
      session.summary.audioScript ||
      session.summary.overview;

    setIsGeneratingAudio(true);
    if (typeof sectionIdx === "number") {
      setActiveSectionIndex(sectionIdx);
    } else {
      setActiveSectionIndex(null);
    }

    try {
      const response = await fetch("/api/study/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          voiceName: selectedVoice,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ovozli xulosa yaratishda xatolik");
      }

      const wavDataUrl = `data:audio/wav;base64,${data.audioBase64}`;
      setAudioUrl(wavDataUrl);
      if (!customText) {
        onCacheAudioSummary(session.id, data.audioBase64);
      }

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } catch (err: any) {
      setAudioError(err.message || "Audio yaratishda xatolik yuz berdi.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = [
      `# ${session.title}`,
      `Manba: ${session.sourceLabel} · Sana: ${session.createdAt}`,
      "",
      "## Umumiy Xulosa",
      session.summary.overview,
      "",
      "## Eng Muhim Fikrlar",
      ...session.summary.keyTakeaways.map((t) => `- ${t}`),
      "",
      ...session.summary.sections.flatMap((s) => [
        `## ${s.heading}`,
        s.content,
        "",
        ...s.bulletPoints.map((b) => `* ${b}`),
        "",
        `Asosiy qoida: ${s.keyFormulaOrInsight}`,
        "",
      ]),
      "## Asosiy Tushunchalar Lug'ati",
      ...session.summary.glossary.map(
        (g) => `- **${g.term}** (${g.category}): ${g.definition}`
      ),
    ].join("\n");

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = [
      `# ${session.title}`,
      `Manba: ${session.sourceLabel} · Sana: ${session.createdAt}`,
      "",
      "## Umumiy Xulosa",
      session.summary.overview,
      "",
      "## Eng Muhim Fikrlar",
      ...session.summary.keyTakeaways.map((t) => `- ${t}`),
      "",
      ...session.summary.sections.flatMap((s) => [
        `## ${s.heading}`,
        s.content,
        "",
        ...s.bulletPoints.map((b) => `* ${b}`),
        "",
        `Asosiy qoida: ${s.keyFormulaOrInsight}`,
        "",
      ]),
      "## Asosiy Tushunchalar Lug'ati",
      ...session.summary.glossary.map(
        (g) => `- **${g.term}** (${g.category}): ${g.definition}`
      ),
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.title.toLowerCase().replace(/\s+/g, "-")}-konspekt.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredGlossary = session.summary.glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Audio-Konspekt (TTS) Studio Bar */}
      <section className="p-5 bg-[#111827] border border-slate-800/90 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <Volume2 className="w-4 h-4" />
              <span>Ovozli Konspekt (Audio Xulosa · Gemini TTS)</span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {session.summary.audioScript}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                setAudioUrl(null);
              }}
              aria-label="Ovoz tembrini tanlash"
              className="px-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handlePlayAudioSummary()}
              disabled={isGeneratingAudio}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {isGeneratingAudio && activeSectionIndex === null ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sintez qilinmoqda...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>To'xtatib turish</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Audio-xulosani eshitish</span>
                </>
              )}
            </button>
          </div>
        </div>

        {audioUrl && (
          <div className="pt-2 border-t border-slate-800/80">
            <audio
              ref={audioRef}
              controls
              src={audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-9"
            />
          </div>
        )}

        {audioError && (
          <p className="text-xs text-rose-400">{audioError}</p>
        )}
      </section>

      {/* Main Two-Column Study Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Structured Notes & Deep-Dive Sections */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview & Export Bar */}
          <div className="p-6 bg-[#111827] border border-slate-800/90 rounded-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100 font-display">
                  Umumiy Tahlil va Asosiy Xulosalar
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{session.summary.sections.length} ta bo'lim</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.summary.keyTakeaways.length} ta tayanch xulosa</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{session.readingTimeMinutes} daqiqa o'qish</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxalash</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Yuklab olish (.md)</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-[15px] text-slate-300 leading-relaxed max-w-[68ch]">
              {session.summary.overview.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Key Takeaways List */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 font-display">
                Eslab Qolish Shart Bo'lgan Xulosalar
              </h3>
              <ul className="space-y-2.5">
                {session.summary.keyTakeaways.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                  >
                    <span className="font-mono tabular-nums text-xs text-sky-400 mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {session.summary.sections.map((section, idx) => (
              <article
                key={idx}
                className="p-6 bg-[#111827] border border-slate-800/90 rounded-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-100 font-display">
                    {section.heading}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayAudioSummary(
                        `${section.heading}. ${section.content}`,
                        idx
                      )
                    }
                    disabled={isGeneratingAudio}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-slate-400 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    {isGeneratingAudio && activeSectionIndex === idx ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>Bo'limni tinglash</span>
                  </button>
                </div>

                <p className="text-[15px] text-slate-300 leading-relaxed max-w-[68ch]">
                  {section.content}
                </p>

                {section.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <span className="text-sky-400 font-mono select-none">·</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.keyFormulaOrInsight && (
                  <div className="p-3.5 bg-[#0B0F19] border border-slate-800 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">
                      Tayanch qoida / Formula:
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-sky-300">
                      {section.keyFormulaOrInsight}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right 4 Columns: Interactive Glossary & Terms Dictionary */}
        <aside className="lg:col-span-4 p-6 bg-[#111827] border border-slate-800/90 rounded-xl space-y-5 lg:sticky lg:top-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-100 font-display flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Asosiy Tushunchalar Lug'ati</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {session.summary.glossary.length} ta atama
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Darslikdagi tayanch ilmiy atamalar va ularning izohi
            </p>
          </div>

          {/* Search Glossary */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Atama yoki ta'rifni qidirish..."
              className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[540px] overflow-y-auto pr-1">
            {filteredGlossary.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Qidiruv bo'yicha atama topilmadi.
              </div>
            ) : (
              filteredGlossary.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-1 last:pb-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-100">
                      {item.term}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
