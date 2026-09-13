import React, { useState } from 'react';
import { CalendarCheck, Sparkles, FileDown, Plus, Trash2, Save } from 'lucide-react';
import { JurnalRow, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface JournalViewProps {
  rows: JurnalRow[];
  onSave: (updated: JurnalRow[]) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  rows,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [journalRows, setJournalRows] = useState<JurnalRow[]>([...rows]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCellChange = (index: number, field: keyof JurnalRow, val: any) => {
    const updated = [...journalRows];
    updated[index] = { ...updated[index], [field]: val };
    setJournalRows(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const newRow: JurnalRow = {
      no: journalRows.length + 1,
      hariTanggal: today,
      pertemuanKe: journalRows.length + 1,
      kelas: `Kelas ${learning.kelas}`,
      jamKe: '1 - 3',
      materi: learning.materiTopik,
      aktivitas: 'Pembelajaran berkesadaran: Memahami konsep dan diskusi aplikatif.',
      hambatanCatatan: 'Seluruh siswa aktif dan kondusif.',
      refleksiCinta: 'Menghargai keberagaman cara berpikir teman (Cinta Sesama).',
    };
    const updated = [...journalRows, newRow];
    setJournalRows(updated);
    onSave(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = journalRows.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    setJournalRows(updated);
    onSave(updated);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun Jurnal Mengajar Harian Guru secara runtut (${learning.jumlahPertemuan} pertemuan) untuk:
${buildLearningContextString(learning, teacher, school)}

Kembalikan HANYA JSON murni dengan format:
{
  "jurnal": [
    {
      "no": 1,
      "hariTanggal": "Senin, 14 Juli 2025",
      "pertemuanKe": 1,
      "kelas": "Kelas ${learning.kelas}",
      "jamKe": "1 - 3",
      "materi": "${learning.materiTopik} (Sesi 1)",
      "aktivitas": "Apersepsi mindful, pemahaman konsep dasar, dan pembagian kelompok.",
      "hambatanCatatan": "Siswa antusias dan saling membantu.",
      "refleksiCinta": "Menumbuhkan cinta ilmu dan kepedulian antarteman."
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.jurnal && Array.isArray(parsed.jurnal)) {
        setJournalRows(parsed.jurnal);
        onSave(parsed.jurnal);
        onShowToast('✓ Jurnal Mengajar berhasil digenerate dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal generate jurnal: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    const headers = [
      'No',
      'Hari/Tanggal',
      'Pert.',
      'Kelas/Jam',
      'Materi Pembelajaran',
      'Aktivitas Pelaksanaan',
      'Catatan / Hambatan',
      'Refleksi Kasih Sayang',
    ];

    const rowsData = journalRows.map((r) => [
      r.no.toString(),
      r.hariTanggal,
      `Ke-${r.pertemuanKe}`,
      `${r.kelas} (${r.jamKe})`,
      r.materi,
      r.aktivitas,
      r.hambatanCatatan,
      r.refleksiCinta,
    ]);

    await exportSingleDocx({
      title: `JURNAL MENGAJAR GURU MATA PELAJARAN ${learning.mataPelajaran.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: `
        <p>Jurnal agenda mengajar harian guru sebagai bukti rekam jejak pelaksanaan pembelajaran mendalam berkesadaran di dalam kelas.</p>
      `,
      tables: [{ headers, rows: rowsData }],
      fileName: `Jurnal_Mengajar_${learning.mataPelajaran.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Jurnal Mengajar berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            Jurnal Mengajar Guru
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan agenda harian proses belajar mengajar di kelas, hambatan keterlaksanaan, dan catatan reflektif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Jurnal...' : 'Generate Jurnal AI'}</span>
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

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Daftar Catatan Jurnal Harian
          </h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pertemuan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3 w-36">Hari / Tanggal</th>
                <th className="py-3 px-3 w-16 text-center">Pert.</th>
                <th className="py-3 px-3 w-28">Kelas / Jam</th>
                <th className="py-3 px-3 w-40">Materi</th>
                <th className="py-3 px-3">Aktivitas Pelaksanaan</th>
                <th className="py-3 px-3 w-36">Hambatan / Solusi</th>
                <th className="py-3 px-3 w-36">Refleksi Cinta</th>
                <th className="py-3 px-3 w-10 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {journalRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 align-top">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{row.no}</td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.hariTanggal}
                      onChange={(e) => handleCellChange(idx, 'hariTanggal', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={row.pertemuanKe}
                      onChange={(e) => handleCellChange(idx, 'pertemuanKe', parseInt(e.target.value) || 1)}
                      className="w-12 px-1 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={`${row.kelas} (${row.jamKe})`}
                      onChange={(e) => handleCellChange(idx, 'kelas', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={row.materi}
                      onChange={(e) => handleCellChange(idx, 'materi', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={row.aktivitas}
                      onChange={(e) => handleCellChange(idx, 'aktivitas', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={row.hambatanCatatan}
                      onChange={(e) => handleCellChange(idx, 'hambatanCatatan', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={row.refleksiCinta}
                      onChange={(e) => handleCellChange(idx, 'refleksiCinta', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-rose-800 dark:text-rose-300 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
