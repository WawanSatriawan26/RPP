import React, { useState } from 'react';
import { FileText, Sparkles, FileDown, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { AtpRow, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface AtpViewProps {
  rows: AtpRow[];
  onSave: (updated: AtpRow[]) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AtpView: React.FC<AtpViewProps> = ({
  rows,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [tableData, setTableData] = useState<AtpRow[]>([...rows]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCellChange = (index: number, field: keyof AtpRow, value: any) => {
    const updated = [...tableData];
    updated[index] = { ...updated[index], [field]: value };
    setTableData(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const newRow: AtpRow = {
      no: tableData.length + 1,
      tujuanPembelajaran: 'Peserta didik mampu...',
      lingkupMateri: learning.materiTopik,
      rencanaAktivitas: 'Diskusi kelompok & pemecahan masalah (Mengaplikasi)',
      profilLulusan: learning.dimensiProfilLulusan.slice(0, 2).join(', '),
      alokasiWaktuJp: 3,
      asesmen: 'Formatif (Observasi & LKPD)',
    };
    const updated = [...tableData, newRow];
    setTableData(updated);
    onSave(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = tableData.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    setTableData(updated);
    onSave(updated);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun Alur Tujuan Pembelajaran (ATP) lengkap, runtut, dan logis untuk mata pelajaran berikut:
${buildLearningContextString(learning, teacher, school)}

Ketentuan Alur Tujuan Pembelajaran:
1. Rumuskan Tujuan Pembelajaran (TP) dengan kata kerja operasional (KKO) yang jelas dan mendalam.
2. Setiap TP memiliki Rencana Aktivitas yang memuat 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi).
3. Hubungkan secara tepat ke Dimensi Profil Lulusan dan Nilai Pembelajaran Berbasis Cinta.
4. Tentukan Alokasi Waktu (JP) dan bentuk Asesmen (Diagnostik / Formatif / Sumatif).

Kembalikan HANYA JSON murni dengan format:
{
  "atp": [
    {
      "no": 1,
      "tujuanPembelajaran": "Peserta didik mampu memahami konsep fundamental...",
      "lingkupMateri": "Materi...",
      "rencanaAktivitas": "Eksplorasi konsep dan diskusi terbimbing (Memahami & Cinta Ilmu)",
      "profilLulusan": "Penalaran Kritis, Kolaborasi",
      "alokasiWaktuJp": 3,
      "asesmen": "Asesmen Formatif (Tanya jawab & LKPD)"
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.atp && Array.isArray(parsed.atp)) {
        setTableData(parsed.atp);
        onSave(parsed.atp);
        onShowToast('✓ Alur Tujuan Pembelajaran (ATP) berhasil digenerate dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal generate ATP: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    const headers = [
      'No',
      'Tujuan Pembelajaran (TP)',
      'Lingkup Materi',
      'Rencana Aktivitas Pembelajaran',
      'Profil Lulusan & Nilai Cinta',
      'JP',
      'Rencana Asesmen',
    ];

    const rowsData = tableData.map((r) => [
      r.no.toString(),
      r.tujuanPembelajaran,
      r.lingkupMateri,
      r.rencanaAktivitas,
      r.profilLulusan,
      `${r.alokasiWaktuJp} JP`,
      r.asesmen,
    ]);

    await exportSingleDocx({
      title: `ALUR TUJUAN PEMBELAJARAN (ATP) - FASE ${learning.fase}`,
      teacher,
      school,
      learning,
      contentHtml: `
        <p>Alur Tujuan Pembelajaran (ATP) ini disusun sebagai panduan operasional pembelajaran berkesadaran, bermakna, dan menggembirakan dengan integrasi nilai cinta pada setiap fase pengalaman belajar.</p>
      `,
      tables: [{ headers, rows: rowsData }],
      fileName: `ATP_${learning.mataPelajaran.replace(/\s+/g, '_')}_Fase_${learning.fase}.docx`,
    });
    onShowToast('✓ Dokumen ATP berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Alur Tujuan Pembelajaran (ATP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rangkaian Tujuan Pembelajaran yang tersusun secara kronologis dan logis sepanjang fase belajar.
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
            <span>{isGenerating ? 'Menyusun Alur TP...' : 'Generate ATP dengan AI'}</span>
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
            Matriks Alur Tujuan Pembelajaran (ATP)
          </h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris TP</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-64">Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-3 w-40">Lingkup Materi</th>
                <th className="py-3 px-3">Rencana Aktivitas</th>
                <th className="py-3 px-3 w-40">Profil & Nilai Cinta</th>
                <th className="py-3 px-3 w-20 text-center">JP</th>
                <th className="py-3 px-3 w-36">Asesmen</th>
                <th className="py-3 px-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 align-top">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{row.no}</td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={3}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => handleCellChange(idx, 'tujuanPembelajaran', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={3}
                      value={row.lingkupMateri}
                      onChange={(e) => handleCellChange(idx, 'lingkupMateri', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={3}
                      value={row.rencanaAktivitas}
                      onChange={(e) => handleCellChange(idx, 'rencanaAktivitas', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={3}
                      value={row.profilLulusan}
                      onChange={(e) => handleCellChange(idx, 'profilLulusan', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={row.alokasiWaktuJp}
                      onChange={(e) => handleCellChange(idx, 'alokasiWaktuJp', parseInt(e.target.value) || 0)}
                      className="w-14 px-1.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={3}
                      value={row.asesmen}
                      onChange={(e) => handleCellChange(idx, 'asesmen', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Hapus Baris"
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
