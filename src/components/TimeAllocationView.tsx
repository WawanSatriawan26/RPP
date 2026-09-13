import React, { useState } from 'react';
import { Clock, Sparkles, FileDown, Plus, Trash2, Save, Calculator } from 'lucide-react';
import { AlokasiWaktuData, TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { exportSingleDocx } from '../services/docxExportService';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface TimeAllocationViewProps {
  data: AlokasiWaktuData;
  onSave: (updated: AlokasiWaktuData) => void;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const TimeAllocationView: React.FC<TimeAllocationViewProps> = ({
  data,
  onSave,
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<AlokasiWaktuData>({ ...data });
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto calculate totals
  const totalJamSemester1 = formData.mingguEfektifSem1 * formData.jpPerMinggu;
  const totalJamSemester2 = formData.mingguEfektifSem2 * formData.jpPerMinggu;
  const totalJamTahun = totalJamSemester1 + totalJamSemester2;
  const jamEfektifReguler = totalJamTahun - formData.cadanganJam;

  const handleUpdate = (field: keyof AlokasiWaktuData, val: any) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    onSave(updated);
  };

  const handleMateriChange = (index: number, field: string, val: any) => {
    const rows = [...formData.rincianMateri];
    rows[index] = { ...rows[index], [field]: val };
    const updated = { ...formData, rincianMateri: rows };
    setFormData(updated);
    onSave(updated);
  };

  const handleAddRow = () => {
    const rows = [
      ...formData.rincianMateri,
      {
        no: formData.rincianMateri.length + 1,
        materi: 'Topik Baru',
        alokasiJp: 3,
        keterangan: 'Semester ' + (school.semester.includes('1') ? '1' : '2'),
      },
    ];
    handleUpdate('rincianMateri', rows);
  };

  const handleRemoveRow = (index: number) => {
    const rows = formData.rincianMateri.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    handleUpdate('rincianMateri', rows);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Buatkan pembagian analisis alokasi waktu tahunan dan semester untuk mata pelajaran berikut dalam format JSON:
${buildLearningContextString(learning, teacher, school)}

Ketentuan:
- Jumlah minggu efektif sem 1: ${formData.mingguEfektifSem1}, sem 2: ${formData.mingguEfektifSem2}
- JP per minggu: ${formData.jpPerMinggu}
- Bagikan materi pokok sesuai ruang lingkup materi jenjang ${learning.jenjang} kelas ${learning.kelas}.

Kembalikan HANYA JSON murni dengan format:
{
  "rincianMateri": [
    {"no": 1, "materi": "Nama Materi 1", "alokasiJp": 6, "keterangan": "Semester 1"},
    {"no": 2, "materi": "Nama Materi 2", "alokasiJp": 6, "keterangan": "Semester 1"}
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.rincianMateri && Array.isArray(parsed.rincianMateri)) {
        const updated = { ...formData, rincianMateri: parsed.rincianMateri };
        setFormData(updated);
        onSave(updated);
        onShowToast('✓ Analisis alokasi materi berhasil dibuat dengan Gemini AI!', 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal generate dengan AI: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    const tableRows = formData.rincianMateri.map((r) => [
      r.no.toString(),
      r.materi,
      `${r.alokasiJp} JP`,
      r.keterangan || '-',
    ]);

    // Add total row
    const totalJpMateri = formData.rincianMateri.reduce((acc, curr) => acc + (Number(curr.alokasiJp) || 0), 0);
    tableRows.push(['', 'TOTAL ALOKASI WAKTU MATERI', `${totalJpMateri} JP`, '']);

    await exportSingleDocx({
      title: 'ANALISIS ALOKASI WAKTU',
      subtitle: 'Tahun Pelajaran ' + school.tahunPelajaran,
      teacher,
      school,
      learning,
      contentHtml: `
        <p><strong>A. Perhitungan Minggu Efektif:</strong></p>
        <ul>
          <li>Jumlah Minggu Efektif Semester 1: <strong>${formData.mingguEfektifSem1} Minggu</strong></li>
          <li>Jumlah Minggu Efektif Semester 2: <strong>${formData.mingguEfektifSem2} Minggu</strong></li>
          <li>Jumlah Jam Pelajaran per Minggu: <strong>${formData.jpPerMinggu} JP</strong></li>
          <li>Total Jam Efektif Semester 1: <strong>${totalJamSemester1} JP</strong></li>
          <li>Total Jam Efektif Semester 2: <strong>${totalJamSemester2} JP</strong></li>
          <li>Total Jam Efektif 1 Tahun: <strong>${totalJamTahun} JP</strong></li>
          <li>Cadangan Jam Pelajaran: <strong>${formData.cadanganJam} JP</strong></li>
          <li>Jam Pembelajaran Efektif Reguler: <strong>${jamEfektifReguler} JP</strong></li>
        </ul>
        <p><strong>B. Distribusi Alokasi Waktu Materi Pokok:</strong></p>
      `,
      tables: [
        {
          headers: ['No', 'Materi Pokok / Lingkup Materi', 'Alokasi Waktu', 'Keterangan'],
          rows: tableRows,
        },
      ],
      fileName: `Analisis_Alokasi_Waktu_${learning.mataPelajaran.replace(/\s+/g, '_')}.docx`,
    });
    onShowToast('✓ Dokumen Analisis Alokasi Waktu berhasil di-export ke Word (.docx)!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Analisis Alokasi Waktu Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Perhitungan sistematis minggu efektif, total JP, dan distribusi materi pokok dalam satu tahun ajaran.
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
            <span>{isGenerating ? 'Menyusun Alokasi...' : 'Distribusi Materi AI'}</span>
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

      {/* Summary Calculation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div className="text-xs text-slate-500">Total Minggu Efektif</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formData.mingguEfektifSem1 + formData.mingguEfektifSem2} <span className="text-xs font-normal">Minggu</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sem 1: {formData.mingguEfektifSem1} | Sem 2: {formData.mingguEfektifSem2}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div className="text-xs text-slate-500">JP per Minggu</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {formData.jpPerMinggu} <span className="text-xs font-normal">JP/Minggu</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Struktur Kurikulum</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div className="text-xs text-slate-500">Total Jam Efektif Tahunan</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {totalJamTahun} <span className="text-xs font-normal">JP</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sem 1: {totalJamSemester1} JP | Sem 2: {totalJamSemester2} JP</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div className="text-xs text-slate-500">Jam Pembelajaran Reguler</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {jamEfektifReguler} <span className="text-xs font-normal">JP</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cadangan: {formData.cadanganJam} JP</div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          Parameter Perhitungan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Minggu Efektif Semester 1
            </label>
            <input
              type="number"
              value={formData.mingguEfektifSem1}
              onChange={(e) => handleUpdate('mingguEfektifSem1', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Minggu Efektif Semester 2
            </label>
            <input
              type="number"
              value={formData.mingguEfektifSem2}
              onChange={(e) => handleUpdate('mingguEfektifSem2', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              JP Mata Pelajaran per Minggu
            </label>
            <input
              type="number"
              value={formData.jpPerMinggu}
              onChange={(e) => handleUpdate('jpPerMinggu', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cadangan Jam (Ujian/Libur)
            </label>
            <input
              type="number"
              value={formData.cadanganJam}
              onChange={(e) => handleUpdate('cadanganJam', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Distribution Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Tabel Distribusi Jam per Materi Pokok
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
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-16 text-center">No</th>
                <th className="py-3 px-4">Materi Pokok / Lingkup Materi</th>
                <th className="py-3 px-4 w-28 text-center">Alokasi (JP)</th>
                <th className="py-3 px-4 w-36">Keterangan</th>
                <th className="py-3 px-4 w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {formData.rincianMateri.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-center font-medium text-slate-500">{row.no}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.materi}
                      onChange={(e) => handleMateriChange(idx, 'materi', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={row.alokasiJp}
                      onChange={(e) => handleMateriChange(idx, 'alokasiJp', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.keterangan || ''}
                      onChange={(e) => handleMateriChange(idx, 'keterangan', e.target.value)}
                      placeholder="Semester 1 / 2"
                      className="w-full px-2.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
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
