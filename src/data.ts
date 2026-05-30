import { Roadmap, DayPlan, FocusType, Badge, ResourceItem } from "./types";

export interface GoalPreset {
  id: string;
  title: string;
  category: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  difficultyRecommended: string;
  topics: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
    furtherWeeks?: string[];
  };
  sampleQuiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  sampleProjects: {
    title: string;
    desc: string;
  }[];
  resources: {
    title: string;
    type: "Artikel" | "Video" | "Tools" | "Checklist" | "Latihan";
    url: string;
  }[];
}

export const GOALS_LIST: GoalPreset[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "frontend",
    iconName: "Layout",
    shortDesc: "HTML, CSS, JavaScript, responsive design, project web.",
    longDesc: "Pelajari cara membangun antarmuka web interaktif yang modern, responsif, dan ramah pengguna dengan menggunakan HTML, CSS, JavaScript, dan framework modern.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Pengenalan Web & HTML5", "Struktur Dokumen Semantik", "Tag Dasar & Multimedia HTML", "Tabel dan Formulir di HTML", "Hosting Web Statis Pertama"],
      week2: ["Dasar CSS & Box Model", "Flexbox & Grid Layout", "Responsive Design & Media Queries", "CSS Variables & Transisi", "Latihan Mockup Landing Page"],
      week3: ["Dasar JavaScript & Sintaks", "DOM Manipulation & Event Handling", "Variabel, Array, dan Object", "Kondisional & Perulangan JS", "Interaktivitas Form Web"],
      week4: ["Fetch API & Async/Await", "Error Handling & LocalStorage", "Git & GitHub Dasar", "Deploy Project Akhir dengan Vercel", "Persiapan Portofolio Frontend"],
      furtherWeeks: ["Clean Code JS & ES6+", "Debugging & Chrome DevTools", "CSS Framework (Tailwind CSS)", "Dasar Single Page Application", "Bundling dengan Vite & NPM"]
    },
    sampleQuiz: [
      {
        question: "Apa fungsi utama dari CSS?",
        options: ["Mengatur tampilan dan layout halaman web", "Menyimpan data user di database", "Membuat server web berjalan", "Menulis query database SQL"],
        answer: "Mengatur tampilan dan layout halaman web",
        explanation: "CSS (Cascading Style Sheets) digunakan untuk memformat tampilan visual halaman HTML."
      },
      {
        question: "Manakah tag HTML yang digunakan untuk membuat judul utama paling besar?",
        options: ["<h6>", "<head>", "<h1>", "<title>"],
        answer: "<h1>",
        explanation: "Tag <h1> digunakan untuk heading tingkat pertama atau judul utama paling besar pada halaman."
      },
      {
        question: "Bagaimana cara mendeklarasikan variabel yang nilainya tidak dapat diubah kembali di JavaScript?",
        options: ["const", "let", "var", "immutable"],
        answer: "const",
        explanation: "Keyword `const` membuat variabel yang berbentuk konstanta, yang berarti nilainya tidak dapat di-reassign setelah diinisialisasi."
      }
    ],
    sampleProjects: [
      {
        title: "Landing Page Pribadi",
        desc: "Buat halaman landing page portofolio statis yang responsif menggunakan HTML semantik dan CSS murni dengan Flexbox."
      },
      {
        title: "Aplikasi Kalkulator Sederhana",
        desc: "Buat kalkulator interaktif dengan JavaScript untuk mengolah operasi aritmatika dasar dan DOM manipulation."
      },
      {
        title: "Dashboard Todo List Modern",
        desc: "Buat aplikasi Todo List dengan fitur CRUD, kategori, filter status, dan data yang tersimpan di LocalStorage."
      }
    ],
    resources: [
      { title: "MDN Web Docs - HTML Basics", type: "Artikel", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics" },
      { title: "W3Schools CSS Tutorial", type: "Artikel", url: "https://www.w3schools.com/css/" },
      { title: "JavaScript.info - The Modern JS", type: "Artikel", url: "https://javascript.info/" },
      { title: "freeCodeCamp - Responsive Web Certification", type: "Latihan", url: "https://www.freecodecamp.org/" }
    ]
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    category: "uiux",
    iconName: "Figma",
    shortDesc: "Design thinking, wireframe, Figma, user flow, prototype.",
    longDesc: "Pelajari dasar desain produk digital mulai dari riset kebutuhan user, pembuatan kerangka blueprint (wireframe), elemen visual, hingga mockup interaktif (UI) di Figma.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Dasar UI/UX & Perbedaan Keduanya", "User-Centered Design & Design Thinking", "User Research & Membuat Persona", "Pemetaan Emosi & User Journey Maps", "Analisis Kompetitor Produk"],
      week2: ["Information Architecture (IA)", "User Flow & Task Flow", "Sketsa Kertas & Low-Fidelity Wireframe", "Prinsip Gestalt dalam Desain UI", "Menggunakan Tooling Dasar Figma"],
      week3: ["Teori Warna & Kontras Aksesibilitas", "Tipografi & Hirarki Visual UI", "Design System Dasar (Komponen & Varian)", "Mockup High-Fidelity (Hi-Fi) Pertama", "Auto Layout & Kontainer Fleksibel"],
      week4: ["Dasar Prototyping interaktif", "Micro-interactions & Animasi Transisi", "Usability Testing (UT) & Evaluasi Kerja", "Desain Serah Terima (Developer Handover)", "Portofolio UI/UX Case Study"],
      furtherWeeks: ["Riset Heuristic Evaluation", "A/B Testing pada Desain", "Eksplorasi Desain Responsif (Web vs App)", "Prinsip Dark Mode & UI Motion", "Seni Portofolio UX Writing"]
    },
    sampleQuiz: [
      {
        question: "Apa singkatan dari UX?",
        options: ["User Experience", "User Interface Extra", "Universal eXchange", "Unifying eXperiment"],
        answer: "User Experience",
        explanation: "UX adalah singkatan dari User Experience, yang mengacu pada keseluruhan pengalaman emosional pengguna dengan produk digital."
      },
      {
        question: "Manakah tool industri terpopuler saat ini untuk mendesain UI/UX?",
        options: ["Figma", "Excel", "Visual Studio Code", "VLC Player"],
        answer: "Figma",
        explanation: "Figma adalah aplikasi berbasis cloud kolaboratif yang menjadi tolok ukur utama industri desain UI/UX saat ini."
      }
    ],
    sampleProjects: [
      {
        title: "User Persona & User Flow App",
        desc: "Riset dan rancang dokumentasi Persona serta User Flow detail untuk sebuah aplikasi pesan antar makanan lokal."
      },
      {
        title: "Wireframe & Lo-Fi E-Commerce",
        desc: "Buat wireframe hitam-putih (Lo-Fi) untuk 3 layar kunci aplikasi belanja online di kertas maupun Figma."
      },
      {
        title: "Interactive Prototype Mobile App",
        desc: "Buat visual UI app yang megah (Hi-Fi), atur auto-layout, lengkapi fungsional prototype klik-pindah halaman di Figma."
      }
    ],
    resources: [
      { title: "Figma Help Center - Getting Started", type: "Tools", url: "https://help.figma.com/hc/en-us" },
      { title: "Laws of UX - Panduan Psikologi Desain", type: "Artikel", url: "https://lawsofux.com/" },
      { title: "UX Collective - Media Publikasi UX Terbesar", type: "Artikel", url: "https://uxdesign.cc/" }
    ]
  },
  {
    id: "saham",
    title: "Belajar Saham & Finansial",
    category: "saham",
    iconName: "TrendingUp",
    shortDesc: "Dasar saham, analisis teknikal, risiko, portofolio.",
    longDesc: "Pahami dasar-dasar investasi pasar modal secara rasional, mulai dari cara kerja bursa efek, analisis laporan keuangan instrumen, hingga grafik pergerakan harga untuk jangka panjang.",
    difficultyRecommended: "Pemula",
    topics: {
      week1: ["Pengertian Dasar Apa itu Saham", "Cara Kerja Bursa Efek Indonesia (BEI)", "Membuka Akun Sekuritas Pertama", "Mengenali Dividen & Capital Gain", "Psikologi Investasi & Mindset Pasar"],
      week2: ["Prinsip Analisis Fundamental", "Membaca Laporan Keuangan Neraca & Laba-Rugi", "Rasio Penting: PER, PBV, ROE, DER", "Menilai Valuasi Saham Murah/Mahal", "Memilih Saham Blue Chip untuk Pemula"],
      week3: ["Dasar Analisis Teknikal Saham", "Mengenali Trend: Uptrend, Downtrend, Sideways", "Membaca Bullish & Bearish Candlestick", "Konsep Support dan Resistance", "Indikator Dasar: Volume, MA, & RSI"],
      week4: ["Prinsip Diversifikasi Portofolio", "Money Management & Mengatur Risk-to-Reward", "Membuat Jurnal Investasi Mingguan", "Menghindari Saham Gorengan (Manipulatif)", "Evaluasi Portofolio Berkelanjutan"],
      furtherWeeks: ["Analisis Industri Makro & Sektor", "Membaca Bandarmologi (Aliran Dana)", "Dividen Investing Strategy", "Siklus Pasar Modal (Bull/Bear Market)", "Manajemen Risiko dengan Stop Loss / Dollar Cost Averaging"]
    },
    sampleQuiz: [
      {
        question: "Apa arti rasio PBV (Price to Book Value) yang di bawah angka 1?",
        options: ["Harga saham lebih murah daripada nilai buku asetnya", "Perusahaan dipastikan bangkrut tahun ini", "Perusahaan tidak memiliki utang sama sekali", "Saham tersebut tidak valid untuk dibeli"],
        answer: "Harga saham lebih murah daripada nilai buku asetnya",
        explanation: "PBV < 1 secara umum mengindikasikan harga saham di pasar diperdagangkan lebih murah atau diskon dibanding nilai buku bersih perusahaan."
      },
      {
        question: "Yang dimaksud dengan dividen adalah...",
        options: ["Pembagian keuntungan perusahaan kepada pemegang saham", "Selisih untung dari penjualan harga saham di pasar", "Biaya admin bulanan yang ditarik oleh sekuritas", "Utang jangka pendek yang wajib dilunasi bursa"],
        answer: "Pembagian keuntungan perusahaan kepada pemegang saham",
        explanation: "Dividen adalah bagian keuntungan korporasi yang didistribusikan kepada para pemegang saham secara periodik."
      }
    ],
    sampleProjects: [
      {
        title: "Skrining 5 Saham Menarik",
        desc: "Lakukan penyaringan 5 saham dengan kriteria PER < 15, ROE > 15%, dan DER < 1 di bursa efek."
      },
      {
        title: "Gambar Garis Support / Resistance",
        desc: "Unduh chart saham favoritmu, tandai trend utama, dan gambarkan 3 titik support dan resistance terdekat."
      },
      {
        title: "Portofolio Mockup Diversifikasi",
        desc: "Buat alokasi investasi Rp 10.000.000 virtual ke dalam 3-5 saham berbeda dengan manajemen risiko aman."
      }
    ],
    resources: [
      { title: "IDX - Panduan Investasi Saham BEI", type: "Artikel", url: "https://www.idx.co.id/" },
      { title: "Yahoo Finance - Cari Data Laporan keuangan", type: "Tools", url: "https://finance.yahoo.com/" },
      { title: "Stockbit - Forum Komunitas & Analisis Saham", type: "Tools", url: "https://stockbit.com/" }
    ]
  },
  {
    id: "matematika",
    title: "Jago Matematika Dasar",
    category: "matematika",
    iconName: "Percent",
    shortDesc: "Aritmatika, pecahan, desimal, persen, logika dasar.",
    longDesc: "Tingkatkan ketajaman logika aritmatika, operasi pecahan, perbandingan persen, aljabar linear, dan statistika dasar untuk kebutuhan akademis, tes kerja, maupun asah otak harian.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Hierarki Operasi Matematika (KABATAKU)", "Bilangan Bulat, Prima, & Desimal", "FPB & KPK secara Efektif", "Dasar Kelipatan & Faktor", "Tips Cara Berhitung Mental Cepat"],
      week2: ["Operasi Pecahan Dasar", "Persentase, Desimal & Perbandingan rasio", "Konversi Satuan Ukur Global", "Aplikasi Soal Cerita Persen Sehari-hari", "Logika Matematika Sederhana"],
      week3: ["Suku Aljabar & Variabel Dasar", "Persamaan Linear Satu Variabel", "Teorema Pythagoras & Segitiga", "Rumus Luas & Keliling Bangun Datar", "Sistem Koordinat Kartesius"],
      week4: ["Statistika Dasar: Mean, Median, Modus", "Penyajian Data (Diagram & Grafik)", "Peluang Kejadian Sederhana", "Latihan Soal Ujian Kemampuan Logika", "Evaluasi Kemampuan Berpikir Kritis"],
      furtherWeeks: ["Persamaan Kuadrat Sederhana", "Konsep Rasio & Proporsi Kontinu", "Bilangan Berpangkat & Akar Selisih", "Pengenalan Dasar Trigonometri Sin-Cos", "Penerapan Logika Matematika di Algoritma"]
    },
    sampleQuiz: [
      {
        question: "Berapa hasil dari operasi: 10 + 5 x 2 - 4 ?",
        options: ["16", "26", "22", "12"],
        answer: "16",
        explanation: "Sesuai aturan hierarki operasi, perkalian dikerjakan terlebih dahulu: 5 x 2 = 10. Kemudian 10 + 10 - 4 = 16."
      },
      {
        question: "Jika harga baju Rp 200.000 diskon 25%, berapakah harga yang harus dibayar?",
        options: ["Rp 150.000", "Rp 175.000", "Rp 125.000", "Rp 100.000"],
        answer: "Rp 150.000",
        explanation: "Diskon = 25% x 200.000 = Rp 50.000. Harga bayar = 200.000 - 50.000 = Rp 150.000."
      }
    ],
    sampleProjects: [
      {
        title: "Cheat Sheet Rumus Esensial",
        desc: "Tulis ringkasan rapi rumus hitung cepat KABATAKU, pecahan, desimal, dan persen di kertas catatan estetik."
      },
      {
        title: "Simulasi Belanja dengan Diskon Ganda",
        desc: "Selesaikan 10 soal cerita simulasi diskon kumulatif e-commerce (Misal diskon 30% + cashback + admin)."
      },
      {
        title: "Dashboard Grafik Keuangan Pribadi",
        desc: "Gunakan data fiktif pemasukan bulanan untuk menghitung persentase alokasi, lalu buat grafik visualisasinya."
      }
    ],
    resources: [
      { title: "Khan Academy - Math Foundations", type: "Video", url: "https://www.khanacademy.org/math" },
      { title: "Math is Fun - Dasar Matematika Interaktif", type: "Artikel", url: "https://www.mathsisfun.com/" }
    ]
  },
  {
    id: "content",
    title: "Jadi Content Creator",
    category: "content",
    iconName: "Video",
    shortDesc: "Ide konten, script, editing, branding, upload konsisten.",
    longDesc: "Temukan niche unikmu, susun naskah video yang atraktif, pelajari teknik editing video pendek di CapCut/Premiere, dan bangun strategi branding di TikTok/Instagram/YouTube shorts.",
    difficultyRecommended: "Pemula",
    topics: {
      week1: ["Menentukan Niche Konten & Audiens Target", "Riset Ide Konten Menggunakan Trend", "Menganalisis Kompetitor Kreator", "Menyiapkan Branding Profil Sosmed", "Latihan Menghadapi Kamera Tanpa Malu"],
      week2: ["Formula Hook (3 Detik Pertama Video)", "Menulis Naskah (Script) Konten Pendek", "Mengenal Struktur Storytelling (3-Act-Structure)", "Teknik Setup Kamera & Set Pencahayaan", "Perekaman Audio yang Jelas & Profesional"],
      week3: ["Pengenalan Aplikasi Editing CapCut / Premiere", "Teknik Memotong (Splitting) & Pacing Konten", "Menambahkan Musik Latar & Efek Suara", "Membuat Subtitle Otomatis & Dynamic Text", "Memilih Thumbnail & Cover Menarik"],
      week4: ["Memahami Algoritma Sosial Media Terkini", "Cara Menulis Caption/Hashtag Ramah SEO", "Membuat Kalender Jadwal Posting Konsisten", "Menganalisis Traffic & Metrik Analitik", "Evaluasi Kolaborasi & Monetisasi Konten"],
      furtherWeeks: ["SEO YouTube & Kata Kunci", "Membangun Personal Brand Jangka Panjang", "Optimasi Thumbnail Click-Through Rate (CTR)", "Teknik Editing Transisi Kreatif", "Cara Mendapatkan Sponsor & Endorse"]
    },
    sampleQuiz: [
      {
        question: "Bagian manakah dari video pendek (TikTok/Shorts) yang paling krusial untuk menahan retensi penonton?",
        options: ["3 Detik pertama (Hook)", "Tulisan bio profil kreator", "Warna baju yang dipakai", "Credits penutup di akhir video"],
        answer: "3 Detik pertama (Hook)",
        explanation: "Hook penentu dalam 3 detik pertama sangat vital untuk mencegah audiens meng-scroll lewat video Anda."
      }
    ],
    sampleProjects: [
      {
        title: "Analisis Mind-Map 3 Niche Idaman",
        desc: "Buat diagram ide konten, target audiens, dan keunikan personal branding Anda di 3 sektor yang disukai."
      },
      {
        title: "Tulis 3 Script Video Pendek",
        desc: "Susun naskah video orisinal berdurasi 60 detik lengkap dengan pembagian visual Hook, Body, dan Call to Action."
      },
      {
        title: "Edit Video Pendek 30 Detik",
        desc: "Rekam video diri sendiri, potong bagian hening, tambahkan B-Roll relevan, subtitle dinamis, dan musik trendi."
      }
    ],
    resources: [
      { title: "YouTube Creators - Channel Strategi Konten", type: "Video", url: "https://www.youtube.com/creators/" },
      { title: "CapCut Academy - Dasar Editing Video", type: "Tools", url: "https://www.capcut.com/" }
    ]
  },
  {
    id: "speaking",
    title: "Belajar Public Speaking",
    category: "speaking",
    iconName: "Mic",
    shortDesc: "Struktur bicara, latihan suara, gesture, percaya diri.",
    longDesc: "Kuasai teknik mengatasi demam panggung, memproyeksikan vokal yang bertenaga, memanfaatkan bahasa tubuh (gesture), serta menyusun kerangka pidato persuasif yang memukau audiens.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Cara Mengatasi Nervousness & Gemetar", "Teknik Napas Diafragma untuk Stamina Suara", "Mengenali Karakteristik Audiens", "Postur dan Bahasa Tubuh Saat Berdiri", "Bahasa Isyarat Tangan (Gesture) Alami"],
      week2: ["Kerangka Pidato (Opening, Body, Closing)", "Membuat Elevator Pitch 60 Detik", "Teknik Storytelling untuk Menarik Empati", "Mengatur Pacing Berbicara & Kecepatan", "Menyingkirkan Filler Words (Aaa, Eee, Hmm)"],
      week3: ["Pengaturan Vokal: Intonasi, Artikulasi, Volum", "Teknik Melakukan Jeda (Pause) Dramatis", "Menyiapkan Slide Presentasi Minimalis", "Latihan Kontak Mata (Eye Contact) Menyeluruh", "Menghadapi Sesi Tanya-Jawab Tanpa Panik"],
      week4: ["Membawakan Presentasi Kerja / Tugas Kuliah", "Menggunakan Mikrofon Secara Tepat di Stage", "Teknik Humor & Ice Breaking Sederhana", "Merekam & Evaluasi Rekaman Video Sendiri", "Rencana Rutinitas Latihan Harian Mandiri"],
      furtherWeeks: ["Teknik Retorika & Metafora", "Menjadi MC / Moderator di Acara Formal", "Persuasi & Negosiasi Tingkat Lanjut", "Crisis Management saat Lupa Materi", "Bicara Dadakan dengan Metode PREP"]
    },
    sampleQuiz: [
      {
        question: "Metode melatih nafas terbaik untuk memproduksi vokal yang matang dan berwibawa adalah...",
        options: ["Pernapasan Diafragma", "Pernapasan Dada", "Pernapasan Bahu", "Pernapasan Hidung Dangkal"],
        answer: "Pernapasan Diafragma",
        explanation: "Pernapasan diafragma membantu mengalirkan udara secara maksimal, menghasilkan suara yang bulat, bertenaga, dan tidak mudah serak."
      }
    ],
    sampleProjects: [
      {
        title: "Rekam Video Perkenalan Diri 1 Menit",
        desc: "Rekam diri Anda membawakan perkenalan personal secara antusias tanpa membaca teks, lalu hitung jumlah filler word."
      },
      {
        title: "Tulis Outline Pidato Struktur PREP",
        desc: "Rancang coret-coret pidato persuasif menggunakan susunan Point, Reason, Example, Point untuk tema bebas."
      },
      {
        title: "Rekam Pidato Persuasif 3 Menit",
        desc: "Sajikan pidato persuasif di depan cermin atau kamera, fokus pada permainan intonasi vokal dan gesture tangan dominan."
      }
    ],
    resources: [
      { title: "Toastmasters International Resources", type: "Artikel", url: "https://www.toastmasters.org/" },
      { title: "TED Talks - Speeches to Learn From", type: "Video", url: "https://www.ted.com/talks" }
    ]
  },
  {
    id: "english",
    title: "Belajar Bahasa Inggris",
    category: "english",
    iconName: "Globe",
    shortDesc: "Vocabulary, grammar, speaking, listening, writing.",
    longDesc: "Tingkatkan kelancaran Bahasa Inggris praktis Anda melalui latihan vocabulary aktif, pemahaman tenses sehari-hari, latihan listening aksen, percakapan (speaking), dan writing email formal.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Level Diagnostik & Menentukan Target Belajar", "Vocabulary Harian yang Sering Digunakan", "Dasar Tenses: Simple Present Tense", "Latihan Mendengar Aksen (Listening)", "Memperbaiki Pelafalan Huruf & Kata Kunci"],
      week2: ["Tenses Dasar: Simple Past & Future", "Membangun Kosakata Berdasarkan Topik (Food, Work)", "Menulis Jurnal Harian 5 Kalimat", "Mendengar Podcast Bahasa Inggris Lambat", "Latihan Reading Artikel Berita Singkat"],
      week3: ["Tenses Menengah: Present Continuous & Perfect", "Phrasal Verbs yang Sering Muncul", "Latihan Menulis Email Bisnis Formal", "Eksperimen Shadowing (Meniru Rekaman Native)", "Memperbaiki Grammar di Percakapan"],
      week4: ["Percakapan Telepon & Meeting Inggris", "Teknik Memparafrase Kalimat Agar Luwes", "Latihan Simulasi Interview Kerja Bahasa Inggris", "Membaca Buku/Novel Bahasa Inggris Ringan", "Evaluasi Portofolio Kemajuan Bahasa Inggris"],
      furtherWeeks: ["Conditional Sentences (If Clause)", "Mempelajari Slang & Idiom Populer", "Aksen British vs American", "Dasar Penulisan Akademik / TOEFL", "Latihan Berdiskusi Debat Pendapat"]
    },
    sampleQuiz: [
      {
        question: "Manakah kalimat Present Perfect Tense yang tepat?",
        options: ["I have lived here for five years", "I am live here since five years", "I lived here for five years ago", "I will have live here today"],
        answer: "I have lived here for five years",
        explanation: "Present Perfect menggunakan pola Subject + have/has + Verb 3 untuk menyatakan aktivitas yang sudah terjadi dan efeknya masih berlanjut."
      }
    ],
    sampleProjects: [
      {
        title: "Kamus 50 Kosakata Baru Terfokus",
        desc: "Cari, catat, dan hafalkan 50 kosakata baru beserta arti, kelas kata, dan contoh penggunaannya dalam kalimat."
      },
      {
        title: "Tulis Jurnal Refleksi Mingguan Inggris",
        desc: "Tulis 3 paragraf refleksi belajar mingguan berbahasa Inggris penuh, cek tata bahasa dengan Grammarly."
      },
      {
        title: "Rekam Percakapan Monolog 2 Menit",
        desc: "Bicarakan tentang hobi atau rencana liburan impianmu dalam Bahasa Inggris penuh selama 2 menit tanpa jeda panjang."
      }
    ],
    resources: [
      { title: "Duolingo - Gamified Vocabulary Training", type: "Tools", url: "https://www.duolingo.com/" },
      { title: "BBC Learning English - Free Tutorials", type: "Artikel", url: "https://www.bbc.co.uk/learningenglish" },
      { title: "Cambridge Dictionary Online", type: "Tools", url: "https://dictionary.cambridge.org/" }
    ]
  },
  {
    id: "kampus",
    title: "Masuk Kampus Impian",
    category: "kampus",
    iconName: "GraduationCap",
    shortDesc: "Target jurusan, latihan soal, strategi belajar, checklist dokumen.",
    longDesc: "Persiapkan dirimu menembus seleksi perguruan tinggi negeri/swasta impian dengan merancang materi spesifik ujian (UTBK/SAB), timeline administrasi, seleksi berkas, dan pengerjaan drilling soal.",
    difficultyRecommended: "Pemula - Sedang",
    topics: {
      week1: ["Analisis Daya Tampung & Ketetatan Jurusan", "Mengenali Jenis Tes & Bobot Skor", "Membuat Jadwal Rutin Belajar Harian", "Menganalisis Kelemahan Sub-Materi", "Pengumpulan Silabus Ujian Terlengkap"],
      week2: ["Pemantapan Materi Tes Penalaran Umum", "Latihan Soal Matematika Kuantitatif", "Tips Strategi Membaca Cepat (Reading Skill)", "Memilah Soal Mudah vs Soal Menjebak", "Eksperimen Try-Out Mandiri Pertama"],
      week3: ["Ulasan Sub-Materi Bahasa Indonesia & Inggris", "Analisis Detail Soal Salah di Tryout", "Membuat Rumus Cheat Sheet Singkat", "Teknik Manajemen Waktu Per Sub-Ujian", "Asah Logika Silogisme & Pola Gambar"],
      week4: ["Try-Out Besar dengan Batasan Waktu Asli", "Review Strategi Pemilihan Universitas Cadangan", "Melengkapi Checklist Syarat Dokumen Fisik", "Rencana Jaga Kesehatan & Persiapan Mental", "Evaluasi Akhir Kesiapan Ujian Kampus"],
      furtherWeeks: ["Drill Soal Penalaran Matematika", "Membaca Kisi-Kisi Soal TPS Terkini", "Teknik Menghilangkan Grogi Hari-H", "Persiapan Ujian Mandiri Kampus Alternatif", "Wawancara Beasiswa / PMDK (jika ada)"]
    },
    sampleQuiz: [
      {
        question: "Mana strategi terbaik saat menghadapi soal ujian UTBK dengan sistem penalti minus di detik terakhir jika ragu-ragu?",
        options: ["Kosongkan saja jika sistem menerapkan nilai minus untuk jawaban salah", "Tembak asal semuanya tanpa membaca soal", "Pilih jawaban paling panjang saja", "Menangis di meja ujian"],
        answer: "Kosongkan saja jika sistem menerapkan nilai minus untuk jawaban salah",
        explanation: "Jika ada penalti nilai salah (minus), mengosongkan jawaban yang sama sekali tidak diketahui adalah strategi preventif terbaik agar skor tidak anjlok."
      }
    ],
    sampleProjects: [
      {
        title: "Riset Matriks Kampus & Jurusan",
        desc: "Buat spreadsheet berisi 3 target kampus, jurusan, daya tampung, skor minimal lolos tahun lalu, dan ketetatan persentase."
      },
      {
        title: "Pembuatan Cheat-Sheet Kilat TPS",
        desc: "Rancang rangkuman rumus pola deret angka, hukum penarikan keputusan logika silogisme, dan tenses esensial di 2 halaman kertas."
      },
      {
        title: "Penyelesaian 50 Soal Tryout Mandiri",
        desc: "Kerjakan 50 bank soal penalaran umum di internet dengan timer menyala, bahas setiap kesalahan jawaban dengan teliti."
      }
    ],
    resources: [
      { title: "LTMPT/SNPMB - Situs Resmi Seleksi Nasional", type: "Artikel", url: "https://snpmb.bppp.kemdikbud.go.id/" },
      { title: "Khan Academy - Sat Prep Tools", type: "Latihan", url: "https://www.khanacademy.org/test-prep" }
    ]
  }
];

// Seed initial resources
export const DEFAULT_RESOURCE_ITEMS: ResourceItem[] = GOALS_LIST.flatMap((p) =>
  p.resources.map((r, index) => ({
    id: `${p.id}-res-${index}`,
    title: r.title,
    type: r.type,
    goalCategory: p.category,
    level: "Semua",
    url: r.url,
    read: false
  }))
);

// Offline Generator logic
export function generateOfflineRoadmap(
  goalId: string,
  customGoalText: string,
  level: "Pemula" | "Sedang" | "Lanjut",
  duration: number,
  dailyTime: string,
  preferences: string[]
): Roadmap {
  const isCustom = goalId === "custom";
  const goalTitle = isCustom ? customGoalText : (GOALS_LIST.find((g) => g.id === goalId)?.title || "Custom Goal");
  const goalCategory = isCustom ? "custom" : goalId;

  // Let's adapt topics depending on category or build dynamic custom ones
  const preset = GOALS_LIST.find((g) => g.id === goalId);
  const topicsBase = preset ? preset.topics : {
    week1: ["Pengenalan dasar & definisi konsep utama", "Sejarah singkat & ekosistem bidang ini", "Menyiapkan alat penunjang & lingkungan kerja", "Mempelajari istilah penting & jargon kunci", "Menemukan mentor / komunitas referensi"],
    week2: ["Teori mendalam & mekanisme cara kerja", "Studi kasus sederhana di lapangan", "Membaca dokumentasi, buku, atau artikel rujukan", "Memehami kesalahan umum pemula (pitfalls)", "Latihan mandiri terbimbing pertama"],
    week3: ["Mulai praktik langsung secara berkala", "Eksperimen modifikasi contoh yang ada", "Melakukan troubleshooting mandiri saat error", "Meningkatkan kecepatan & kenyamanan eksekusi", "Menyusun sketsa draf proyek pertama"],
    week4: ["Menggabungkan semua potongan materi (Integrasi)", "Memoles/finishing hasil kerja agar rapi", "Melakukan review mandiri / peer review jika ada", "Dokumentasi & pencatatan hasil belajar", "Rencana pengasahan skill jangka panjang"],
    furtherWeeks: ["Materi tingkat lanjut & optimasi kinerja", "Studi kasus berskala industri / professional", "Eksplorasi utilitas pihak ketiga (tools)", "Berbagi hasil karya ke platform sosial", "Sertifikasi / Pembuatan portofolio komprehensif"]
  };

  const sampleQuiz = preset?.sampleQuiz || [
    {
      question: `Apa langkah terbaik saat baru mulai belajar ${goalTitle}?`,
      options: ["Membuat rencana belajar terstruktur seperti Roadmapin", "Maju tanpa arah dan berhenti saat bingung", "Menunda belajar sampai tahun depan", "Membaca seluruh isi internet dalam satu hari"],
      answer: "Membuat rencana belajar terstruktur seperti Roadmapin",
      explanation: "Rencana belajar yang terstruktur (roadmap) memberikan arah yang jelas dan meminimalkan keraguan saat belajar."
    }
  ];

  const sampleProjects = preset?.sampleProjects || [
    {
      title: `Project Eksplorasi Dasar - ${goalTitle}`,
      desc: "Buat rangkuman visual, mind-map, atau draf pertama yang mendemonstrasikan fondasi materi yang baru dipelajari."
    },
    {
      title: `Aplikasi Praktis Menengah - ${goalTitle}`,
      desc: "Buat sebuah representasi kerja praktis (studi kasus lapangan, mock data, atau file latihan) secara mandiri."
    },
    {
      title: `Capstone Masterpiece - ${goalTitle}`,
      desc: "Gabungkan semua materi, rapikan visualisasi, selesaikan error, dan publikasikan/tunjukkan hasilnya ke orang lain."
    }
  ];

  const days: DayPlan[] = [];

  // Determine intensity multiplier based on learning hours per day
  let intensityTasksMultiplier = 2; // Default
  if (dailyTime.includes("15")) intensityTasksMultiplier = 1;
  else if (dailyTime.includes("30")) intensityTasksMultiplier = 2;
  else if (dailyTime.includes("60")) intensityTasksMultiplier = 3;
  else if (dailyTime.includes("90")) intensityTasksMultiplier = 4;

  // Let's populate the days array
  for (let d = 1; d <= duration; d++) {
    const weekNumber = Math.ceil(d / 7);
    const dayInWeek = ((d - 1) % 7) + 1; // 1 to 7

    let isEvaluationDay = d % 7 === 0;
    
    // Synthesize Day Details
    let title = "";
    let focus: FocusType = "Fondasi";
    let tasks: string[] = [];
    let resource = "";
    let quiz: DayPlan["quiz"] = null;
    let miniProject: DayPlan["miniProject"] = null;

    if (isEvaluationDay) {
      // Evaluation Day
      focus = "Evaluasi";
      title = `Evaluasi Mingguan — Minggu ${weekNumber}`;
      tasks = [
        "Ulas kembali seluruh materi hari 1-6 pada minggu ini",
        "Tulis poin penting pelajaran yang paling menempel di ingatan",
        "Catat hambatan atau materi tersulit untuk dipelajari kembali",
        "Kerjakan evaluasi performa belajar mingguan di form bawah ini"
      ];
      resource = "Dokumentasi Evaluasi Mandiri Roadmapin";
      
      const projectIdx = Math.min(weekNumber - 1, sampleProjects.length - 1);
      const chosenProject = sampleProjects[projectIdx] || sampleProjects[0];
      
      miniProject = {
        title: `Proyek Minggu ${weekNumber}: ${chosenProject.title}`,
        desc: chosenProject.desc,
        completed: false
      };
    } else {
      // Learning Day
      // Map week and day to topics list
      let topicList = topicsBase.week1;
      if (weekNumber === 2) topicList = topicsBase.week2;
      else if (weekNumber === 3) topicList = topicsBase.week3;
      else if (weekNumber === 4) topicList = topicsBase.week4;
      else if (weekNumber > 4) topicList = topicsBase.furtherWeeks || topicsBase.week4;

      const topicText = topicList[(dayInWeek - 1) % topicList.length];

      // Alter title based on level & topic
      const levelPrefix = level === "Pemula" ? "[Dasar]" : level === "Sedang" ? "[Menengah]" : "[Mahir]";
      title = `${levelPrefix} ${topicText}`;

      // Pick standard categories
      if (dayInWeek === 1 || dayInWeek === 2) {
        focus = "Fondasi";
      } else if (dayInWeek === 3 || dayInWeek === 4) {
        focus = "Praktik";
      } else if (dayInWeek === 5) {
        focus = "Quiz";
      } else {
        focus = "Review";
      }

      // Generate Tasks
      tasks = [
        `Pahami konsep tentang "${topicText}" secara teoretis`,
      ];

      if (focus === "Fondasi") {
        tasks.push(`Buat catatan ringkas mengenai poin-poin utama dari "${topicText}"`);
        if (intensityTasksMultiplier >= 2) tasks.push("Cari 2 contoh aplikasi nyata dari konsep ini di dunia nyata");
        if (intensityTasksMultiplier >= 3) tasks.push("Bacakan/diskusikan catatan ini kepada diri sendiri untuk menguji pemahaman");
        if (intensityTasksMultiplier >= 4) tasks.push("Rancang mind-map visual sederhana untuk mempermudah ingatan");
      } else if (focus === "Praktik") {
        tasks.push(`Lakukan uji coba praktik langsung (hands-on) materi "${topicText}"`);
        if (intensityTasksMultiplier >= 2) tasks.push(`Tulis studi kasus mini 1 layar untuk eksplorasi langsung`);
        if (intensityTasksMultiplier >= 3) tasks.push(`Selesaikan 3 skenario penyelesaian kendala (troubleshooting)`);
        if (intensityTasksMultiplier >= 4) tasks.push(`Optimalkan performa atau hias visual kode/hasil praktikmu`);
      } else if (focus === "Quiz" || focus === "Review") {
        tasks.push(`Uji coba ingatan jangka pendek mengenai materi ${topicText}`);
        tasks.push(`Jawab Quick Quiz harian di bawah dengan teliti`);
        if (intensityTasksMultiplier >= 3) tasks.push(`Review silang dengan topik awal minggu ini agar tetap ingat`);
      }

      // Generate Resource Link
      resource = preset ? `${preset.title} Resource - Section ${dayInWeek}` : `Informasi Terpercaya - ${topicText}`;
      
      // Inject Quiz for Quiz days or 50% chance of quiz on other learn days
      if (focus === "Quiz" || dayInWeek === 5 || Math.random() > 0.5) {
        const quizIdx = (d + dayInWeek) % sampleQuiz.length;
        const qSeed = sampleQuiz[quizIdx];
        quiz = {
          question: qSeed.question,
          options: qSeed.options,
          answer: qSeed.answer,
          explanation: qSeed.explanation
        };
      }
    }

    // Assign custom sub-durations
    let dayDuration = "30 menit";
    if (dailyTime.includes("15")) dayDuration = "15 menit";
    else if (dailyTime.includes("60")) dayDuration = "60 menit";
    else if (dailyTime.includes("90")) dayDuration = "90 menit";
    else if (dailyTime !== "Custom") dayDuration = dailyTime.split(" / ")[0] || "30 menit";

    days.push({
      day: d,
      title,
      focus,
      duration: dayDuration,
      tasks,
      completedTasks: new Array(tasks.length).fill(false),
      resource,
      resourceLink: preset?.resources[d % preset.resources.length]?.url || "https://google.com/search?q=" + encodeURIComponent(title),
      quiz,
      miniProject,
      reflection: "",
      reflectionSubmitted: false,
      completed: false,
      evaluation: isEvaluationDay,
      evaluationData: isEvaluationDay ? {
        halMudah: "",
        halSulit: "",
        targetMingguDepan: "",
        nilaiFokus: 8,
        submitted: false
      } : null
    });
  }

  return {
    id: `roadmap-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    goal: goalTitle,
    goalCategory,
    level,
    duration,
    dailyTime,
    preferences,
    days,
    createdAt: new Date().toISOString(),
    completedCount: 0,
    xpEarned: 0
  };
}

export const BADGES_LIST: Badge[] = [
  { id: "start", title: "Mulai Belajar", desc: "Mulai petualangan belajarmu dengan membuat roadmap pertama.", iconName: "Compass", unlocked: false },
  { id: "streak3", title: "Konsisten 3 Hari", desc: "Selesaikan misi harian selama 3 hari berturut-turut.", iconName: "Flame", unlocked: false },
  { id: "streak7", title: "Konsisten 7 Hari", desc: "Percepat belajarmu! Konsisten 7 hari berturut-turut tanpa menunda.", iconName: "Zap", unlocked: false },
  { id: "project1", title: "Project Pertama", desc: "Selesaikan mini-project mingguan pertamamu.", iconName: "Award", unlocked: false },
  { id: "quizmaster", title: "Quiz Master", desc: "Selesaikan 5 kuis dengan jawaban benar pada percobaan pertama.", iconName: "BookOpen", unlocked: false },
  { id: "road30", title: "Roadmap 30 Hari", desc: "Generasi roadmap jangka pendek 30 hari untuk membangun kebiasaan.", iconName: "Target", unlocked: false },
  { id: "anti_procrastinate", title: "Anti Menunda", desc: "Tandai tugas hari ini selesai sebelum jam 12 siang.", iconName: "Clock", unlocked: false },
  { id: "finisher", title: "Ultimate Finisher", desc: "Selesaikan seluruh rangkaian hari dalam roadmap aktif Anda.", iconName: "Crown", unlocked: false }
];
