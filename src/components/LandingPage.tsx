import React from "react";
import { Compass, Sparkles, BookOpen, Clock, Target, ArrowRight, Award, GraduationCap, Layout, Figma, TrendingUp, Percent, Video, Mic, Globe, CheckCircle2 } from "lucide-react";
import { GoalPreset, GOALS_LIST } from "../data";

interface LandingPageProps {
  onStartWizard: (goalId?: string) => void;
  onViewSample: () => void;
}

export default function LandingPage({ onStartWizard, onViewSample }: LandingPageProps) {
  // Mapping categories to icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Layout": return <Layout className="w-5 h-5" />;
      case "Figma": return <Figma className="w-5 h-5" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5" />;
      case "Percent": return <Percent className="w-5 h-5" />;
      case "Video": return <Video className="w-5 h-5" />;
      case "Mic": return <Mic className="w-5 h-5" />;
      case "Globe": return <Globe className="w-5 h-5" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 py-8 md:py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6" id="hero-section">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold animate-bounce mt-4">
          <Sparkles className="w-4 h-4" />
          <span>SaaS Generator Pembelajaran Bertenaga AI</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Bingung mulai belajar dari mana? <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Bikin roadmap belajarmu otomatis.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Pilih tujuan, level kemampuan, dan waktu belajar per hari. <strong>Roadmapin</strong> akan menyusun tugas harian, resource, quiz, project kecil, dan evaluasi mingguan agar kamu tahu harus belajar apa setiap hari.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onStartWizard()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center space-x-2 text-base"
            id="cta-start-wizard"
          >
            <span>Buat Roadmap Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onViewSample}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-800/80 font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center space-x-1.5 text-base"
            id="cta-view-sample"
          >
            <span>Lihat Contoh Klasik</span>
          </button>
        </div>
      </section>

      {/* Popular Goals Carousel/Grid */}
      <section className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pilih Paling Populer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pilih dari pustaka kurikulum standar industri kami atau buat tujuan kustommu sendiri.</p>
          </div>
          <button 
            onClick={() => onStartWizard("custom")} 
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 self-start sm:self-center"
            id="btn-custom-goal-shortcut"
          >
            <span>Bikin Tujuan Kustom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="goals-presets-grid">
          {GOALS_LIST.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onStartWizard(preset.id)}
              className="group p-5 rounded-3xl border border-gray-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500/80 hover:shadow-xl hover:shadow-blue-500/[0.03] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  {getIcon(preset.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base sm:text-lg">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                    Rekomendasi: {preset.difficultyRecommended}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-slate-400 line-clamp-3">
                    {preset.shortDesc}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
                <span>Pilih Skill Ini</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Key Benefits Bento Grid */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-12 px-4 rounded-3xl max-w-7xl mx-auto border border-gray-200/50 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kenapa pakai Roadmapin?</h2>
          <p className="text-gray-500 dark:text-slate-300">Berhentilah membaca artikel acak tanpa arah dan beralihlah ke jalur belajar terstruktur harian.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto" id="benefits-grid">
          {/* Benefit 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Bukan Sekadar Daftar Tugas</h3>
            <p className="text-sm text-gray-400 dark:text-slate-400">Sistem membagi materi secara logis dari fondasi dasar, praktik fungsional, latihan, hingga project konkret yang berjalan bertahap.</p>
          </div>
          
          {/* Benefit 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Sesuai Kapasitas Waktu</h3>
            <p className="text-sm text-gray-400 dark:text-slate-400">Punya waktu 15 menit atau 90 menit? Generator menterjemahkan dan menakar intensitas tugas harian yang pas agar kamu tidak mengalami burnout.</p>
          </div>

          {/* Benefit 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Gamifikasi Belajar Seru</h3>
            <p className="text-sm text-gray-400 dark:text-slate-400">Dapatkan Experience Points (XP), raih streak harian yang tinggi, dan buka lencana digital (badges) keren setiap kali kamu merampungkan materi belajarmu.</p>
          </div>
        </div>
      </section>

      {/* Stats Dummy Section */}
      <section className="max-w-5xl mx-auto text-center grid grid-cols-2 md:grid-cols-4 gap-8 px-4" id="stats-section">
        <div className="space-y-1">
          <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">120K+</p>
          <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Roadmap Terbuat</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">98%</p>
          <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tingkat Kepuasan</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl sm:text-5xl font-extrabold text-purple-600 dark:text-purple-400">8</p>
          <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Preset Industri</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">10M+</p>
          <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">XP Terkumpul</p>
        </div>
      </section>
    </div>
  );
}
