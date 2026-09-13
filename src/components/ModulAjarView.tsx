import React, { useState } from 'react';
import { FileText, Sparkles, FileDown, Wand2, Zap, Printer } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { RichDocumentEditor } from './RichDocumentEditor';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface ModulAjarViewProps {
  content: string;
  onSave: (updated: string) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  content,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [docType, setDocType] = useState<'modul' | 'rpp'>('modul');
  const [editorContent, setEditorContent] = useState<string>(
    content ||
      `<h1>MODUL AJAR: ${learning.materiTopik.toUpperCase()}</h1>
<p style="text-align:center; font-style:italic;">Pendekatan Pembelajaran Mendalam Berbasis Cinta</p>
<hr/>

<h3>A. IDENTITAS UMUM</h3>
<ul>
  <li><strong>Nama Penyusun:</strong> ${teacher.namaPembuat}</li>
  <li><strong>Satuan Pendidikan:</strong> ${school.namaSekolah}</li>
  <li><strong>Tahun Ajaran:</strong> ${school.tahunPelajaran} | <strong>Semester:</strong> ${school.semester}</li>
  <li><strong>Jenjang / Kelas / Fase:</strong> ${learning.jenjang} / Kelas ${learning.kelas} / Fase ${learning.fase}</li>
  <li><strong>Mata Pelajaran:</strong> ${learning.mataPelajaran}</li>
  <li><strong>Elemen:</strong> ${learning.elemen}</li>
  <li><strong>Alokasi Waktu:</strong> ${learning.alokasiWaktu} (${learning.jumlahPertemuan} Pertemuan)</li>
</ul>

<h3>B. KOMPETENSI AWAL</h3>
<p>Peserta didik telah memiliki pengetahuan dasar tentang konsep awal terkait ${learning.materiTopik} dan memiliki antusiasme untuk belajar bersama.</p>

<h3>C. PROFIL LULUSAN & NILAI CINTA</h3>
<ul>
  <li><strong>Dimensi Profil Lulusan:</strong> ${learning.dimensiProfilLulusan.join(', ')}</li>
  <li><strong>Nilai Pembelajaran Berbasis Cinta:</strong> ${learning.nilaiCinta.join(', ')}</li>
  <li><strong>Integrasi 4 Olah:</strong> ${learning.olah.join(', ')}</li>
</ul>

<h3>D. SARANA DAN PRASARANA</h3>
<p>${learning.saranaPrasarana}</p>

<h3>E. TARGET DAN MODEL PEMBELAJARAN</h3>
<ul>
  <li><strong>Target Peserta Didik:</strong> Peserta didik reguler (${learning.jumlahPesertaDidik} siswa) dengan keragaman gaya belajar.</li>
  <li><strong>Model Pembelajaran:</strong> Problem Based Learning / Project Based Learning yang kontekstual.</li>
  <li><strong>3 Prinsip:</strong> ${learning.prinsipPembelajaran.join(', ')}</li>
</ul>

<h3>F. KOMPONEN INTI</h3>
<h4>1. Tujuan Pembelajaran</h4>
<p>Peserta didik mampu memahami hakikat konsep ${learning.materiTopik}, mengaplikasikan pengetahuan tersebut dalam memecahkan permasalahan nyata dengan rasa cinta kasih, serta merefleksikan nilai manfaatnya.</p>

<h4>2. Pemahaman Bermakna</h4>
<p>Pembelajaran bukan sekadar menghafal teori, melainkan seni memahami kehidupan, mengasah empati, dan menggunakan ilmu untuk kebermanfaatan bersama.</p>

<h4>3. Pertanyaan Pemantik</h4>
<ul>
  <li>Bagaimana konsep ${learning.materiTopik} ini hadir dan membantu kehidupan kita sehari-hari?</li>
  <li>Nilai cinta dan kebaikan apa yang bisa kita wujudkan melalui pemahaman materi ini?</li>
</ul>

<h4>4. Kegiatan Pembelajaran</h4>
<p><strong>A. Kegiatan Pendahuluan (15 Menit):</strong></p>
<ul>
  <li>Guru menyapa dengan hangat dan penuh cinta, mengajak berdoa bersama (Cinta kepada Tuhan).</li>
  <li>Mindful Check-in: Latihan pernapasan hening sejenak untuk memusatkan kesadaran belajar.</li>
  <li>Apersepsi dan penyampaian tujuan pembelajaran secara menyenangkan (Joyful).</li>
</ul>

<p><strong>B. Kegiatan Inti (${parseInt(learning.alokasiWaktu) > 0 ? parseInt(learning.alokasiWaktu) - 25 : 55} Menit):</strong></p>
<ul>
  <li><strong>1. Pengalaman Memahami:</strong> Siswa mengamati fenomena kontekstual, menelaah materi secara berpasangan, dan mengajukan pertanyaan kritis.</li>
  <li><strong>2. Pengalaman Mengaplikasi:</strong> Siswa berkolaborasi dalam kelompok kecil menyelesaikan tugas pemecahan masalah nyata pada LKPD dengan saling menghargai (Cinta Sesama).</li>
  <li><strong>3. Pengalaman Merefleksi:</strong> Perwakilan kelompok mempresentasikan gagasan; siswa lain memberikan apresiasi dan tanggapan konstruktif; siswa merenungkan esensi makna belajar hari ini.</li>
</ul>

<p><strong>C. Kegiatan Penutup (15 Menit):</strong></p>
<ul>
  <li>Rangkuman bersama yang meneguhkan keyakinan belajar siswa.</li>
  <li>Refleksi perasaan gembira dan catatan bersyukur.</li>
  <li>Doa penutup dan salam hangat.</li>
</ul>

<h3>G. ASESMEN PEMBELAJARAN</h3>
<ul>
  <li><strong>Asesmen Diagnostik:</strong> Tanya jawab pemantik kesiapan belajar awal.</li>
  <li><strong>Asesmen Formatif:</strong> Observasi keaktifan diskusi, lembar kerja kelompok (LKPD), dan sikap kasih sayang.</li>
  <li><strong>Asesmen Sumatif:</strong> Tes tertulis/projek pemecahan masalah kontekstual.</li>
</ul>

<h3>H. REFLEKSI DAN TINDAK LANJUT</h3>
<p>Refleksi guru terhadap suasana kelas yang berkesadaran, serta program pengayaan bagi siswa berkecepatan tinggi dan bimbingan remedial penuh kesabaran.</p>`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async (variant: 'modul_lengkap' | 'rpp_efektif' | 'improve') => {
    setIsGenerating(true);
    try {
      let prompt = '';
      if (variant === 'modul_lengkap') {
        prompt = `Susun MODUL AJAR LENGKAP & SISTEMATIS (standar Kurikulum Nasional Indonesia terbaru) berbasis Pembelajaran Mendalam dan Pembelajaran Berbasis Cinta untuk data berikut:
${buildLearningContextString(learning, teacher, school)}

Wajib menggunakan struktur teratur berformat HTML (h1, h2, h3, h4, p, ul, ol, li, table):
A. IDENTITAS UMUM (Lengkap dengan alokasi waktu dan pertemuan)
B. KOMPETENSI AWAL
C. PROFIL LULUSAN (Integrasikan 8 Dimensi)
D. SARANA DAN PRASARANA
E. TARGET PESERTA DIDIK
F. MODEL & METODE PEMBELAJARAN
G. PENDEKATAN PEMBELAJARAN MENDALAM (Mindful, Meaningful, Joyful)
H. INTEGRASI NILAI PEMBELAJARAN BERBASIS CINTA (Cinta Tuhan, Diri Sendiri, Sesama, Ilmu, Lingkungan, Bangsa/Negara)
I. TUJUAN PEMBELAJARAN
J. PEMAHAMAN BERMAKNA
K. PERTANYAAN PEMANTIK
L. KEGIATAN PEMBELAJARAN RINCI:
   - Pendahuluan (Orientasi, Apersepsi, Motivasi, Mindful Breathing/Check-in)
   - Kegiatan Inti Terstruktur:
     * 1. Pengalaman Memahami
     * 2. Pengalaman Mengaplikasi (Kolaborasi & kontekstual)
     * 3. Pengalaman Merefleksi (Evaluasi makna belajar)
   - Penutup (Rangkuman, Apresiasi, Joyful Closing & Doa)
M. ASESMEN (Diagnostik, Formatif, Sumatif)
N. PENGAYAAN DAN REMEDIAL
O. REFLEKSI GURU DAN PESERTA DIDIK
P. LAMPIRAN (Ringkasan LKPD & Glosarium).

Tulis secara operasional, siap diterapkan guru di kelas, dengan bahasa yang bermakna dan terarah.`;
      } else if (variant === 'rpp_efektif') {
        prompt = `Susun RPP SINGKAT & EFEKTIF (1-2 Halaman) berbasis Pembelajaran Mendalam Berbasis Cinta untuk:
${buildLearningContextString(learning, teacher, school)}

Format HTML rapi dan padat:
1. Identitas RPP
2. Tujuan Pembelajaran
3. Langkah-langkah Pembelajaran (Pendahuluan, Inti: Memahami->Mengaplikasi->Merefleksi, Penutup)
4. Asesmen Singkat (Formatif & Sumatif).`;
      } else {
        prompt = `Perbaiki dan sempurnakan dokumen Modul Ajar / RPP berikut agar lebih mendalam, runtut, dan kaya akan sentuhan cinta kasih serta pengalaman belajar:
Dokumen Saat Ini:
${editorContent}

Konteks:
${buildLearningContextString(learning, teacher, school)}

Kembalikan dokumen lengkap berformat HTML.`;
      }

      const res = await callGeminiAI(prompt);
      setEditorContent(res);
      onSave(res);
      onShowToast(`✓ Dokumen ${docType === 'modul' ? 'Modul Ajar' : 'RPP'} berhasil dibuat dengan Gemini AI!`, 'success');
    } catch (e: any) {
      onShowToast('Gagal memproses AI: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    const titleText = docType === 'modul' ? 'MODUL AJAR' : 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP)';
    await exportSingleDocx({
      title: `${titleText}: ${learning.materiTopik.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: editorContent,
      fileName: `${docType === 'modul' ? 'Modul_Ajar' : 'RPP'}_${learning.materiTopik.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Modul Ajar / RPP berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Modul Ajar / RPP Pembelajaran Mendalam
            </h2>
            {/* Toggle RPP vs Modul Ajar */}
            <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDocType('modul')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  docType === 'modul'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Modul Ajar Lengkap
              </button>
              <button
                type="button"
                onClick={() => setDocType('rpp')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  docType === 'rpp'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                RPP Efektif (Singkat)
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mengintegrasikan 3 Prinsip (Mindful, Meaningful, Joyful), 3 Pengalaman Inti (Memahami, Mengaplikasi, Merefleksi), dan 6 Nilai Cinta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleGenerateAi(docType === 'modul' ? 'modul_lengkap' : 'rpp_efektif')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Perangkat...' : docType === 'modul' ? 'Generate Modul Ajar' : 'Generate RPP Efektif'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerateAi('improve')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Sempurnakan</span>
          </button>

          <button
            type="button"
            onClick={handleExportDocx}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Word (.docx)</span>
          </button>
        </div>
      </div>

      <RichDocumentEditor
        title={docType === 'modul' ? 'Modul Ajar' : 'RPP'}
        value={editorContent}
        onChange={(newHtml) => {
          setEditorContent(newHtml);
          onSave(newHtml);
        }}
        onExportDocx={handleExportDocx}
      />
    </div>
  );
};
