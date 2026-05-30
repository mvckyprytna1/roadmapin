import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Circle, Lock, Clock, BookOpen, Printer, RefreshCw, Star, 
  ChevronRight, Calendar, Bookmark, ClipboardList, Info, HelpCircle, 
  Lightbulb, FileText, Sparkles, Send, Award, Trash2, ArrowLeft, ExternalLink 
} from "lucide-react";
import { DayPlan, Roadmap, UserProfile } from "../types";

interface ActiveDashboardProps {
  roadmap: Roadmap;
  onUpdateRoadmap: (updated: Roadmap) => void;
  onAwardXP: (amount: number, reason: string) => void;
  onTriggerStreak: () => void;
  onResetRoadmap: () => void;
  userProfile: UserProfile;
}

export default function ActiveDashboard({
  roadmap,
  onUpdateRoadmap,
  onAwardXP,
  onTriggerStreak,
  onResetRoadmap,
  userProfile
}: ActiveDashboardProps) {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"syllabus" | "daily">("syllabus");
  const [reflectionText, setReflectionText] = useState("");
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string>("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showPrintModalAlert, setShowPrintModalAlert] = useState(false);

  // Sync state whenever day changes
  useEffect(() => {
    // Look up day is selected
    const dayPlan = roadmap.days.find((d) => d.day === selectedDayNum);
    if (dayPlan) {
      setReflectionText(dayPlan.reflection || "");
      if (dayPlan.quiz?.selectedAnswer) {
        setQuizAnswerSelected(dayPlan.quiz.selectedAnswer);
        setQuizSubmitted(true);
        setQuizFeedback({
          isCorrect: dayPlan.quiz.isCorrect || false,
          text: dayPlan.quiz.isCorrect 
            ? "Benar! Kamu sudah paham konsep utama hari ini. 🎉" 
            : "Belum tepat. Coba ulangi materi hari ini, lalu kerjakan lagi. 🤖"
        });
      } else {
        setQuizAnswerSelected("");
        setQuizSubmitted(false);
        setQuizFeedback(null);
      }
    }
  }, [selectedDayNum, roadmap]);

  const selectedDay = roadmap.days.find((d) => d.day === selectedDayNum) || roadmap.days[0];

  // Compute overall statistic counters
  const totalDays = roadmap.days.length;
  const completedDaysCount = roadmap.days.filter((d) => d.completed).length;
  const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

  // Finding "Today's learning slot" based on progress
  const firstUncompletedDay = roadmap.days.find((d) => !d.completed);
  const todayDayNum = firstUncompletedDay ? firstUncompletedDay.day : totalDays;

  // Compute if user is lagging behind based on elapsed days since creation date
  const computeLaggingDays = () => {
    const createdDate = new Date(roadmap.createdAt);
    const currentDate = new Date();
    // difference in days
    const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
    const daysElapsed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // If they have completed fewer days than elapsed, they might be behind
    if (daysElapsed > completedDaysCount) {
      return daysElapsed - completedDaysCount;
    }
    return 0;
  };
  const laggingDays = computeLaggingDays();

  // Task checklist handler updates
  const handleToggleTask = (taskIdx: number) => {
    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day) {
        const nextCompletedTasks = [...d.completedTasks];
        nextCompletedTasks[taskIdx] = !nextCompletedTasks[taskIdx];
        
        // Award modest XP on checking a task
        if (nextCompletedTasks[taskIdx]) {
          onAwardXP(2, "Task Selesai");
        } else {
          onAwardXP(-2, "Task Unchecked");
        }
        
        return {
          ...d,
          completedTasks: nextCompletedTasks
        };
      }
      return d;
    });

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays
    });
  };

  // Submit Daily reflections logger
  const handleSubmitReflection = () => {
    if (!reflectionText.trim()) return;

    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day) {
        return {
          ...d,
          reflection: reflectionText,
          reflectionSubmitted: true
        };
      }
      return d;
    });

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays
    });

    onAwardXP(10, "Refleksi Harian");
  };

  // Submit Quiz answering metrics
  const handleSubmitQuiz = () => {
    if (!selectedDay.quiz || !quizAnswerSelected) return;

    const isCorrect = quizAnswerSelected === selectedDay.quiz.answer;
    
    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day && d.quiz) {
        return {
          ...d,
          quiz: {
            ...d.quiz,
            selectedAnswer: quizAnswerSelected,
            isCorrect: isCorrect
          }
        };
      }
      return d;
    });

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays
    });

    setQuizSubmitted(true);
    if (isCorrect) {
      onAwardXP(15, "Quiz Selesai");
      setQuizFeedback({
        isCorrect: true,
        text: "Benar! Kamu sudah paham konsep utama hari ini. 🎉"
      });
    } else {
      setQuizFeedback({
        isCorrect: false,
        text: "Belum tepat. Coba ulangi materi hari ini, lalu kerjakan lagi. 🤖"
      });
    }
  };

  // Submit weekly / evaluasi mini project
  const handleCompleteProject = () => {
    if (!selectedDay.miniProject) return;

    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day && d.miniProject) {
        return {
          ...d,
          miniProject: {
            ...d.miniProject,
            completed: true
          }
        };
      }
      return d;
    });

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays
    });

    onAwardXP(50, "Project Selesai");
  };

  // Submit Evaluasi Minggu Form data
  const handleSubmitEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const halMudah = data.get("halMudah")?.toString() || "";
    const halSulit = data.get("halSulit")?.toString() || "";
    const targetMingguDepan = data.get("targetMingguDepan")?.toString() || "";
    const nilaiFokus = parseInt(data.get("nilaiFokus")?.toString() || "8");

    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day) {
        return {
          ...d,
          evaluationData: {
            halMudah,
            halSulit,
            targetMingguDepan,
            nilaiFokus,
            submitted: true
          }
        };
      }
      return d;
    });

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays
    });

    onAwardXP(30, "Evaluasi Mingguan");
  };

  // Toggle Day complete metric state
  const handleMarkDayComplete = () => {
    const isNowCompleted = !selectedDay.completed;

    const updatedDays = roadmap.days.map((d) => {
      if (d.day === selectedDay.day) {
        // Automatically check all tasks if marked completed
        const updatedChecks = isNowCompleted
          ? new Array(d.tasks.length).fill(true)
          : d.completedTasks;
        
        return {
          ...d,
          completed: isNowCompleted,
          completedTasks: updatedChecks
        };
      }
      return d;
    });

    const isAllCompleted = updatedDays.every((d) => d.completed);

    onUpdateRoadmap({
      ...roadmap,
      days: updatedDays,
      completedCount: updatedDays.filter((d) => d.completed).length
    });

    if (isNowCompleted) {
      onAwardXP(20, "Hari Selesai");
      onTriggerStreak(); // potentially increment streak count
      
      // Auto move pointer to next uncompleted day or toast
      if (selectedDayNum < totalDays) {
        setTimeout(() => setSelectedDayNum(selectedDayNum + 1), 800);
      }
    } else {
      onAwardXP(-20, "Mark Uncompleted");
    }
  };

  // Color coding for day focuses badges
  const getFocusBadgeColor = (focus: string) => {
    switch (focus) {
      case "Fondasi": return "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400";
      case "Praktik": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
      case "Quiz": return "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400";
      case "Project": return "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400";
      case "Evaluasi": return "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400";
      default: return "bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  // Effect to clean up printed class after closing print dialog
  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-roadmap");
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // Effect to manage body.modal-open scroll lock when print modal is open
  useEffect(() => {
    if (showPrintModalAlert) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showPrintModalAlert]);

  // Native windows print router formatted page
  const handlePrint = () => {
    document.body.classList.add("printing-roadmap");
    setShowPrintModalAlert(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (printErr) {
        console.warn("Native print blocked or failed inside sandbox:", printErr);
      }
    }, 250);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4" id="dashboard-main-panel">
      
      {showPrintModalAlert && (
        <div 
          className="modal-overlay no-print" 
          id="print-guideline-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPrintModalAlert(false);
              document.body.classList.remove("printing-roadmap");
            }
          }}
        >
          <div 
            className="print-modal animate-scale-up"
            id="print-guideline-modal-card"
          >
            <div className="print-modal-header flex items-start justify-between">
              <div className="flex items-center space-x-3 text-slate-900 dark:text-white">
                <div className="print-modal-icon p-2.5 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
                  <Printer className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight" id="print-modal-title">Cetak & Simpan PDF</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">Kurikulum Belajar Mandiri: {roadmap.goal}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPrintModalAlert(false);
                  document.body.classList.remove("printing-roadmap");
                }}
                className="modal-close p-1 px-2.5 py-1.5 text-gray-400 hover:text-slate-605 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold font-sans cursor-pointer"
                id="btn-close-print-modal"
              >
                Tutup
              </button>
            </div>

            <div className="print-modal-body space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3 text-amber-800 dark:text-amber-400">
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="font-extrabold text-xs uppercase tracking-wide">Pemberitahuan Sistem Preview</p>
                  <p className="text-xs font-medium leading-relaxed">
                    Browser membatasi cetak otomatis di dalam frame workspace editor. Jika jendela cetak tidak muncul secara otomatis, silakan buka aplikasi di tab baru menggunakan tombol <strong>"Open in new tab"</strong> di pojok kanan atas pratinjau, lalu klik tombol ini lagi!
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="font-black text-slate-900 dark:text-white">💡 Tips Pengaturan Cetak yang Optimal:</p>
                <ul className="space-y-2 list-none pl-0">
                  <li className="flex items-start space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="flex items-center justify-center w-5 h-5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span>Aktifkan opsi <strong>"Grafis Latar Belakang" (Background Graphics / Colors)</strong> di menu setelan cetak browser agar warna progress dan kurikulum harian tercetak sempurna.</span>
                  </li>
                  <li className="flex items-start space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="flex items-center justify-center w-5 h-5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span>Pilih opsi tujuan printer sebagai <strong>"Simpan sebagai PDF" (Save as PDF)</strong> jika Anda ingin mengunduhnya sebagai berkas digital yang portabel.</span>
                  </li>
                  <li className="flex items-start space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="flex items-center justify-center w-5 h-5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <span>Atur tata letak ke <strong>Portrait</strong> untuk hasil dokumen kurikulum terstruktur satu kolom yang rapi dan memanjang ke bawah.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="print-modal-footer">
              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/15 cursor-pointer min-h-[46px]"
                id="btn-trigger-dialog-print"
                data-action="print-roadmap"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Buka Jendela Cetak Sistem</span>
              </button>
              
              <button
                onClick={() => {
                  setShowPrintModalAlert(false);
                  document.body.classList.remove("printing-roadmap");
                }}
                className="w-full sm:w-auto px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-xs rounded-xl transition cursor-pointer min-h-[46px]"
                id="btn-cancel-print-modal"
                data-action="close-print-modal"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0. Print-Only Premium Decorative Header */}
      <div className="print-only mb-6 border-b-2 border-slate-900 pb-4">
        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Roadmapin</h1>
        <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Skill Roadmap & Kurikulum Belajar Mandiri</p>
        
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Target Belajar (Goal)</span>
            <span className="text-base font-extrabold text-slate-900">{roadmap.goal}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Tingkat Kesulitan</span>
            <span className="text-sm font-bold text-slate-800">{roadmap.level}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Durasi Belajar</span>
            <span className="text-sm font-bold text-slate-800">{roadmap.duration} Hari</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Rekomendasi Waktu Harian</span>
            <span className="text-sm font-bold text-slate-800">{roadmap.dailyTime}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Progress saat ini</span>
            <span className="text-sm font-bold text-slate-800">{completedDaysCount} dari {totalDays} Hari ({progressPercent}% Selesai)</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Tanggal Cetak</span>
            <span className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>
      
      {/* 1. Header Metrics Card Bar */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6" id="metrics-card-bar">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500 text-white select-none">
                {roadmap.level}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500 text-white select-none">
                {roadmap.duration} Hari
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500 text-slate-900 select-none">
                {roadmap.dailyTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1.5">{roadmap.goal}</h2>
            <p className="text-xs text-slate-300 font-medium">Lanjutkan progress belajarmu harian dan kumpulkan penghargaan XP!</p>
          </div>

          <div className="flex items-center space-x-2.5 self-stretch sm:self-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-800/40 text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 hover:bg-slate-800 transition"
              id="btn-print-roadmap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onResetRoadmap}
              className="px-4 py-2.5 rounded-xl border border-transparent bg-red-600/25 hover:bg-red-600 text-red-400 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 transition"
              id="btn-reset-roadmap"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus Roadmap</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold select-none">
            <span className="text-slate-300">Progress Belajar: {progressPercent}% Selesai</span>
            <span>{completedDaysCount} dari {totalDays} Hari</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 shadow-md shadow-blue-500/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Hari Ini Belajar Apa Motivational Banner */}
      {completedDaysCount === totalDays ? (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-400 shadow-xl space-y-3 text-center" id="motivational-banner">
          <Award className="w-12 h-12 mx-auto animate-bounce text-yellow-300" />
          <h3 className="text-xl sm:text-2xl font-black">Selamat! Kamu Tamat! 🎓✨</h3>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Kamu telah menyelesaikan seluruh paket {totalDays} hari kurikulum <strong>{roadmap.goal}</strong> dengan penuh kerja keras dan konsisten. Kumpulkan lencana barumu di tab Pencapaian!
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 text-white border border-blue-400 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="motivational-banner">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-amber-400 text-slate-900 animate-pulse">
                Rekomendasi Hari Ini
              </span>
              {laggingDays > 0 && (
                <span className="text-[10px] font-bold text-red-200">
                  ⚠️ Kamu tertinggal {laggingDays} hari
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold leading-tight">Hari ke-{todayDayNum}: {roadmap.days[todayDayNum - 1]?.title}</h3>
            <p className="text-xs text-blue-100">
              {laggingDays > 0 
                ? "Tenang, jangan terburu-buru. Mulai dari pelajaran terakhir yang belum diselesaikan." 
                : "Ayo pelajari materi hari ini dan uji pemahamanmu melaui kuis!"}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDayNum(todayDayNum);
              setActiveTab("daily");
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 text-xs sm:text-sm flex items-center justify-center space-x-1.5 shrink-0 hover:translate-x-0.5 transition-transform"
            id="btn-motivational-jump"
          >
            <span>Mulai Belajar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Main Split View - Syllabus Grid vs Active Day Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="split-dashboard-panel">
        
        {/* Left Column: Curriculum Timeline / Calendar */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-3xl shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Timeline Catur-harian</h3>
            <div className="flex space-x-1" id="tab-toggle-dashboard">
              <button
                onClick={() => setActiveTab("syllabus")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "syllabus"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
                id="btn-tab-syllabus"
              >
                Silabus
              </button>
              <button
                onClick={() => setActiveTab("daily")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "daily"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
                id="btn-tab-daily"
              >
                Kegiatan Aktif
              </button>
            </div>
          </div>

          {/* Scollable list of all days in the curriculum with indicator */}
          <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1.5" id="timeline-scroll-container">
            {roadmap.days.map((dayPlan) => {
              const isSelected = selectedDayNum === dayPlan.day;
              return (
                <div
                  key={dayPlan.day}
                  onClick={() => {
                    setSelectedDayNum(dayPlan.day);
                    setActiveTab("daily");
                  }}
                  className={`p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/25 ring-1 ring-blue-500/20"
                      : dayPlan.completed
                        ? "border-emerald-100 dark:border-emerald-950/50 bg-emerald-50/[0.08] dark:bg-emerald-950/[0.04]"
                        : "border-gray-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    {/* Circle check/lock indicator */}
                    <div className="shrink-0 leading-none">
                      {dayPlan.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-slate-900" />
                      ) : isSelected ? (
                        <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 dark:text-slate-700" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                          Hari {dayPlan.day}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${getFocusBadgeColor(dayPlan.focus)}`}>
                          {dayPlan.focus}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {dayPlan.title}
                      </h4>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-[10px] font-bold pl-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dayPlan.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Day Detail Workspace Panel */}
        <div className="lg:col-span-7" id="active-day-workspace">
          {activeTab === "syllabus" ? (
            /* SYLLABUS MACRO STATE PREVIEW */
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-md space-y-6 animate-fade-in" id="syllabus-overview">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Syllabus Overview</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Ikuti rancangan jalur belajar ini secara tertib untuk hasil ideal jangka panjang. Berikut pembagian sub-materi mingguan:</p>
              
              <div className="space-y-4">
                {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, weekIdx) => {
                  const weekNum = weekIdx + 1;
                  const weekDays = roadmap.days.slice(weekIdx * 7, (weekIdx + 1) * 7);
                  const completedInWeek = weekDays.filter((d) => d.completed).length;

                  return (
                    <div key={weekNum} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-sm text-slate-800 dark:text-slate-200">Minggu {weekNum}: Pemantapan Fase</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">{completedInWeek} / 7 Hari Selesai</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${(completedInWeek / 7) * 100}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {weekDays.map((d) => (
                          <span 
                            key={d.day} 
                            onClick={() => {
                              setSelectedDayNum(d.day);
                              setActiveTab("daily");
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition ${
                              d.completed 
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : d.day === selectedDayNum
                                  ? "bg-blue-600 text-white"
                                  : "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800"
                            }`}
                          >
                            H{d.day}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* DETAILED SINGLE DAY STUDY WORKSPACE */
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-md space-y-6 animate-fade-in" id="day-workspace-card">
              
              {/* Day Header Block */}
              <div className="pb-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500 select-none">
                      HARI {selectedDay.day} DARI {totalDays}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${getFocusBadgeColor(selectedDay.focus)}`}>
                      {selectedDay.focus}
                    </span>
                    {selectedDay.completed && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 select-none">
                        SELESAI
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">{selectedDay.title}</h3>
                </div>

                <button
                  onClick={handleMarkDayComplete}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 shrink-0 cursor-pointer shadow transition-all ${
                    selectedDay.completed
                      ? "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-300 hover:bg-red-50 hover:text-red-600"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  id="btn-toggle-day-complete"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedDay.completed ? "Batal Selesai" : "Tandas Selesai"}</span>
                </button>
              </div>

              {/* Day Body Content split into sections */}
              
              {/* Task list Section */}
              <div className="space-y-3" id="task-list-section">
                <div className="flex items-center space-x-2 pb-1.5 border-b border-gray-100 dark:border-slate-800">
                  <ClipboardList className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Tugas Harian Checklist:</h4>
                </div>
                <div className="space-y-2">
                  {selectedDay.tasks.map((taskStr, index) => {
                    const isChecked = selectedDay.completedTasks[index];
                    return (
                      <label
                        key={index}
                        className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked 
                            ? "border-emerald-100 bg-emerald-50/20 dark:bg-emerald-950/10 text-gray-400" 
                            : "border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
                        }`}
                        id={`task-item-${index}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => handleToggleTask(index)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs sm:text-sm">{taskStr}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Resource Referral Link section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-gray-25/50 dark:border-slate-850 flex items-center justify-between" id="daily-resource-box">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Bahan Rujukan Pendukung:</h5>
                    <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-xs">{selectedDay.resource}</p>
                  </div>
                </div>
                <a
                  href={selectedDay.resourceLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg text-[11px] font-extrabold text-blue-600 dark:text-blue-400 flex items-center space-x-1 shrink-0 hover:bg-blue-50 dark:hover:bg-slate-850 transition"
                  id="link-resource-external"
                >
                  <span>Buka Materi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Interactive MCQ Quiz Block */}
              {selectedDay.quiz && (
                <div className="p-5 rounded-2xl border border-amber-100 dark:border-amber-955 bg-amber-50/[0.12] space-y-4" id="daily-quiz-block">
                  <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Quick Quiz Harian (+15 XP)</span>
                  </div>

                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedDay.quiz.question}</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedDay.quiz.options.map((optOption) => {
                      const optIsSelected = quizAnswerSelected === optOption;
                      return (
                        <button
                          key={optOption}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswerSelected(optOption)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition ${
                            optIsSelected
                              ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-400"
                              : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50/50"
                          } ${quizSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {optOption}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!quizAnswerSelected}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition"
                      id="btn-submit-quiz"
                    >
                      Kirim Jawaban
                    </button>
                  ) : (
                    <div className="space-y-2 pt-2 animate-fade-in" id="quiz-feedback-box">
                      <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold ${
                        quizFeedback?.isCorrect 
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-50 dark:bg-red-955 text-red-700 dark:text-red-400"
                      }`}>
                        {quizFeedback?.text}
                      </div>
                      <div className="p-3 text-xs text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1">
                        <p className="font-extrabold text-slate-700 dark:text-slate-300">💡 Penjelasan Kunci Jawaban:</p>
                        <p>{selectedDay.quiz.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Weekly Special Mini Project Submission */}
              {selectedDay.miniProject && (
                <div className="p-5 rounded-2xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/[0.15] dark:bg-purple-950/[0.04] space-y-4" id="weekly-project-block">
                  <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 font-extrabold uppercase text-xs tracking-wider">
                    <Star className="w-4 h-4 animate-spin text-purple-500 shrink-0" />
                    <span>Mini-Project Mingguan (+50 XP)</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-sm font-black text-slate-800 dark:text-slate-100">{selectedDay.miniProject.title}</h5>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{selectedDay.miniProject.desc}</p>
                  </div>

                  {!selectedDay.miniProject.completed ? (
                    <button
                      onClick={handleCompleteProject}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow transition"
                      id="btn-complete-project"
                    >
                      Kirim & Tandas Project Selesai 🎉
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm text-center">
                      ✓ Project Selesai Dituntaskan (+50 XP diperoleh!)
                    </div>
                  )}
                </div>
              )}

              {/* Weekly Special Evaluation Form */}
              {selectedDay.evaluation && selectedDay.evaluationData && (
                <div className="p-5 rounded-2xl border border-red-100 dark:border-red-950 bg-red-50/[0.06] space-y-5" id="weekly-eval-block">
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 font-extrabold uppercase text-xs tracking-wider">
                    <ClipboardList className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Laporan Evaluasi Mingguan (+30 XP)</span>
                  </div>

                  {!selectedDay.evaluationData.submitted ? (
                    <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">1. Hal paling mudah dipahami minggu ini:</label>
                        <input
                          type="text"
                          name="halMudah"
                          required
                          placeholder="Materi apa yang paling gampang bagi Anda?"
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">2. Hal paling sulit atau hambatan terbesar:</label>
                        <input
                          type="text"
                          name="halSulit"
                          required
                          placeholder="Metode/Sintaks apa yang paling sering error?"
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">3. Target baru untuk minggu depan:</label>
                        <input
                          type="text"
                          name="targetMingguDepan"
                          required
                          placeholder="Apa visi baru Anda pada babak selanjutnya?"
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">4. Berikan nilai fokus pribadi Anda minggu ini (1-10):</label>
                        <select
                          name="nilaiFokus"
                          className="p-2 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-slate-950"
                        >
                          {Array.from({ length: 10 }).map((_, n) => (
                            <option key={n+1} value={n+1}>{n+1} / 10</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs sm:text-sm cursor-pointer hover:shadow transition"
                      >
                        Kirim Laporan Evaluasi
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 animate-fade-in" id="eval-reports-box">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-center rounded-xl">
                        ✓ Laporan Evaluasi Mingguan Berhasil Dikirim (+30 XP!)
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-2xl text-xs space-y-2">
                        <p><strong>Mudah:</strong> {selectedDay.evaluationData.halMudah}</p>
                        <p><strong>Sulit:</strong> {selectedDay.evaluationData.halSulit}</p>
                        <p><strong>Target Selanjutnya:</strong> {selectedDay.evaluationData.targetMingguDepan}</p>
                        <p><strong>Skor Nilai Fokus Diri:</strong> {selectedDay.evaluationData.nilaiFokus} / 10</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reflection Submittion Form Block */}
              {!selectedDay.evaluation && (
                <div className="space-y-3" id="reflection-log-box">
                  <div className="flex items-center space-x-2 pb-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0" />
                    <h4 className="text-sm font-bold">Refleksi Harian Mandiri (+10 XP)</h4>
                  </div>
                  
                  <textarea
                    rows={2}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    disabled={selectedDay.reflectionSubmitted}
                    placeholder="Tulis hal baru yang kamu pelajari atau pahami hari ini..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {selectedDay.reflectionSubmitted ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] sm:text-xs rounded-xl flex items-center space-x-1.5 animate-fade-in">
                      <span>✓ Refleksi berhasil disalin dan disimpan! (+10 XP diperoleh)</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitReflection}
                      disabled={!reflectionText.trim()}
                      className="px-4 py-2 bg-slate-950 dark:bg-slate-800 disabled:bg-gray-100 dark:disabled:bg-slate-950 disabled:text-gray-400 dark:disabled:text-slate-600 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center space-x-1 hover:bg-slate-900 cursor-pointer shadow transition"
                      id="btn-submit-reflection"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Catat Refleksi</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Print-only syllabus listing */}
      <div className="print-only mt-8" id="syllabus-print-grid">
        <h2 className="text-2xl font-black text-slate-900 mb-4 border-b pb-2">Rincian Kurikulum Harian</h2>
        <div className="space-y-4">
          {roadmap.days.map((dayPlan) => (
            <div key={dayPlan.day} className="print-day-item bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700 mr-2">Hari {dayPlan.day}</span>
                  <span className="text-xs font-bold text-slate-500">({dayPlan.focus})</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{dayPlan.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-600">{dayPlan.duration}</span>
              </div>
              
              {dayPlan.tasks && dayPlan.tasks.length > 0 && (
                <div className="mt-2 pl-4">
                  <h4 className="text-xs font-bold text-slate-600 mb-1">Daftar Materi & Tugas:</h4>
                  <ul className="list-disc space-y-1 text-xs text-slate-700 pl-4">
                    {dayPlan.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="border border-slate-400 w-3.5 h-3.5 rounded shrink-0 inline-block text-center text-[10px] leading-3 font-bold">
                          {dayPlan.completedTasks?.[idx] ? "✓" : " "}
                        </span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {dayPlan.reflection && (
                <div className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase">Refleksi Belajar:</h4>
                  <p className="text-xs italic text-slate-700 mt-1">{dayPlan.reflection}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
