import React from 'react';
import {
  Sparkles,
  Settings,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  AlertCircle,
  Zap,
  GraduationCap
} from 'lucide-react';
import { TeacherProfile, SchoolIdentity, GeminiSettings } from '../types';

interface HeaderProps {
  teacher: TeacherProfile;
  school: SchoolIdentity;
  gemini: GeminiSettings;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenGeminiSettings: () => void;
  onOpenQuickGenerate: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  school,
  gemini,
  theme,
  onToggleTheme,
  onOpenGeminiSettings,
  onOpenQuickGenerate,
  onToggleSidebar,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-6 py-3 shadow-xs no-print transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & School Identity Overview */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden"
            title="Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm lg:text-base text-slate-900 dark:text-white leading-tight">
                  {school.namaSekolah || 'Panel Perangkat Ajar'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
                  {school.jenjang}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {teacher.namaPembuat || 'Guru Pengampu'}
                </span>
                <span className="hidden md:inline">&bull;</span>
                <span className="hidden md:inline">
                  Tapel {school.tahunPelajaran} ({school.semester})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status Gemini, Quick Generate, Settings, Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Generate Action */}
          <button
            id="btn-quick-generate-header"
            onClick={onOpenQuickGenerate}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Generate Cepat</span>
          </button>

          {/* Gemini AI Status Badge */}
          <button
            id="btn-gemini-status"
            onClick={onOpenGeminiSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              gemini.isConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
            title="Klik untuk membuka Pengaturan Gemini AI"
          >
            {gemini.isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden xs:inline">Gemini Terhubung</span>
                <span className="xs:hidden">Aktif</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span className="hidden xs:inline">Gemini Belum Terhubung</span>
                <span className="xs:hidden">Offline</span>
              </>
            )}
          </button>

          {/* Gemini Settings Button */}
          <button
            id="btn-header-gemini-settings"
            onClick={onOpenGeminiSettings}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
            title="Pengaturan Gemini AI"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
