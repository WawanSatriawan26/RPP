import React, { useState } from 'react';
import { CalendarRange, Sparkles, FileDown, Plus, Trash2 } from 'lucide-react';
import { PromesRow, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface PromesViewProps {
  rows: PromesRow[];
  onSave: (updated: PromesRow[]) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const PromesView: React.FC<PromesViewProps> = ({
  rows,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [promesRows, setPromesRows] = useState<PromesRow[]>([...rows]);
  const [isGenerating, setIsGenerating] = useState(false);

  const isSem1 = school.semester.includes('1');
  const monthNames = isSem1
    ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  const handleCellChange = (index: number, field: keyof PromesRow, val: any) => {
    const updated = [...promesRows];
    updated[index] = { ...updated[index], [field]: val };
    setPromesRows(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const newRow: PromesRow = {
      no: promesRows.length + 1,
      materi: learning.materiTopik,
      alokasiJp: 6,
      bulan: [
        { namaBulan: monthNames[0], minggu: [true, true, false, false] },
        { namaBulan: monthNames[1], minggu: [false, false, false, false] },
        { namaBulan: monthNames[2], minggu: [false, false, false, false] },
        { namaBulan: monthNames[3], minggu: [false, false, false, false] },
        { namaBulan: monthNames[4], minggu: [false, false, false, false] },
        { namaBulan: monthNames[5], minggu: [false, false, false, false] },
      ],
      keterangan: 'Tuntas',
    };
    const updated = [...promesRows, newRow];
    setPromesRows(updated);
    onSave(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = promesRows.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    setPromesRows(updated);
    onSave(updated);
  };

  const toggleMinggu = (rowIndex: number, bulanIndex: number, mingguIndex: number) => {
    const updated = [...promesRows];
    const targetBulan = [...updated[rowIndex].bulan];
    const targetMinggu = [...targetBulan[bulanIndex].minggu];
    targetMinggu[mingguIndex] = !targetMinggu[mingguIndex];
    targetBulan[bulanIndex] = { ...targetBulan[bulanIndex], minggu: targetMinggu };
    updated[rowIndex] = { ...updated[rowIndex], bulan: targetBulan };
    setPromesRows(updated);
    onSave(updated);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Susun PROGRAM SEMESTER (PROMES) Semester ${isSem1 ? '1 (Ganjil)' : '2 (Genap)'} mata pelajaran:
${buildLearningContextString(learning, teacher, school)}

Rincikan alokasi per materi pokok pada bulan-bulan ${monthNames.join(', ')}.
Kembalikan HANYA JSON murni dengan format:
{
  "promes": [
    {
      "no": 1,
      "materi": "Materi Pokok 1",
      "alokasiJp": 6,
      "keterangan": "Bulan ${monthNames[0]} & ${monthNames[1]}"
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.promes && Array.isArray(parsed.promes)) {
        const generatedRows: PromesRow[] = parsed.promes.map((p: any, idx: number) => ({
          no: idx + 1,
          materi: p.materi,
          alokasiJp: p.alokasiJp || 6,
          bulan: monthNames.map((mName, mIdx) => ({
            namaBulan: mName,
            minggu: [mIdx === idx % 6, mIdx === idx % 6, false, false],
          })),
          keterangan: p.keterangan || 'Sesuai Rencana',
        }));

        setPromesRows(generatedRows);
        onSave(generatedRows);
        onShowToast('✓ Program Semester (PROMES) berhasil digenerate dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal generate PROMES: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    const headers = ['No', 'Materi Pokok / TP', 'Alokasi (JP)', 'Distribusi Bulan', 'Keterangan'];
    const rowsData = promesRows.map((r) => {
      const activeMonths = r.bulan
        .filter((b) => b.minggu.some((m) => m))
        .map((b) => b.namaBulan)
        .join(', ');

      return [r.no.toString(), r.materi, `${r.alokasiJp} JP`, activeMonths || 'Terjadwal', r.keterangan || '-'];
    });

    await exportSingleDocx({
      title: `PROGRAM SEMESTER (PROMES) - SEMESTER ${school.semester.toUpperCase()}`,
      teacher,
      school,
      learning,
      contentHtml: `
        <p>Program Semester mata pelajaran ${learning.mataPelajaran} jenjang ${learning.jenjang} kelas ${learning.kelas} Tahun Pelajaran ${school.tahunPelajaran}.</p>
      `,
      tables: [{ headers, rows: rowsData }],
      fileName: `PROMES_${learning.mataPelajaran.replace(/\s+/g, '_')}_Semester_${isSem1 ? '1' : '2'}.docx`,
    });
    onShowToast('✓ Dokumen PROMES berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-blue-600" />
            Program Semester (PROMES) - {isSem1 ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribusi alokasi waktu dan jadwal pelaksanaan pembelajaran per minggu pada setiap bulan semester berjalan.
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
            <span>{isGenerating ? 'Menyusun PROMES...' : 'Generate PROMES AI'}</span>
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
            Matriks Distribusi Minggu Efektif ({monthNames[0]} - {monthNames[5]})
          </h3>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Materi</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 text-center">
              <tr>
                <th rowSpan={2} className="py-2.5 px-3 w-10 border-r border-slate-200 dark:border-slate-800">No</th>
                <th rowSpan={2} className="py-2.5 px-3 w-64 text-left border-r border-slate-200 dark:border-slate-800">Materi Pokok / TP</th>
                <th rowSpan={2} className="py-2.5 px-3 w-16 border-r border-slate-200 dark:border-slate-800">JP</th>
                {monthNames.map((m, mIdx) => (
                  <th key={mIdx} colSpan={4} className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-800">
                    {m}
                  </th>
                ))}
                <th rowSpan={2} className="py-2.5 px-3 w-28 border-r border-slate-200 dark:border-slate-800">Keterangan</th>
                <th rowSpan={2} className="py-2.5 px-2 w-10">Aksi</th>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                {monthNames.map((_, mIdx) => (
                  <React.Fragment key={mIdx}>
                    <th className="py-1 w-6 border-r border-slate-200 dark:border-slate-800">1</th>
                    <th className="py-1 w-6 border-r border-slate-200 dark:border-slate-800">2</th>
                    <th className="py-1 w-6 border-r border-slate-200 dark:border-slate-800">3</th>
                    <th className="py-1 w-6 border-r border-slate-200 dark:border-slate-800">4</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {promesRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                    {row.no}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={row.materi}
                      onChange={(e) => handleCellChange(rIdx, 'materi', e.target.value)}
                      className="w-full px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="number"
                      value={row.alokasiJp}
                      onChange={(e) => handleCellChange(rIdx, 'alokasiJp', parseInt(e.target.value) || 0)}
                      className="w-12 px-1 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold"
                    />
                  </td>

                  {/* 6 Bulan x 4 Minggu Checkboxes */}
                  {row.bulan.slice(0, 6).map((b, bIdx) => (
                    <React.Fragment key={bIdx}>
                      {b.minggu.slice(0, 4).map((isMarked, wIdx) => (
                        <td
                          key={wIdx}
                          onClick={() => toggleMinggu(rIdx, bIdx, wIdx)}
                          className={`py-1 text-center cursor-pointer border-r border-slate-200 dark:border-slate-800 select-none transition ${
                            isMarked
                              ? 'bg-blue-600 text-white font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={`${b.namaBulan} Minggu ke-${wIdx + 1}: Klik untuk tandai`}
                        >
                          {isMarked ? '✓' : ''}
                        </td>
                      ))}
                    </React.Fragment>
                  ))}

                  <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={row.keterangan || ''}
                      onChange={(e) => handleCellChange(rIdx, 'keterangan', e.target.value)}
                      className="w-full px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(rIdx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
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
