import React from "react";
import { Compass, Flame, Zap, Sun, Moon, Sparkles, User, Settings2, History, Library, LayoutDashboard, Award } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  userProfile: UserProfile;
  currentView: string;
  setCurrentView: (view: string) => void;
  toggleTheme: () => void;
  hasActiveRoadmap: boolean;
}

export default function Header({
  userProfile,
  currentView,
  setCurrentView,
  toggleTheme,
  hasActiveRoadmap
}: HeaderProps) {
  return (
    <header className="app-header sticky top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView("home")} 
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
          id="logo-brand"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Roadmapin
            </h1>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase -mt-1">
              Skill Roadmap Generator
            </p>
          </div>
        </div>

        {/* Navigation Items (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => setCurrentView(hasActiveRoadmap ? "dashboard" : "home")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "dashboard" || (currentView === "home" && !hasActiveRoadmap)
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView("wizard")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "wizard"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-wizard"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bikin Roadmap</span>
          </button>

          <button
            onClick={() => setCurrentView("history")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "history"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-history"
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={() => setCurrentView("resources")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "resources"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-resources"
          >
            <Library className="w-4 h-4" />
            <span>Resource Library</span>
          </button>

          <button
            onClick={() => setCurrentView("badges")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "badges"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-badges"
          >
            <Award className="w-4 h-4" />
            <span>Pencapaian</span>
          </button>

          <button
            onClick={() => setCurrentView("settings")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              currentView === "settings"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
            id="nav-settings"
          >
            <Settings2 className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* User Stats & Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Streak Counter */}
          <div 
            onClick={() => setCurrentView("badges")}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 cursor-pointer select-none hover:scale-105 transition-transform duration-200"
            title="Streak Belajarmu: Klik untuk melihat pencapaian lencana!"
            id="streak-badge"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span className="text-xs sm:text-sm font-bold">{userProfile.streak} Hari</span>
          </div>

          {/* XP Badge */}
          <div 
            onClick={() => setCurrentView("badges")}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 cursor-pointer select-none hover:scale-105 transition-transform duration-200"
            title="Sertifikat XP: Klik untuk melihat pencapaian lencana!"
            id="xp-badge"
          >
            <Zap className="w-4 h-4 fill-current text-indigo-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">{userProfile.xp} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
            id="btn-theme-toggle"
          >
            {userProfile.theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Mini Avatar Profile */}
          <div 
            onClick={() => setCurrentView("settings")}
            className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-3 sm:pl-4 cursor-pointer group"
            id="profile-mini"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[80px]">
              {userProfile.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
