# BilimStudio

BilimStudio — matn, PDF, ovozli ma'ruza va veb-maqolalarni strukturali konspekt, flesh-kartochkalar, test savollari va AI Ustoz bilan ishlashga aylantiruvchi zamonaviy ta'lim platformasi.

Ushbu loyiha o'quv materiallarini tezda o'rganishga yordam beradi: foydalanuvchi manbani yuklaganidan so'ng, tizim uni tahlil qilib, ilmiy konspekt, audiomurojaat, quiz va shaxsiy AI yordamchisini avtomatik tarzda shakllantiradi.

## Asosiy xususiyatlar

- Matn, PDF, ovozli audio va URL manbalaridan konspekt yaratish
- O'zbek tilida muhandislik darajasidagi akademik yozuvlar
- Qisqa va chuqur bo'limli o'quv notalari
- 8–10 ta flesh-kartochka va 6–8 ta test savoli avtomatik shakllanishi
- Audio transkripsiya va TTS (text-to-speech) funksiyasi
- AI Ustoz chat orqali mavzu bo'yicha savol-javob va izohlar
- Veb-interfeysi bilan ishlash: bitta panel ichida o'rganish, quiz va chat
- Mahalliy hisoblash (localStorage) orqali foydalanuvchi sessiyalarini saqlash

## Texnologiyalar

- React 19
- TypeScript
- Vite
- Express
- Google Gemini API
- Tailwind CSS
- Lucide React

## Loyiha arxitekturasi

```text
BilimStudio/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ types.ts
├─ .env.example
├─ .gitignore
├─ index.html
├─ metadata.json
├─ package.json
├─ server.ts
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

### Asosiy komponentlar

- `src/App.tsx` — asosiy ilova logikasi, sessiyalar, tablar va modallar
- `src/components/` — UI bloklar: notelar, flashcards, quiz, tutor chat va source modal
- `server.ts` — Express serveri va Gemini API endpointlari
- `package.json` — skriptlar, dependencylar va ishga tushirish konfiguratsiyasi

## Ishga tushirish uchun talablar

- Node.js 18+
- npm yoki pnpm
- Google Gemini API kaliti

## Tez boshlash

1. Repozitoriyani klonlang:

```bash
git clone https://github.com/SolijonSolayev/BilimStudio.git
cd BilimStudio
```

2. Dependencylarni o'rnating:

```bash
npm install
```

3. Muhit o'zgaruvchilarini sozlang:

```bash
cp .env.example .env
```

`.env` faylini ochib, quyidagilarni kiriting:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

> Agar AI Studio orqali ishlayotgan bo'lsangiz, API kalitni `Settings > Secrets` ichida ham sozlashingiz mumkin.

4. Dasturni dev rejimda ishga tushiring:

```bash
npm run dev
```

Bundan so'ng ilova odatda quyidagi manzilda ochiladi:

```text
http://localhost:3000
```

## Build qilish

Production build yaratish uchun:

```bash
npm run build
```

So'ngra serverni ishga tushiring:

```bash
npm run start
```

## API endpointlari

Loyiha server qismida quyidagi asosiy endpointlarni taqdim etadi:

- `POST /api/study/transcribe` — ovozni transkriptiya qilish
- `POST /api/study/generate` — konspekt, glossariy, quiz va flashcards yaratish
- `POST /api/study/tts` — matndan ovoz yaratish
- `POST /api/study/chat` — AI Ustoz bilan muloqot
- `POST /api/study/more-quiz` — qo'shimcha test savollarini yaratish

## Foydalanish sxemasi

1. Foydalanuvchi yangi mavzu yoki manba tanlaydi
2. Matn, PDF, ovoz yoki URL yuboriladi
3. Gemini modeli ma'lumotni o'rganadi va strukturali konspekt yaratadi
4. Tizim quyidagilarni avtomatik tarzda shakllantiradi:
   - sarlavha va umumiy ma'lumot
   - bo'limli konspekt
   - lug'at (glossary)
   - flesh-kartochkalar
   - test savollari
   - audio script va TTS
5. Foydalanuvchi AI Ustoz bilan mavzu bo'yicha savol-javob qiladi

## Ishlab chiqish uslubi

BilimStudio loyiha maqsadiga ko'ra akademik, ta'lim maqsadli va o'quv jarayonini tezlashtirishga yo'naltirilgan. Loyiha ishlab chiqishda quyidagi tamoyillar asos bo'ldi:

- oson va aniq interfeys
- shaxsiy o'rganish tajribasi
- ilmiy va tushunarli kontent
- AI yordamida tez uzatish va mustahkamlash
- foydalanuvchiga moslashtirilgan ta'lim

## Hissa qo'shish

Hissa qo'shmoqchimisiz? Quyidagi qadamlardan o'ting:

```bash
git checkout -b feature/your-feature
npm install
# o'zgartirishlarni qiling
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

Keyin GitHubda Pull Request oching.

## Muallif

- Solijon Solayev

## Eslatma

Bu loyiha Google Gemini API xizmatiga bog'liq bo'lib, API kalitining mavjudligi va to'g'ri sozlanishi kerak. Kalit yo'q bo'lsa yoki noto'g'ri bo'lsa, AI funksiyalar ishlamay qoladi.

---

Agar xohlasangiz, men bu README ni yanada yanada professional, startup uslubidagi versiyaga ham aylantiraman: hero section, logo, Screenshots, demo link, badges va deployment bo'limi bilan.
