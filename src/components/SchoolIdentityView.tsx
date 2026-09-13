import React, { useState } from 'react';
import { School, Save, RotateCcw, Image, Upload, Trash2 } from 'lucide-react';
import { SchoolIdentity, Jenjang } from '../types';
import { DEFAULT_SCHOOL_IDENTITY } from '../data/defaults';

interface SchoolIdentityViewProps {
  school: SchoolIdentity;
  onSave: (updated: SchoolIdentity) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SchoolIdentityView: React.FC<SchoolIdentityViewProps> = ({
  school,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<SchoolIdentity>({ ...school });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(school.logoUrl);

  const handleChange = (field: keyof SchoolIdentity, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast?.('Ukuran logo maksimal 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        handleChange('logoUrl', result);
        onShowToast?.('Logo sekolah berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    handleChange('logoUrl', undefined);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowToast?.('✓ Identitas Sekolah berhasil disimpan.', 'success');
  };

  const handleReset = () => {
    if (confirm('Kembalikan data sekolah ke default?')) {
      setFormData(DEFAULT_SCHOOL_IDENTITY);
      setLogoPreview(undefined);
      onSave(DEFAULT_SCHOOL_IDENTITY);
      onShowToast?.('Identitas sekolah telah direset.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            Identitas Satuan Pendidikan (Sekolah)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Informasi lembaga pendidikan ini digunakan untuk Kop Surat resmi, Cover RPP/Modul Ajar, dan administrasi kurikulum.
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

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Logo & School Name Header Group */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Image className="w-7 h-7 mx-auto mb-1 text-slate-300" />
                    <span className="text-[10px] font-semibold block">Logo Sekolah</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{logoPreview ? 'Ganti Logo' : 'Upload Logo Sekolah'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Format PNG/JPG/WEBP maksimal 2MB. Logo disimpan di browser lokal dan otomatis dicetak pada Kop Word.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Resmi Satuan Pendidikan (Sekolah/Madrasah) *
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                placeholder="Contoh: SMP Negeri 1 Nusantara"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional)
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                placeholder="Contoh: 20104567"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jenjang Pendidikan *
              </label>
              <select
                value={formData.jenjang}
                onChange={(e) => handleChange('jenjang', e.target.value as Jenjang)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="SD">SD (Sekolah Dasar)</option>
                <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                <option value="MTs">MTs (Madrasah Tsanawiyah)</option>
                <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                <option value="MA">MA (Madrasah Aliyah)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Sekolah
              </label>
              <select
                value={formData.statusSekolah}
                onChange={(e) => handleChange('statusSekolah', e.target.value as 'Negeri' | 'Swasta')}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Pelajaran *
              </label>
              <input
                type="text"
                required
                value={formData.tahunPelajaran}
                onChange={(e) => handleChange('tahunPelajaran', e.target.value)}
                placeholder="2025/2026"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Berjalan *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Jalan
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                placeholder="Jl. Pendidikan Karakter No. 45"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Desa / Kelurahan
              </label>
              <input
                type="text"
                value={formData.desaKelurahan}
                onChange={(e) => handleChange('desaKelurahan', e.target.value)}
                placeholder="Merdeka Belajar"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => handleChange('kecamatan', e.target.value)}
                placeholder="Cerdas Bersama"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kabupaten / Kota *
              </label>
              <input
                type="text"
                required
                value={formData.kabupatenKota}
                onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                placeholder="Kota Nusantara"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Provinsi *
              </label>
              <input
                type="text"
                required
                value={formData.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                placeholder="DKI Jakarta"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.kodePos}
                onChange={(e) => handleChange('kodePos', e.target.value)}
                placeholder="12345"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">✓ Tersimpan otomatis pada browser</span>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Identitas Sekolah</span>
          </button>
        </div>
      </form>
    </div>
  );
};
