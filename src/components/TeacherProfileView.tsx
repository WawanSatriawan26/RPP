import React, { useState } from 'react';
import { User, Save, RotateCcw, Check, Briefcase, Phone, Mail, Award, ShieldCheck } from 'lucide-react';
import { TeacherProfile } from '../types';
import { DEFAULT_TEACHER_PROFILE } from '../data/defaults';

interface TeacherProfileViewProps {
  profile: TeacherProfile;
  onSave: (updated: TeacherProfile) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  profile,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof TeacherProfile, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
    onShowToast?.('✓ Profil Pembuat berhasil disimpan dan akan digunakan otomatis pada seluruh dokumen Word.', 'success');
  };

  const handleReset = () => {
    if (confirm('Kembalikan data profil ke nilai standar bawaan?')) {
      setFormData(DEFAULT_TEACHER_PROFILE);
      onSave(DEFAULT_TEACHER_PROFILE);
      setIsEditing(false);
      onShowToast?.('Profil pembuat telah direset ke default.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profil Pembuat Perangkat Ajar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Data ini secara otomatis dicantumkan pada Kop Dokumen, Halaman Judul, dan Ruang Tanda Tangan Word (.docx).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Section 1: Guru Pengampu */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Identitas Guru Pembuat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaPembuat}
                  onChange={(e) => handleChange('namaPembuat', e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Pd., M.Pd."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => handleChange('nip', e.target.value)}
                  placeholder="Contoh: 19850412 201001 1 018 atau - jika non-PNS"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NUPTK
                </label>
                <input
                  type="text"
                  value={formData.nuptk}
                  onChange={(e) => handleChange('nuptk', e.target.value)}
                  placeholder="Contoh: 4532763665200023"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jabatan / Tugas
                </label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => handleChange('jabatan', e.target.value)}
                  placeholder="Contoh: Guru Mata Pelajaran / Wali Kelas"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mata Pelajaran Utama
                </label>
                <input
                  type="text"
                  value={formData.mataPelajaran}
                  onChange={(e) => handleChange('mataPelajaran', e.target.value)}
                  placeholder="Contoh: Informatika / Matematika"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.nomorHp}
                  onChange={(e) => handleChange('nomorHp', e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Akun Belajar / Dinas
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Contoh: nama.guru@guru.belajar.id"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 2: Kepala Sekolah Pengesah */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pimpinan Sekolah (Penanda Tangan Dokumen)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kepala Sekolah & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaKepalaSekolah}
                  onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
                  placeholder="Contoh: Dra. Hj. Siti Rahmawati, M.M."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                  placeholder="Contoh: 19720315 199702 2 003"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isEditing ? 'Ada perubahan belum disimpan.' : '✓ Tersimpan otomatis'}
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
