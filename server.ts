import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to prevent crashes if key is omitted
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// API endpoint to generate high-fidelity AI roadmap
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { goal, level, duration, dailyTime, preferences } = req.body;

    if (!goal || !level || !duration) {
      return res.status(400).json({ error: "Goal, level, dan durasi wajib ditentukan." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return specific error to let client fall back to offline generator
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "Gemini API Key belum dikonfigurasi. Mengalihkan ke generator luring premium."
      });
    }

    const prompt = `
Anda adalah pakar kurikulum pembelajaran (Syllabus & Curriculum Specialist) profesional.
Tugas Anda adalah menformulasikan rancangan roadmap belajar terstruktur selama ${duration} hari dalam Bahasa Indonesia.

Informasi Input User:
- Tujuan Belajar: "${goal}"
- Level Kemampuan Saat Ini: "${level}"
- Alokasi Waktu Belajar: "${dailyTime}"
- Preferensi atau Gaya Belajar: ${preferences ? preferences.join(", ") : "Seimbang"}

Ketentuan Pembuatan Roadmap:
1. Harus menghasilkan tepat ${duration} hari kegiatan belajar. Setiap hari terstruktur.
2. Setiap 7 hari (Hari 7, Hari 14, Hari 21, Hari 28, dst) wajib dijadikan HARI EVALUASI ("Evaluasi"). Di hari evaluasi, tugas utamanya adalah mengulang materi seminggu ini, mengevaluasi kendala, dan mengerjakan sebuah mini-project mingguan.
3. Strukturkan fokus pembelajaran harian ("focus") dengan nilai salah satu dari: "Fondasi", "Praktik", "Quiz", "Project", "Evaluasi", atau "Review".
4. Karena batas token, tulis konten secara padat, ringkas, informatif, dan langsung ke intinya (hindari basa-basi panjang). Tulis semua dalam Bahasa Indonesia yang santai tapi profesional.
5. Sediakan 1 kuis harian sederhana (pilihan ganda, 4 opsi, berikan jawaban dan penjelasannya) untuk hari-hari belajar biasa.
6. Untuk Hari Evaluasi, sediakan Mini Project (seperti project kecil mingguan) dengan judul dan deskripsi singkat.

Rincian Schema JSON yang Harus Anda Kembalikan:
Keluarkan data hanya berupa ARRAY JSON [] di mana setiap elemen mewakili 1 hari dan memiliki field persis seperti di bawah ini:
[
  {
    "day": 1,
    "title": "Judul harian yang spesifik sesuai kurikulum",
    "focus": "Fondasi" (atau "Praktik"/"Quiz"/"Project"/"Evaluasi"/"Review"),
    "tasks": ["Tugas spesifik 1", "Tugas spesifik 2"],
    "resource": "Rekomendasi nama artikel/video spesifik",
    "resourceLink": "Contoh link pencarian Google atau situs edukasi relevan",
    "quiz": {
      "question": "Pertanyaan kuis pilihan ganda yang cerdas tentang materi hari ini",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "answer": "Jawaban yang benar (harus persis sama dengan salah satu teks di options)",
      "explanation": "Penjelasan ilmiah singkat mengapa jawaban tersebut benar"
    },
    "miniProject": null (atau jika hari evaluasi, berikan object: {"title": "Judul project", "desc": "Deskripsi project"})
  }
]

Ingat: Kembalikan HANYA array JSON murni. Jangan bungkus dengan markdown \`\`\`json atau teks pengantar lainnya agar bisa diparsing secara lurus.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Daftar rencana belajar harian untuk roadmap",
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              title: { type: Type.STRING },
              focus: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              resource: { type: Type.STRING },
              resourceLink: { type: Type.STRING },
              quiz: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "answer", "explanation"]
              },
              miniProject: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  desc: { type: Type.STRING }
                }
              }
            },
            required: ["day", "title", "focus", "tasks", "resource", "resourceLink"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini menghasilkan respon kosong");
    }

    const parsedDays = JSON.parse(text.trim());

    // Map the response to full DayPlan objects with standard state
    const processedDays = parsedDays.map((d: any) => ({
      day: d.day,
      title: d.title,
      focus: ["Fondasi", "Praktik", "Quiz", "Project", "Evaluasi", "Review"].includes(d.focus) ? d.focus : "Fondasi",
      duration: dailyTime.includes("Custom") ? "30 menit" : (dailyTime.split(" / ")[0] || "300 menit"),
      tasks: d.tasks || [`Pelajari materi ${d.title}`],
      completedTasks: new Array((d.tasks || [1]).length).fill(false),
      resource: d.resource || "Referensi Google",
      resourceLink: d.resourceLink || `https://www.google.com/search?q=${encodeURIComponent(d.title)}`,
      quiz: d.quiz ? {
        question: d.quiz.question,
        options: d.quiz.options,
        answer: d.quiz.answer,
        explanation: d.quiz.explanation
      } : null,
      miniProject: d.miniProject ? {
        title: d.miniProject.title || "Mini Project",
        desc: d.miniProject.desc || "Selesaikan tugas praktis hari ini.",
        completed: false
      } : null,
      reflection: "",
      reflectionSubmitted: false,
      completed: false,
      evaluation: d.focus === "Evaluasi" || d.day % 7 === 0,
      evaluationData: (d.focus === "Evaluasi" || d.day % 7 === 0) ? {
        halMudah: "",
        halSulit: "",
        targetMingguDepan: "",
        nilaiFokus: 8,
        submitted: false
      } : null
    }));

    return res.json({
      success: true,
      roadmap: {
        id: `roadmap-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        goal: goal,
        goalCategory: "custom_ai",
        level,
        duration,
        dailyTime,
        preferences: preferences || [],
        days: processedDays,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        xpEarned: 0
      }
    });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return res.status(200).json({
      success: false,
      fallback: true,
      error: error.message || "Gagal menghubungi AI model",
      message: "AI Generation terkendala. Mengalihkan ke generator luring premium."
    });
  }
});

// Serve assets and handle Vite in dev/prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
