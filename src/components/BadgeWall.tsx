import React from "react";
import { Compass, Flame, Zap, Award, BookOpen, Target, Clock, Crown, ShieldAlert } from "lucide-react";
import { Badge } from "../types";

interface BadgeWallProps {
  badges: Badge[];
}

export default function BadgeWall({ badges }: BadgeWallProps) {
  const getIcon = (iconName: string, unlocked: boolean) => {
    const cn = `w-8 h-8 transition-transform group-hover:scale-110 duration-200 ${
      unlocked 
        ? "text-yellow-500 dark:text-yellow-400 fill-yellow-50 dark:fill-yellow-950/20" 
        : "text-gray-300 dark:text-slate-700"
    }`;
    switch (iconName) {
      case "Compass": return <Compass className={cn} />;
      case "Flame": return <Flame className={cn} />;
      case "Zap": return <Zap className={cn} />;
      case "Award": return <Award className={cn} />;
      case "BookOpen": return <BookOpen className={cn} />;
      case "Target": return <Target className={cn} />;
      case "Clock": return <Clock className={cn} />;
      case "Crown": return <Crown className={cn} />;
      default: return <Compass className={cn} />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8" id="badge-wall-panel">
      {/* Metric banner summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 border border-blue-500 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Pencapaian Belajar</h2>
          <p className="text-xs sm:text-sm text-blue-100">Dapatkan XP dan selesaikan berbagai habit belajar harian untuk membuka lencana luhur.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-black">{unlockedCount}</span>
          <span className="text-xs font-bold text-blue-100 block">/ {badges.length} Terbuka</span>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="badges-cards-grid">
        {badges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all duration-150 flex items-start space-x-4 group ${
                badge.unlocked
                  ? "border-amber-200 dark:border-amber-900/40 bg-amber-50/[0.1] dark:bg-amber-950/[0.04] shadow-sm"
                  : "border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 opacity-75"
              }`}
              id={`badge-card-${badge.id}`}
            >
              <div className={`p-3 rounded-xl shrink-0 ${
                badge.unlocked 
                  ? "bg-amber-500/10 dark:bg-yellow-500/15" 
                  : "bg-gray-50 dark:bg-slate-800/80"
              }`}>
                {getIcon(badge.iconName, badge.unlocked)}
              </div>

              <div className="space-y-1 select-none">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-none">
                    {badge.title}
                  </h3>
                  {!badge.unlocked && (
                    <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-600 shrink-0" title="Terkunci" />
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-400 leading-normal">{badge.desc}</p>
                {badge.unlocked && badge.unlockedAt && (
                  <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-400 block pt-1 uppercase tracking-wider">
                    DIBUKA: {new Date(badge.unlockedAt).toLocaleDateString("id-ID")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
