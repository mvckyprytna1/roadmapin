import React, { useState } from "react";
import { Search, ExternalLink, Bookmark, Check, BookOpen, Video, Code, Wrench, GraduationCap } from "lucide-react";
import { ResourceItem } from "../types";

interface ResourceLibraryProps {
  resources: ResourceItem[];
  onToggleRead: (resId: string) => void;
  goalCategoryFilter: string;
}

export default function ResourceLibrary({
  resources,
  onToggleRead,
  goalCategoryFilter
}: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Semua");

  const categories = [
    { key: "Semua", label: "Semua Tipe" },
    { key: "Artikel", label: "Artikel / Dokumentasi" },
    { key: "Video", label: "Video Tutorial" },
    { key: "Tools", label: "Perkakas / Tools" },
    { key: "Checklist", label: "Checklist" },
    { key: "Latihan", label: "Latihan Praktis" }
  ];

  // Filtering criteria matching
  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Semua" || res.type === selectedType;
    const matchesGoal = goalCategoryFilter === "Semua" || res.goalCategory === goalCategoryFilter || goalCategoryFilter === "custom_ai";
    return matchesSearch && matchesType && matchesGoal;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "Video": return <Video className="w-4 h-4 text-red-500" />;
      case "Tools": return <Wrench className="w-4 h-4 text-amber-500" />;
      case "Checklist": return <Code className="w-4 h-4 text-blue-500" />;
      case "Latihan": return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      default: return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8" id="resource-library-panel">
      {/* Search Header and filters */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Resource Library</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Pustaka link rujukan standar industri dan tools penunjang belajar yang sangat kami rekomendasikan.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari rujukan belajar..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5" id="type-category-selectors">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedType(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedType === cat.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Grid listing */}
      {filteredResources.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl" id="resource-empty-state">
          <Bookmark className="w-10 h-10 text-gray-300 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-400 mt-3">Tidak ada kecocokan resource</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">Kami tidak dapat mengidentifikasi tautan yang sesuai kata pencarianmu. Coba pilih kategori tipe rujukan yang berbeda di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="resource-cards-grid">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 hover:shadow transition"
              id={`resource-item-${res.id}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between select-none">
                  <div className="flex items-center space-x-1.5">
                    {getIcon(res.type)}
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">{res.type}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500">
                    {res.goalCategory.toUpperCase()} PRESET
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{res.title}</h3>
                <p className="text-[11px] text-gray-400">Cocok dipelajari untuk memantapkan pemahaman coding mu.</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
                <button
                  onClick={() => onToggleRead(res.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                    res.read
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-slate-800 text-slate-500 hover:bg-gray-200"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{res.read ? "Sudah Dibaca" : "Tandukan Selesai"}</span>
                </button>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"
                  id={`link-ext-resource-${res.id}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
