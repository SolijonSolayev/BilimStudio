import { StudySession } from "../types";

export const SAMPLE_SESSIONS: StudySession[] = [
  {
    id: "session-neuroplasticity-01",
    title: "Neyroplastiklik va Inson Xotirasi Mexanizmlari",
    createdAt: "24 Oktabr 2026",
    sourceType: "text",
    sourceLabel: "Neyrobiologiya ma'ruzasi",
    readingTimeMinutes: 6,
    rawSourceText:
      "Neyroplastiklik — inson miyasining hayot davomida yangi tajribalar, o'rganish va muhit ta'sirida o'z neyron aloqalarini qayta qurish qobiliyatidir. Uzoq muddatli xotira gippokamp va neokorteks o'rtasidagi sinaptik mustahkamlanish (Long-Term Potentiation - LTP) orqali shakllanadi.",
    summary: {
      overview:
        "Neyroplastiklik — miyaning o'zgaruvchan sharoitlarga moslashish, yangi bilimlarni o'zlashtirish va shikastlanishlardan keyin funksiyalarni tiklash uchun sinaptik aloqalarni qayta tashkil etish qobiliyatidir. Zamonaviy neyrobiologiya miya faqat bolalikda emas, balki butun umr davomida faol o'zgarib borishini isbotlagan.\n\nO'rganish jarayonida neyronlar o'rtasida elektr va kimyoviy signallar almashinuvi kuchayadi. Donald Xebb qoidasiga ko'ra, bir vaqtda faollashgan neyronlar o'zaro bog'lanadi va bu bog'lanish takrorlash hamda chuqur uyqu fazasida uzoq muddatli xotiraga aylanadi.",
      audioScript:
        "Neyroplastiklik — inson miyasining yangi bilim va tajribalar ta'sirida o'z neyron aloqalarini yangilash qobiliyatidir. Qisqa muddatli ma'lumotlar gippokampda vaqtincha saqlanadi, so'ngra chuqur uyqu va intervalli takrorlash yordamida neokorteksga — uzoq muddatli xotiraga ko'chiriladi. Har safar yangi ko'nikmani mashq qilganingizda sinapslar mustahkamlanib, mielinizatsiya hisobiga fikrlash tezligi oshadi.",
      keyTakeaways: [
        "Neyroplastiklik butun umr davomida saqlanib qoladi va faol aqliy mashqlar orqali rag'batlantiriladi.",
        "Xebb qoidasi: 'Birga faollashgan neyronlar bir-biriga bog'lanadi' — har qanday ko'nikma takrorlash orqali avtomatlashadi.",
        "Gippokamp yangi bilimlarni kodlash markazi bo'lsa, neokorteks ularni uzoq muddatli saqlash omboridir.",
        "Chuqur uyqu (NREM va REM fazalari) kunduzgi o'rganilgan ma'lumotlarni saralab, doimiy xotiraga muhrlaydi.",
        "Intervalli takrorlash (Spaced Repetition) va faol eslash (Active Recall) sinaptik aloqalarni passiv o'qishga qaraganda 3 barobar kuchliroq mustahkamlaydi.",
      ],
      sections: [
        {
          heading: "01. Sinaptik Plastiklik va Uzoq Muddatli Potensiatsiya (LTP)",
          content:
            "Ikki neyron o'rtasidagi muloqot nuqtasi sinaps deb ataladi. Yangi ma'lumot o'rganilganda presinaptik neyrondan glutamat neyromediatori ajralib chiqadi va postsinaptik neyronning NMDA hamda AMPA retseptorlarini faollashtiradi. Natijada postsinaptik neyronga kalsiy ionlari kirib, signal uzatish samaradorligini uzoq vaqtga oshiradi.",
          bulletPoints: [
            "LTP (Long-Term Potentiation) — sinapslarning signal o'tkazuvchanlik qobiliyatining uzoq muddatli kuchayishi.",
            "Glutamat va NMDA retseptorlari o'rganish jarayonidagi asosiy molekulyar kalit hisoblanadi.",
            "Ishlatilmagan neyron aloqalari 'sinaptik kesish' (synaptic pruning) orqali zaiflashib yo'qoladi.",
          ],
          keyFormulaOrInsight:
            "Xebb qonuni: Δw_ij = η · x_i · y_j (Neyronlar bir vaqtda qo'zg'alganda ular orasidagi sinaptik vazn ortadi).",
        },
        {
          heading: "02. Xotira Konsolidatsiyasi: Gippokampdan Neokorteksga",
          content:
            "Yangi faktlar yoki ma'ruzani tinglaganimizda ma'lumot dastlab qisqa muddatli ishchi xotirada (prefrontal korteks) va gippokampda qayd etiladi. Biroq gippokampning sig'imi cheklangan. Tungi uyqu vaqtida gippokamp ushbu neyron naqshlarni tezlashtirilgan rejimda qayta ijro etib, ularni neokorteksning turli bo'limlariga uzatadi.",
          bulletPoints: [
            "Ishchi xotira bir vaqtning o'zida o'rtacha 4±1 ta ma'lumot blokini ushlab tura oladi.",
            "Tizimli konsolidatsiya jarayoni bir necha kundan bir necha oygacha davom etadi.",
            "Emotsional ahamiyatga ega ma'lumotlar bodomsimon tana (amigdala) ishtirokida tezroq eslab qolinadi.",
          ],
          keyFormulaOrInsight:
            "Kodlash (Gippokamp) → Konsolidatsiya (Uyqu va Takrorlash) → Qayta tiklash (Prefrontal va Neokorteks).",
        },
        {
          heading: "03. Samarali O'rganishning Neyrobiologik Strategiyalari",
          content:
            "Kitobni qayta-qayta passiv o'qish miyada 'tanishlik illyuziyasi'ni hosil qiladi, lekin sinapslarni mustahkamlamaydi. Haqiqiy neyroplastik o'zgarish miya ma'lumotni xotiradan kuch bilan qidirib topganda — ya'ni flesh-kartochkalar, testlar va o'z so'zi bilan tushuntirish (Feynman usuli) qo'llanilganda yuz beradi.",
          bulletPoints: [
            "Faol eslash (Active Recall) mielin qobig'ining qalinlashishini tezlashtiradi.",
            "Ebbingxauz unutish egri chizig'ini yengish uchun 1-kun, 3-kun, 7-kun va 21-kun intervallarida takrorlash zarur.",
            "Jismoniy faollik BDNF (Brain-Derived Neurotrophic Factor) oqsilini ko'paytirib, yangi neyronlar o'sishiga yordam beradi.",
          ],
          keyFormulaOrInsight:
            "Eslab qolish ehtimoli: R = e^(-t / S), bu yerda t — vaqt, S — xotira mustahkamligi.",
        },
      ],
      glossary: [
        {
          term: "Neyroplastiklik",
          definition: "Miyaning tajriba va o'rganish natijasida o'z tuzilishi hamda neyron aloqalarini o'zgartirish qobiliyati.",
          category: "Asosiy tushuncha",
        },
        {
          term: "Uzoq muddatli potensiatsiya (LTP)",
          definition: "Neyronlarning birgalikda faollashuvi natijasida sinaptik aloqa kuchining uzoq vaqtga oshishi.",
          category: "Molekulyar jarayon",
        },
        {
          term: "Gippokamp",
          definition: "Miyaning chakka qismida joylashgan, yangi xotiralarni shakllantirish va fazoviy mo'ljal olishga javobgar tuzilma.",
          category: "Miya anatomiyasi",
        },
        {
          term: "Sinaptik kesish (Pruning)",
          definition: "Miya samaradorligini oshirish uchun kam ishlatiladigan neyron aloqalarining yo'qotilishi.",
          category: "Jarayon",
        },
        {
          term: "Mielinizatsiya",
          definition: "Neyron aksonlarining mielin qobig'i bilan o'ralishi; elektr impulslarining uzatilish tezligini oshiradi.",
          category: "Neyrobiologiya",
        },
        {
          term: "BDNF oqsili",
          definition: "Mavjud neyronlarni qo'llab-quvvatlovchi va yangi sinapslar o'sishini rag'batlantiruvchi neyrotrofik omil.",
          category: "Biokimyo",
        },
      ],
    },
    flashcards: [
      {
        id: "fc-1",
        front: "Neyroplastiklik nima?",
        back: "Inson miyasining hayot davomida tajriba va o'rganish ta'sirida o'z neyron aloqalarini qayta qurish va moslashish qobiliyati.",
        hint: "Miyaning o'zgaruvchanligi",
        status: "mastered",
      },
      {
        id: "fc-2",
        front: "Xebb qoidasining asosiy mazmuni qanday?",
        back: "Bir vaqtda faollashgan neyronlar o'zaro bog'lanadi va ular orasidagi sinaptik aloqa mustahkamlanadi.",
        hint: "Cells that fire together...",
        status: "learning",
      },
      {
        id: "fc-3",
        front: "Gippokamp va Neokorteksning xotiradagi vazifasi nimadan farq qiladi?",
        back: "Gippokamp yangi ma'lumotlarni dastlabki kodlash va vaqtincha saqlashni bajaradi, neokorteks esa ularni uzoq muddatli xotirada saqlaydi.",
        hint: "Vaqtinchalik bufer va doimiy ombor",
        status: "unseen",
      },
      {
        id: "fc-4",
        front: "LTP (Long-Term Potentiation) jarayonida qaysi neyromediator asosiy rol o'ynaydi?",
        back: "Glutamat neyromediatori hamda NMDA va AMPA retseptorlari.",
        hint: "Asosiy qo'zg'atuvchi neyromediator",
        status: "unseen",
      },
      {
        id: "fc-5",
        front: "Sinaptik kesish (Synaptic Pruning) nima uchun kerak?",
        back: "Ishlatilmayotgan va ortiqcha neyron aloqalarni tozalab, muhim neyron tarmoqlarining energiya va tezlik samaradorligini oshirish uchun.",
        hint: "Bog'dagi daraxt shoxlarini butash kabi",
        status: "unseen",
      },
      {
        id: "fc-6",
        front: "Nima uchun kitobni qayta o'qishdan ko'ra flesh-kartochka va test ishlash samaraliroq?",
        back: "Chunki faol eslash (Active Recall) neyron zanjirlarini kuch bilan ishga tushirib, mielinizatsiya va sinaptik mustahkamlanishni tezlashtiradi.",
        hint: "Passiv tanishlik vs Faol eslash",
        status: "unseen",
      },
    ],
    quiz: [
      {
        id: "qz-1",
        question: "Yangi o'rganilgan ma'lumotlarni qisqa muddatli xotiradan uzoq muddatli xotiraga o'tkazishda qaysi miya tuzilmasi asosiy 'ko'prik' vazifasini bajaradi?",
        options: [
          "Gippokamp",
          "Miyacha (Cerebellum)",
          "Uzunchoq miya",
          "Ko'rish do'mbog'i (Talamus)",
        ],
        correctIndex: 0,
        explanation:
          "Gippokamp yangi deklarativ xotiralarni dastlabki kodlash va konsolidatsiya davomida neokorteksga uzatish uchun javobgardir.",
      },
      {
        id: "qz-2",
        question: "Uzoq muddatli potensiatsiya (LTP) vaqtida postsinaptik neyron ichiga qaysi ionlarning kirishi sinaps mustahkamlanishini boshlab beradi?",
        options: [
          "Xlor (Cl-) ionlari",
          "Kalsiy (Ca2+) ionlari",
          "Temir (Fe2+) ionlari",
          "Ftor (F-) ionlari",
        ],
        correctIndex: 1,
        explanation:
          "NMDA retseptorlari ochilganda postsinaptik neyronga Kalsiy (Ca2+) ionlari oqib kiradi va hujayra ichidagi kinaza fermentlarini faollashtirib, sinapsni kuchaytiradi.",
      },
      {
        id: "qz-3",
        question: "Insonning ishchi xotirasi (Working Memory) bir vaqtning o'zida o'rtacha nechta ma'lumot blokini samarali ushlab tura oladi?",
        options: [
          "15–20 ta blokni",
          "4 ± 1 ta ma'lumot blokini",
          "Cheksiz miqdordagi blokni",
          "Faqat 1 ta blokni",
        ],
        correctIndex: 1,
        explanation:
          "Zamonaviy kognitiv psixologiya (Kouen tadqiqotlari) ishchi xotira sig'imi o'rtacha 3 tadan 5 tagacha (4±1) ma'lumot birligiga teng ekanini ko'rsatadi.",
      },
      {
        id: "qz-4",
        question: "Jismoniy mashqlar vaqtida ajralib chiqib, yangi sinapslar va neyronlar o'sishini rag'batlantiruvchi oqsil qaysi?",
        options: [
          "Gemoglobin",
          "BDNF (Brain-Derived Neurotrophic Factor)",
          "Insulin",
          "Kollagen",
        ],
        correctIndex: 1,
        explanation:
          "BDNF oqsili miyada neyrogenez va sinaptik plastiklikni rag'batlantiruvchi eng muhim neyrotrofik omildir.",
      },
    ],
    chatHistory: [
      {
        id: "msg-welcome-1",
        role: "model",
        text: "Assalomu alaykum! Men **Neyroplastiklik va Inson Xotirasi Mexanizmlari** darsligi bo'yicha AI Ustozingizman. Sinaptik plastiklik, LTP jarayoni yoki samarali eslab qolish usullari bo'yicha istalgan savolingizni berishingiz mumkin.",
        timestamp: "10:00",
      },
    ],
  },
  {
    id: "session-transformers-ai-02",
    title: "Transformer Arxitekturasi va Katta Til Modellari (LLM)",
    createdAt: "23 Oktabr 2026",
    sourceType: "pdf",
    sourceLabel: "Attention Is All You Need.pdf",
    readingTimeMinutes: 8,
    rawSourceText:
      "2017-yilda taqdim etilgan Transformer arxitekturasi rekurrent neyron tarmoqlardan (RNN) voz kechib, to'liq Self-Attention (O'z-o'ziga e'tibor qaratish) mexanizmiga asoslandi. Bu matndagi so'zlar orasidagi uzoq masofali bog'liqliklarni parallel hisoblash imkonini yaratdi.",
    summary: {
      overview:
        "Transformer arxitekturasi zamonaviy Sun'iy Intellekt inqilobining asosiy poydevori hisoblanadi. Avvalgi RNN va LSTM modellari matnni so'zma-so'z ketma-ket qayta ishlagani sababli sekin ishlagan va uzun matnlarda kontekstni yo'qotib qo'ygan.\n\nSelf-Attention mexanizmi esa gapdagi har bir tokenning boshqa barcha tokenlar bilan ma'noviy bog'liqlik darajasini bir vaqtning o'zida (parallel) hisoblaydi. Natijada GPU klasterlarida milliardlab parametrli modellarni o'qitish imkoniyati paydo bo'ldi.",
      audioScript:
        "Transformer arxitekturasi matnni ketma-ket emas, balki barcha so'zlarni bir vaqtda parallel tahlil qilish orqali sun'iy intellekt olamini tubdan o'zgartirdi. Uning yuragi bo'lgan Self-Attention mexanizmi Query, Key va Value vektorlari yordamida gapdagi har bir so'zning kontekstdagi asl ma'nosini aniqlaydi. Pozitsion kodlash esa so'zlarning gapdagi tartibini saqlab qolishga xizmat qiladi.",
      keyTakeaways: [
        "Transformerlar RNN va LSTM modellaridagi ketma-ketlik cheklovini bartaraf etib, to'liq parallel o'qitishni ta'minlaydi.",
        "Self-Attention mexanizmi har bir token uchun Query (So'rov), Key (Kalit) va Value (Qiymat) vektorlarini hisoblaydi.",
        "Multi-Head Attention modelga bir vaqtning o'zida grammatik, semantik va mantiqiy bog'liqliklarni alohida 'nigohlar' bilan ko'rish imkonini beradi.",
        "Positional Encoding (Pozitsion kodlash) parallel qayta ishlashda so'zlarning ketma-ketlik tartibini yo'qotmaslik uchun token vektorlariga qo'shiladi.",
      ],
      sections: [
        {
          heading: "01. Tokenizatsiya va Vektorli Embeddinglar",
          content:
            "Neyron tarmoqlar matnni to'g'ridan-to'g'ri tushunmaydi. Kiritilgan matn dastlab BPE (Byte-Pair Encoding) kabi algoritmlar yordamida tokenlarga (so'z yoki bo'g'in bo'laklariga) ajratiladi. Har bir token ko'p o'lchovli fazodagi sonli vektorga (Embedding) aylantiriladi.",
          bulletPoints: [
            "Ma'nosi yaqin so'zlar vektor fazosida bir-biriga yaqin nuqtalarda joylashadi.",
            "Pozitsion kodlash (sinus va kosinus funksiyalari yoki RoPE) so'zning gapdagi o'rnini belgilaydi.",
          ],
          keyFormulaOrInsight:
            "InputRepresentation = TokenEmbedding(x) + PositionalEncoding(pos)",
        },
        {
          heading: "02. Scaled Dot-Product Attention Mexanizmi",
          content:
            "O'z-o'ziga e'tibor qaratish mexanizmi uchta matritsa ustida quriladi: Q (Query), K (Key) va V (Value). Query va Key vektorlarining skalyar ko'paytmasi hisoblanib, o'lcham ildiziga (√d_k) bo'linadi va Softmax funksiyasi orqali 0 dan 1 gacha bo'lgan e'tibor vaznlariga aylantiriladi.",
          bulletPoints: [
            "√d_k ga bo'lish katta o'lchamlarda Softmax gradientlari juda kichrayib ketishining (vanishing gradients) oldini oladi.",
            "Decoder modellarida kelajakdagi so'zlarni ko'rib qo'ymaslik uchun Masked Self-Attention ishlatiladi.",
          ],
          keyFormulaOrInsight:
            "Attention(Q, K, V) = softmax((Q · K^T) / √d_k) · V",
        },
      ],
      glossary: [
        {
          term: "Self-Attention",
          definition: "Ketma-ketlikdagi har bir elementning boshqa barcha elementlar bilan bog'liqlik vaznini hisoblovchi mexanizm.",
          category: "Arxitektura",
        },
        {
          term: "Token",
          definition: "Til modeli qayta ishlaydigan eng kichik matn birligi (to'liq so'z, so'z qismi yoki belgi).",
          category: "Asosiy tushuncha",
        },
        {
          term: "Positional Encoding",
          definition: "Ketma-ketlikdagi tokenlarning joylashuv tartibini modelga bildiruvchi matematik vektor.",
          category: "Matematik usul",
        },
        {
          term: "Multi-Head Attention",
          definition: "E'tibor mexanizmini bir nechta mustaqil fazolarda parallel bajarib, natijalarni birlashtirish usuli.",
          category: "Arxitektura",
        },
      ],
    },
    flashcards: [
      {
        id: "fc-ai-1",
        front: "Self-Attention formulasidagi Q, K va V nimani anglatadi?",
        back: "Query (So'rov), Key (Kalit) va Value (Qiymat) vektor matritsalari.",
        hint: "Qidiruv tizimi analogiyasi",
        status: "unseen",
      },
      {
        id: "fc-ai-2",
        front: "Nima uchun Attention formulasida skalyar ko'paytma √d_k ga bo'linadi?",
        back: "Katta o'lchamli vektorlarda ko'paytma qiymati haddan tashqari oshib, Softmax gradientlari nolga yaqinlashib qolishining oldini olish uchun.",
        hint: "Gradient barqarorligi",
        status: "unseen",
      },
      {
        id: "fc-ai-3",
        front: "Transformerlarda Positional Encoding nima uchun shart?",
        back: "Chunki Transformer barcha so'zlarni bir vaqtda parallel qabul qiladi va pozitsion kodlash bo'lmasa, so'zlarning ketma-ketlik tartibini farqlay olmaydi.",
        hint: "Tartibni saqlash",
        status: "unseen",
      },
    ],
    quiz: [
      {
        id: "qz-ai-1",
        question: "Transformer arxitekturasi RNN modellariga nisbatan qanday asosiy ustunlikka ega?",
        options: [
          "Faqatgina rasmlar bilan ishlay oladi",
          "Matn tokenlarini parallel qayta ishlaydi va uzoq masofali kontekstni yo'qotmaydi",
          "Hech qanday GPU xotirasini talab qilmaydi",
          "Faqat bitta qatlamdan iborat bo'ladi",
        ],
        correctIndex: 1,
        explanation:
          "RNN modellari so'zlarni ketma-ket hisoblagani uchun parallel o'qitish imkonsiz edi; Transformer esa butun ketma-ketlikni parallel qayta ishlaydi.",
      },
      {
        id: "qz-ai-2",
        question: "Scaled Dot-Product Attention formulasida ehtimollik vaznlarini (yig'indisi 1 ga teng bo'lgan sonlarni) olish uchun qaysi funksiya qo'llaniladi?",
        options: ["ReLU", "Sigmoid", "Softmax", "Tanh"],
        correctIndex: 2,
        explanation:
          "Softmax funksiyasi barcha tokenlar bo'yicha hisoblangan ballarni yig'indisi 1.0 ga teng bo'lgan e'tibor taqsimotiga aylantiradi.",
      },
    ],
    chatHistory: [
      {
        id: "msg-welcome-2",
        role: "model",
        text: "Salom! **Transformer Arxitekturasi va Katta Til Modellari** konspekti bo'yicha savollaringiz bormi? Self-Attention formulasi yoki tokenizatsiya qanday ishlashini birgalikda tahlil qilishimiz mumkin.",
        timestamp: "14:20",
      },
    ],
  },
];
