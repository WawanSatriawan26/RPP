import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { storageService } from './storageService';

// Helper to sanitize HTML strings
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper to create and trigger download of the standalone single-file index.html
export function downloadStandaloneHtml(
  teacherParam?: TeacherProfile,
  schoolParam?: SchoolIdentity,
  learningParam?: LearningData
): void {
  const teacher = teacherParam || storageService.getTeacherProfile();
  const school = schoolParam || storageService.getSchoolIdentity();
  const learning = learningParam || storageService.getLearningData();

  const alokasi = storageService.getAlokasiWaktu();
  const analisisCpAtp = storageService.getCpAtpAnalysis();
  const cpContent = storageService.getCpContent();
  const atpRows = storageService.getAtpRows();
  const bahanAjar = storageService.getBahanAjar();
  const modulAjar = storageService.getModulAjar();
  const lkpd = storageService.getLkpd();
  const asesmen = storageService.getAsesmen();
  const jurnalRows = storageService.getJurnalRows();
  const protaRows = storageService.getProtaRows();
  const promesRows = storageService.getPromesRows();

  const fullDataJson = JSON.stringify({
    teacher,
    school,
    learning,
    alokasi,
    analisisCpAtp,
    cpContent,
    atpRows,
    bahanAjar,
    modulAjar,
    lkpd,
    asesmen,
    jurnalRows,
    protaRows,
    promesRows,
  }).replace(/</g, '\\u003c');

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel Perangkat Ajar - ${escapeHtml(school.namaSekolah)}</title>
  <meta name="description" content="10 Berkas Perangkat Ajar Pembelajaran Mendalam Berbasis Cinta untuk ${escapeHtml(learning.mataPelajaran)} Kelas ${escapeHtml(learning.kelas)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--slate-50);
      color: var(--slate-800);
      line-height: 1.6;
    }
    .font-doc { font-family: 'Tinos', 'Times New Roman', serif; }
    header {
      background: white;
      border-bottom: 1px solid var(--slate-200);
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-outline { background: white; border-color: var(--slate-200); color: var(--slate-700); }
    .btn-outline:hover { background: var(--slate-100); }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .hero-card {
      background: linear-gradient(135deg, #1e40af, #3730a3, #0f172a);
      color: white;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(30, 64, 175, 0.3);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .tabs-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
      background: white;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid var(--slate-200);
    }
    .tab-btn {
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 0.8125rem;
      font-weight: 600;
      border: 1px solid transparent;
      background: var(--slate-100);
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s;
    }
    .tab-btn:hover { background: #e2e8f0; }
    .tab-btn.active {
      background: var(--primary);
      color: white;
    }
    .doc-viewer {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--slate-200);
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      min-height: 400px;
    }
    .doc-content {
      font-family: 'Tinos', 'Times New Roman', serif;
      font-size: 1.05rem;
      line-height: 1.8;
      white-space: pre-wrap;
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 0.875rem;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px 12px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    .kop-surat {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 12px;
      margin-bottom: 24px;
      font-family: 'Tinos', 'Times New Roman', serif;
    }
    .kop-surat h2 { font-size: 1.35rem; font-weight: bold; text-transform: uppercase; }
    .kop-surat h3 { font-size: 1.15rem; font-weight: bold; text-transform: uppercase; }
    .kop-surat p { font-size: 0.85rem; color: #475569; }
    @media print {
      header, .tabs-nav, .hero-card, .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
      .container { padding: 0 !important; max-width: 100% !important; }
      .doc-viewer { border: none !important; box-shadow: none !important; padding: 0 !important; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-logo">PA</div>
      <div>
        <h1 style="font-size: 1.125rem; font-weight: 700; color: #0f172a;">Panel Perangkat Ajar Offline</h1>
        <p style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Pembelajaran Mendalam Berbasis Cinta</p>
      </div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" class="btn btn-outline no-print">🖨️ Cetak / PDF</button>
      <button onclick="copyCurrentDoc()" class="btn btn-primary no-print" id="copy-btn">📋 Salin Teks Dokumen</button>
    </div>
  </header>

  <div class="container">
    <div class="hero-card">
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
        <span class="badge">❤️ Berbasis Cinta Kasih</span>
        <span class="badge">✨ Mindful &bull; Meaningful &bull; Joyful</span>
        <span class="badge">🏫 ${escapeHtml(school.namaSekolah)}</span>
      </div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">
        ${escapeHtml(learning.mataPelajaran)} &bull; Kelas ${escapeHtml(learning.kelas)} (${escapeHtml(learning.fase)})
      </h2>
      <p style="font-size: 0.875rem; opacity: 0.9; max-width: 650px;">
        Penyusun: <strong>${escapeHtml(teacher.namaPembuat)}</strong> (NIP: ${escapeHtml(teacher.nip || '-')}) &bull; Semester ${escapeHtml(school.semester)} TP ${escapeHtml(school.tahunPelajaran)}
      </p>
    </div>

    <!-- Document Tabs Navigation -->
    <div class="tabs-nav no-print" id="tabs-container">
      <button class="tab-btn active" onclick="showDoc('modul-ajar')">📘 Modul Ajar / RPP</button>
      <button class="tab-btn" onclick="showDoc('bahan-ajar')">📖 Bahan Ajar</button>
      <button class="tab-btn" onclick="showDoc('lkpd')">📝 LKPD</button>
      <button class="tab-btn" onclick="showDoc('asesmen')">📊 Asesmen</button>
      <button class="tab-btn" onclick="showDoc('cp')">🎯 Capaian Pembelajaran</button>
      <button class="tab-btn" onclick="showDoc('atp')">🛤️ Alur Tujuan (ATP)</button>
      <button class="tab-btn" onclick="showDoc('alokasi')">⏱️ Alokasi Waktu</button>
      <button class="tab-btn" onclick="showDoc('analisis-cp-atp')">🔍 Analisis CP-ATP</button>
      <button class="tab-btn" onclick="showDoc('prota')">📅 PROTA</button>
      <button class="tab-btn" onclick="showDoc('promes')">🗓️ PROMES</button>
      <button class="tab-btn" onclick="showDoc('jurnal')">📓 Jurnal Mengajar</button>
    </div>

    <!-- Viewer Document Area -->
    <div class="doc-viewer" id="doc-display-area">
      <!-- Kop Surat -->
      <div class="kop-surat">
        <h2>PEMERINTAH DAERAH PROVINSI / KABUPATEN</h2>
        <h3>${escapeHtml(school.namaSekolah)}</h3>
        <p>${escapeHtml(school.alamat || '')} ${escapeHtml(school.kecamatan || '')}, ${escapeHtml(school.kabupatenKota || '')} &bull; NPSN: ${escapeHtml(school.npsn || '-')}</p>
      </div>

      <div id="doc-body" class="doc-content"></div>
    </div>
  </div>

  <script>
    const APP_DATA = ${fullDataJson};

    const DOCS_MAP = {
      'modul-ajar': {
        title: 'MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)',
        content: APP_DATA.modulAjar || 'Belum ada draf modul ajar. Silakan generate di aplikasi utama.'
      },
      'bahan-ajar': {
        title: 'BAHAN AJAR KONTEKSTUAL BERBASIS CINTA',
        content: APP_DATA.bahanAjar || 'Belum ada draf bahan ajar.'
      },
      'lkpd': {
        title: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
        content: APP_DATA.lkpd || 'Belum ada draf LKPD.'
      },
      'asesmen': {
        title: 'ASESMEN PEMBELAJARAN & RUBRIK PENILAIAN',
        content: APP_DATA.asesmen || 'Belum ada draf asesmen.'
      },
      'cp': {
        title: 'CAPAIAN PEMBELAJARAN (CP)',
        content: APP_DATA.cpContent || 'Belum ada dokumen CP.'
      },
      'alokasi': {
        title: 'ANALISIS ALOKASI WAKTU EFEKTIF',
        render: function() {
          const a = APP_DATA.alokasi;
          let h = '<h3>ANALISIS ALOKASI WAKTU EFEKTIF</h3>';
          h += '<p><strong>Semester Ganjil:</strong> ' + (a.semesterGanjil?.mingguEfektif || 18) + ' Minggu Efektif x ' + (a.semesterGanjil?.jamPerMinggu || 3) + ' JP = ' + (a.semesterGanjil?.totalJam || 54) + ' JP</p>';
          h += '<p><strong>Semester Genap:</strong> ' + (a.semesterGenap?.mingguEfektif || 16) + ' Minggu Efektif x ' + (a.semesterGenap?.jamPerMinggu || 3) + ' JP = ' + (a.semesterGenap?.totalJam || 48) + ' JP</p>';
          h += '<table><thead><tr><th>No</th><th>Materi Pokok</th><th>Alokasi JP</th></tr></thead><tbody>';
          (a.distribusiMateri || []).forEach((m, idx) => {
            h += '<tr><td>' + (idx + 1) + '</td><td>' + m.materi + '</td><td>' + m.alokasiJp + ' JP</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      },
      'analisis-cp-atp': {
        title: 'ANALISIS CP & ATP PEMBELAJARAN MENDALAM',
        render: function() {
          let h = '<h3>ANALISIS CP & ATP DENGAN 3 PRINSIP & NILAI CINTA</h3>';
          h += '<table><thead><tr><th>Elemen CP</th><th>Kompetensi</th><th>Materi Esensial</th><th>Tujuan Pembelajaran</th><th>Prinsip & Nilai Cinta</th></tr></thead><tbody>';
          (APP_DATA.analisisCpAtp || []).forEach(r => {
            h += '<tr><td>' + r.elemen + '</td><td>' + r.kompetensi + '</td><td>' + r.materi + '</td><td>' + r.tujuan + '</td><td>' + r.prinsip + ' (' + r.nilaiCinta + ')</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      },
      'atp': {
        title: 'ALUR TUJUAN PEMBELAJARAN (ATP)',
        render: function() {
          let h = '<h3>ALUR TUJUAN PEMBELAJARAN (ATP) KRONOLOGIS</h3>';
          h += '<table><thead><tr><th>No</th><th>Tujuan Pembelajaran (TP)</th><th>Alokasi JP</th><th>Dimensi Profil</th><th>Rencana Asesmen</th></tr></thead><tbody>';
          (APP_DATA.atpRows || []).forEach(r => {
            h += '<tr><td>' + r.no + '</td><td>' + r.tp + '</td><td>' + r.jp + ' JP</td><td>' + r.dimensi + '</td><td>' + r.asesmen + '</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      },
      'prota': {
        title: 'PROGRAM TAHUNAN (PROTA)',
        render: function() {
          let h = '<h3>PROGRAM TAHUNAN (PROTA)</h3>';
          h += '<table><thead><tr><th>No</th><th>Semester</th><th>Tujuan / Materi</th><th>Alokasi JP</th></tr></thead><tbody>';
          (APP_DATA.protaRows || []).forEach(r => {
            h += '<tr><td>' + r.no + '</td><td>' + r.semester + '</td><td>' + r.materi + '</td><td>' + r.alokasiJp + ' JP</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      },
      'promes': {
        title: 'PROGRAM SEMESTER (PROMES)',
        render: function() {
          let h = '<h3>PROGRAM SEMESTER (PROMES)</h3>';
          h += '<table><thead><tr><th>No</th><th>Materi Pokok</th><th>Alokasi JP</th><th>Bulan Pelaksanaan</th></tr></thead><tbody>';
          (APP_DATA.promesRows || []).forEach(r => {
            h += '<tr><td>' + r.no + '</td><td>' + r.materi + '</td><td>' + r.alokasiJp + ' JP</td><td>' + r.bulan + '</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      },
      'jurnal': {
        title: 'JURNAL MENGAJAR GURU',
        render: function() {
          let h = '<h3>JURNAL MENGAJAR GURU KELAS</h3>';
          h += '<table><thead><tr><th>No</th><th>Hari/Tgl</th><th>Kelas/Jam</th><th>Materi & Aktivitas</th><th>Refleksi Cinta Kasih</th></tr></thead><tbody>';
          (APP_DATA.jurnalRows || []).forEach(r => {
            h += '<tr><td>' + r.no + '</td><td>' + r.hariTanggal + '</td><td>' + r.kelasJam + '</td><td>' + r.materi + '</td><td>' + (r.refleksiCinta || '-') + '</td></tr>';
          });
          h += '</tbody></table>';
          return h;
        }
      }
    };

    let activeDocId = 'modul-ajar';

    function showDoc(docId) {
      activeDocId = docId;
      const target = DOCS_MAP[docId];
      if (!target) return;

      const bodyEl = document.getElementById('doc-body');
      if (target.render) {
        bodyEl.innerHTML = target.render();
      } else {
        bodyEl.innerHTML = '<h3 style="text-align:center; font-weight:bold; margin-bottom:16px;">' + target.title + '</h3><div style="white-space:pre-wrap;">' + target.content + '</div>';
      }

      // Update button classes
      const buttons = document.querySelectorAll('.tab-btn');
      buttons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('onclick').includes(docId));
      });
    }

    function copyCurrentDoc() {
      const bodyEl = document.getElementById('doc-body');
      navigator.clipboard.writeText(bodyEl.innerText).then(() => {
        const btn = document.getElementById('copy-btn');
        const orig = btn.innerText;
        btn.innerText = '✓ Teks Tersalin!';
        setTimeout(() => btn.innerText = orig, 2000);
      });
    }

    // Initial render
    showDoc('modul-ajar');
  </script>
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
