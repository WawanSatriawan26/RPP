import React, { useState } from 'react';
import { CheckSquare, Sparkles, FileDown, Layers, HelpCircle, FileCheck } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { RichDocumentEditor } from './RichDocumentEditor';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface AssessmentViewProps {
  content: string;
  onSave: (updated: string) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  content,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [assessmentType, setAssessmentType] = useState<'sumatif' | 'formatif' | 'diagnostik'>('sumatif');
  const [soalCount, setSoalCount] = useState<number>(10);
  const [editorContent, setEditorContent] = useState<string>(
    content ||
      `<h1>INSTRUMEN ASESMEN PEMBELAJARAN</h1>
<p style="text-align:center; font-weight:bold;">Mata Pelajaran: ${learning.mataPelajaran} | Topik: ${learning.materiTopik}</p>
<p style="text-align:center; font-style:italic;">Fase ${learning.fase} / Kelas ${learning.kelas} - ${school.jenjang}</p>
<hr/>

<h3>A. KISI-KISI ASESMEN</h3>
<table style="width:100%; border:1px solid #cbd5e1; border-collapse:collapse; font-size:12px; margin-bottom:16px;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th style="border:1px solid #cbd5e1; padding:6px; width:5%;">No</th>
      <th style="border:1px solid #cbd5e1; padding:6px; width:30%;">Tujuan Pembelajaran</th>
      <th style="border:1px solid #cbd5e1; padding:6px; width:30%;">Indikator Ketercapaian (IKTP)</th>
      <th style="border:1px solid #cbd5e1; padding:6px; width:15%;">Bentuk Soal</th>
      <th style="border:1px solid #cbd5e1; padding:6px; width:10%;">No. Soal</th>
      <th style="border:1px solid #cbd5e1; padding:6px; width:10%;">Level</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">1</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Memahami konsep dasar ${learning.materiTopik}</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Disajikan situasi nyata, siswa mampu mengidentifikasi konsep dengan tepat</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Pilihan Ganda</td>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">1 - 5</td>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">L2 (Aplikasi)</td>
    </tr>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">2</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Menganalisis & merefleksikan solusi</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Siswa mampu merumuskan solusi berbasis kepedulian lingkungan</td>
      <td style="border:1px solid #cbd5e1; padding:6px;">Uraian / Kasus</td>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">6 - 10</td>
      <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">L3 (Penalaran)</td>
    </tr>
  </tbody>
</table>

<h3>B. NASKAH SOAL ASESMEN</h3>
<h4>Bagian I: Pilihan Ganda</h4>
<p><strong>1.</strong> Perhatikan stimulus berikut: Sebuah fenomena dalam kehidupan sehari-hari berkaitan dengan materi ${learning.materiTopik}. Sikap yang paling mencerminkan rasa syukur dan pemahaman konsep yang benar adalah...<br/>
A. Pilihan jawaban A<br/>
B. Pilihan jawaban B (Kunci)<br/>
C. Pilihan jawaban C<br/>
D. Pilihan jawaban D</p>

<h4>Bagian II: Uraian Kontekstual Berbasis Masalah</h4>
<p><strong>2.</strong> Mengapa penerapan konsep ${learning.materiTopik} harus senantiasa dilandasi dengan empati dan rasa cinta kepada sesama serta alam sekitar? Jelaskan contoh solutif yang bisa kalian lakukan di lingkungan sekolah!</p>
<p style="border:1px dashed #cbd5e1; padding:12px; background:#f8fafc;">[Pedoman Penskoran: Maksimal skor 10]</p>

<h3>C. KUNCI JAWABAN & PEMBAHASAN</h3>
<ol>
  <li><strong>Kunci B</strong> - Pembahasan: Konsep ini menjelaskan bahwa...</li>
  <li><strong>Kunci Uraian:</strong> Jawaban memuat 3 aspek penting: (1) Esensi konsep, (2) Contoh konkret di sekolah, (3) Nilai kepedulian.</li>
</ol>

<h3>D. RUBRIK & PEDOMAN PENSKORAN</h3>
<table style="width:100%; border:1px solid #cbd5e1; border-collapse:collapse; font-size:12px;">
  <tr style="background:#f8fafc;">
    <th style="border:1px solid #cbd5e1; padding:6px;">Skor</th>
    <th style="border:1px solid #cbd5e1; padding:6px;">Kriteria Penilaian Uraian</th>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">9 - 10</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Menjelaskan konsep dengan sangat tepat, runtut, logis, dan menyertakan refleksi nilai cinta mendalam.</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">7 - 8</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Menjelaskan konsep tepat dan contoh relevan namun refleksi nilai masih umum.</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">&lt; 6</td>
    <td style="border:1px solid #cbd5e1; padding:6px;">Penjelasan konsep belum runtut dan kurang aplikatif.</td>
  </tr>
</table>`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun DOKUMEN ASESMEN PEMBELAJARAN LENGKAP Tipe: ${assessmentType.toUpperCase()} sebanyak ${soalCount} SOAL untuk:
${buildLearningContextString(learning, teacher, school)}

Ketentuan dokumen wajib berformat HTML lengkap (h1, h2, h3, h4, p, table, ul, ol, li):
1. Judul & Identitas Asesmen
2. Kisi-kisi Asesmen (Tabel lengkap: No, Tujuan Pembelajaran, Indikator Soal, Bentuk Soal, Nomor Soal, Level Kognitif)
3. Naskah Soal (${soalCount} Soal berkualitas tinggi: kombinasi Pilihan Ganda berbasis stimulus kontekstual dan Uraian HOTS bernalar kritis)
4. Kunci Jawaban Lengkap dan Pembahasan Pedagogi
5. Rubrik Penilaian & Pedoman Penskoran Nilai Akhir
6. Lembar Pengamatan Sikap (Profil Lulusan & Nilai Cinta Kasih).`;

      const res = await callGeminiAI(prompt);
      setEditorContent(res);
      onSave(res);
      onShowToast(`✓ Asesmen ${assessmentType} (${soalCount} soal) berhasil digenerate!`, 'success');
    } catch (e: any) {
      onShowToast('Gagal generate asesmen: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    await exportSingleDocx({
      title: `ASESMEN PEMBELAJARAN: ${learning.materiTopik.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: editorContent,
      fileName: `Asesmen_${learning.materiTopik.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Asesmen berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Asesmen Pembelajaran & Kisi-Kisi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kisi-kisi komprehensif, naskah soal berbasis HOTS dan konteks nyata, kunci jawaban, serta rubrik penskoran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Asesmen type */}
          <select
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
          >
            <option value="sumatif">Asesmen Sumatif (Lingkup Materi)</option>
            <option value="formatif">Asesmen Formatif (Proses Belajar)</option>
            <option value="diagnostik">Asesmen Diagnostik (Awal)</option>
          </select>

          {/* Soal Count Selector */}
          <select
            value={soalCount}
            onChange={(e) => setSoalCount(parseInt(e.target.value))}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
          >
            <option value={10}>10 Soal</option>
            <option value={15}>15 Soal</option>
            <option value={20}>20 Soal</option>
            <option value={25}>25 Soal</option>
            <option value={30}>30 Soal</option>
            <option value={40}>40 Soal</option>
            <option value={50}>50 Soal</option>
          </select>

          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Soal & Kisi...' : 'Generate Asesmen AI'}</span>
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
        title="Asesmen Pembelajaran"
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
