import React from 'react';
import {
  BookOpen,
  Save,
  RotateCcw,
  Sparkles,
  Heart,
  Brain,
  Smile,
  Compass,
  Check
} from 'lucide-react';
import {
  LearningData,
  Jenjang,
  Fase,
  DIMENSI_PROFIL_LULUSAN_OPTIONS,
  PRINSIP_PEMBELAJARAN_OPTIONS,
  PENGALAMAN_BELAJAR_OPTIONS,
  OLAH_OPTIONS,
  NILAI_CINTA_OPTIONS
} from '../types';
import {
  KELAS_BY_JENJANG,
  DEFAULT_MAPEL_BY_JENJANG,
  recommendFaseByKelas,
  DEFAULT_LEARNING_DATA
} from '../data/defaults';

interface LearningDataViewProps {
  data: LearningData;
  onSave: (updated: LearningData) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LearningDataView: React.FC<LearningDataViewProps> = ({
  data,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = React.useState<LearningData>({ ...data });

  const handleJenjangChange = (jenjang: Jenjang) => {
    const availableKelas = KELAS_BY_JENJANG[jenjang] || ['7', '8', '9'];
    const newKelas = availableKelas[0];
    const newFase = recommendFaseByKelas(jenjang, newKelas);
    const defaultMapel = DEFAULT_MAPEL_BY_JENJANG[jenjang]?.[0] || 'Informatika';

    const updated = {
      ...formData,
      jenjang,
      kelas: newKelas,
      fase: newFase,
      mataPelajaran: defaultMapel,
    };
    setFormData(updated);
    onSave(updated);
  };

  const handleKelasChange = (kelas: string) => {
    const recFase = recommendFaseByKelas(formData.jenjang, kelas);
    const updated = {
      ...formData,
      kelas,
      fase: recFase,
    };
    setFormData(updated);
    onSave(updated);
  };

  const handleRecommendFase = () => {
    const rec = recommendFaseByKelas(formData.jenjang, formData.kelas);
    setFormData((prev) => ({ ...prev, fase: rec }));
    onShowToast?.(`Rekomendasi Fase untuk Kelas ${formData.kelas}: Fase ${rec}`, 'info');
  };

  const handleArrayToggle = (
    field: 'dimensiProfilLulusan' | 'prinsipPembelajaran' | 'pengalamanBelajar' | 'olah' | 'nilaiCinta',
    value: string
  ) => {
    const current = [...formData[field]];
    const index = current.indexOf(value);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }
    const updated = { ...formData, [field]: current };
    setFormData(updated);
    onSave(updated);
  };

  const handleChange = (field: keyof LearningData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowToast?.('✓ Data Pembelajaran berhasil disimpan.', 'success');
  };

  const handleReset = () => {
    if (confirm('Kembalikan data pembelajaran ke default?')) {
      setFormData(DEFAULT_LEARNING_DATA);
      onSave(DEFAULT_LEARNING_DATA);
      onShowToast?.('Data pembelajaran telah direset.', 'info');
    }
  };

  const kelasOptions = KELAS_BY_JENJANG[formData.jenjang] || ['7', '8', '9'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Data & Karakteristik Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat konfigurasi pedagogi: Kurikulum, Alokasi Waktu, Prinsip Pembelajaran Mendalam, dan Nilai Berbasis Cinta.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      <form onSubmit={handleSaveForm} className="space-y-6">
        {/* Card 1: Kurikulum & Kelas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            1. Struktur Jenjang & Mata Pelajaran
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jenjang *
              </label>
              <select
                value={formData.jenjang}
                onChange={(e) => handleJenjangChange(e.target.value as Jenjang)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="SD">SD (Fase A, B, C)</option>
                <option value="SMP">SMP (Fase D)</option>
                <option value="MTs">MTs (Fase D)</option>
                <option value="SMA">SMA (Fase E, F)</option>
                <option value="MA">MA (Fase E, F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kelas *
              </label>
              <select
                value={formData.kelas}
                onChange={(e) => handleKelasChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
              >
                {kelasOptions.map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Fase Kurikulum
                </label>
                <button
                  type="button"
                  onClick={handleRecommendFase}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Rekomendasi
                </button>
              </div>
              <select
                value={formData.fase}
                onChange={(e) => handleChange('fase', e.target.value as Fase)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="A">Fase A (Kelas 1 - 2)</option>
                <option value="B">Fase B (Kelas 3 - 4)</option>
                <option value="C">Fase C (Kelas 5 - 6)</option>
                <option value="D">Fase D (Kelas 7 - 9)</option>
                <option value="E">Fase E (Kelas 10)</option>
                <option value="F">Fase F (Kelas 11 - 12)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                required
                value={formData.mataPelajaran}
                onChange={(e) => handleChange('mataPelajaran', e.target.value)}
                placeholder="Informatika / IPA / dll"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Materi Pokok / Topik Pembelajaran *
              </label>
              <input
                type="text"
                required
                value={formData.materiTopik}
                onChange={(e) => handleChange('materiTopik', e.target.value)}
                placeholder="Contoh: Berpikir Komputasional dan Algoritma Dasar"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Elemen / Domain CP *
              </label>
              <input
                type="text"
                required
                value={formData.elemen}
                onChange={(e) => handleChange('elemen', e.target.value)}
                placeholder="Contoh: Berpikir Komputasional (BK)"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alokasi Waktu *
              </label>
              <input
                type="text"
                value={formData.alokasiWaktu}
                onChange={(e) => handleChange('alokasiWaktu', e.target.value)}
                placeholder="Contoh: 3 x 40 Menit (3 JP)"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Pertemuan
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.jumlahPertemuan}
                onChange={(e) => handleChange('jumlahPertemuan', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                JP per Pertemuan
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.jpPerPertemuan}
                onChange={(e) => handleChange('jpPerPertemuan', parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Peserta Didik
              </label>
              <input
                type="number"
                value={formData.jumlahPesertaDidik}
                onChange={(e) => handleChange('jumlahPesertaDidik', parseInt(e.target.value) || 32)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sarana & Prasarana
              </label>
              <input
                type="text"
                value={formData.saranaPrasarana}
                onChange={(e) => handleChange('saranaPrasarana', e.target.value)}
                placeholder="Laptop, Proyektor LCD, Jaringan Internet, Papan Tulis, LKPD"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Karakteristik & Kebutuhan Peserta Didik
            </label>
            <textarea
              rows={2}
              value={formData.karakteristikPesertaDidik}
              onChange={(e) => handleChange('karakteristikPesertaDidik', e.target.value)}
              placeholder="Gaya belajar beragam (visual, kinestetik, auditori), menyukai praktik langsung, perlu stimulasi pertanyaan pemantik."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Card 2: 8 Dimensi Profil Lulusan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              2. Delapan (8) Dimensi Profil Lulusan
            </span>
            <span className="text-xs font-normal text-slate-500">
              Pilih dimensi yang relevan dengan materi ini
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {DIMENSI_PROFIL_LULUSAN_OPTIONS.map((dim) => {
              const isSelected = formData.dimensiProfilLulusan.includes(dim);
              return (
                <button
                  type="button"
                  key={dim}
                  onClick={() => handleArrayToggle('dimensiProfilLulusan', dim)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-200 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{dim}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 3: Prinsip & Pengalaman Belajar & 4 Olah */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            3. Kerangka Pembelajaran Mendalam (Deep Learning)
          </h3>

          {/* 3 Prinsip */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              3 Prinsip Pembelajaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRINSIP_PEMBELAJARAN_OPTIONS.map((p) => {
                const isSelected = formData.prinsipPembelajaran.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => handleArrayToggle('prinsipPembelajaran', p)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{p}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Pengalaman Belajar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              3 Pengalaman Belajar (Kegiatan Inti)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PENGALAMAN_BELAJAR_OPTIONS.map((exp) => {
                const isSelected = formData.pengalamanBelajar.includes(exp);
                return (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => handleArrayToggle('pengalamanBelajar', exp)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{exp}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Olah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Integrasi 4 Olah
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OLAH_OPTIONS.map((o) => {
                const isSelected = formData.olah.includes(o);
                return (
                  <button
                    type="button"
                    key={o}
                    onClick={() => handleArrayToggle('olah', o)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-400 text-purple-900 dark:text-purple-200 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{o}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 4: Nilai Pembelajaran Berbasis Cinta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              4. Nilai Pembelajaran Berbasis Cinta
            </span>
            <span className="text-xs font-normal text-slate-500">
              Menghidupkan suasana kelas yang penuh empati dan kasih sayang
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {NILAI_CINTA_OPTIONS.map((c) => {
              const isSelected = formData.nilaiCinta.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleArrayToggle('nilaiCinta', c)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-800 text-rose-950 dark:text-rose-200 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{c}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Perubahan otomatis tersimpan ke penyimpanan browser.
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Data Pembelajaran</span>
          </button>
        </div>
      </form>
    </div>
  );
};
