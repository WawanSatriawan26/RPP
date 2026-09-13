import React, { useState } from 'react';
import { CalendarDays, Sparkles, FileDown, Plus, Trash2, Save } from 'lucide-react';
import { ProtaRow, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface ProtaViewProps {
  rows: ProtaRow[];
  onSave: (updated: ProtaRow[]) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ProtaView: React.FC<ProtaViewProps> = ({
  rows,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [protaRows, setProtaRows] = useState<ProtaRow[]>([...rows]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCellChange = (index: number, field: keyof ProtaRow, val: any) => {
    const updated = [...protaRows];
    updated[index] = { ...updated[index], [field]: val };
    setProtaRows(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const newRow: ProtaRow = {
      no: protaRows.length + 1,
      cp: learning.elemen,
      tp: 'Peserta didik mampu...',
      materi: learning.materiTopik,
      alokasiJp: 6,
      semester: school.semester.includes('1') ? 1 : 2,
      keterangan: 'Tuntas',
    };
    const updated = [...protaRows, newRow];
    setProtaRows(updated);
    onSave(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = protaRows.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    setProtaRows(updated);
    onSave(updated);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun PROGRAM TAHUNAN (PROTA) lengkap untuk 1 tahun ajaran (Semester 1 & 2) untuk:
${buildLearningContextString(learning, teacher, school)}

Kembalikan HANYA JSON murni dengan format:
{
  "prota": [
    {
      "no": 1,
      "cp": "Elemen/Domain CP",
      "tp": "Tujuan Pembelajaran",
      "materi": "Materi Pokok",
      "alokasiJp": 6,
      "semester": 1,
      "keterangan": "Semester 1"
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.prota && Array.isArray(parsed.prota)) {
        setProtaRows(parsed.prota);
        onSave(parsed.prota);
        onShowToast('✓ Program Tahunan (PROTA) berhasil digenerate dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal generate PROTA: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalJp = protaRows.reduce((acc, curr) => acc + (Number(curr.alokasiJp) || 0), 0);

  const handleExportDocx = async () => {
    const headers = [
      'No',
      'Capaian Pembelajaran (CP)',
      'Tujuan Pembelajaran (TP)',
      'Lingkup Materi',
      'Alokasi (JP)',
      'Semester',
      'Keterangan',
    ];

    const rowsData = protaRows.map((r) => [
      r.no.toString(),
      r.cp,
      r.tp,
      r.materi,
      `${r.alokasiJp} JP`,
      `Semester ${r.semester}`,
      r.keterangan || '-',
    ]);

    rowsData.push(['', 'TOTAL ALOKASI WAKTU 1 TAHUN', '', '', `${totalJp} JP`, '', '']);

    await exportSingleDocx({
      title: `PROGRAM TAHUNAN (PROTA) - TAHUN AJARAN ${school.tahunPelajaran}`,
      teacher,
      school,
      learning,
      contentHtml: `
        <p>Program Tahunan mata pelajaran ${learning.mataPelajaran} jenjang ${learning.jenjang} kelas ${learning.kelas} disusun berdasarkan pembagian beban belajar terukur dan bermakna.</p>
      `,
      tables: [{ headers, rows: rowsData }],
      fileName: `PROTA_${learning.mataPelajaran.replace(/\s+/g, '_')}_${school.tahunPelajaran.replace('/', '-')}.docx`,
    });
    onShowToast('✓ Dokumen PROTA berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Program Tahunan (PROTA)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rencana alokasi waktu pembelajaran selama satu tahun ajaran untuk mencapai capaian pembelajaran yang telah ditetapkan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300">
            Total: {totalJp} JP
          </div>

          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun PROTA...' : 'Generate PROTA AI'}</span>
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
            Matriks Program Tahunan (PROTA)
          </h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3 w-40">Elemen / CP</th>
                <th className="py-3 px-3 w-64">Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-3 w-44">Materi Pokok</th>
                <th className="py-3 px-3 w-20 text-center">Alokasi (JP)</th>
                <th className="py-3 px-3 w-24 text-center">Semester</th>
                <th className="py-3 px-3 w-32">Keterangan</th>
                <th className="py-3 px-3 w-10 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {protaRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 align-top">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{row.no}</td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.cp}
                      onChange={(e) => handleCellChange(idx, 'cp', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={row.tp}
                      onChange={(e) => handleCellChange(idx, 'tp', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.materi}
                      onChange={(e) => handleCellChange(idx, 'materi', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={row.alokasiJp}
                      onChange={(e) => handleCellChange(idx, 'alokasiJp', parseInt(e.target.value) || 0)}
                      className="w-16 px-1.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                      value={row.semester}
                      onChange={(e) => handleCellChange(idx, 'semester', parseInt(e.target.value))}
                      className="px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value={1}>Sem 1</option>
                      <option value={2}>Sem 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.keterangan || ''}
                      onChange={(e) => handleCellChange(idx, 'keterangan', e.target.value)}
                      placeholder="Catatan..."
                      className="w-full px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
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
