import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  Mic,
  Square,
  Globe,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Sparkles,
} from "lucide-react";
import { SourceType, StudySession } from "../types";

interface SourceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: StudySession) => void;
}

const QUICK_SAMPLE_TEXT = `Kvant hisoblash (Quantum Computing) — kvant mexanikasi hodisalari, xususan superpozitsiya va kvant chigallashish (entanglement) tamoyillariga asoslangan axborotni qayta ishlash texnologiyasidir. An'anaviy kompyuterlar ma'lumotni bitlar (0 yoki 1) ko'rinishida saqlasa, kvant kompyuterlari kubitlardan (quantum bits) foydalanadi. Superpozitsiya tufayli kubit bir vaqtning o'zida ham 0, ham 1 holatlarining chiziqli kombinatsiyasida bo'la oladi: |ψ⟩ = α|0⟩ + β|1⟩, bu yerda |α|² + |β|² = 1.

Kvant chigallashish (Entanglement) ikki yoki undan ortiq kubitlarning holati bir-biriga bog'liq bo'lib qolishini anglatadi: bir kubitning holatini o'lchash ikkinchi kubitning holatini masofadan qat'i nazar bir zumda aniqlaydi. Shor algoritmi katta sonlarni tub ko'paytuvchilarga ajratish orqali RSA kriptografiyasiga xavf tug'dirsa, Grover algoritmi tartiblanmagan ma'lumotlar bazasidan qidirishni kvadratik tezlashtiradi (O(√N)). Biroq kvant dekogerentligi (tashqi shovqin tufayli kvant holatning buzilishi) zamonaviy kvant muhandisligining eng katta muammosi bo'lib, uni hal etish uchun kvant xatolarni tuzatish kodlari (Surface Codes) qo'llaniladi.`;

export const SourceInputModal: React.FC<SourceInputModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
}) => {
  const [activeTab, setActiveTab] = useState<SourceType>("text");
  const [customTitle, setCustomTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlNotes, setUrlNotes] = useState("");

  // PDF / File state
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [fileMimeType, setFileMimeType] = useState("");

  // Audio recording / upload state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState("");
  const [audioMimeType, setAudioMimeType] = useState("audio/webm");
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepStatus, setStepStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("Fayl hajmi 20 MB dan oshmasligi kerak.");
      return;
    }

    setSelectedFileName(file.name);
    if (!customTitle) {
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const b64 = await blobToBase64(file);
      setFileBase64(b64);
      setFileMimeType("application/pdf");
    } else {
      // Read text file (.txt, .md, .csv)
      const text = await file.text();
      setTextContent(text);
      setFileBase64("");
      setFileMimeType("text/plain");
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const preview = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(preview);
        const b64 = await blobToBase64(audioBlob);
        setAudioBase64(b64);
        setAudioMimeType("audio/webm");
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(
        "Mikrofonga ruxsat berilmadi yoki qurilma topilmadi. Audio faylni yuklash imkoniyatidan ham foydalanishingiz mumkin."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("Audio fayl hajmi 20 MB dan oshmasligi kerak.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setAudioPreviewUrl(preview);
    const b64 = await blobToBase64(file);
    setAudioBase64(b64);
    setAudioMimeType(file.type || "audio/mp3");
    if (!customTitle) {
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleTranscribeAudio = async (): Promise<string | null> => {
    if (!audioBase64) {
      setErrorMsg("Avval ovoz yozing yoki audio fayl yuklang.");
      return null;
    }

    setIsTranscribing(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/study/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType: audioMimeType,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Audio transkripsiya xatoligi");
      }
      setTranscribedText(data.transcript);
      return data.transcript;
    } catch (err: any) {
      setErrorMsg(err.message || "Ovozni matnga o'girishda xatolik yuz berdi.");
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateStudyPack = async () => {
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      let finalContent = textContent;
      let payloadSourceType: SourceType = activeTab;

      if (activeTab === "audio") {
        let currentTranscript = transcribedText.trim();
        if (!currentTranscript) {
          setStepStatus("Ovozli yozuv matnga o'girilmoqda (gemini-3.5-transcribe)...");
          const resTranscript = await handleTranscribeAudio();
          if (!resTranscript) {
            setIsGenerating(false);
            setStepStatus("");
            return;
          }
          currentTranscript = resTranscript;
        }
        finalContent = currentTranscript;
      }

      if (activeTab === "text" && finalContent.trim().length < 20) {
        throw new Error("Iltimos, tahlil qilish uchun kamida 20 ta belgidan iborat matn kiriting.");
      }

      if (activeTab === "pdf" && !fileBase64 && finalContent.trim().length < 20) {
        throw new Error("Iltimos, PDF yoki matnli hujjat faylini tanlang.");
      }

      if (activeTab === "url" && !urlInput.trim().startsWith("http")) {
        throw new Error("Iltimos, to'g'ri veb-sahifa manzilini kiriting (masalan: https://...).");
      }

      setStepStatus("Strukturali konspekt, lug'at, kartochkalar va testlar yaratilmoqda...");

      const response = await fetch("/api/study/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: payloadSourceType,
          customTitle: customTitle.trim(),
          content: activeTab === "url" ? urlNotes : finalContent,
          url: activeTab === "url" ? urlInput.trim() : undefined,
          fileBase64: activeTab === "pdf" ? fileBase64 : undefined,
          mimeType: activeTab === "pdf" ? fileMimeType : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Konspekt yaratishda xatolik yuz berdi.");
      }

      const pack = data.studyPack;
      const now = new Date();
      const dateStr = now.toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const sourceLabelMap: Record<SourceType, string> = {
        text: "Matnli manba",
        pdf: selectedFileName || "PDF darslik",
        audio: "Ovozli ma'ruza",
        url: urlInput.trim().replace(/^https?:\/\//, "").split("/")[0] || "Veb-maqola",
      };

      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        title: pack.title || customTitle || "Yangi O'quv Konspekti",
        createdAt: dateStr,
        sourceType: activeTab,
        sourceLabel: sourceLabelMap[activeTab],
        readingTimeMinutes: pack.readingTimeMinutes || 5,
        rawSourceText: data.rawSourceText || finalContent || "",
        summary: {
          overview: pack.summary?.overview || "",
          audioScript: pack.summary?.audioScript || "",
          keyTakeaways: pack.summary?.keyTakeaways || [],
          sections: pack.summary?.sections || [],
          glossary: pack.summary?.glossary || [],
        },
        flashcards: (pack.flashcards || []).map((fc: any, idx: number) => ({
          id: `fc-${Date.now()}-${idx}`,
          front: fc.front,
          back: fc.back,
          hint: fc.hint || "",
          status: "unseen",
        })),
        quiz: (pack.quiz || []).map((q: any, idx: number) => ({
          id: `qz-${Date.now()}-${idx}`,
          question: q.question,
          options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
          explanation: q.explanation || "",
        })),
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            role: "model",
            text: `Assalomu alaykum! **${pack.title}** mavzusi bo'yicha konspekt, flesh-kartochkalar va test savollari tayyor. Ushbu mavzu yuzasidan tushunmagan savollaringizni berishingiz mumkin!`,
            timestamp: now.toTimeString().slice(0, 5),
          },
        ],
      };

      onSessionCreated(newSession);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Jarayon davomida xatolik yuz berdi.");
    } finally {
      setIsGenerating(false);
      setStepStatus("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 font-display">
              Yangi O'quv Konspekti Yaratish
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Matn, PDF hujjat, jonli ovozli ma'ruza yoki veb-havolani yuklang
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Type Segmented Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#0B0F19] border border-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab("text");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "text"
                  ? "bg-slate-800 text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Matn kiritish</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("pdf");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "pdf"
                  ? "bg-slate-800 text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>PDF va Hujjat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("audio");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-nowrap shrink-0 ${
                activeTab === "audio"
                  ? "bg-slate-800 text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Ovoz va Audio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("url");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "url"
                  ? "bg-slate-800 text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Veb-havola (URL)</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Optional Custom Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Mavzu sarlavhasi (ixtiyoriy — AI avtomatik nomlashi ham mumkin)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Masalan: Kvant hisoblash asoslari yoki Iqtisodiyot nazariyasi"
              className="w-full px-3.5 py-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* TAB 1: TEXT */}
          {activeTab === "text" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Maqola, ma'ruza yoki darslik matni
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomTitle("Kvant Hisoblash va Kubitlar Fizikasi");
                    setTextContent(QUICK_SAMPLE_TEXT);
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Namuna matnni joylashtirish
                </button>
              </div>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Uzun maqola, kitob bobi yoki ma'ruza matnini shu yerga nusxalab joylashtiring..."
                className="w-full p-3.5 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed resize-y"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                <span>Belgilar soni: {textContent.length}</span>
                <span>So'zlar soni: {textContent.trim() ? textContent.trim().split(/\s+/).length : 0}</span>
              </div>
            </div>
          )}

          {/* TAB 2: PDF / DOCUMENT */}
          {activeTab === "pdf" && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 hover:border-sky-500/70 rounded-xl bg-[#0B0F19]/70 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-sky-400 mb-2.5" />
                <span className="text-sm font-medium text-slate-200">
                  PDF, TXT yoki Markdown (.md) faylni tanlang
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Maksimal hajm: 20 MB · Gemini multimodal tahlili
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf,text/plain"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>

              {selectedFileName && (
                <div className="flex items-center justify-between px-4 py-3 bg-[#0B0F19] border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-200 truncate max-w-md">
                      {selectedFileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName("");
                      setFileBase64("");
                      setTextContent("");
                    }}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    O'chirish
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIO / VOICE */}
          {activeTab === "audio" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Live Microphone Box */}
                <div className="p-4 bg-[#0B0F19] border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-300">
                      1-usul: Jonli ovoz yozish
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Dars yoki fikrlaringizni mikrofon orqali gapiring
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-mono tabular-nums text-slate-200">
                      {formatTime(recordingSeconds)}
                    </span>
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Yozishni boshlash</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>To'xtatish</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload Audio File Box */}
                <label className="p-4 bg-[#0B0F19] border border-dashed border-slate-700 hover:border-sky-500/70 rounded-xl flex flex-col justify-between cursor-pointer transition-colors">
                  <div>
                    <div className="text-xs font-medium text-slate-300">
                      2-usul: Audio fayl yuklash
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Tayyor ma'ruza yozuvini (.mp3, .wav, .webm, .m4a) yuklang
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-medium pt-3">
                    <Upload className="w-4 h-4" />
                    <span>Audio faylni tanlash</span>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {audioPreviewUrl && (
                <div className="p-3.5 bg-[#0B0F19] border border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-sky-400" />
                      Ovozli yozuv tayyor
                    </span>
                    <button
                      type="button"
                      onClick={handleTranscribeAudio}
                      disabled={isTranscribing}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {isTranscribing ? "Matnga o'girilmoqda..." : "Avval matnga o'girib ko'rish"}
                    </button>
                  </div>
                  <audio controls src={audioPreviewUrl} className="w-full h-9" />
                </div>
              )}

              {transcribedText && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Audiodan olingan matn (tahrirlashingiz mumkin):
                  </label>
                  <textarea
                    rows={4}
                    value={transcribedText}
                    onChange={(e) => setTranscribedText(e.target.value)}
                    className="w-full p-3 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: URL */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Maqola yoki veb-sahifa manzili (URL)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
                  className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Qo'shimcha urg'u yoki fokus (ixtiyoriy)
                </label>
                <textarea
                  rows={3}
                  value={urlNotes}
                  onChange={(e) => setUrlNotes(e.target.value)}
                  placeholder="Masalan: Maqoladagi tarixiy sanalar va asosiy algoritmlarga ko'proq e'tibor qarating..."
                  className="w-full p-3 bg-[#0B0F19] border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Progress Step Status */}
          {isGenerating && stepStatus && (
            <div className="flex items-center gap-3 p-3.5 bg-sky-950/30 border border-sky-800/50 rounded-lg text-xs text-sky-200">
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
              <span>{stepStatus}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-[#0B0F19]/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleGenerateStudyPack}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Tayyorlanmoqda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Konspekt va Testlarni Yaratish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
