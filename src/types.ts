export type SourceType = "text" | "pdf" | "audio" | "url";

export type StudyTab = "notes" | "flashcards" | "quiz" | "tutor";

export interface StudySection {
  heading: string;
  content: string;
  bulletPoints: string[];
  keyFormulaOrInsight: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint: string;
  status: "unseen" | "learning" | "mastered";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface StudySession {
  id: string;
  title: string;
  createdAt: string;
  sourceType: SourceType;
  sourceLabel: string;
  readingTimeMinutes: number;
  rawSourceText: string;
  summary: {
    overview: string;
    audioScript: string;
    keyTakeaways: string[];
    sections: StudySection[];
    glossary: GlossaryItem[];
  };
  flashcards: FlashcardItem[];
  quiz: QuizQuestion[];
  chatHistory: ChatMessage[];
  audioSummaryBase64?: string;
  lastQuizScore?: {
    correct: number;
    total: number;
  };
}
