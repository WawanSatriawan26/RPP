export type Jenjang = 'SD' | 'SMP' | 'MTs' | 'SMA' | 'MA';
export type Fase = 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | 'Fase E' | 'Fase F';
export type JenisDokumen =
  | 'RPP'
  | 'Modul Ajar'
  | 'Bahan Ajar'
  | 'LKPD'
  | 'Asesmen'
  | 'Jurnal'
  | 'PROTA'
  | 'PROMES'
  | 'CP'
  | 'ATP'
  | 'Analisis Waktu'
  | 'Analisis CP-ATP';

export type NavigationTab =
  | 'dashboard'
  | 'profil-guru'
  | 'identitas-sekolah'
  | 'data-pembelajaran'
  | 'alokasi-waktu'
  | 'analisis-cp-atp'
  | 'cp'
  | 'atp'
  | 'bahan-ajar'
  | 'modul-ajar'
  | 'lkpd'
  | 'asesmen'
  | 'jurnal'
  | 'prota'
  | 'promes'
  | 'ai-generator'
  | 'generator-ai'
  | 'asisten-guru'
  | 'quality-check'
  | 'dokumen-saya'
  | 'export-word'
  | 'backup-data'
  | 'import-data'
  | 'pengaturan-gemini'
  | 'pengaturan-tampilan'
  | 'tentang-aplikasi';

export interface TeacherProfile {
  namaPembuat: string;
  nip: string;
  nuptk: string;
  jabatan: string;
  mataPelajaran: string;
  nomorHp: string;
  email: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
}

export interface SchoolIdentity {
  namaSekolah: string;
  npsn: string;
  jenjang: Jenjang;
  statusSekolah: 'Negeri' | 'Swasta';
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  tahunPelajaran: string;
  semester: '1 (Ganjil)' | '2 (Genap)';
  logoUrl?: string;
}

export interface LearningData {
  jenjang: Jenjang;
  kelas: string;
  fase: Fase;
  mataPelajaran: string;
  semester: '1 (Ganjil)' | '2 (Genap)';
  tahunPelajaran: string;
  materiTopik: string;
  elemen: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
  jpPerPertemuan: number;
  jumlahPesertaDidik: number;
  karakteristikPesertaDidik: string;
  saranaPrasarana: string;
  dimensiProfilLulusan: string[];
  prinsipPembelajaran: string[];
  pengalamanBelajar: string[];
  olah: string[];
  nilaiCinta: string[];
}

export interface AlokasiWaktuBulan {
  no: number;
  bulan: string;
  totalMinggu: number;
  mingguEfektif: number;
  keterangan: string;
}

export interface AlokasiWaktuMateriRow {
  no: number;
  materi: string;
  alokasiJp: number;
  keterangan: string;
}

export interface AlokasiWaktuRow {
  no: number;
  materi: string;
  alokasiJp: number;
  pertemuan?: string;
  semester?: string;
  keterangan: string;
}

export interface AlokasiWaktuData {
  semester1: AlokasiWaktuBulan[];
  semester2: AlokasiWaktuBulan[];
  mingguEfektifSem1: number;
  mingguEfektifSem2: number;
  jpPerMinggu: number;
  totalJpEfektif: number;
  cadanganJam: number;
  rincianMateri: AlokasiWaktuMateriRow[];
  catatan?: string;
  // Legacy / optional fields for compatibility
  mingguEfektif?: number;
  hariEfektif?: number;
  hariLibur?: number;
  jpAsesmen?: number;
  jpProjek?: number;
  jpKegiatanSekolah?: number;
  tabelMateri?: AlokasiWaktuRow[];
}

export interface AnalisisCpAtpRow {
  no?: number;
  komponen: string;
  hasilAnalisis: string;
  analisis?: string;
  rekomendasi: string;
}

export interface AtpRow {
  no: number;
  tujuanPembelajaran: string;
  lingkupMateri: string;
  materi?: string;
  rencanaAktivitas: string;
  aktivitas?: string;
  profilLulusan: string;
  alokasiWaktuJp: number;
  alokasiWaktu?: string;
  asesmen: string;
}

export interface ProtaRow {
  no: number;
  cp: string;
  tp: string;
  materi: string;
  materiUnit?: string;
  tujuanPembelajaran?: string;
  alokasiJp: number;
  alokasiWaktu?: string;
  semester: number | string;
  keterangan?: string;
}

export interface PromesBulan {
  namaBulan: string;
  minggu: boolean[];
}

export interface PromesRow {
  no: number;
  materi: string;
  tujuanPembelajaran?: string;
  alokasiJp: number;
  jp?: number;
  bulan: PromesBulan[];
  keterangan?: string;
  bulan1?: string;
  bulan2?: string;
  bulan3?: string;
  bulan4?: string;
  bulan5?: string;
  bulan6?: string;
}

export interface JurnalRow {
  no: number;
  hariTanggal: string;
  pertemuanKe: number;
  kelas: string;
  jamKe: string;
  materi: string;
  aktivitas: string;
  hambatanCatatan: string;
  refleksiCinta: string;
  // Legacy / optional fields
  id?: string;
  tanggal?: string;
  mataPelajaran?: string;
  tujuan?: string;
  kegiatan?: string;
  kehadiran?: string;
  hasilPembelajaran?: string;
  kendala?: string;
  solusi?: string;
  tindakLanjut?: string;
  refleksi?: string;
}

export interface DocumentItem {
  id: string;
  nama: string;
  jenis: JenisDokumen;
  mataPelajaran: string;
  kelas: string;
  fase: Fase;
  kontenHtml: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface QualityCheckResult {
  skor: number;
  status: 'Baik' | 'Perlu Perbaikan' | 'Belum Lengkap';
  ringkasan: string;
  items: {
    kriteria: string;
    status: 'Baik' | 'Perlu Perbaikan' | 'Belum Lengkap';
    catatan: string;
  }[];
  rekomendasiKonkret: string[];
}

export interface GeminiSettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  isConnected: boolean;
  lastTested?: string;
}

export const DIMENSI_PROFIL_LULUSAN_OPTIONS = [
  'Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa',
  'Kewargaan',
  'Penalaran kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi',
];

export const PRINSIP_PEMBELAJARAN_OPTIONS = [
  'Berkesadaran (Mindful)',
  'Bermakna (Meaningful)',
  'Menggembirakan (Joyful)',
];

export const PENGALAMAN_BELAJAR_OPTIONS = [
  'Memahami',
  'Mengaplikasi',
  'Merefleksi',
];

export const OLAH_OPTIONS = [
  'Olah Pikir',
  'Olah Hati',
  'Olah Rasa',
  'Olah Raga',
];

export const NILAI_CINTA_OPTIONS = [
  'Cinta kepada Tuhan',
  'Cinta kepada Diri Sendiri',
  'Cinta kepada Sesama',
  'Cinta kepada Ilmu',
  'Cinta kepada Lingkungan',
  'Cinta kepada Bangsa dan Negara',
];
