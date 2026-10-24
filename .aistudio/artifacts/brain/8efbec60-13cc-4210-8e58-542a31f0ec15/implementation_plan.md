# BilimStudio — Ovozli va Matnli Konspekt Platformasi (Smart Study Notes)

Uzun maqolalar, PDF darsliklar, veb-havolalar hamda ovozli ma'ruzalarni soniyalar ichida strukturali konspekt, asosiy tushunchalar lug'ati, interaktiv flesh-kartochkalar (flashcards), bilimlarni tekshiruvchi testlar (quiz) va AI ustoz muloqotiga aylantiruvchi zamonaviy ta'lim studiyasi.

## User Review & Critical Decisions

> [!IMPORTANT]
> Quyidagi qarorlar sizning javoblaringiz asosida tasdiqlandi va ilovaning asosiy poydevorini tashkil etadi. Rejani ko'rib chiqib, **Proceed** tugmasini bossangiz, dasturni yaratishni boshlaymiz.

- **Tasdiqlangan ma'lumot kiritish usullari**: Matn kiritish va PDF fayl yuklash, mikrofondan jonli ovoz yozish hamda audio fayl yuklash, shuningdek veb-sahifa yoki maqola havolasi (URL) orqali tahlil qilish.
- **Tasdiqlangan o'quv vositalari**: Strukturali konspekt va asosiy tushunchalar lug'ati, interaktiv flesh-kartochkalar (Flashcards), avtomatik test savollari (Quiz), konspektni ovozli eshitish (Audio TTS) hamda mavzu yuzasidan AI ustoz bilan savol-javob chati.
- **Tasdiqlangan vizual uslub**: **Dark Focus Studio** — ko'zni charchatmaydigan chuqur tungi slanets (`#0B0F19`) foni, aniq tipografiya va diqqatni jamlashga yordam beruvchi minimalist dizayn.

---

## 1. Overview & Core Concept

- **What It Does**: Foydalanuvchi istalgan o'quv materialini (matn, PDF, ovozli ma'ruza yoki maqola URL havolasi) kiritadi. Platforma serverdagi Gemini AI modellari yordamida materialni tahlil qilib, to'liq o'quv paketini yaratadi:
  1. **Strukturali Konspekt va Audio-xulosa**: Bo'limlarga ajratilgan asosiy g'oyalar, muhim xulosalar, tayanch iboralar lug'ati hamda qisqa xulosani ovozli eshitish (TTS) imkoniyati.
  2. **Flesh-kartochkalar (Flashcards)**: 3D aylanish effektiga ega savol-javob kartochkalari va "Bilaman / Takrorlash kerak" filtri.
  3. **Interaktiv Test (Quiz)**: 4 variantli test savollari, har bir javobning izohi va yakuniy natija tahlili.
  4. **AI Ustoz Chati**: Faqatgina kiritilgan darslik/mavzu doirasida tushunmagan joylarni sodda misollar bilan tushuntirib beruvchi interaktiv suhbatdosh.
- **Target Audience / Persona**: Talabalar, mustaqil o'rganuvchilar, ilmiy tadqiqotchilar va mutaxassislar — katta hajmdagi ma'lumotlarni tez o'zlashtirishi va imtihonlarga samarali tayyorlanishi kerak bo'lgan foydalanuvchilar.
- **Key Value**: Soatlab konspekt yozish va savollar tuzish o'rniga, bir necha soniya ichida tayyor interaktiv o'quv muhitiga ega bo'lish.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Kirish va Kutubxona (Workspace)**: Foydalanuvchi kirganda chap tomonda saqlangan konspektlar kutubxonasi (namunaviy tayyor darsliklar bilan birga) va asosiy sahnada yangi konspekt yaratish studiyasini ko'radi.
  2. **Manbani Tanlash va Yuklash**: Foydalanuvchi 4 ta tabdan birini tanlaydi:
     - *Matn*: Uzun maqola yoki ma'ruza matnini joylashtirish.
     - *PDF / Hujjat*: PDF yoki matnli faylni yuklash.
     - *Ovozli yozuv*: Brauzer mikrofoni orqali jonli ma'ruza yozish yoki tayyor audio fayl (`.mp3`, `.wav`, `.webm`) yuklash.
     - *Veb-havola (URL)*: Maqola manzilini kiritish.
  3. **O'quv Rejimlarida Ishlash**: Tahlil yakunlangach, 4 ta asosiy o'quv oynasi (Konspekt & Lug'at, Flesh-kartochkalar, Test sinovi, AI Ustoz) o'rtasida bir zumda almashib o'qish mumkin.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: **Dark Focus Studio** — tungi sokin akademik laboratoriya atmosferasi.
  - *Color Palette & Mood (60-30-10 qoidasi)*:
    - **60% Asosiy Kenglik (`--background`)**: Chuqur tungi slanets (`#0B0F19` / `slate-950`).
    - **30% Strukturali Yuzalar (`--surface`)**: Yengil ajralib turuvchi tungi panellar (`#111827` / `slate-900`) va nozik 1px chegara chiziqlari (`#1E293B` / `slate-800`).
    - **10% Urg'u va Ma'no Ranglari (`--accent`)**: Asosiy harakatlar uchun yorqin moviy-indigo (`#38BDF8` / `sky-400` va `#6366F1` / `indigo-500`), o'zlashtirilgan kartochkalar va to'g'ri javoblar uchun zumrad yashil (`#10B981`), takrorlash kerak bo'lganlar uchun kahrabo (`#F59E0B`), xatolar uchun marjon qizil (`#EF4444`).
  - *Typography & Hierarchy (2+1 Font qoidasi)*:
    - **Display / Sarlavhalar**: `Outfit` (600–700 qalinlik, `text-wrap: balance`, aniq va zamonaviy).
    - **Asosiy Matn / Konspekt**: `Plus Jakarta Sans` (400–500, qulay o'qilishi uchun `1.65` qator oralig'i va `68ch` maksimal kenglik).
    - **Raqamlar va Statistika**: `JetBrains Mono` (`tabular-nums` — taymer, test ballari va kartochkalar hisobi uchun).
  - *Component Styling & Layout*:
    - Yuqori navigatsiya paneli (Top Bar Contract): 3 ta aniq hudud — Brend nomi (`BilimStudio`), 4 ta asosiy bo'lim havolasi (`Konspekt`, `Kartochkalar`, `Test`, `AI Ustoz`) va 1 ta asosiy tugma (`+ Yangi Manba`).
    - Ikki hududli ishchi maydon (1440px keng ekran uchun mo'ljallangan): Chapda ixcham kutubxona va manba yaratish paneli, o'ngda keng o'quv va interaktiv mashq sahnasi.
    - Barcha metama'lumotlar (vaqt, so'zlar soni, qiyinlik darajasi) hech qanday rangli kapsulalarsiz (zero-pill), `·` belgisi bilan ajratilgan toza matn ko'rinishida beriladi.
- **Interactive Feedback & Motion**:
  - Flesh-kartochkalarni bosganda yoki `Space` tugmasini bosganda silliq 3D aylanish (`transform`, `180ms`).
  - Mikrofondan ovoz yozish vaqtida jonli sekundomer (`tabular-nums`) va ovoz to'lqini indikatori.
  - AI tahlili davomida bosqichma-bosqich jarayon ko'rsatkichi (masalan: *"Audio matnga o'girilmoqda..."*, *"Konspekt va testlar shakllantirilmoqda..."*).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-side Gemini AI Arxitekturasi va Model Tanlovi**
  - *Chosen Approach*: Barcha AI so'rovlarini Express backend (`/api/study/*`) orqali bajarish. Ovozni matnga o'girish uchun `gemini-3.5-transcribe`, strukturali konspekt, flesh-kartochkalar va testlarni JSON sxema asosida yaratish hamda URL tahlili uchun `gemini-3.8-flash`, konspektning qisqa audio-xulosasini o'qib berish uchun `gemini-3.8-flash-lite-tts` modellaridan foydalanish.
  - *Why*: API kalit xavfsizligini to'liq ta'minlaydi, `responseSchema` orqali xatosiz strukturali ma'lumot (konspekt + kartochka + test) olinadi va bepul/standart API kalitda yuqori tezlikda ishlaydi.
  - *Alternatives Considered*: Har bir o'quv vositasi (konspekt, kartochka, test) uchun alohida-alohida so'rov yuborish — bu foydalanuvchi kutish vaqtini 3 barobarga oshirib yuboradi; yagona strukturali so'rov esa barchasini bir martada tayyorlaydi.
- **Decision 2: Ma'lumotlarni Saqlash va Tayyor Namunalar (Zero-State Experience)**
  - *Chosen Approach*: Foydalanuvchi yaratgan barcha konspektlar va test natijalarini `localStorage` orqali brauzerda doimiy saqlash hamda ilova ilk bor ochilganda 2 ta boyitilgan namunaviy darslikni (masalan, *"Sun'iy Intellekt va Neyron Tarmoqlar Asoslari"* hamda *"Inson Miyasi va Xotira Mexanizmlari"*) tayyor holda taqdim etish.
  - *Why*: Foydalanuvchi ro'yxatdan o'tmasdan ham darhol flesh-kartochkalar, testlar va AI ustozni sinab ko'rishi hamda o'z konspektlarini yo'qotmasdan saqlab borishi mumkin.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     BilimStudio Client (React 19)                       │
├───────────────────────┬─────────────────────────────────────────────────┤
│   Top Navigation Bar  │  Brand · [Konspekt | Kartochkalar | Test | AI]  │
├───────────────────────┼─────────────────────────────────────────────────┤
│  Chap Panel (Library) │           Asosiy O'quv Sahnasi (Stage)          │
│  ┌─────────────────┐  │  ┌───────────────────────────────────────────┐  │
│  │ + Yangi Manba   │  │  │ 1. Strukturali Konspekt + Audio Xulosa    │  │
│  │ (Matn/PDF/Audio │  │  │    - Bo'limlar, Asosiy xulosalar, Lug'at  │  │
│  │  /URL modal)    │  │  ├───────────────────────────────────────────┤  │
│  ├─────────────────┤  │  │ 2. Interaktiv Flesh-kartochkalar          │  │
│  │ Saqlangan       │  │  │    - Old/Orqa 3D karta, O'zlashtirish     │  │
│  │ Darsliklar      │  │  ├───────────────────────────────────────────┤  │
│  │ - Qidiruv       │  │  │ 3. Bilimni Tekshirish Testi (Quiz)        │  │
│  │ - Ro'yxat       │  │  │    - 4 variant, izohlar, ball hisoblagich │  │
│  │ - O'chirish     │  │  ├───────────────────────────────────────────┤  │
│  └─────────────────┘  │  │ 4. AI Ustoz Chati (Mavzu doirasida)       │  │
│                       │  └───────────────────────────────────────────┘  │
└───────────┬───────────┴────────────────────────┬────────────────────────┘
            │ HTTP / JSON (Base64 Audio/PDF)     │
            ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Express Backend Server (server.ts)                  │
├─────────────────────────────────────────────────────────────────────────┤
│  • POST /api/study/generate   -> gemini-3.8-flash (JSON Schema + URL)   │
│  • POST /api/study/transcribe -> gemini-3.5-transcribe (Audio -> Matn)  │
│  • POST /api/study/tts        -> gemini-3.8-flash-lite-tts (WAV Audio)  │
│  • POST /api/study/chat       -> gemini-3.8-flash (Kontekstli AI Ustoz) │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`StudySession` (O'quv to'plami)**:
  - `id`, `title`, `createdAt`, `sourceType` (`text` | `pdf` | `audio` | `url`), `readingTimeMinutes`, `rawSourceText`.
  - `summary`: `{ overview: string, keyTakeaways: string[], sections: { heading: string, content: string, bulletPoints: string[] }[], glossary: { term: string, definition: string }[] }`.
  - `flashcards`: `Array<{ id: string, front: string, back: string, status: 'unseen' | 'learning' | 'mastered' }>`.
  - `quiz`: `Array<{ id: string, question: string, options: string[], correctIndex: number, explanation: string }>`.
  - `chatHistory`: `Array<{ role: 'user' | 'model', text: string, timestamp: string }>`.
  - `audioSummaryBase64`: Ovozli xulosa (`audio/wav`) keshlangan ma'lumoti.

### Interactive Component & State Mapping

- **Manba Kiritish Modali (`SourceInputModal`)**:
  - *Matn va URL*: Bo'sh maydonlarni tekshiradi; URL kiritilganda serverda `urlContext` / `googleSearch` vositasi orqali maqola mazmuni olinadi.
  - *PDF Yuklash*: PDF faylni base64 formatga o'girib, bevosita Gemini multimodal modeliga `application/pdf` sifatida yuboradi.
  - *Jonli Ovoz Yozish (`MediaRecorder`)*: Mikrofon ruxsatini so'raydi, yozib olingan audio bo'laklarni `Blob` qilib yig'adi, avval `/api/study/transcribe` orqali matnga aylantiradi, foydalanuvchiga transkripsiyani ko'rsatadi va undan to'liq konspekt yaratadi.
- **Konspekt va Lug'at Oynasi (`NotesView`)**:
  - Bo'limlar bo'yicha tezkor navigatsiya, lug'atdagi atamalarni qidirish, konspektni nusxalash va `"Ovozli eshitish"` tugmasi bosilganda `/api/study/tts` orqali audio o'ynatish (`<audio>` pleer).
- **Flesh-kartochkalar Oynasi (`FlashcardsView`)**:
  - Kartochkani aylantirish, `"Bilaman (Mastered)"` va `"Takrorlash kerak (Learning)"` tugmalari orqali kartochka holatini yangilash, kartochkalarni aralashtirish (Shuffle) va faqat o'zlashtirilmagan kartochkalarni filtrlash.
- **Test Oynasi (`QuizView`)**:
  - Variantni tanlaganda darhol to'g'ri/noto'g'ri ekanligini va ilmiy izohini ko'rsatish, yakunda o'zlashtirish foizini hisoblash hamda `"Qayta topshirish"` yoki `"Yangi savollar tuzish"` imkoniyati.
- **AI Ustoz Chati (`TutorChatView`)**:
  - Joriy konspekt matnini tizim ko'rsatmasi (`systemInstruction`) sifatida biriktirib, foydalanuvchi savollariga aniq va tushunarli javob qaytarish hamda tez-tez beriladigan tezkor savol tugmalarini (`"Soddaroq tushuntir"`, `"Hayotiy misol keltir"`, `"Imtihon savoli ber"`) taqdim etish.
