import React from "react";
import { History, Calendar, Award, Trash2, ArrowRight, Compass, Layout } from "lucide-react";
import { Roadmap } from "../types";

interface HistoryListProps {
  history: Roadmap[];
  activeRoadmapId: string;
  onSelectActiveRoadmap: (id: string) => void;
  onDeleteRoadmap: (id: string) => void;
}

export default function HistoryList({
  history,
  activeRoadmapId,
  onSelectActiveRoadmap,
  onDeleteRoadmap
}: HistoryListProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8" id="roadmap-history-panel">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Riwayat Roadmap</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Atur dan jelajahi arsip roadmap belajar yang pernah kamu buat sebelumnya.</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl" id="history-empty-state">
          <History className="w-10 h-10 text-gray-300 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-3">Belum ada riwayat roadmap</h3>
          <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 max-w-md mx-auto">Mulai susun roadmap belajar pertamamu secara otomatis sekarang!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="history-cards-grid">
          {history.map((rm) => {
            const isActive = activeRoadmapId === rm.id;
            const completedCount = rm.days.filter((d) => d.completed).length;
            const completionPercent = Math.round((completedCount / rm.days.length) * 100);

            return (
              <div
                key={rm.id}
                className={`p-6 rounded-2xl border transition-all duration-150 flex flex-col justify-between space-y-4 ${
                  isActive
                    ? "border-blue-500 bg-blue-50/[0.12] dark:bg-blue-950/[0.15] ring-1 ring-blue-500/20"
                    : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
                id={`history-item-${rm.id}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500">
                      {rm.level}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(rm.createdAt).toLocaleDateString("id-ID")}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg pr-4">{rm.goal}</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">Durasi target: {rm.duration} Hari — Alokasi: {rm.dailyTime}</p>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-slate-400">
                    <span>Progress: {completionPercent}% Selesai</span>
                    <span>{completedCount} / {rm.days.length} hari</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionPercent}%` }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80">
                  <button
                    onClick={() => onSelectActiveRoadmap(rm.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center space-x-1.5 transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 cursor-default"
                        : "bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gray-200 cursor-pointer"
                    }`}
                    id={`btn-load-roadmap-${rm.id}`}
                  >
                    <span>{isActive ? "Sedang Aktif" : "Load Roadmap"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteRoadmap(rm.id)}
                    className="p-2.5 rounded-xl border border-transparent hover:border-red-100 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"
                    title="Hapus riwayat permanen"
                    id={`btn-delete-roadmap-${rm.id}`}
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
