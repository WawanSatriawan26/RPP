import React, { useState } from 'react';
import { ClipboardList, Sparkles, FileDown, Wand2, Users, User, Beaker, Rocket } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { RichDocumentEditor } from './RichDocumentEditor';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface LkpdViewProps {
  content: string;
  onSave: (updated: string) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LkpdView: React.FC<LkpdViewProps> = ({
  content,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [lkpdType, setLkpdType] = useState<'kelompok' | 'individu' | 'praktik' | 'projek'>('kelompok');
  const [editorContent, setEditorContent] = useState<string>(
    content ||
      `<h1>LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
<p style="text-align:center; font-weight:bold;">Topik: ${learning.materiTopik}</p>
<p style="text-align:center; font-style:italic;">Pendekatan Pembelajaran Mendalam Berbasis Cinta</p>
<hr/>

<table style="width:100%; border:1px solid #cbd5e1; border-collapse:collapse; margin-bottom:16px;">
  <tr>
    <td style="padding:8px; border:1px solid #cbd5e1; width:25%;"><strong>Mata Pelajaran</strong></td>
    <td style="padding:8px; border:1px solid #cbd5e1; width:25%;">${learning.mataPelajaran}</td>
    <td style="padding:8px; border:1px solid #cbd5e1; width:25%;"><strong>Hari / Tanggal</strong></td>
    <td style="padding:8px; border:1px solid #cbd5e1; width:25%;">...........................</td>
  </tr>
  <tr>
    <td style="padding:8px; border:1px solid #cbd5e1;"><strong>Kelas / Fase</strong></td>
    <td style="padding:8px; border:1px solid #cbd5e1;">Kelas ${learning.kelas} (${learning.fase})</td>
    <td style="padding:8px; border:1px solid #cbd5e1;"><strong>Nama Anggota / No. Absen</strong></td>
    <td style="padding:8px; border:1px solid #cbd5e1;">1. .....................<br/>2. .....................<br/>3. .....................</td>
  </tr>
</table>

<h3>A. TUJUAN PEMBELAJARAN</h3>
<p>Melalui aktivitas pada LKPD ini, peserta didik mampu memahami esensi materi ${learning.materiTopik}, bekerja sama dengan penuh empati, serta memecahkan tantangan kontekstual secara kritis dan kreatif.</p>

<h3>B. PETUNJUK PENGERJAAN</h3>
<ol>
  <li>Awali aktivitas dengan senyuman dan berdoa bersama (Cinta Tuhan).</li>
  <li>Bacalah cerita kontekstual dan permasalahan yang disajikan dengan saksama.</li>
  <li>Bekerjasamalah secara harmonis, dengarkan pendapat setiap anggota kelompok tanpa mencela (Cinta Sesama).</li>
  <li>Tuangkan hasil diskusi pada kolom isian yang tersedia.</li>
</ol>

<h3>C. CERITA PEMANTIK / MASALAH KONTEKSTUAL</h3>
<p>Sebuah permasalahan nyata di lingkungan sekitar kita: "Bagaimana cara kita menerapkan konsep ${learning.materiTopik} untuk membantu mengatasi tantangan sehari-hari dan menghadirkan solusi bermanfaat?"</p>

<h3>D. LANGKAH AKTIVITAS SISWA</h3>
<h4>1. Pengalaman Memahami</h4>
<p>Diskusikan bersama kelompok: Apa saja fakta penting yang kalian temukan dari masalah di atas? Tuliskan pemahaman awal kelompok kalian!</p>
<p style="border:1px dashed #94a3b8; padding:16px; background:#f8fafc; min-height:60px;">[Ruang jawaban siswa...]</p>

<h4>2. Pengalaman Mengaplikasi (Tabel Eksplorasi)</h4>
<table style="width:100%; border:1px solid #94a3b8; border-collapse:collapse; margin-top:8px;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th style="border:1px solid #94a3b8; padding:8px; width:10%;">No</th>
      <th style="border:1px solid #94a3b8; padding:8px; width:45%;">Aspek yang Diamati</th>
      <th style="border:1px solid #94a3b8; padding:8px; width:45%;">Hasil Analisis Solusi Kelompok</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #94a3b8; padding:8px; text-align:center;">1</td>
      <td style="border:1px solid #94a3b8; padding:8px;">Identifikasi masalah utama</td>
      <td style="border:1px solid #94a3b8; padding:8px;">............................................................</td>
    </tr>
    <tr>
      <td style="border:1px solid #94a3b8; padding:8px; text-align:center;">2</td>
      <td style="border:1px solid #94a3b8; padding:8px;">Alternatif solusi kreatif</td>
      <td style="border:1px solid #94a3b8; padding:8px;">............................................................</td>
    </tr>
    <tr>
      <td style="border:1px solid #94a3b8; padding:8px; text-align:center;">3</td>
      <td style="border:1px solid #94a3b8; padding:8px;">Dampak positif bagi sesama & lingkungan</td>
      <td style="border:1px solid #94a3b8; padding:8px;">............................................................</td>
    </tr>
  </tbody>
</table>

<h4>3. Pengalaman Merefleksi</h4>
<p>Tuliskan 1 hal paling berkesan yang kalian pelajari hari ini dan bagaimana kalian bisa membagikan manfaatnya kepada teman atau keluarga!</p>
<p style="border:1px dashed #94a3b8; padding:16px; background:#f8fafc; min-height:60px;">[Refleksi cinta & kebermaknaan...]</p>

<h3>E. RUBRIK PENILAIAN SINGKAT</h3>
<table style="width:100%; border:1px solid #cbd5e1; border-collapse:collapse; font-size:12px;">
  <tr style="background:#f8fafc;">
    <th style="border:1px solid #cbd5e1; padding:6px;">Kriteria</th>
    <th style="border:1px solid #cbd5e1; padding:6px;">Sangat Baik (4)</th>
    <th style="border:1px solid #cbd5e1; padding:6px;">Baik (3)</th>
    <th style="border:1px solid #cbd5e1; padding:6px;">Cukup (2)</th>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1; padding:6px; font-weight:bold;">Pemahaman Konsep</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Sangat tepat & mendalam</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Tepat</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Sebagian tepat</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1; padding:6px; font-weight:bold;">Kolaborasi & Sikap Kasih Sayang</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Saling mendukung penuh empati</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Bekerja sama baik</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Kurang terlibat aktif</td>
  </tr>
</table>`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun LEMBAR KERJA PESERTA DIDIK (LKPD) Tipe: ${lkpdType.toUpperCase()} untuk mata pelajaran:
${buildLearningContextString(learning, teacher, school)}

Karakteristik LKPD wajib format HTML lengkap (h1, h2, h3, h4, table, p, ul, ol, li):
1. Judul & Identitas LKPD lengkap (Nama/Kelompok, Kelas, Fase, Mapel, Hari/Tanggal)
2. Tujuan Pembelajaran Berkesadaran
3. Petunjuk Pengerjaan yang ramah, santun, dan penuh kasih sayang
4. Masalah Kontekstual / Cerita Pemantik Nyata yang relevan dengan kehidupan anak seusia ${learning.jenjang} Kelas ${learning.kelas}
5. Langkah Aktivitas 3 Pengalaman Belajar:
   - Pengalaman Memahami
   - Pengalaman Mengaplikasi (Sediakan tabel isian terstruktur)
   - Pengalaman Merefleksi (Refleksi bermakna & nilai cinta)
6. Ruang Isian / Lembar Jawaban Siswa
7. Rubrik Penilaian Singkat & Operasional.`;

      const res = await callGeminiAI(prompt);
      setEditorContent(res);
      onSave(res);
      onShowToast(`✓ LKPD (${lkpdType}) berhasil digenerate dengan Gemini AI!`, 'success');
    } catch (e: any) {
      onShowToast('Gagal generate LKPD: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    await exportSingleDocx({
      title: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${learning.materiTopik.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: editorContent,
      fileName: `LKPD_${learning.materiTopik.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen LKPD berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Lembar Kerja Peserta Didik (LKPD)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Panduan aktivitas siswa yang memandu pengalaman memahami, mengaplikasi, dan merefleksi secara mendalam.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tipe LKPD selector */}
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLkpdType('kelompok')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                lkpdType === 'kelompok' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kelompok</span>
            </button>
            <button
              type="button"
              onClick={() => setLkpdType('individu')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                lkpdType === 'individu' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Individu</span>
            </button>
            <button
              type="button"
              onClick={() => setLkpdType('praktik')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                lkpdType === 'praktik' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              <span>Praktik</span>
            </button>
            <button
              type="button"
              onClick={() => setLkpdType('projek')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                lkpdType === 'projek' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Projek</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun LKPD...' : `Generate LKPD ${lkpdType}`}</span>
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
        title="LKPD Siswa"
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
