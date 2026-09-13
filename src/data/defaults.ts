import {
  Jenjang,
  Fase,
  TeacherProfile,
  SchoolIdentity,
  LearningData,
  GeminiSettings,
  AlokasiWaktuData,
  AnalisisCpAtpRow,
  AtpRow,
  ProtaRow,
  PromesRow,
  JurnalRow,
} from '../types';

export const KELAS_BY_JENJANG: Record<Jenjang, string[]> = {
  SD: ['1', '2', '3', '4', '5', '6'],
  SMP: ['7', '8', '9'],
  MTs: ['7', '8', '9'],
  SMA: ['10', '11', '12'],
  MA: ['10', '11', '12'],
};

export const JENJANG_KELAS_MAP = KELAS_BY_JENJANG;

export const DEFAULT_MAPEL_BY_JENJANG: Record<Jenjang, string[]> = {
  SD: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Seni Rupa',
    'Seni Musik',
    'Seni Tari',
    'Seni Teater',
    'Bahasa Inggris',
  ],
  SMP: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Bahasa Inggris',
    'Informatika',
    'PJOK',
    'Seni & Prakarya',
  ],
  MTs: [
    'Al-Qur\'an Hadis',
    'Akidah Akhlak',
    'Fikih',
    'Sejarah Kebudayaan Islam (SKI)',
    'Bahasa Arab',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'IPA',
    'IPS',
    'Bahasa Inggris',
    'Informatika',
  ],
  SMA: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Sosiologi',
    'Geografi',
    'Sejarah',
    'Informatika',
    'PJOK',
  ],
  MA: [
    'Al-Qur\'an Hadis',
    'Akidah Akhlak',
    'Fikih',
    'SKI',
    'Bahasa Arab',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Geografi',
    'Sosiologi',
  ],
};

export const MATA_PELAJARAN_LIST = DEFAULT_MAPEL_BY_JENJANG.SMP;

export function recommendFaseByKelas(jenjang: Jenjang, kelas: string): Fase {
  if (jenjang === 'SD') {
    if (['1', '2'].includes(kelas)) return 'Fase A';
    if (['3', '4'].includes(kelas)) return 'Fase B';
    return 'Fase C';
  }
  if (jenjang === 'SMP' || jenjang === 'MTs') {
    return 'Fase D';
  }
  if (jenjang === 'SMA' || jenjang === 'MA') {
    if (kelas === '10') return 'Fase E';
    return 'Fase F';
  }
  return 'Fase D';
}

export const recommendFase = recommendFaseByKelas;

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  namaPembuat: 'Budi Santoso, S.Pd., M.Pd.',
  nip: '19850412 201001 1 018',
  nuptk: '4532763665200023',
  jabatan: 'Guru Mata Pelajaran',
  mataPelajaran: 'Informatika',
  nomorHp: '081234567890',
  email: 'budi.santoso@guru.smp.belajar.id',
  namaKepalaSekolah: 'Dra. Hj. Siti Rahmawati, M.M.',
  nipKepalaSekolah: '19720315 199702 2 003',
};

export const DEFAULT_SCHOOL_IDENTITY: SchoolIdentity = {
  namaSekolah: 'SMP Negeri 1 Nusantara',
  npsn: '20104567',
  jenjang: 'SMP',
  statusSekolah: 'Negeri',
  alamat: 'Jl. Pendidikan Karakter No. 45',
  desaKelurahan: 'Merdeka Belajar',
  kecamatan: 'Cerdas Bersama',
  kabupatenKota: 'Kota Nusantara',
  provinsi: 'DKI Jakarta',
  kodePos: '12345',
  tahunPelajaran: '2025/2026',
  semester: '1 (Ganjil)',
};

export const DEFAULT_LEARNING_DATA: LearningData = {
  jenjang: 'SMP',
  kelas: '7',
  fase: 'Fase D',
  mataPelajaran: 'Informatika',
  semester: '1 (Ganjil)',
  tahunPelajaran: '2025/2026',
  materiTopik: 'Berpikir Komputasional dan Pemecahan Masalah Sehari-hari',
  elemen: 'Berpikir Komputasional (BK)',
  alokasiWaktu: '2 Pertemuan (4 x 40 Menit)',
  jumlahPertemuan: 2,
  jpPerPertemuan: 2,
  jumlahPesertaDidik: 32,
  karakteristikPesertaDidik: 'Peserta didik memiliki gaya belajar variatif (visual, kinestetik, auditori) dan antusias terhadap studi kasus kolaboratif.',
  saranaPrasarana: 'Proyektor/LCD, LKPD cetak, Kartu Aktivitas Berpikir Komputasional, Laptop/Smartphone (opsional unplugged).',
  dimensiProfilLulusan: [
    'Penalaran kritis',
    'Kreativitas',
    'Kolaborasi',
    'Komunikasi',
  ],
  prinsipPembelajaran: [
    'Berkesadaran (Mindful)',
    'Bermakna (Meaningful)',
    'Menggembirakan (Joyful)',
  ],
  pengalamanBelajar: [
    'Memahami',
    'Mengaplikasi',
    'Merefleksi',
  ],
  olah: ['Olah Pikir', 'Olah Rasa', 'Olah Hati'],
  nilaiCinta: [
    'Cinta kepada Ilmu',
    'Cinta kepada Sesama',
    'Cinta kepada Lingkungan',
  ],
};

export const DEFAULT_GEMINI_SETTINGS: GeminiSettings = {
  apiKey: '',
  model: 'gemini-3.8-flash',
  temperature: 0.7,
  maxOutputTokens: 4096,
  isConnected: true,
};

export const DEFAULT_ALOKASI_WAKTU: AlokasiWaktuData = {
  semester1: [
    { no: 1, bulan: 'Juli', totalMinggu: 5, mingguEfektif: 3, keterangan: 'MPLS & Awal Masuk' },
    { no: 2, bulan: 'Agustus', totalMinggu: 4, mingguEfektif: 4, keterangan: 'KBM Efektif' },
    { no: 3, bulan: 'September', totalMinggu: 4, mingguEfektif: 4, keterangan: 'KBM Efektif' },
    { no: 4, bulan: 'Oktober', totalMinggu: 5, mingguEfektif: 4, keterangan: 'Asesmen Tengah Semester' },
    { no: 5, bulan: 'November', totalMinggu: 4, mingguEfektif: 4, keterangan: 'KBM Efektif' },
    { no: 6, bulan: 'Desember', totalMinggu: 4, mingguEfektif: 1, keterangan: 'PAS & Libur Semester 1' },
  ],
  semester2: [
    { no: 1, bulan: 'Januari', totalMinggu: 5, mingguEfektif: 4, keterangan: 'Awal Masuk Sem 2' },
    { no: 2, bulan: 'Februari', totalMinggu: 4, mingguEfektif: 4, keterangan: 'KBM Efektif' },
    { no: 3, bulan: 'Maret', totalMinggu: 4, mingguEfektif: 3, keterangan: 'Perkiraan Awal Puasa' },
    { no: 4, bulan: 'April', totalMinggu: 5, mingguEfektif: 3, keterangan: 'Libur Idul Fitri' },
    { no: 5, bulan: 'Mei', totalMinggu: 4, mingguEfektif: 4, keterangan: 'KBM Efektif' },
    { no: 6, bulan: 'Juni', totalMinggu: 4, mingguEfektif: 2, keterangan: 'PAT & Pembagian Rapor' },
  ],
  mingguEfektifSem1: 20,
  mingguEfektifSem2: 20,
  jpPerMinggu: 2,
  totalJpEfektif: 40,
  cadanganJam: 4,
  rincianMateri: [
    { no: 1, materi: 'Berpikir Komputasional (Dekomposisi & Pola)', alokasiJp: 8, keterangan: 'Semester 1' },
    { no: 2, materi: 'Algoritma dan Abstraksi Sederhana', alokasiJp: 8, keterangan: 'Semester 1' },
    { no: 3, materi: 'Teknologi Informasi & Komunikasi (Aplikasi Kerja)', alokasiJp: 10, keterangan: 'Semester 1' },
    { no: 4, materi: 'Sistem Komputer & Jaringan Dasar', alokasiJp: 10, keterangan: 'Semester 1' },
    { no: 5, materi: 'Cadangan & Asesmen Sumatif', alokasiJp: 4, keterangan: 'Semester 1' },
  ],
};

export const DEFAULT_ANALISIS_CP_ATP: AnalisisCpAtpRow[] = [
  {
    no: 1,
    komponen: 'Kompetensi Esensial dalam CP',
    hasilAnalisis: 'Peserta didik diarahkan memiliki kemampuan bernalar kritis, dekomposisi masalah, dan merumuskan algoritma terstruktur.',
    rekomendasi: 'Gunakan studi kasus nyata di lingkungan sekitar siswa agar konsep tidak abstrak.',
  },
  {
    no: 2,
    komponen: 'Keterpaduan 3 Prinsip (Mindful, Meaningful, Joyful)',
    hasilAnalisis: 'Aktivitas pembelajaran telah mengaitkan masalah otentik siswa, didukung permainan logika yang menggembirakan.',
    rekomendasi: 'Sertakan jeda mindful breathing di awal untuk memusatkan kesadaran belajar.',
  },
  {
    no: 3,
    komponen: 'Integrasi Nilai Cinta kepada Sesama & Ilmu',
    hasilAnalisis: 'Pengerjaan tugas secara berkelompok mengasah rasa empati dan saling menghargai pendapat rekan.',
    rekomendasi: 'Berikan penguatan pada sikap saling membantu tanpa meremehkan.',
  },
];

export const DEFAULT_ATP_ROWS: AtpRow[] = [
  {
    no: 1,
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan konsep dasar dekomposisi untuk memecahkan masalah sehari-hari secara terstruktur.',
    lingkupMateri: 'Dekomposisi Masalah',
    rencanaAktivitas: 'Diskusi kelompok membedah studi kasus nyata (Memahami & Mengaplikasi)',
    profilLulusan: 'Penalaran kritis, Kolaborasi',
    alokasiWaktuJp: 3,
    asesmen: 'Formatif (Observasi & LKPD)',
  },
  {
    no: 2,
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi pola (pattern recognition) dalam data sederhana serta merancang abstraksinya.',
    lingkupMateri: 'Pengenalan Pola & Abstraksi',
    rencanaAktivitas: 'Simulasi kartu teka-teki logika berpasangan (Joyful)',
    profilLulusan: 'Kreativitas, Kemandirian',
    alokasiWaktuJp: 3,
    asesmen: 'Formatif (LKPD Pola & Kuis)',
  },
  {
    no: 3,
    tujuanPembelajaran: 'Peserta didik mampu menyusun algoritma langkah demi langkah untuk memecahkan permasalahan dengan penuh ketelitian dan kasih sayang.',
    lingkupMateri: 'Penyusunan Algoritma Sederhana',
    rencanaAktivitas: 'Merancang petunjuk langkah ramah lingkungan (Mengaplikasi & Merefleksi)',
    profilLulusan: 'Penalaran kritis, Komunikasi',
    alokasiWaktuJp: 3,
    asesmen: 'Sumatif (Projek Mini Solusi Nyata)',
  },
];

export const DEFAULT_PROTA_ROWS: ProtaRow[] = [
  { no: 1, cp: 'Berpikir Komputasional', tp: 'Memahami 4 pilar berpikir komputasional dalam konteks kehidupan nyata.', materi: 'Pilar Berpikir Komputasional', alokasiJp: 8, semester: 1, keterangan: 'Tuntas' },
  { no: 2, cp: 'Teknologi Informasi & Komunikasi', tp: 'Memanfaatkan aplikasi pengolah kata dan lembar kerja untuk laporan projek.', materi: 'Aplikasi Perkantoran', alokasiJp: 10, semester: 1, keterangan: 'Praktik' },
  { no: 3, cp: 'Sistem Komputer', tp: 'Menjelaskan interaksi perangkat keras dan perangkat lunak.', materi: 'Hardware & Software', alokasiJp: 8, semester: 1, keterangan: 'Konseptual' },
  { no: 4, cp: 'Jaringan Komputer & Internet', tp: 'Menghubungkan perangkat ke internet dan menjaga keamanan data.', materi: 'Jaringan & Keamanan Data', alokasiJp: 8, semester: 2, keterangan: 'Praktik' },
  { no: 5, cp: 'Analisis Data', tp: 'Mengumpulkan dan mengolah data sederhana tentang lingkungan sekolah.', materi: 'Pengolahan Data Lingkungan', alokasiJp: 10, semester: 2, keterangan: 'Riset Mini' },
  { no: 6, cp: 'Dampak Sosial Informatika', tp: 'Menganalisis dampak positif dan etika digital berlandaskan cinta sesama.', materi: 'Etika Digital & Cinta Kasih', alokasiJp: 8, semester: 2, keterangan: 'Refleksi' },
];

export const DEFAULT_PROMES_ROWS: PromesRow[] = [
  {
    no: 1,
    materi: 'Dekomposisi & Pengenalan Pola',
    alokasiJp: 6,
    bulan: [
      { namaBulan: 'Juli', minggu: [true, true, false, false] },
      { namaBulan: 'Agustus', minggu: [false, false, false, false] },
      { namaBulan: 'September', minggu: [false, false, false, false] },
      { namaBulan: 'Oktober', minggu: [false, false, false, false] },
      { namaBulan: 'November', minggu: [false, false, false, false] },
      { namaBulan: 'Desember', minggu: [false, false, false, false] },
    ],
    keterangan: 'Tuntas',
  },
  {
    no: 2,
    materi: 'Abstraksi & Algoritma Sederhana',
    alokasiJp: 6,
    bulan: [
      { namaBulan: 'Juli', minggu: [false, false, false, false] },
      { namaBulan: 'Agustus', minggu: [true, true, false, false] },
      { namaBulan: 'September', minggu: [false, false, false, false] },
      { namaBulan: 'Oktober', minggu: [false, false, false, false] },
      { namaBulan: 'November', minggu: [false, false, false, false] },
      { namaBulan: 'Desember', minggu: [false, false, false, false] },
    ],
    keterangan: 'Tuntas',
  },
];

export const DEFAULT_JURNAL_ROWS: JurnalRow[] = [
  {
    no: 1,
    hariTanggal: 'Senin, 14 Juli 2025',
    pertemuanKe: 1,
    kelas: 'Kelas 7',
    jamKe: '1 - 3',
    materi: 'Berpikir Komputasional - Dekomposisi',
    aktivitas: 'Apersepsi mindful, pemahaman konsep dasar dengan fenomena nyata, dan kerja kelompok pada LKPD.',
    hambatanCatatan: 'Seluruh peserta didik aktif dan tertib.',
    refleksiCinta: 'Menghargai keberagaman cara berpikir teman (Cinta Sesama).',
  },
  {
    no: 2,
    hariTanggal: 'Senin, 21 Juli 2025',
    pertemuanKe: 2,
    kelas: 'Kelas 7',
    jamKe: '1 - 3',
    materi: 'Pengenalan Pola & Abstraksi',
    aktivitas: 'Permainan kartu logika berkelompok secara gembira (Joyful) dan perumusan kesimpulan bersama.',
    hambatanCatatan: 'Dibutuhkan bimbingan tambahan bagi satu kelompok yang belum terbiasa.',
    refleksiCinta: 'Menumbuhkan kesabaran dan saling mendukung antarteman.',
  },
];
