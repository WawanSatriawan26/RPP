import React, { useState } from 'react';
import { BookMarked, Sparkles, FileDown, Wand2 } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { RichDocumentEditor } from './RichDocumentEditor';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface TeachingMaterialViewProps {
  content: string;
  onSave: (updated: string) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const TeachingMaterialView: React.FC<TeachingMaterialViewProps> = ({
  content,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [editorContent, setEditorContent] = useState<string>(
    content ||
      `<h1>BAHAN AJAR: ${learning.materiTopik.toUpperCase()}</h1>
<p><strong>Mata Pelajaran:</strong> ${learning.mataPelajaran} | <strong>Fase/Kelas:</strong> ${learning.fase} / ${learning.kelas}</p>
<hr/>
<h3>1. Tujuan Pembelajaran</h3>
<p>Melalui bahan ajar ini, peserta didik diharapkan mampu memahami konsep esensial ${learning.materiTopik}, mengaplikasikannya dalam konteks kehidupan nyata dengan penuh kesadaran dan empati, serta merefleksikan nilai-nilai kebaikan.</p>

<h3>2. Pengantar Pembelajaran (Pertanyaan Pemantik)</h3>
<p>Pernahkah kalian membayangkan bagaimana sebuah konsep sederhana dapat memberikan dampak besar bagi kehidupan sehari-hari kita? Mengapa kita perlu mempelajari materi ini dengan rasa ingin tahu dan cinta terhadap ilmu pengetahuan?</p>

<h3>3. Uraian Materi Utama</h3>
<p>Pembahasan materi inti ${learning.materiTopik} secara mendalam, terstruktur, dan berbasis contoh kontekstual...</p>

<h3>4. Konsep Penting & Contoh Nyata</h3>
<ul>
  <li><strong>Konsep Kunci:</strong> Penjelasan konsep utama dan aplikasinya.</li>
  <li><strong>Konteks Nyata:</strong> Penerapan langsung di lingkungan sekitar peserta didik.</li>
</ul>

<h3>5. Aktivitas Pembelajaran Siswa</h3>
<p><strong>A. Pengalaman Memahami:</strong> Menyimak, membaca mandiri, dan merumuskan ide pokok.</p>
<p><strong>B. Pengalaman Mengaplikasi:</strong> Bekerja sama dalam kelompok menyelesaikan simulasi masalah nyata.</p>
<p><strong>C. Pengalaman Merefleksi:</strong> Menuliskan hal baru yang dipelajari dan manfaatnya bagi diri sendiri serta sesama.</p>

<h3>6. Refleksi Pembelajaran Berbasis Cinta</h3>
<p>Bagaimana materi ini menumbuhkan rasa syukur kepada Tuhan, kepedulian terhadap lingkungan, dan tanggung jawab terhadap bangsa?</p>

<h3>7. Rangkuman & Glosarium</h3>
<p>Rangkuman poin-poin utama materi serta daftar istilah penting...</p>`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async (mode: 'full' | 'improve') => {
    setIsGenerating(true);
    try {
      let prompt = '';
      if (mode === 'full') {
        prompt = `Susun Bahan Ajar Lengkap, mendalam, dan menarik untuk:
${buildLearningContextString(learning, teacher, school)}

Struktur Bahan Ajar wajib mencakup format HTML lengkap (h1, h2, h3, p, ul, ol, li, table):
1. Judul Materi & Identitas
2. Tujuan Pembelajaran Berkesadaran
3. Pengantar Menarik (Hook / Pemantik Rasa Ingin Tahu)
4. Uraian Materi Utama yang komprehensif, terstruktur, dan mudah dipahami
5. Konsep-konsep Penting & Penjelasannya
6. Contoh Konkret dalam Kehidupan Sehari-hari
7. Studi Kasus / Masalah Nyata
8. Aktivitas Siswa Terstruktur:
   - Pengalaman Memahami
   - Pengalaman Mengaplikasi
   - Pengalaman Merefleksi
9. Latihan Soal Mandiri & Diskusi Kelompok
10. Refleksi Pembelajaran Berbasis Cinta (${learning.nilaiCinta.join(', ')})
11. Rangkuman Materi
12. Glosarium & Daftar Referensi.

Gunakan gaya bahasa komunikatif, inspiratif, dan bermakna bagi peserta didik ${learning.jenjang} Kelas ${learning.kelas}.`;
      } else {
        prompt = `Perkaya dan perbaiki Bahan Ajar berikut agar lebih mendalam dan menyentuh nilai-nilai cinta serta 3 pengalaman belajar:
Bahan Ajar Saat Ini:
${editorContent}

Konteks:
${buildLearningContextString(learning, teacher, school)}

Kembalikan Bahan Ajar yang telah disempurnakan berformat HTML lengkap.`;
      }

      const res = await callGeminiAI(prompt);
      setEditorContent(res);
      onSave(res);
      onShowToast(`✓ Bahan Ajar berhasil diproses dengan Gemini AI!`, 'success');
    } catch (e: any) {
      onShowToast('Gagal generate Bahan Ajar: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    await exportSingleDocx({
      title: `BAHAN AJAR: ${learning.materiTopik.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: editorContent,
      fileName: `Bahan_Ajar_${learning.materiTopik.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Bahan Ajar berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-600" />
            Bahan Ajar Pembelajaran Mendalam
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bahan ajar kontekstual yang kaya studi kasus nyata, aktivitas bermakna, dan integrasi nilai kasih sayang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleGenerateAi('full')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Bahan Ajar...' : 'Generate Bahan Ajar AI'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerateAi('improve')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Perkaya</span>
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
        title="Bahan Ajar"
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
