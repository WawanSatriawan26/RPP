import React from 'react';
import { Heart, Sparkles, GraduationCap, Download, ShieldCheck, FileCheck, Layers } from 'lucide-react';

interface AboutAppViewProps {
  onDownloadStandaloneHtml: () => void;
}

export const AboutAppView: React.FC<AboutAppViewProps> = ({ onDownloadStandaloneHtml }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/20">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Pedagogi Hati & Akal Budi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Panel Perangkat Ajar Pembelajaran Mendalam Berbasis Cinta
        </h1>
        <p className="text-sm text-blue-100/90 leading-relaxed max-w-2xl">
          Aplikasi terintegrasi untuk guru Indonesia dalam menyusun 10 berkas administrasi pembelajaran berkualitas tinggi secara otomatis dengan bantuan Gemini AI dan format dokumen Microsoft Word (.docx) berstandar resmi.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onDownloadStandaloneHtml}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Aplikasi Mandiri (.html) Portabel</span>
          </button>
        </div>
      </div>

      {/* Core Philosophies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 font-bold">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3 Prinsip Pembelajaran</h3>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>Mindful:</strong> Berkesadaran penuh, hening, dan hadir utuh.</li>
            <li><strong>Meaningful:</strong> Mengaitkan konsep dengan kehidupan nyata.</li>
            <li><strong>Joyful:</strong> Menggembirakan, memantik antusiasme belajar.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 font-bold">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3 Pengalaman Belajar</h3>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>Memahami:</strong> Membangun konsepsi esensial materi.</li>
            <li><strong>Mengaplikasi:</strong> Memecahkan masalah nyata kontekstual.</li>
            <li><strong>Merefleksi:</strong> Menemukan makna diri dan evaluasi.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 font-bold">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">6 Nilai Kasih Sayang</h3>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Cinta kepada Tuhan YME</li>
            <li>Cinta kepada Diri Sendiri & Sesama</li>
            <li>Cinta Ilmu, Lingkungan, & Bangsa</li>
          </ul>
        </div>
      </div>

      {/* Standalone & Privacy Features */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Kemandirian & Keamanan Data Guru
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Aplikasi ini dirancang dengan prinsip <em>Offline-First</em>. Seluruh isian data guru, sekolah, dan naskah modul pembelajaran tersimpan langsung di dalam penyimpanan lokal (<code>localStorage</code>) pada peramban Anda. Anda dapat mencadangkan seluruh data dalam format JSON kapan saja serta mengunduh berkas tunggal <code>index.html</code> untuk dijalankan tanpa internet (kecuali saat memanggil Gemini AI).
        </p>
      </div>
    </div>
  );
};
