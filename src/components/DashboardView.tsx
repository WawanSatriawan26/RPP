import React from 'react';
import {
  Sparkles,
  Bot,
  FileDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  BookOpen,
  Download,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import {
  TeacherProfile,
  SchoolIdentity,
  LearningData,
  NavigationTab
} from '../types';

interface DashboardViewProps {
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  completionPercent: number;
  docStatuses: { id: NavigationTab; title: string; isComplete: boolean }[];
  onNavigateToTab: (tab: NavigationTab) => void;
  onExportAllDocx: () => void;
  onDownloadPortableHtml: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  teacher,
  school,
  learning,
  completionPercent,
  docStatuses,
  onNavigateToTab,
  onExportAllDocx,
  onDownloadPortableHtml,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Welcome Card */}
      <div className="bg-linear-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/20">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Pembelajaran Mendalam Berbasis Cinta</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {teacher.namaPembuat || 'Bapak/Ibu Guru'}!
            </h1>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              Panel pintar untuk menyusun 10 berkas administrasi perangkat pembelajaran secara otomatis, selaras dengan Kurikulum Nasional, dan mengakar pada 3 prinsip: <strong className="text-white">Mindful, Meaningful, & Joyful</strong>.
            </p>

            {/* Quick badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-blue-200">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <GraduationCap className="w-3.5 h-3.5" />
                {school.namaSekolah || 'Sekolah Belum Diisi'}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <BookOpen className="w-3.5 h-3.5" />
                {learning.mataPelajaran} ({learning.jenjang} / Kelas {learning.kelas})
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                Semester {school.semester} - {school.tahunPelajaran}
              </span>
            </div>
          </div>

          {/* Quick Action Button Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab('ai-generator')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>🚀 Mulai Generate Otomatis (AI)</span>
            </button>

            <button
              type="button"
              onClick={onExportAllDocx}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600/60 hover:bg-blue-600/90 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Semua ke Word (.docx)</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPortableHtml}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition cursor-pointer"
              title="Unduh 1 file HTML mandiri tanpa instalasi aplikasi"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Aplikasi Standalone (.html)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kelengkapan Berkas</span>
            <span className="text-lg font-black text-blue-600">{completionPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {completionPercent >= 100
              ? '🎉 Luar biasa! Seluruh 10 berkas perangkat ajar telah lengkap dan siap diexport.'
              : `${docStatuses.filter((d) => d.isComplete).length} dari 10 berkas telah terisi.`}
          </p>
        </div>

        {/* 3 Prinsip Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">3 Prinsip Pembelajaran</span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-900/50">
              Mindful
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Berkesadaran</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-900/50">
              Meaningful
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Bermakna</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-900/50">
              Joyful
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Gembira</span>
            </div>
          </div>
        </div>

        {/* 6 Nilai Cinta Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">6 Nilai Berbasis Cinta</span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {learning.nilaiCinta.map((val, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-lg text-[11px] font-semibold"
              >
                ♥ {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Documents Status Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Status 10 Berkas Perangkat Ajar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pantau status berkas Anda dan klik untuk meninjau, mengedit, atau menggenerate ulang dengan AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {docStatuses.map((doc, idx) => (
            <div
              key={doc.id}
              onClick={() => onNavigateToTab(doc.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Berkas 0{idx + 1}</span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {doc.isComplete ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Siap / Lengkap
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Draf Awal
                    </span>
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
