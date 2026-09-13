import { GeminiSettings, LearningData, TeacherProfile, SchoolIdentity } from '../types';
import { storageService } from './storageService';

export const SYSTEM_INSTRUCTION_PEDAGOGI = `Kamu adalah asisten ahli perencanaan pembelajaran Indonesia dan UI/UX perancangan kurikulum.
Bantu guru menyusun perangkat ajar dengan menggunakan pendekatan Pembelajaran Mendalam (Deep Learning).

Gunakan 3 prinsip pembelajaran:
1. Berkesadaran / Mindful (Peserta didik memahami tujuan belajar dan sadar terhadap proses belajarnya)
2. Bermakna / Meaningful (Pembelajaran dikaitkan dengan kehidupan nyata dan pengalaman peserta didik)
3. Menggembirakan / Joyful (Pembelajaran menciptakan suasana positif, aman, aktif, dan menyenangkan)

Integrasikan 3 pengalaman belajar pada kegiatan inti:
1. Memahami (Membangun pemahaman konsep mendalam)
2. Mengaplikasi (Menggunakan pengetahuan dalam pemecahan masalah konteks nyata)
3. Merefleksi (Mengevaluasi pengalaman dan kebermaknaan belajar)

Integrasikan 8 dimensi profil lulusan secara relevan (Keimanan & ketakwaan, Kewargaan, Penalaran kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi).
Integrasikan 4 Olah (Pikir, Hati, Rasa, Raga) secara proporsional.
Integrasikan nilai Pembelajaran Berbasis Cinta (Cinta kepada Tuhan, Diri Sendiri, Sesama, Ilmu, Lingkungan, Bangsa dan Negara) secara kontekstual ke dalam tujuan, aktivitas, pertanyaan pemantik, kerja kelompok, dan refleksi.

Pastikan alur: CP -> ATP -> Tujuan -> Materi -> Aktivitas -> Asesmen memiliki keterkaitan yang logis.
Gunakan bahasa Indonesia yang baku, formal, rapi, terstruktur, dan siap diedit oleh guru.`;

export async function testGeminiConnection(settings: GeminiSettings): Promise<{ success: boolean; message: string }> {
  try {
    // Try server API first
    const res = await fetch('/api/gemini/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customApiKey: settings.apiKey,
        model: settings.model || 'gemini-3.8-flash',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Gemini AI berhasil terhubung!' };
    }

    // Direct fallback if backend route unavailable (standalone mode)
    if (settings.apiKey) {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-3.8-flash'}:generateContent?key=${settings.apiKey}`;
      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping test. Jawab "OK".' }] }],
        }),
      });

      if (directRes.ok) {
        return { success: true, message: 'Gemini AI berhasil terhubung langsung!' };
      }
      const errJson = await directRes.json();
      return { success: false, message: errJson.error?.message || 'Gagal terhubung ke Gemini API' };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errData.error || 'Gemini AI tidak dapat terhubung. Silakan periksa koneksi dan API Key.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menghubungi layanan Gemini AI.',
    };
  }
}

export async function callGeminiAI(
  prompt: string,
  options?: {
    customSystemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
    asJson?: boolean;
  }
): Promise<string> {
  const settings = storageService.getGeminiSettings();
  const sysInst = options?.customSystemInstruction || SYSTEM_INSTRUCTION_PEDAGOGI;

  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction: sysInst,
        model: settings.model || 'gemini-3.8-flash',
        temperature: options?.temperature ?? settings.temperature ?? 0.7,
        maxOutputTokens: options?.maxOutputTokens ?? settings.maxOutputTokens ?? 4096,
        responseMimeType: options?.asJson ? 'application/json' : undefined,
        customApiKey: settings.apiKey,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.text || '';
    }

    // Direct client fallback for standalone file usage
    if (settings.apiKey) {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-3.8-flash'}:generateContent?key=${settings.apiKey}`;
      const payload: any = {
        systemInstruction: { parts: [{ text: sysInst }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? settings.temperature ?? 0.7,
          maxOutputTokens: options?.maxOutputTokens ?? settings.maxOutputTokens ?? 4096,
        },
      };
      if (options?.asJson) {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (directRes.ok) {
        const json = await directRes.json();
        return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    }

    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memproses AI generator.');
  } catch (error: any) {
    console.warn('Gemini call encountered error, providing pedagogical fallback draft:', error);
    throw error;
  }
}

// Generate context-rich prompt helper
export function buildLearningContextString(
  learning: LearningData,
  teacher: TeacherProfile,
  school: SchoolIdentity
): string {
  return `
[IDENTITAS GURU & SEKOLAH]
Nama Guru: ${teacher.namaPembuat}
NIP: ${teacher.nip}
Nama Kepala Sekolah: ${teacher.namaKepalaSekolah}
Sekolah: ${school.namaSekolah} (${school.jenjang})
Tahun Pelajaran: ${school.tahunPelajaran} | Semester: ${school.semester}

[DATA PEMBELAJARAN]
Jenjang: ${learning.jenjang} | Kelas: ${learning.kelas} | Fase: ${learning.fase}
Mata Pelajaran: ${learning.mataPelajaran}
Materi Pokok / Topik: ${learning.materiTopik}
Elemen: ${learning.elemen}
Alokasi Waktu: ${learning.alokasiWaktu} (${learning.jumlahPertemuan} Pertemuan, ${learning.jpPerPertemuan} JP/Pertemuan)
Jumlah Peserta Didik: ${learning.jumlahPesertaDidik} siswa
Karakteristik Siswa: ${learning.karakteristikPesertaDidik}
Sarana & Prasarana: ${learning.saranaPrasarana}

[PENDEKATAN PEMBELAJARAN MENDALAM]
Dimensi Profil Lulusan yang Ditargetkan: ${learning.dimensiProfilLulusan.join(', ')}
3 Prinsip: ${learning.prinsipPembelajaran.join(', ')}
3 Pengalaman Belajar Inti: ${learning.pengalamanBelajar.join(', ')}
Integrasi 4 Olah: ${learning.olah.join(', ')}
Nilai Pembelajaran Berbasis Cinta: ${learning.nilaiCinta.join(', ')}
`;
}
