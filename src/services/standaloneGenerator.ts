import { TeacherProfile, SchoolIdentity, LearningData } from '../types';

// Helper to create and trigger download of the standalone single-file index.html
export function downloadStandaloneHtml(
  teacher?: TeacherProfile,
  school?: SchoolIdentity,
  learning?: LearningData
): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel Perangkat Ajar - Pembelajaran Mendalam Berbasis Cinta</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://unpkg.com/docx@8.5.0/build/index.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-doc { font-family: 'Tinos', 'Times New Roman', serif; }
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      body { background: white !important; color: black !important; }
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased">
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between shadow-sm sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">PA</div>
        <div>
          <h1 class="font-bold text-slate-900 leading-tight">Panel Perangkat Ajar</h1>
          <p class="text-xs text-blue-600 font-medium">Pembelajaran Mendalam Berbasis Cinta (Versi Standalone Offline)</p>
        </div>
      </div>
      <div class="flex items-center gap-4 text-sm mt-2 sm:mt-0">
        <div class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-slate-700 font-medium">Siap Digunakan di Komputer Sekolah</span>
        </div>
        <button onclick="window.print()" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold">🖨️ Cetak</button>
      </div>
    </header>

    <!-- Main Container -->
    <div class="flex-1 max-w-7xl w-full mx-auto p-6">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Selamat Datang di Versi Standalone Single-File</h2>
            <p class="text-slate-600 text-sm mt-1 max-w-2xl">
              File ini dapat dibuka langsung di Google Chrome, Microsoft Edge, atau Mozilla Firefox di laptop/PC manapun tanpa koneksi internet atau server tambahan.
            </p>
          </div>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Single File Portable</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <h3 class="font-semibold text-blue-900 text-sm">3 Prinsip Pembelajaran</h3>
            <p class="text-xs text-blue-700 mt-1">Berkesadaran (Mindful), Bermakna (Meaningful), & Menggembirakan (Joyful).</p>
          </div>
          <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <h3 class="font-semibold text-indigo-900 text-sm">3 Pengalaman Belajar</h3>
            <p class="text-xs text-indigo-700 mt-1">Kegiatan Inti: Memahami → Mengaplikasi → Merefleksi.</p>
          </div>
          <div class="p-4 rounded-xl bg-rose-50 border border-rose-100">
            <h3 class="font-semibold text-rose-900 text-sm">Pembelajaran Berbasis Cinta</h3>
            <p class="text-xs text-rose-700 mt-1">Cinta Tuhan, Diri Sendiri, Sesama, Ilmu, Lingkungan, Bangsa & Negara.</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-800 mb-4">Pilih Dokumen yang Ingin Dilihat & Diexport:</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <a href="#modul-ajar" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📘</div>
            <div class="font-semibold text-xs text-slate-800">Modul Ajar / RPP</div>
          </a>
          <a href="#bahan-ajar" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📖</div>
            <div class="font-semibold text-xs text-slate-800">Bahan Ajar</div>
          </a>
          <a href="#lkpd" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📝</div>
            <div class="font-semibold text-xs text-slate-800">LKPD Siswa</div>
          </a>
          <a href="#asesmen" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📊</div>
            <div class="font-semibold text-xs text-slate-800">Asesmen & Kisi</div>
          </a>
          <a href="#prota" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📅</div>
            <div class="font-semibold text-xs text-slate-800">PROTA</div>
          </a>
          <a href="#promes" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">🗓️</div>
            <div class="font-semibold text-xs text-slate-800">PROMES</div>
          </a>
          <a href="#jurnal" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">📓</div>
            <div class="font-semibold text-xs text-slate-800">Jurnal Mengajar</div>
          </a>
          <a href="#atp" class="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition">
            <div class="text-2xl mb-1">🎯</div>
            <div class="font-semibold text-xs text-slate-800">CP & ATP</div>
          </a>
        </div>
      </div>
    </div>

    <footer class="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
      Panel Perangkat Ajar Pembelajaran Mendalam Berbasis Cinta &bull; Dirancang untuk Guru Indonesia
    </footer>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
