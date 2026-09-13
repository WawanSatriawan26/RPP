import React, { useState } from 'react';
import { GitMerge, Sparkles, FileDown, Save, Plus, Trash2 } from 'lucide-react';
import { AnalisisCpAtpRow, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface CpAtpAnalysisViewProps {
  data: AnalisisCpAtpRow[];
  onSave: (updated: AnalisisCpAtpRow[]) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CpAtpAnalysisView: React.FC<CpAtpAnalysisViewProps> = ({
  data,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [rows, setRows] = useState<AnalisisCpAtpRow[]>([...data]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCellChange = (index: number, field: keyof AnalisisCpAtpRow, value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const newRows = [
      ...rows,
      {
        no: rows.length + 1,
        komponen: 'Komponen Baru',
        hasilAnalisis: 'Hasil analisis kompetensi dan materi...',
        rekomendasi: 'Rekomendasi tindak lanjut pedagogi...',
      },
    ];
    setRows(newRows);
    onSave(newRows);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    setRows(newRows);
    onSave(newRows);
  };

  const handleAnalyzeWithAi = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Lakukan analisis Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) secara komprehensif berdasarkan prinsip Pembelajaran Mendalam dan Pembelajaran Berbasis Cinta untuk data berikut:
${buildLearningContextString(learning, teacher, school)}

Analisis komponen-komponen utama:
1. Kompetensi Esensial dalam CP
2. Lingkup Materi Pokok & Keterkaitannya
3. Integrasi 3 Prinsip (Mindful, Meaningful, Joyful)
4. Integrasi 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)
5. Nilai Pembelajaran Berbasis Cinta

Kembalikan HANYA JSON murni dengan format:
{
  "rows": [
    {
      "no": 1,
      "komponen": "Nama Komponen",
      "hasilAnalisis": "Uraian hasil analisis secara mendalam...",
      "rekomendasi": "Rekomendasi praktis operasional bagi guru..."
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.rows && Array.isArray(parsed.rows)) {
        setRows(parsed.rows);
        onSave(parsed.rows);
        onShowToast('✓ Analisis CP & ATP berhasil digenerate dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal analisis AI: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportDocx = async () => {
    const tableData = rows.map((r) => [r.no.toString(), r.komponen, r.hasilAnalisis, r.rekomendasi]);

    await exportSingleDocx({
      title: 'ANALISIS CAPAIAN PEMBELAJARAN & ALUR TUJUAN PEMBELAJARAN',
      teacher,
      school,
      learning,
      contentHtml: `
        <p>Analisis ini menjadi dasar penyusunan Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), dan Modul Ajar dengan pendekatan Pembelajaran Mendalam Berbasis Cinta.</p>
      `,
      tables: [
        {
          headers: ['No', 'Komponen Analisis', 'Hasil Analisis Pedagogi', 'Rekomendasi Tindak Lanjut'],
          rows: tableData,
        },
      ],
      fileName: `Analisis_CP_ATP_${learning.mataPelajaran.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Analisis CP & ATP berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-blue-600" />
            Analisis Capaian Pembelajaran (CP) & ATP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analisis mendalam terhadap rumusan kompetensi esensial, keterkaitan materi, dan integrasi nilai cinta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAnalyzeWithAi}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Menganalisis...' : 'Analisis dengan Gemini'}</span>
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Matriks Analisis Komponen CP & ATP
          </h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Komponen</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-14 text-center">No</th>
                <th className="py-3 px-4 w-48">Komponen</th>
                <th className="py-3 px-4">Hasil Analisis</th>
                <th className="py-3 px-4 w-72">Rekomendasi</th>
                <th className="py-3 px-4 w-14 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 align-top">
                  <td className="py-3 px-4 text-center font-semibold text-slate-500">{row.no}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.komponen}
                      onChange={(e) => handleCellChange(idx, 'komponen', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-400 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <textarea
                      rows={3}
                      value={row.hasilAnalisis}
                      onChange={(e) => handleCellChange(idx, 'hasilAnalisis', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <textarea
                      rows={3}
                      value={row.rekomendasi}
                      onChange={(e) => handleCellChange(idx, 'rekomendasi', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-emerald-800 dark:text-emerald-300 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
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
