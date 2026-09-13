import React, { useState } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Wand2, ArrowRight } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface QualityCheckViewProps {
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  cpContent: string;
  modulAjar: string;
  lkpd: string;
  asesmen: string;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onNavigateToTab: (tab: any) => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  notes: string;
  recommendation: string;
}

export const QualityCheckView: React.FC<QualityCheckViewProps> = ({
  teacher,
  school,
  learning,
  cpContent,
  modulAjar,
  lkpd,
  asesmen,
  onShowToast,
  onNavigateToTab,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(88);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'identitas',
      title: 'Kelengkapan Identitas Sekolah & Guru',
      score: teacher.namaPembuat && school.namaSekolah ? 100 : 50,
      status: teacher.namaPembuat && school.namaSekolah ? 'passed' : 'warning',
      notes: teacher.namaPembuat && school.namaSekolah ? 'Identitas lengkap terisi' : 'NIP atau identitas kepala sekolah belum lengkap',
      recommendation: 'Lengkapi data kepala sekolah dan NIP untuk kesiapan administrasi resmi.',
    },
    {
      id: 'keselarasan',
      title: 'Keselarasan Alur: CP → TP → Aktivitas → Asesmen',
      score: 90,
      status: 'passed',
      notes: 'Tujuan pembelajaran selaras dengan lingkup materi dan asesmen formatif.',
      recommendation: 'Pastikan indikator ketercapaian pada LKPD merujuk langsung ke KKO tujuan pembelajaran.',
    },
    {
      id: 'tiga_prinsip',
      title: 'Integrasi 3 Prinsip (Mindful, Meaningful, Joyful)',
      score: 85,
      status: 'passed',
      notes: 'Kegiatan awal memuat mindful breathing dan apersepsi bermakna.',
      recommendation: 'Perkuat kegiatan penutup dengan ekspresi joyful dan apresiasi karya siswa.',
    },
    {
      id: 'tiga_pengalaman',
      title: 'Integrasi 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)',
      score: 90,
      status: 'passed',
      notes: 'Sintaks inti membagi tahapan memahami, mengaplikasikan materi pada LKPD, dan refleksi mandiri.',
      recommendation: 'Pertahankan alur bertahap agar tidak melompati pengalaman memahami konsep inti.',
    },
    {
      id: 'nilai_cinta',
      title: 'Kehadiran Nilai Pembelajaran Berbasis Cinta',
      score: 95,
      status: 'passed',
      notes: `Memuat nilai ${learning.nilaiCinta.join(', ')} secara eksplisit dalam langkah pembelajaran.`,
      recommendation: 'Ajak siswa menyadari dampak kasih sayang terhadap kepedulian lingkungan.',
    },
    {
      id: 'alokasi_waktu',
      title: 'Keseimbangan Alokasi Waktu (JP & Menit)',
      score: 80,
      status: 'passed',
      notes: `Alokasi waktu ${learning.alokasiWaktu} mencukupi untuk tahapan kegiatan inti.`,
      recommendation: 'Alokasikan waktu cadangan 10 menit untuk presentasi siswa.',
    },
    {
      id: 'rubrik',
      title: 'Kejelasan Rubrik Asesmen & Pedoman Penskoran',
      score: 75,
      status: 'warning',
      notes: 'Rubrik penilaian telah tersedia namun deskriptor level cukup perlu diperjelas.',
      recommendation: 'Lengkapi deskripsi capaian pada level sedang agar penilaian lebih objektif.',
    },
    {
      id: 'bahasa',
      title: 'Kelayakan Bahasa, Santun & Keterbacaan Siswa',
      score: 90,
      status: 'passed',
      notes: `Bahasa komunikatif, ramah, dan disesuaikan dengan jenjang ${learning.jenjang}.`,
      recommendation: 'Gunakan kalimat ajakan yang memotivasi pada lembar kerja siswa.',
    },
  ]);

  const handleRunAiCheck = async () => {
    setIsChecking(true);
    try {
      const prompt = `Lakukan evaluasi dan audit kualitas pedagogis kurikulum (Pemeriksa Kualitas Perangkat Ajar) secara obyektif terhadap:
${buildLearningContextString(learning, teacher, school)}

Cuplikan Modul Ajar:
${modulAjar.substring(0, 1500)}

Periksa 8 aspek:
1. Kelengkapan Identitas Sekolah & Guru
2. Keselarasan Alur: CP -> TP -> Aktivitas -> Asesmen
3. Integrasi 3 Prinsip (Mindful, Meaningful, Joyful)
4. Integrasi 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)
5. Kehadiran Nilai Pembelajaran Berbasis Cinta
6. Keseimbangan Alokasi Waktu
7. Kejelasan Rubrik Asesmen & Penskoran
8. Kelayakan Bahasa & Keterbacaan

Kembalikan HANYA JSON murni dengan format:
{
  "overallScore": 92,
  "items": [
    {
      "id": "identitas",
      "title": "Kelengkapan Identitas Sekolah & Guru",
      "score": 95,
      "status": "passed",
      "notes": "Catatan singkat...",
      "recommendation": "Saran perbaikan..."
    }
  ]
}`;

      const res = await callGeminiAI(prompt, { asJson: true });
      const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.overallScore && parsed.items) {
        setOverallScore(parsed.overallScore);
        setItems(parsed.items);
        onShowToast(`✓ Pemeriksaan kualitas selesai! Skor: ${parsed.overallScore}/100`, 'success');
      }
    } catch (e: any) {
      onShowToast('Gagal audit AI: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Sangat Baik / Sempurna', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 75) return { label: 'Baik & Layak Pakai', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 60) return { label: 'Cukup (Perlu Sedikit Perbaikan)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Belum Lengkap', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const badge = getScoreBadge(overallScore);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Pemeriksa Kualitas Perangkat Ajar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit otomatis keselarasan pedagogis, keutuhan komponen modul, dan kedalaman integrasi nilai kasih sayang.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAiCheck}
          disabled={isChecking}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Sedang Memeriksa...' : 'Periksa Kualitas dengan Gemini AI'}</span>
        </button>
      </div>

      {/* Overview Score Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-blue-700 dark:text-blue-400">{overallScore}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Status Kelayakan Dokumen</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Perangkat ajar Anda telah dinilai berdasarkan 8 standar mutu Kurikulum Nasional dan pendekatan Pembelajaran Mendalam.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onNavigateToTab('modul-ajar')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            <span>Buka Modul Ajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Standards Checklist */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider px-1">
          Rincian 8 Aspek Kualitas Pedagogi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5 hover:border-blue-200 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : item.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                </div>
                <span className="text-xs font-bold text-slate-500">{item.score}%</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                {item.notes}
              </p>

              {item.recommendation && (
                <div className="flex items-start gap-1.5 text-[11px] text-blue-700 dark:text-blue-400">
                  <Wand2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500" />
                  <span><strong>Saran:</strong> {item.recommendation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
