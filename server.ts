import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY topilmadi. Iltimos, Settings > Secrets panelidan API kalitni tekshiring.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function fetchUrlReadableText(targetUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,text/plain,*/*",
      },
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.slice(0, 28000);
  } catch {
    return "";
  }
}

const studyPackSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Mavzuning aniq, ilmiy va tushunarli sarlavhasi (o'zbek tilida).",
    },
    readingTimeMinutes: {
      type: Type.INTEGER,
      description: "Konspektni o'qib chiqish uchun ketadigan taxminiy vaqt (daqiqada).",
    },
    extractedSourcePreview: {
      type: Type.STRING,
      description: "Manbadan olingan asosiy matnning qisqa tavsifi yoki transkripsiyasi.",
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        overview: {
          type: Type.STRING,
          description: "Mavzuning umumiy mazmuni va ahamiyati haqida 2-3 abzatslik chuqur kirish xulosasi.",
        },
        audioScript: {
          type: Type.STRING,
          description: "Ovozli o'qib berish (TTS) uchun tabiiy, ravon va tushunarli tilda yozilgan 4-6 gaplik qisqa audio-konspekt matni.",
        },
        keyTakeaways: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Eng muhim 5-6 ta asosiy xulosa va eslab qolish shart bo'lgan fikrlar.",
        },
        sections: {
          type: Type.ARRAY,
          description: "Mavzuning mantiqiy bo'limlarga ajratilgan batafsil konspekti (3-5 ta bo'lim).",
          items: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING, description: "Bo'lim sarlavhasi." },
              content: { type: Type.STRING, description: "Bo'limning batafsil, tushunarli tahliliy matni." },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Bo'lim ichidagi asosiy faktlar, qoidalar yoki bosqichlar.",
              },
              keyFormulaOrInsight: {
                type: Type.STRING,
                description: "Ushbu bo'limdagi eng muhim qoida, formula yoki ta'rif.",
              },
            },
            required: ["heading", "content", "bulletPoints", "keyFormulaOrInsight"],
          },
        },
        glossary: {
          type: Type.ARRAY,
          description: "Mavzudagi asosiy atamalar va tushunchalar lug'ati (6-10 ta atama).",
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING, description: "Atama yoki tushuncha nomi." },
              definition: { type: Type.STRING, description: "Atamaning aniq va sodda izohi." },
              category: { type: Type.STRING, description: "Atama turi yoki sohasi (masalan: Asosiy tushuncha, Jarayon, Nazariya)." },
            },
            required: ["term", "definition", "category"],
          },
        },
      },
      required: ["overview", "audioScript", "keyTakeaways", "sections", "glossary"],
    },
    flashcards: {
      type: Type.ARRAY,
      description: "Bilimni mustahkamlash uchun 8-10 ta savol-javob flesh-kartochkalari.",
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "Kartochkaning old tomoni: aniq savol yoki tushuncha." },
          back: { type: Type.STRING, description: "Kartochkaning orqa tomoni: lo'nda va aniq javob." },
          hint: { type: Type.STRING, description: "Eslashga yordam beruvchi qisqa ishora (hint)." },
        },
        required: ["front", "back", "hint"],
      },
    },
    quiz: {
      type: Type.ARRAY,
      description: "Mavzuni tekshirish uchun 6-8 ta 4 variantli test savollari.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Test savoli matni." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Aniq 4 ta javob varianti.",
          },
          correctIndex: {
            type: Type.INTEGER,
            description: "To'g'ri javob indeksi (0, 1, 2 yoki 3).",
          },
          explanation: {
            type: Type.STRING,
            description: "Nima uchun ushbu javob to'g'ri ekanligi haqida batafsil ilmiy izoh.",
          },
        },
        required: ["question", "options", "correctIndex", "explanation"],
      },
    },
  },
  required: ["title", "readingTimeMinutes", "extractedSourcePreview", "summary", "flashcards", "quiz"],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "35mb" }));

  // 1. Transcribe uploaded or live-recorded audio using gemini-3.5-transcribe
  app.post("/api/study/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) {
        res.status(400).json({ error: "Audio ma'lumot yuborilmadi." });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-transcribe",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "audio/webm",
                data: audioBase64,
              },
            },
            {
              text: "Transcribe this educational audio accurately. Preserve the original spoken language (Uzbek, Russian, or English) and format it into clean, readable paragraphs without adding extra commentary.",
            },
          ],
        },
      });

      const transcript = response.text?.trim() || "";
      if (!transcript) {
        res.status(422).json({ error: "Audiodan nutq aniqlanmadi. Iltimos, aniqroq ovozli yozuv yuklang." });
        return;
      }

      res.json({ transcript });
    } catch (error: any) {
      console.error("Transcription error:", error);
      res.status(500).json({
        error: error?.message || "Audio faylni matnga o'girishda xatolik yuz berdi.",
      });
    }
  });

  // 2. Generate full structured Study Pack from Text, PDF, Audio transcript, or URL
  app.post("/api/study/generate", async (req, res) => {
    try {
      const { sourceType, customTitle, content, url, fileBase64, mimeType } = req.body;
      const ai = getAiClient();

      const parts: any[] = [];
      let rawTextContext = "";

      if (sourceType === "pdf" && fileBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: fileBase64,
          },
        });
        rawTextContext = content || "PDF hujjat tarkibi";
      } else if (sourceType === "url" && url) {
        const fetchedText = await fetchUrlReadableText(url);
        if (fetchedText && fetchedText.length > 150) {
          rawTextContext = `Manba URL: ${url}\n\nSahifadan olingan matn:\n${fetchedText}`;
        } else {
          rawTextContext = `Manba URL: ${url}\nQo'shimcha izoh: ${content || "Ushbu veb-sahifa yoki maqola mavzusini chuqur tahlil qilib o'quv konspekti yarating."}`;
        }
        parts.push({ text: rawTextContext });
      } else {
        if (!content || String(content).trim().length < 20) {
          res.status(400).json({ error: "Konspekt yaratish uchun kamida 20 ta belgidan iborat matn kiriting." });
          return;
        }
        rawTextContext = String(content).trim();
        parts.push({ text: rawTextContext });
      }

      const instructionPrompt = `
Siz professional akademik o'qituvchi va metodistsiz. Taqdim etilgan manba asosida O'ZBEK TILIDA mukammal, chuqur va tushunarli o'quv to'plami (Smart Study Notes) tayyorlang.
${customTitle ? `Foydalanuvchi taklif qilgan sarlavha: "${customTitle}"` : ""}

Talablar:
1. Konspekt bo'limlari (sections) mantiqiy ketma-ketlikda, ilmiy aniq va o'qishga qulay bo'lsin.
2. Asosiy tushunchalar lug'ati (glossary) kamida 6 ta muhim atamani qamrab olsin.
3. Flesh-kartochkalar (flashcards) kamida 8 ta bo'lsin, old tomonida aniq savol/atama, orqa tomonida lo'nda javob va eslash uchun kichik ishora (hint) bo'lsin.
4. Test savollari (quiz) kamida 6 ta bo'lsin, har birida 4 tadan variant va nima uchun to'g'ri javob tanlanganining ilmiy izohi (explanation) bo'lsin.
5. Audio skript (audioScript) 4-6 gapdan iborat bo'lib, konspektning eng muhim mag'zini suhandon o'qib bergandek ravon bayon etsin.
`;

      parts.push({ text: instructionPrompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: studyPackSchema,
          temperature: 0.4,
        },
      });

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new Error("Modeldan bo'sh javob qaytdi.");
      }

      const parsed = JSON.parse(jsonText);
      res.json({
        studyPack: parsed,
        rawSourceText: rawTextContext || parsed.extractedSourcePreview || "",
      });
    } catch (error: any) {
      console.error("Generate study pack error:", error);
      res.status(500).json({
        error: error?.message || "O'quv to'plamini shakllantirishda xatolik yuz berdi.",
      });
    }
  });

  // 3. Generate Speech (TTS) for audio summary or section reading using gemini-3.8-flash-lite-tts
  app.post("/api/study/tts", async (req, res) => {
    try {
      const { text, voiceName } = req.body;
      if (!text || String(text).trim().length === 0) {
        res.status(400).json({ error: "O'qib berish uchun matn topilmadi." });
        return;
      }

      const cleanText = String(text).trim().slice(0, 1800);
      const ai = getAiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: cleanText,
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || "Kore",
              },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        throw new Error("Audio ma'lumot generatsiya qilinmadi.");
      }

      res.json({
        audioBase64: base64Audio,
        mimeType: "audio/wav",
      });
    } catch (error: any) {
      console.error("TTS generation error:", error);
      res.status(500).json({
        error: error?.message || "Ovozli xulosani yaratishda xatolik yuz berdi.",
      });
    }
  });

  // 4. Contextual AI Tutor Chat using gemini-3.8-flash
  app.post("/api/study/chat", async (req, res) => {
    try {
      const { question, history, studyContext } = req.body;
      if (!question || String(question).trim().length === 0) {
        res.status(400).json({ error: "Savol matni bo'sh bo'lmasligi kerak." });
        return;
      }

      const ai = getAiClient();

      const systemInstruction = `Siz "BilimStudio" ta'lim platformasining shaxsiy AI Ustozisiz.
Vazifangiz: Foydalanuvchiga hozir o'rganayotgan darsligi va konspekti yuzasidan tushunarli, ilmiy asoslangan va hayotiy misollarga boy javob berish.

Joriy darslik ma'lumotlari:
Sarlavha: ${studyContext?.title || "Noma'lum mavzu"}
Umumiy xulosa: ${studyContext?.overview || ""}
Bo'limlar va asosiy tushunchalar: ${studyContext?.details || ""}

Qoidalar:
- Javoblarni o'zbek tilida, aniq, samimiy va tushunarli tilda yozing.
- Murakkab tushunchalarni oddiy hayotiy analogiyalar bilan tushuntiring.
- Agar foydalanuvchi bilimini sinamoqchi bo'lsa, mavzu yuzasidan qisqa savol bering va javobini tahlil qiling.`;

      const formattedContents = [
        ...(Array.isArray(history)
          ? history.slice(-10).map((msg: { role: string; text: string }) => ({
              role: msg.role === "model" ? "model" : "user",
              parts: [{ text: msg.text }],
            }))
          : []),
        {
          role: "user",
          parts: [{ text: String(question).trim() }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.5,
        },
      });

      res.json({
        reply: response.text?.trim() || "Kechirasiz, javob shakllantirishda xatolik yuz berdi.",
      });
    } catch (error: any) {
      console.error("AI Tutor chat error:", error);
      res.status(500).json({
        error: error?.message || "AI Ustoz bilan bog'lanishda xatolik yuz berdi.",
      });
    }
  });

  // 5. Generate additional Quiz questions on demand
  app.post("/api/study/more-quiz", async (req, res) => {
    try {
      const { title, overview, sectionsText, existingQuestions } = req.body;
      const ai = getAiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Mavzu: ${title}\nUmumiy ma'lumot: ${overview}\nBo'limlar: ${sectionsText}\nAvvalgi savollar: ${(existingQuestions || []).join("; ")}\n\nUshbu mavzu bo'yicha avvalgilaridan farq qiluvchi YANA 4 TA yangi, chuqurroq test savolini o'zbek tilida tuzing.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "[]");
      res.json({ questions: parsed });
    } catch (error: any) {
      console.error("More quiz error:", error);
      res.status(500).json({
        error: error?.message || "Qo'shimcha test savollarini tuzishda xatolik yuz berdi.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BilimStudio server running on http://localhost:${PORT}`);
  });
}

startServer();
