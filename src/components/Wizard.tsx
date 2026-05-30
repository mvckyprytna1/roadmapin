import React, { useState, useEffect } from "react";
import { 
  Compass, Award, ChevronRight, ChevronLeft, Layout, Figma, TrendingUp, Percent, 
  Video, Mic, Globe, GraduationCap, Sparkles, Check, AlertCircle, BookOpen, Clock, Activity, Zap 
} from "lucide-react";
import { GOALS_LIST } from "../data";
import { Roadmap } from "../types";

interface WizardProps {
  initialGoalId?: string;
  onGenerate: (params: {
    goalId: string;
    customGoalText: string;
    level: "Pemula" | "Sedang" | "Lanjut";
    duration: number;
    dailyTime: string;
    preferences: string[];
    useAI: boolean;
  }) => Promise<void>;
  isGenerating: boolean;
  onBackToHome: () => void;
}

const PREF_OPTIONS = [
  "Lebih suka banyak teori",
  "Lebih suka praktik langsung",
  "Seimbang teori dan praktik",
  "Belajar dengan materi video",
  "Belajar dengan artikel/buku",
  "Belajar berbasis pengerjaan project",
  "Ingin banyak quiz harian",
  "Ingin banyak checklist tugas"
];

export default function Wizard({ initialGoalId = "", onGenerate, isGenerating, onBackToHome }: WizardProps) {
  const [step, setStep] = useState(1);
  const [selectedGoalId, setSelectedGoalId] = useState(initialGoalId || "");
  const [customGoalText, setCustomGoalText] = useState("");
  const [level, setLevel] = useState<"Pemula" | "Sedang" | "Lanjut" | "">("");
  const [duration, setDuration] = useState<30 | 60 | 90 | 0>(0);
  const [dailyTime, setDailyTime] = useState("");
  const [customDailyTime, setCustomDailyTime] = useState("");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [useAI, setUseAI] = useState(true); // Toggle to use server-side AI or instant offline procedural curation
  
  // Rotating loading labels text state
  const [loadingText, setLoadingText] = useState("Menghubungi AI specialist...");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialGoalId) {
      setSelectedGoalId(initialGoalId);
    }
  }, [initialGoalId]);

  // Loading text animator
  useEffect(() => {
    let tInterval: NodeJS.Timeout;
    if (isGenerating) {
      const texts = [
        "Menghubungi AI specialist... 📝",
        "Menganalisis tujuan belajarmu... 🔍",
        "Menentukan level & kurikulum esensial... ⚙️",
        "Membagi tugas harian agar terstruktur... 📅",
        "Menyiapkan kuis pemahaman harian... ✍️",
        "Menyinkronkan resource belajar referensi... 📚",
        "Hampir selesai! Memoles detail rancangan... ✨"
      ];
      let idx = 0;
      setLoadingText(texts[0]);
      tInterval = setInterval(() => {
        idx = (idx + 1) % texts.length;
        setLoadingText(texts[idx]);
      }, 2500);
    }
    return () => clearInterval(tInterval);
  }, [isGenerating]);

  const handleNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!selectedGoalId) {
        setErrorMsg("Pilih tujuan belajar dulu biar roadmap bisa dibuat.");
        return;
      }
      if (selectedGoalId === "custom" && !customGoalText.trim()) {
        setErrorMsg("Input tujuan kustom tidak boleh kosong.");
        return;
      }
    } else if (step === 2) {
      if (!level) {
        setErrorMsg("Pilih salah satu level kemampuan dulu ya.");
        return;
      }
    } else if (step === 3) {
      if (!duration) {
        setErrorMsg("Pilih target durasi pembentukan habit dulu.");
        return;
      }
    } else if (step === 4) {
      if (!dailyTime) {
        setErrorMsg("Pilih berapa lama alokasi waktumu per hari.");
        return;
      }
      if (dailyTime === "Custom" && (!customDailyTime.trim() || parseInt(customDailyTime) <= 0)) {
        setErrorMsg("Waktu belajar harus lebih dari 0 menit.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setErrorMsg("");
    setStep((s) => s - 1);
  };

  const handleTogglePref = (pref: string) => {
    setSelectedPrefs((prev) => 
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const triggerGenerate = async () => {
    setErrorMsg("");
    const finalDailyTime = dailyTime === "Custom" ? `${customDailyTime} menit / hari` : dailyTime;
    
    try {
      await onGenerate({
        goalId: selectedGoalId,
        customGoalText,
        level: level as "Pemula" | "Sedang" | "Lanjut",
        duration: duration as number,
        dailyTime: finalDailyTime,
        preferences: selectedPrefs,
        useAI
      });
    } catch (e: any) {
      setErrorMsg(e.message || "Gagal menghasilkan roadmap. Coba lagi.");
    }
  };

  // Helper icons mapper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Layout": return <Layout className="w-5 h-5 text-blue-500" />;
      case "Figma": return <Figma className="w-5 h-5 text-purple-500" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "Percent": return <Percent className="w-5 h-5 text-teal-500" />;
      case "Video": return <Video className="w-5 h-5 text-amber-500" />;
      case "Mic": return <Mic className="w-5 h-5 text-orange-500" />;
      case "Globe": return <Globe className="w-5 h-5 text-blue-400" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      default: return <Compass className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="wizard-container">
      {/* Wizard Header Bar & Stepper Indicator */}
      {!isGenerating && (
        <div className="mb-8" id="wizard-stepper">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 select-none">
            <span>Progress Pengaturan</span>
            <span>Langkah {step} dari 6</span>
          </div>
          {/* Stepper Dots Bar */}
          <div className="flex space-x-1.5 h-1 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Toast / Alert Box */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-sm font-semibold flex items-center space-x-2 animate-shake" id="error-message-box">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dynamic Steps Container */}
      {!isGenerating ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-8 transition-all duration-300">
          
          {/* STEP 1: PILIH TUJUAN BELAJAR */}
          {step === 1 && (
            <div className="space-y-6" id="step-1">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Ada tujuan skill apa yang mau kamu kuasai?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Pilih salah satu kurikulum preset paling populer, atau tulis sendiri kelincahan tujuanmu!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GOALS_LIST.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedGoalId(p.id);
                      setErrorMsg("");
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all duration-150 cursor-pointer ${
                      selectedGoalId === p.id
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/25"
                        : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 shrink-0">
                      {getIcon(p.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">{p.title}</h4>
                      <p className="text-xs text-gray-400 dark:text-slate-400 line-clamp-2 mt-0.5">{p.shortDesc}</p>
                    </div>
                  </button>
                ))}

                {/* Custom goal clicker */}
                <button
                  onClick={() => {
                    setSelectedGoalId("custom");
                    setErrorMsg("");
                  }}
                  className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all duration-150 cursor-pointer ${
                    selectedGoalId === "custom"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/25"
                      : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">Custom Goal / Tujuan Kustom</h4>
                    <p className="text-xs text-gray-400 dark:text-slate-400 line-clamp-2 mt-0.5">Tulis bebas target belajarmu, AI/Sistem akan meracik rencana unik.</p>
                  </div>
                </button>
              </div>

              {/* Show Custom Input Box if Custom active */}
              {selectedGoalId === "custom" && (
                <div className="space-y-2 pt-2 animate-fade-in" id="custom-goal-input-container">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tulis Target/Tujuan Belajarmu:</label>
                  <input
                    type="text"
                    value={customGoalText}
                    onChange={(e) => {
                      setCustomGoalText(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Contoh: Belajar Berternak Bebek Hias, Mahir UI/UX Figma Dasar, Belajar Masak Ramen Jepang..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    id="input-custom-goal"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PILIH LEVEL */}
          {step === 2 && (
            <div className="space-y-6" id="step-2">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Berapa level pemahamanmu saat ini?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Pecutan materi harian akan ditakar sesuai pemahaman awalmu agar tidak kebingungan.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: "Pemula",
                    title: "Pemula (Beginner)",
                    desc: "Baru mulai, butuh pelajaran dasar, pengenalan istilah, dan arahan pelan-pelan tanpa kejutan rumit."
                  },
                  {
                    id: "Sedang",
                    title: "Sedang (Intermediate)",
                    desc: "Sudah punya pemahaman dasar, ingin tantangan fungsional, dan disiplin agar belajar lebih terbiasa konsisten."
                  },
                  {
                    id: "Lanjut",
                    title: "Lanjut (Advanced)",
                    desc: "Sudah bisa mandiri, butuh project pengerjaan serius, banyak kuis, dan review skenario rumit."
                  }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLevel(l.id as any);
                      setErrorMsg("");
                    }}
                    className={`p-5 rounded-2xl border text-left flex items-start space-x-4 transition-all duration-150 cursor-pointer ${
                      level === l.id
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/25"
                        : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      {level === l.id ? (
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 font-bold" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-200">{l.title}</h4>
                      <p className="text-sm text-gray-400 dark:text-slate-400 mt-1">{l.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PILIH DURASI ROADMAP */}
          {step === 3 && (
            <div className="space-y-6" id="step-3">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Berapa lama jangka durasi belajarmu?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Materi esensial akan dipecah merata pada timeline target yang kamu inginkan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 30, title: "30 Hari", sub: "Habit Builder", text: "Cocok untuk eksplorasi cepat, mulai cepat belajar hal baru, dan merawat habit harian mandiri." },
                  { id: 60, title: "60 Hari", sub: "Middle Mastery", text: "Cocok untuk pemahaman konsep lebih stabil, praktik menengah terstruktur, dan mematangkan fundamental." },
                  { id: 90, title: "90 Hari", sub: "Serious Transformation", text: "Cocok untuk transformasi skill serius, pengerjaan studi kasus, portofolio karir, dan sertifikasi." }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDuration(d.id as any);
                      setErrorMsg("");
                    }}
                    className={`p-6 rounded-2xl border text-center flex flex-col justify-between space-y-4 transition-all duration-150 cursor-pointer ${
                      duration === d.id
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/25"
                        : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 mb-1">
                        {d.sub}
                      </div>
                      <h4 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100">{d.title}</h4>
                      <p className="text-xs text-gray-400 dark:text-slate-400 leading-normal">{d.text}</p>
                    </div>
                    <div className={`mt-2 py-2 rounded-xl text-xs font-semibold ${duration === d.id ? "bg-blue-600 text-white" : "bg-gray-50 dark:bg-slate-900 text-gray-500"}`}>
                      {duration === d.id ? "Terpilih" : "Pilih Paket"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: WAKTU BELAJAR PER HARI */}
          {step === 4 && (
            <div className="space-y-6" id="step-4">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Alokasi waktu belajarmu per harinya?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Pilih durasi realistis agar belajarmu konsisten setiap harinya.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "15 menit / hari", title: "15 Menit saja", intensive: "Ringan", desc: "Sangat bersahabat, cocok untuk kamu yang super padat aktivitas harian." },
                  { id: "30 menit / hari", title: "30 Menit ideal", intensive: "Sangat Pas", desc: "Skenario paling proporsional untuk fokus pemula membangun habit." },
                  { id: "60 menit / hari", title: "60 Menit serius", intensive: "Garas Keras", desc: "Kemajuan skill terasa 2 kali lipat lebih cepat dengan banyak detail." },
                  { id: "90 menit / hari", title: "90 Menit master", intensive: "Ultra Intensif", desc: "Rekomendasi untuk kamu dengan target besar beasiswa atau seleksi kompetitif." },
                  { id: "Custom", title: "Kustom manual", intensive: "Sesuai Selera", desc: "Tulis bebas durasi menit belajar harian yang kamu sanggupi." }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setDailyTime(t.id);
                      setErrorMsg("");
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all duration-150 cursor-pointer ${
                      dailyTime === t.id
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/25"
                        : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 select-none">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">{t.title}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                          {t.intensive}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Show Custom Time Input */}
              {dailyTime === "Custom" && (
                <div className="space-y-2 pt-2 animate-fade-in" id="custom-time-input-container">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tulis durasi belajar (dalam menit):</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={customDailyTime}
                      onChange={(e) => {
                        setCustomDailyTime(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="Contoh: 45, 120, 180"
                      className="w-40 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      id="input-custom-time"
                    />
                    <span className="text-sm text-gray-500 dark:text-slate-400 font-bold">menit / hari</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: PREFERENSI BELAJAR */}
          {step === 5 && (
            <div className="space-y-6" id="step-5">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Ada preferensi gaya belajarmu?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Materi akan disinkronasikan dan menekankan preferensi yang kamu sukai (boleh pilih banyak/semua).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="preferences-list">
                {PREF_OPTIONS.map((opt) => {
                  const active = selectedPrefs.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleTogglePref(opt)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        active
                          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-indigo-500/35"
                          : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{opt}</span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        active ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      }`}>
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: TEKNOLOGI GENERATOR & AI ACTIVATE */}
          {step === 6 && (
            <div className="space-y-6" id="step-6">
              <div className="space-y-1.5 text-center">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20 animate-spin">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white pt-2">Siap untuk meracik roadmap barumu?</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md mx-auto">Kami akan memisahkan materi per minggu, menyiapkan tugas harian, merekomendasikan video/artikel penunjang, kuis mandiri, dan evaluasi rutin.</p>
              </div>

              {/* AI toggle selection with clean UI */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 space-y-4 max-w-md mx-auto" id="ai-generator-toggle-box">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">Pilah Mode Generator:</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Rekomendasi</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setUseAI(true)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start space-x-2 ${
                      useAI 
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 font-bold" 
                        : "border-gray-200 dark:border-gray-800 text-gray-500"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${useAI ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm">Server-Side Gemini AI (Cerdas & Kustom)</p>
                      <p className="text-[10px] text-gray-400 font-normal">Membutuhkan GEMINI_API_KEY aktif. Membuat kurikulum cerdas yang unik.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUseAI(false)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start space-x-2 ${
                      !useAI 
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 font-bold" 
                        : "border-gray-200 dark:border-gray-800 text-gray-500"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${!useAI ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm">Generator Cerdas Luring (Instant premium)</p>
                      <p className="text-[10px] text-gray-400 font-normal">Super cepat, bekerja instan offline tanpa API key, resep kurikulum sangat matang.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold flex items-center space-x-1"
                id="btn-wizard-prev"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 text-xs sm:text-sm font-bold flex items-center space-x-1"
                id="btn-wizard-cancel"
              >
                <span>Batal</span>
              </button>
            )}

            {step < 6 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center space-x-1 shadow-md shadow-blue-500/10"
                id="btn-wizard-next"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={triggerGenerate}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-blue-500/15 hover:shadow-indigo-500/25 cursor-pointer"
                id="btn-wizard-generate"
              >
                <Sparkles className="w-4 h-4 animate-bounce" />
                <span>Mulai Susun Roadmap!</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* WIZARD GENERATING SKELETON SCREEN */
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 text-center animate-pulse" id="wizard-loading-skeleton">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 animate-spin mx-auto flex items-center justify-center text-white">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100">Sedang Merancang Kurikulum Unikmu...</h3>
            <p className="text-blue-600 dark:text-blue-400 font-extrabold text-sm uppercase tracking-widest">{loadingText}</p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <p className="text-[11px] text-gray-400 text-left font-semibold">Gaya belajar, level & alokasi durasi dinilai menyeluruh...</p>
            </div>
            
            <div className="h-2 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-progressbar w-[80%]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
