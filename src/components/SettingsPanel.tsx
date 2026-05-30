import React, { useState } from "react";
import { User, ClipboardList, RefreshCw, Download, Upload, Trash2, Heart, ExternalLink, HelpCircle } from "lucide-react";
import { UserProfile } from "../types";

interface SettingsPanelProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onClearAllData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export default function SettingsPanel({
  userProfile,
  onUpdateProfile,
  onClearAllData,
  onExportBackup,
  onImportBackup
}: SettingsPanelProps) {
  const [name, setName] = useState(userProfile.name);
  const [defaultGoal, setDefaultGoal] = useState(userProfile.targetGoalDefault);
  const [defaultTime, setDefaultTime] = useState(userProfile.dailyTimeDefault);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateProfile({
      ...userProfile,
      name,
      targetGoalDefault: defaultGoal,
      dailyTimeDefault: defaultTime
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const triggerImport = () => {
    const backupStr = prompt("Tempel teks enkripsi backup JSON Anda di sini:");
    if (backupStr) {
      onImportBackup(backupStr);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6" id="settings-panel-container">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Pengaturan Sistem</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium">Sesuaikan profil belajarmu, amankan data cadangan local, dan atur fungsional sistem.</p>
      </div>

      {/* Profile settings form editor */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
          <User className="w-4 h-4 text-blue-500" />
          <span>Edit Biodata Belajar</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Siapa Namamu?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="settings-input-name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Target Skill:</label>
              <input
                type="text"
                value={defaultGoal}
                onChange={(e) => setDefaultGoal(e.target.value)}
                placeholder="Misal: Frontend Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Waktu Belajar:</label>
              <select
                value={defaultTime}
                onChange={(e) => setDefaultTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="15 menit / hari">15 menit / hari</option>
                <option value="30 menit / hari">30 menit / hari</option>
                <option value="60 menit / hari">60 menit / hari</option>
                <option value="90 menit / hari">90 menit / hari</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer hover:shadow transition"
              id="settings-save-profile"
            >
              Simpan Perubahan
            </button>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-lg animate-fade-in">
                ✓ Profil berhasil disimpan!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Backup and LocalStorage controls card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
          <Download className="w-4 h-4 text-purple-500" />
          <span>Cadangan & Pemulihan Sistem</span>
        </h3>

        <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed">Seluruh data pencapaian, progress harian, kuis terjawab, XP, dan riwayat disimpan di laci lokal browser (LocalStorage) Anda. Amankan backup data Anda sebelum membersihkan cache.</p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExportBackup}
            className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400 bg-purple-50/20 hover:bg-purple-600 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 transition"
            id="settings-export-backup"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Backup JSON</span>
          </button>

          <button
            onClick={triggerImport}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 hover:bg-indigo-600 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 transition"
            id="settings-import-backup"
          >
            <Upload className="w-4 h-4" />
            <span>Impor Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Critical actions danger zone block */}
      <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-200/50 dark:border-red-955 p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-extrabold text-red-700 dark:text-red-400 flex items-center space-x-1.5">
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Zona Bahaya Permanen</span>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Tindakan di bawah bersifat irreversible. Menghapus seluruh data akan me-reset streak, progress lencana, XP, serta seluruh riwayat roadmap belajar Anda secara utuh di peramban ini.
        </p>

        <button
          onClick={onClearAllData}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center space-x-1 cursor-pointer transition hover:shadow-lg hover:shadow-red-500/10"
          id="settings-clear-all-data"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Hapus Seluruh Data</span>
        </button>
      </div>
    </div>
  );
}
