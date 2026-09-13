import React, { useState } from 'react';
import { Target, Sparkles, FileDown, Save, Wand2 } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { RichDocumentEditor } from './RichDocumentEditor';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface CpViewProps {
  content: string;
  onSave: (updated: string) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CpView: React.FC<CpViewProps> = ({
  content,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [editorContent, setEditorContent] = useState<string>(
    content ||
      `<h1>CAPAIAN PEMBELAJARAN (CP)</h1>
<h2>Mata Pelajaran: ${learning.mataPelajaran}</h2>
<p><strong>Fase ${learning.fase} (Kelas ${learning.kelas}) - ${school.jenjang}</strong></p>
<p><strong>Elemen:</strong> ${learning.elemen}</p>
<hr/>
<h3>A. Rasional Mata Pelajaran</h3>
<p>Mata pelajaran ${learning.mataPelajaran} membekali peserta didik dengan kecakapan berpikir kritis, kreatif, serta berkesadaran tinggi dalam memecahkan masalah kontekstual...</p>
<h3>B. Capaian Pembelajaran Fase ${learning.fase}</h3>
<p>Pada akhir Fase ${learning.fase}, peserta didik mampu memahami konsep fundamental ${learning.materiTopik}, mengaplikasikannya dalam kehidupan sehari-hari secara kolaboratif dengan dilandasi nilai cinta kepada sesama dan lingkungan...</p>
<h3>C. Capaian Pembelajaran Berdasarkan Elemen (${learning.elemen})</h3>
<p>Peserta didik mampu mengidentifikasi, mengaplikasi, dan merefleksikan proses belajar pada lingkup materi ${learning.materiTopik} secara mandiri dan bernalar kritis.</p>`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async (mode: 'draft' | 'improve' | 'analyze') => {
    setIsGenerating(true);
    try {
      let prompt = '';
      if (mode === 'draft') {
        prompt = `Susun teks Capaian Pembelajaran (CP) komprehensif untuk:
${buildLearningContextString(learning, teacher, school)}

Format teks harus terstruktur rapi dengan tag HTML (h1, h2, h3, p, ul, li):
1. Rasional Mata Pelajaran
2. Tujuan Mata Pelajaran
3. Karakteristik Mata Pelajaran
4. Capaian Pembelajaran Umum Fase ${learning.fase}
5. Capaian Pembelajaran Berdasarkan Elemen (${learning.elemen})
6. Pemetaan Nilai Cinta dan 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi).
Tandai sebagai draft standar kurikulum jika tidak menggunakan salinan resmi.`;
      } else if (mode === 'improve') {
        prompt = `Perbaiki dan sempurnakan rumusan Capaian Pembelajaran (CP) berikut agar lebih selaras dengan pendekatan Pembelajaran Mendalam (Mindful, Meaningful, Joyful) dan nilai Pembelajaran Berbasis Cinta:
Teks CP Saat Ini:
${editorContent}

Konteks Pembelajaran:
${buildLearningContextString(learning, teacher, school)}

Kembalikan teks lengkap hasil perbaikan yang rapi dengan tag HTML (h1, h2, h3, p, ul, li).`;
      } else {
        prompt = `Lakukan analisis mendalam terhadap teks Capaian Pembelajaran (CP) berikut:
${editorContent}

Tentukan secara sistematis:
1. Kompetensi Esensial (KKO Taksonomi & tingkat berpikir mendalam)
2. Konten Esensial (Materi inti yang wajib dikuasai)
3. Variasi Keterampilan (Keterampilan berpikir kritis, kreatif, kolaboratif)
4. Integrasi 3 Pengalaman Belajar & Nilai Cinta.

Kembalikan hasil analisis rapi berformat HTML lengkap.`;
      }

      const res = await callGeminiAI(prompt);
      setEditorContent(res);
      onSave(res);
      onShowToast(`✓ Berhasil memproses CP (${mode}) dengan Gemini AI!`, 'success');
    } catch (e: any) {
      onShowToast('Gagal memproses AI: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    await exportSingleDocx({
      title: `CAPAIAN PEMBELAJARAN (CP) - FASE ${learning.fase}`,
      teacher,
      school,
      learning,
      contentHtml: editorContent,
      fileName: `CP_${learning.mataPelajaran.replace(/\s+/g, '_')}_Fase_${learning.fase}.docx`,
    });
    onShowToast('✓ Dokumen CP berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Capaian Pembelajaran (CP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola teks CP resmi Kemendikbudristek atau susun draf CP yang terintegrasi dengan Pembelajaran Mendalam.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleGenerateAi('draft')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Draf CP</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerateAi('improve')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Perbaiki CP</span>
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

      {/* Rich Editor */}
      <RichDocumentEditor
        title="Capaian Pembelajaran"
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
