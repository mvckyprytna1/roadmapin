import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Sparkles, History, Library, Award, Settings2, Compass, 
  Home, Check, HelpCircle, Trophy, Sparkle, LogIn, Heart, Download, Trash2, Info,
  Instagram, AtSign
} from "lucide-react";

// Types
import { UserProfile, Roadmap, Badge, ResourceItem } from "./types";

// Static Data and Offline builder
import { GOALS_LIST, DEFAULT_RESOURCE_ITEMS, BADGES_LIST, generateOfflineRoadmap } from "./data";

// Extracted Modular Components
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Wizard from "./components/Wizard";
import ActiveDashboard from "./components/ActiveDashboard";
import ResourceLibrary from "./components/ResourceLibrary";
import HistoryList from "./components/HistoryList";
import BadgeWall from "./components/BadgeWall";
import SettingsPanel from "./components/SettingsPanel";

// Robust localStorage persistence helper
function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw && raw.trim() !== "") {
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.error(`Gagal membaca key ${key} dari localStorage:`, err);
  }
  return fallback;
}

export default function App() {
  // Views states: 'home' | 'wizard' | 'dashboard' | 'history' | 'resources' | 'badges' | 'settings'
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedGoalIdForWizard, setSelectedGoalIdForWizard] = useState<string>("");

  // Storage Persistence States
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Siswa Hebat",
    targetGoalDefault: "Frontend Developer",
    dailyTimeDefault: "30 menit / hari",
    xp: 0,
    streak: 0,
    lastActiveDate: "",
    theme: "light",
    unlockedBadges: []
  });

  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [history, setHistory] = useState<Roadmap[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // App system indicators
  const [isGenerating, setIsGenerating] = useState(false);

  // Toast notifications manager state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

  const showNotification = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Modal alert/confirm/prompt system state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm" | "prompt" | "copy";
    title: string;
    message: string;
    placeholder?: string;
    defaultValue?: string;
    onConfirm?: (value?: string) => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: ""
  });

  const showCustomModal = (config: Omit<typeof modalConfig, "isOpen">) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeCustomModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Load state on start Mount
  useEffect(() => {
    const rawProfile = localStorage.getItem("roadmapin_profile");
    if (rawProfile) {
      try {
        setUserProfile(JSON.parse(rawProfile));
      } catch (e) {
        console.error("Failed to parse local profile:", e);
      }
    } else {
      // Setup initial default profile
      const initialProfile: UserProfile = {
        name: "Siswa Hebat",
        targetGoalDefault: "Frontend Developer",
        dailyTimeDefault: "30 menit / hari",
        xp: 10,
        streak: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        theme: "light",
        unlockedBadges: ["start"] // unlock start
      };
      setUserProfile(initialProfile);
      localStorage.setItem("roadmapin_profile", JSON.stringify(initialProfile));
    }

    const loadedActive = safeGetStorage<Roadmap | null>("roadmapin_active_roadmap", null);
    if (loadedActive) {
      setActiveRoadmap(loadedActive);
      setCurrentView("dashboard");
    }

    setHistory(safeGetStorage<Roadmap[]>("roadmapin_history", []));

    const loadedResources = localStorage.getItem("roadmapin_resources");
    if (loadedResources) {
      try {
        setResources(JSON.parse(loadedResources));
      } catch (e) {
        setResources(DEFAULT_RESOURCE_ITEMS);
      }
    } else {
      setResources(DEFAULT_RESOURCE_ITEMS);
      localStorage.setItem("roadmapin_resources", JSON.stringify(DEFAULT_RESOURCE_ITEMS));
    }

    const loadedBadges = localStorage.getItem("roadmapin_badges");
    if (loadedBadges) {
      try {
        setBadges(JSON.parse(loadedBadges));
      } catch (e) {
        const initialBadges = BADGES_LIST.map((b) => b.id === "start" ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b);
        setBadges(initialBadges);
      }
    } else {
      const initialBadges = BADGES_LIST.map((b) => b.id === "start" ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b);
      setBadges(initialBadges);
      localStorage.setItem("roadmapin_badges", JSON.stringify(initialBadges));
    }
  }, []);

  // Sync Global Theme classes triggered by theme changes
  useEffect(() => {
    if (userProfile.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [userProfile.theme]);

  // Handler for setting / toggling light-dark theme
  const handleToggleTheme = () => {
    const nextTheme = userProfile.theme === "light" ? "dark" : "light";
    const updatedProfile = { ...userProfile, theme: nextTheme };
    setUserProfile(updatedProfile);
    localStorage.setItem("roadmapin_profile", JSON.stringify(updatedProfile));
  };

  // Handler update global user profiles
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem("roadmapin_profile", JSON.stringify(updated));
  };

  // Gamified Engine: Award XP, trigger alert overlays and checking badge states
  const handleAwardXP = (amount: number, reason: string) => {
    const nextXp = Math.max(0, userProfile.xp + amount);
    let badgesToUnlock = [...userProfile.unlockedBadges];

    // Evaluate badge thresholds on state update
    if (nextXp >= 100 && !badgesToUnlock.includes("streak3") && userProfile.streak >= 3) {
      badgesToUnlock.push("streak3");
    }
    if (nextXp >= 300 && !badgesToUnlock.includes("streak7") && userProfile.streak >= 7) {
      badgesToUnlock.push("streak7");
    }
    if (nextXp >= 50 && !badgesToUnlock.includes("project1") && activeRoadmap?.days.some(d => d.miniProject?.completed)) {
      badgesToUnlock.push("project1");
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      xp: nextXp,
      unlockedBadges: badgesToUnlock
    };

    setUserProfile(updatedProfile);
    localStorage.setItem("roadmapin_profile", JSON.stringify(updatedProfile));

    // Also synchronise badge arrays
    const updatedBadges = badges.map((b) => {
      if (badgesToUnlock.includes(b.id) && !b.unlocked) {
        return {
          ...b,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBadges(updatedBadges);
    localStorage.setItem("roadmapin_badges", JSON.stringify(updatedBadges));
  };

  // Tracking daily streak algorithm on marking task/days selesai
  const handleTriggerStreak = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastActive = userProfile.lastActiveDate;

    let nextStreak = userProfile.streak;

    if (!lastActive) {
      nextStreak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active yesterday
        nextStreak += 1;
      } else if (diffDays > 1) {
        // Missed yesterday
        nextStreak = 1;
      }
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      streak: nextStreak,
      lastActiveDate: todayStr
    };

    setUserProfile(updatedProfile);
    localStorage.setItem("roadmapin_profile", JSON.stringify(updatedProfile));

    // Auto unlock consistency badges
    if (nextStreak >= 3) {
      handleAwardXP(30, "Apresiasi Konsisten 3 Hari!");
    }
    if (nextStreak >= 7) {
      handleAwardXP(100, "Apresiasi Konsisten 7 Hari!");
    }
  };

  // Submit / Generate wizard form trigger controller
  const handleGenerateRoadmap = async ({
    goalId,
    customGoalText,
    level,
    duration,
    dailyTime,
    preferences,
    useAI
  }: {
    goalId: string;
    customGoalText: string;
    level: "Pemula" | "Sedang" | "Lanjut";
    duration: number;
    dailyTime: string;
    preferences: string[];
    useAI: boolean;
  }) => {
    setIsGenerating(true);

    const goalLabel = goalId === "custom" ? customGoalText : (GOALS_LIST.find((g) => g.id === goalId)?.title || "Skill Baru");

    // Let's call our backend API if they requested useAI mode
    if (useAI) {
      try {
        const response = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: goalLabel,
            level,
            duration,
            dailyTime,
            preferences
          })
        });

        const data = await response.json();
        if (data.success && data.roadmap) {
          // Successfully obtained AI generated roadmap!
          const newRm: Roadmap = data.roadmap;
          
          setActiveRoadmap(newRm);
          localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(newRm));

          // Save to history list
          const nextHistory = [newRm, ...history];
          setHistory(nextHistory);
          localStorage.setItem("roadmapin_history", JSON.stringify(nextHistory));

          setIsGenerating(false);
          setCurrentView("dashboard");
          return;
        } else {
          console.warn("AI roadmap generation failed. Redirecting to instant offline engine: " + (data.message || data.error));
        }
      } catch (err) {
        console.warn("Could not reach AI generation server route, falling back to seamless offline curation.", err);
      }
    }

    // High fidelity Offline scheduler fallback
    setTimeout(() => {
      const offlineRm = generateOfflineRoadmap(
        goalId,
        customGoalText,
        level,
        duration,
        dailyTime,
        preferences
      );

      setActiveRoadmap(offlineRm);
      localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(offlineRm));

      const nextHistory = [offlineRm, ...history];
      setHistory(nextHistory);
      localStorage.setItem("roadmapin_history", JSON.stringify(nextHistory));

      setIsGenerating(false);
      setCurrentView("dashboard");
    }, 4500); // realistic premium skeleton loading timeout
  };

  // Select historical roadmap to set active
  const handleSelectActiveRoadmap = (rmId: string) => {
    const rm = history.find((h) => h.id === rmId);
    if (rm) {
      setActiveRoadmap(rm);
      localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(rm));
      setCurrentView("dashboard");
    }
  };

  // Delete historic roadmap permanent
  const handleDeleteRoadmap = (rmId: string) => {
    const nextHist = history.filter((h) => h.id !== rmId);
    setHistory(nextHist);
    localStorage.setItem("roadmapin_history", JSON.stringify(nextHist));

    // If deleting the active roadmap, nullify active states
    if (activeRoadmap?.id === rmId) {
      setActiveRoadmap(null);
      localStorage.removeItem("roadmapin_active_roadmap");
      setCurrentView("home");
    }
  };

  const handleResetActiveRoadmap = () => {
    if (!activeRoadmap) return;
    showCustomModal({
      type: "confirm",
      title: "Hapus Roadmap Aktif",
      message: "Apakah Anda yakin ingin mematikan / menghapus roadmap aktif ini secara permanen?",
      onConfirm: () => {
        handleDeleteRoadmap(activeRoadmap.id);
        showNotification("Roadmap aktif berhasil dihapus.", "info");
      }
    });
  };

  // Single bookmark study resources flag
  const handleToggleResourceRead = (resId: string) => {
    const nextRes = resources.map((r) => {
      if (r.id === resId) {
        return {
          ...r,
          read: !r.read
        };
      }
      return r;
    });
    setResources(nextRes);
    localStorage.setItem("roadmapin_resources", JSON.stringify(nextRes));
  };

  // Clearing / Wipe out standard localstorage triggers
  const handleClearAllData = () => {
    showCustomModal({
      type: "confirm",
      title: "Hapus Seluruh Data",
      message: "Apakah Anda benar-benar yakin ingin menghapus seluruh data Roadmapin Anda secara permanen? Semua XP, Streak, dan Roadmap yang sudah Anda rancang akan sirna.",
      onConfirm: () => {
        localStorage.clear();
        // Reset React state values
        setUserProfile({
          name: "Siswa Hebat",
          targetGoalDefault: "Frontend Developer",
          dailyTimeDefault: "30 menit / hari",
          xp: 0,
          streak: 0,
          lastActiveDate: "",
          theme: "light",
          unlockedBadges: []
        });
        setActiveRoadmap(null);
        setHistory([]);
        setResources(DEFAULT_RESOURCE_ITEMS);
        setBadges(BADGES_LIST);
        setCurrentView("home");
        showNotification("Seluruh data lokal berhasil dibersihkan.", "success");
      }
    });
  };

  // Profile JSON copy backup codes
  const handleExportBackup = () => {
    const backupObj = {
      profile: userProfile,
      activeRoadmap,
      history,
      resources,
      badges
    };
    try {
      const exportedStr = btoa(JSON.stringify(backupObj));
      showCustomModal({
        type: "copy",
        title: "Ekspor Backup",
        message: "Simpan teks kode enkripsi di bawah ini aman-aman di notepad atau catat untuk dipulihkan nanti.",
        defaultValue: exportedStr
      });
    } catch (err) {
      showNotification("Gagal mengenkripsi paket backup.", "error");
    }
  };

  const handleImportBackup = (jsonStr: string) => {
    try {
      const decoded = JSON.parse(atob(jsonStr));
      if (!decoded.profile) {
        showNotification("Data backup tidak dikenali.", "error");
        return;
      }
      setUserProfile(decoded.profile);
      setActiveRoadmap(decoded.activeRoadmap || null);
      setHistory(decoded.history || []);
      setResources(decoded.resources || DEFAULT_RESOURCE_ITEMS);
      setBadges(decoded.badges || BADGES_LIST);
      
      localStorage.setItem("roadmapin_profile", JSON.stringify(decoded.profile));
      if (decoded.activeRoadmap) {
        localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(decoded.activeRoadmap));
      } else {
        localStorage.removeItem("roadmapin_active_roadmap");
      }
      localStorage.setItem("roadmapin_history", JSON.stringify(decoded.history || []));
      localStorage.setItem("roadmapin_resources", JSON.stringify(decoded.resources || DEFAULT_RESOURCE_ITEMS));
      localStorage.setItem("roadmapin_badges", JSON.stringify(decoded.badges || BADGES_LIST));
      
      setCurrentView(decoded.activeRoadmap ? "dashboard" : "home");
      showNotification("Data profil Roadmapin berhasil dipulihkan!", "success");
    } catch (e) {
      showNotification("Sintaks backup tidak valid. Pastikan Anda menyalin semuanya.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200 pb-20 md:pb-0" id="main-applet">
      
      {/* Global CSS background radial gradient effects */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-400 dark:bg-blue-600 blur-[130px]" />
        <div className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full bg-purple-400 dark:bg-purple-600 blur-[120px]" />
      </div>

      {/* header */}
      <Header
        userProfile={userProfile}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedGoalIdForWizard("");
        }}
        toggleTheme={handleToggleTheme}
        hasActiveRoadmap={!!activeRoadmap}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentView === "home" && (
          <LandingPage
            onStartWizard={(id) => {
              if (id) setSelectedGoalIdForWizard(id);
              setCurrentView("wizard");
            }}
            onViewSample={() => {
              // Load Frontend sample preset directly
              const sample = generateOfflineRoadmap("frontend", "", "Pemula", 30, "30 menit / hari", ["Teori", "Praktik"]);
              setActiveRoadmap(sample);
              localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(sample));
              // save historical
              const nextHist = [sample, ...history];
              setHistory(nextHist);
              localStorage.setItem("roadmapin_history", JSON.stringify(nextHist));
              
              setCurrentView("dashboard");
              alert("Behasil memuat contoh Roadmap Frontend Developer 30 Hari!");
            }}
          />
        )}

        {currentView === "wizard" && (
          <Wizard
            initialGoalId={selectedGoalIdForWizard}
            onGenerate={handleGenerateRoadmap}
            isGenerating={isGenerating}
            onBackToHome={() => setCurrentView("home")}
          />
        )}

        {currentView === "dashboard" && activeRoadmap && (
          <ActiveDashboard
            roadmap={activeRoadmap}
            onUpdateRoadmap={(updated) => {
              setActiveRoadmap(updated);
              localStorage.setItem("roadmapin_active_roadmap", JSON.stringify(updated));
              
              // update corresponding element inside history list too
              const nextHist = history.map((h) => h.id === updated.id ? updated : h);
              setHistory(nextHist);
              localStorage.setItem("roadmapin_history", JSON.stringify(nextHist));
            }}
            onAwardXP={handleAwardXP}
            onTriggerStreak={handleTriggerStreak}
            onResetRoadmap={handleResetActiveRoadmap}
            userProfile={userProfile}
          />
        )}

        {currentView === "resources" && (
          <ResourceLibrary
            resources={resources}
            onToggleRead={handleToggleResourceRead}
            goalCategoryFilter={activeRoadmap ? activeRoadmap.goalCategory : "Semua"}
          />
        )}

        {currentView === "history" && (
          <HistoryList
            history={history}
            activeRoadmapId={activeRoadmap ? activeRoadmap.id : ""}
            onSelectActiveRoadmap={handleSelectActiveRoadmap}
            onDeleteRoadmap={handleDeleteRoadmap}
          />
        )}

        {currentView === "badges" && (
          <BadgeWall badges={badges} />
        )}

        {currentView === "settings" && (
          <SettingsPanel
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onClearAllData={handleClearAllData}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Floating Bottom Navigator for Mobile devices */}
      <div className="mobile-bottom-nav md:hidden fixed bottom-1.5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-14 bg-white/95 dark:bg-slate-900/95 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl backdrop-blur flex justify-around items-center px-4 py-2 z-50">
        <button
          onClick={() => setCurrentView(activeRoadmap ? "dashboard" : "home")}
          className={`flex flex-col items-center justify-center space-y-0.5 ${
            currentView === "dashboard" || (currentView === "home" && !activeRoadmap) ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView("wizard")}
          className={`flex flex-col items-center justify-center space-y-0.5 ${
            currentView === "wizard" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-bold">Bikin</span>
        </button>

        <button
          onClick={() => setCurrentView("history")}
          className={`flex flex-col items-center justify-center space-y-0.5 ${
            currentView === "history" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[9px] font-bold">Arsip</span>
        </button>

        <button
          onClick={() => setCurrentView("resources")}
          className={`flex flex-col items-center justify-center space-y-0.5 ${
            currentView === "resources" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[9px] font-bold">Pustaka</span>
        </button>

        <button
          onClick={() => setCurrentView("settings")}
          className={`flex flex-col items-center justify-center space-y-0.5 ${
            currentView === "settings" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Settings2 className="w-5 h-5" />
          <span className="text-[9px] font-bold">Setelan</span>
        </button>
      </div>

      {toast.show && (
        <div id="toast-notification-banner" className="fixed top-20 right-4 sm:right-6 max-w-sm w-full bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl shadow-2xl z-[60] flex items-center space-x-3 text-sm font-bold animate-slide-in">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === "success" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" :
            toast.type === "error" ? "bg-red-50 dark:bg-red-955 text-red-600 dark:text-red-400" :
            "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <span className="text-slate-800 dark:text-slate-100">{toast.message}</span>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="custom-global-dialog">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl shadow-2xl space-y-4 animate-scale-up">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {modalConfig.type === "copy" ? <Download className="w-5 h-5 text-purple-500" /> :
                 modalConfig.type === "confirm" ? <HelpCircle className="w-5 h-5 text-indigo-500" /> :
                 modalConfig.title.toLowerCase().includes("hapus") ? <Trash2 className="w-5 h-5 text-red-500" /> :
                 <Sparkles className="w-5 h-5 text-blue-500" />}
                <span>{modalConfig.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">{modalConfig.message}</p>
            </div>

            {modalConfig.type === "prompt" && (
              <textarea
                id="modal-prompt-input"
                className="w-full p-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                placeholder={modalConfig.placeholder}
              />
            )}

            {modalConfig.type === "copy" && (
              <div className="space-y-3">
                <textarea
                  id="modal-copy-textarea"
                  readOnly
                  value={modalConfig.defaultValue}
                  className="w-full p-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono text-[10px] select-all min-h-[120px] focus:outline-none"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
                <button
                  onClick={() => {
                    if (modalConfig.defaultValue) {
                      navigator.clipboard.writeText(modalConfig.defaultValue);
                      showNotification("Berhasil menyalin kode backup ke clipboard!", "success");
                    }
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 hover:shadow-md transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salin ke Clipboard</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-50 dark:border-slate-800">
              {modalConfig.type !== "alert" && modalConfig.type !== "copy" && (
                <button
                  onClick={() => {
                    closeCustomModal();
                    if (modalConfig.onCancel) modalConfig.onCancel();
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer transition"
                >
                  Batal
                </button>
              )}
              
              <button
                onClick={() => {
                  let value: string | undefined = undefined;
                  if (modalConfig.type === "prompt") {
                    const el = document.getElementById("modal-prompt-input") as HTMLTextAreaElement;
                    value = el?.value;
                  }
                  closeCustomModal();
                  if (modalConfig.onConfirm) modalConfig.onConfirm(value);
                }}
                className={`px-5 py-2 ${
                  modalConfig.title.toLowerCase().includes("hapus")
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition`}
              >
                {modalConfig.type === "alert" || modalConfig.type === "copy" ? "Tutup" : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Human humble footer */}
      <footer className="no-print py-10 px-6 text-center text-xs text-slate-400 selection:bg-indigo-500 border-t border-slate-150/10 dark:border-slate-800/60 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-950/20 max-w-7xl mx-auto rounded-3xl mt-16 mb-8 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2" id="footer-branding-label">
          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Roadmap<span className="text-indigo-600 dark:text-indigo-400 font-black">in</span></span>
          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
          <p className="text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">Kurikulum & Roadmap Belajar Mandiri</p>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium max-w-md leading-relaxed font-sans">
          Membantu siswa & pembelajar mandiri di Indonesia menyusun rencana belajar berbasis AI secara terfokus, bertahap, dan komprehensif.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
          <span>&copy; {new Date().getFullYear()} Roadmapin</span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-800">&bull;</span>
          <span className="flex items-center space-x-1.5 py-1 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-full text-slate-800 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all">
            <span>Dirancang oleh</span> 
            <span className="text-indigo-600 dark:text-indigo-400 font-black tracking-normal lowercase text-xs first-letter:uppercase">vicky</span>
          </span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-800">&bull;</span>
          <span className="flex items-center space-x-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span>untuk Indonesia</span>
          </span>
        </div>

        {/* Brand Elegant Social Media Integration */}
        <div className="flex items-center justify-center gap-2.5 pt-1.5" id="vicky-footer-socials">
          <a
            href="https://instagram.com/mvckyprytna_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 dark:from-pink-500/5 dark:to-purple-500/5 border border-pink-500/20 hover:border-pink-500/40 rounded-full text-slate-700 dark:text-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            title="Ikuti Instagram @mvckyprytna_"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
            <span className="text-[10px] lowercase font-extrabold tracking-tight font-sans">instagram: @mvckyprytna_</span>
          </a>

          <a
            href="https://tiktok.com/@mvckyprytna_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-500/10 to-slate-900/10 hover:from-teal-500/20 hover:to-slate-900/20 dark:from-teal-500/5 dark:to-slate-900/5 border border-teal-505/20 hover:border-teal-500/40 rounded-full text-slate-700 dark:text-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            title="Ikuti TikTok @mvckyprytna_"
          >
            <AtSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-[10px] lowercase font-extrabold tracking-tight font-sans">tiktok: @mvckyprytna_</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
