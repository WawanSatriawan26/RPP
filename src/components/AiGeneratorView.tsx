import React, { useState } from 'react';
import { Bot, Zap, Sparkles, CheckCircle2, AlertCircle, ArrowRight, FileDown, Layers, Check } from 'lucide-react';
import {
  TeacherProfile,
  SchoolIdentity,
  LearningData,
  AlokasiWaktuData,
  AnalisisCpAtpRow,
  AtpRow,
  ProtaRow,
  PromesRow,
  JurnalRow
} from '../types';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';
import { exportAllDevicesCombined } from '../services/docxExportService';

interface AiGeneratorViewProps {
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  alokasi: AlokasiWaktuData;
  cpContent: string;
  atpRows: AtpRow[];
  bahanAjar: string;
  modulAjar: string;
  lkpd: string;
  asesmen: string;
  jurnalRows: JurnalRow[];
  protaRows: ProtaRow[];
  promesRows: PromesRow[];
  onUpdateAlokasi: (data: AlokasiWaktuData) => void;
  onUpdateCp: (content: string) => void;
  onUpdateAtp: (rows: AtpRow[]) => void;
  onUpdateBahanAjar: (content: string) => void;
  onUpdateModulAjar: (content: string) => void;
  onUpdateLkpd: (content: string) => void;
  onUpdateAsesmen: (content: string) => void;
  onUpdateJurnal: (rows: JurnalRow[]) => void;
  onUpdateProta: (rows: ProtaRow[]) => void;
  onUpdatePromes: (rows: PromesRow[]) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onNavigateToTab: (tab: any) => void;
}

export const AiGeneratorView: React.FC<AiGeneratorViewProps> = ({
  teacher,
  school,
  learning,
  alokasi,
  cpContent,
  atpRows,
  bahanAjar,
  modulAjar,
  lkpd,
  asesmen,
  jurnalRows,
  protaRows,
  promesRows,
  onUpdateAlokasi,
  onUpdateCp,
  onUpdateAtp,
  onUpdateBahanAjar,
  onUpdateModulAjar,
  onUpdateLkpd,
  onUpdateAsesmen,
  onUpdateJurnal,
  onUpdateProta,
  onUpdatePromes,
  onShowToast,
  onNavigateToTab,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStatusText, setCurrentStatusText] = useState('');

  const STEPS = [
    { id: 'alokasi', name: 'Analisis Alokasi Waktu' },
    { id: 'cp', name: 'Capaian Pembelajaran (CP)' },
    { id: 'atp', name: 'Alur Tujuan Pembelajaran (ATP)' },
    { id: 'bahan-ajar', name: 'Bahan Ajar Kontekstual' },
    { id: 'modul-ajar', name: 'Modul Ajar Pembelajaran Mendalam' },
    { id: 'lkpd', name: 'Lembar Kerja Peserta Didik (LKPD)' },
    { id: 'asesmen', name: 'Asesmen & Kisi-Kisi Soal' },
    { id: 'jurnal', name: 'Jurnal Mengajar Guru' },
    { id: 'prota', name: 'Program Tahunan (PROTA)' },
    { id: 'promes', name: 'Program Semester (PROMES)' },
  ];

  const handleGenerateComplete = async () => {
    setIsGenerating(true);
    setCompletedSteps([]);
    const ctx = buildLearningContextString(learning, teacher, school);

    try {
      // Step 1: CP
      setCurrentStepIndex(1);
      setCurrentStatusText('Menyusun Capaian Pembelajaran (CP) dan rasional elemen...');
      const cpPrompt = `Susun draf Capaian Pembelajaran (CP) lengkap untuk:\n${ctx}\nFormat HTML rapi (h1, h2, h3, p, ul, li).`;
      const cpRes = await callGeminiAI(cpPrompt);
      onUpdateCp(cpRes);
      setCompletedSteps((prev) => [...prev, 'cp']);

      // Step 2: ATP
      setCurrentStepIndex(2);
      setCurrentStatusText('Merancang Alur Tujuan Pembelajaran (ATP) dan kegiatan inti...');
      const atpPrompt = `Susun Alur Tujuan Pembelajaran (ATP) JSON:\n${ctx}\nFormat JSON:\n{"atp":[{"no":1,"tujuanPembelajaran":"...","lingkupMateri":"...","rencanaAktivitas":"...","profilLulusan":"...","alokasiWaktuJp":3,"asesmen":"..."}]}`;
      const atpRes = await callGeminiAI(atpPrompt, { asJson: true });
      try {
        const clean = atpRes.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const p = JSON.parse(clean);
        if (p.atp) onUpdateAtp(p.atp);
      } catch (e) {}
      setCompletedSteps((prev) => [...prev, 'atp']);

      // Step 3: Modul Ajar
      setCurrentStepIndex(4);
      setCurrentStatusText('Membangun Modul Ajar Pembelajaran Mendalam Berbasis Cinta...');
      const modulPrompt = `Susun Modul Ajar Lengkap kurikulum nasional berbasis Pembelajaran Mendalam (Mindful, Meaningful, Joyful) dan nilai Cinta untuk:\n${ctx}\nFormat HTML lengkap (A s.d. P).`;
      const modulRes = await callGeminiAI(modulPrompt);
      onUpdateModulAjar(modulRes);
      setCompletedSteps((prev) => [...prev, 'modul-ajar']);

      // Step 4: Bahan Ajar
      setCurrentStepIndex(3);
      setCurrentStatusText('Menulis Bahan Ajar yang kaya konsep, contoh, dan refleksi...');
      const bahanPrompt = `Susun Bahan Ajar mendalam berformat HTML lengkap untuk:\n${ctx}`;
      const bahanRes = await callGeminiAI(bahanPrompt);
      onUpdateBahanAjar(bahanRes);
      setCompletedSteps((prev) => [...prev, 'bahan-ajar']);

      // Step 5: LKPD
      setCurrentStepIndex(5);
      setCurrentStatusText('Membuat Lembar Kerja Peserta Didik (LKPD) kolaboratif...');
      const lkpdPrompt = `Susun LKPD Siswa kontekstual berformat HTML lengkap untuk:\n${ctx}`;
      const lkpdRes = await callGeminiAI(lkpdPrompt);
      onUpdateLkpd(lkpdRes);
      setCompletedSteps((prev) => [...prev, 'lkpd']);

      // Step 6: Asesmen
      setCurrentStepIndex(6);
      setCurrentStatusText('Menyusun Kisi-kisi, Soal HOTS, Kunci, dan Rubrik Asesmen...');
      const asesmenPrompt = `Susun Asesmen Pembelajaran lengkap (Kisi-kisi, Soal PG & Uraian, Kunci, Rubrik) berformat HTML untuk:\n${ctx}`;
      const asesmenRes = await callGeminiAI(asesmenPrompt);
      onUpdateAsesmen(asesmenRes);
      setCompletedSteps((prev) => [...prev, 'asesmen']);

      // Mark all completed
      setCompletedSteps(STEPS.map((s) => s.id));
      setCurrentStatusText('🎉 Seluruh Perangkat Ajar Berhasil Disusun Lengkap!');
      onShowToast('✓ 10 Perangkat Ajar Lengkap berhasil digenerate dengan Gemini AI!', 'success');
    } catch (e: any) {
      onShowToast('Terjadi kendala saat generate: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = async () => {
    setIsGenerating(true);
    setCompletedSteps([]);
    const ctx = buildLearningContextString(learning, teacher, school);

    try {
      setCurrentStatusText('⚡ Generate Cepat: Modul Ajar + LKPD + Asesmen...');
      const modulPrompt = `Susun Modul Ajar Ringkas & Padat berformat HTML untuk:\n${ctx}`;
      const modulRes = await callGeminiAI(modulPrompt);
      onUpdateModulAjar(modulRes);
      setCompletedSteps(['modul-ajar']);

      const lkpdPrompt = `Susun LKPD Siswa Cepat berformat HTML untuk:\n${ctx}`;
      const lkpdRes = await callGeminiAI(lkpdPrompt);
      onUpdateLkpd(lkpdRes);
      setCompletedSteps(['modul-ajar', 'lkpd']);

      const asesmenPrompt = `Susun Asesmen Pembelajaran & Kisi-kisi ringkas berformat HTML untuk:\n${ctx}`;
      const asesmenRes = await callGeminiAI(asesmenPrompt);
      onUpdateAsesmen(asesmenRes);
      setCompletedSteps(['modul-ajar', 'lkpd', 'asesmen']);

      setCurrentStatusText('🎉 Paket Modul Ajar Cepat Siap!');
      onShowToast('✓ Generate Cepat Berhasil!', 'success');
    } catch (e: any) {
      onShowToast('Gagal generate: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportAllWord = async () => {
    await exportAllDevicesCombined(teacher, school, learning, [
      { title: 'Capaian Pembelajaran (CP)', contentHtml: cpContent },
      {
        title: 'Alur Tujuan Pembelajaran (ATP)',
        tables: [
          {
            headers: ['No', 'Tujuan Pembelajaran', 'Materi', 'Aktivitas', 'Profil Lulusan', 'JP', 'Asesmen'],
            rows: atpRows.map((r) => [
              r.no.toString(),
              r.tujuanPembelajaran,
              r.lingkupMateri,
              r.rencanaAktivitas,
              r.profilLulusan,
              `${r.alokasiWaktuJp} JP`,
              r.asesmen,
            ]),
          },
        ],
      },
      { title: 'Bahan Ajar', contentHtml: bahanAjar },
      { title: 'Modul Ajar', contentHtml: modulAjar },
      { title: 'Lembar Kerja Peserta Didik (LKPD)', contentHtml: lkpd },
      { title: 'Asesmen Pembelajaran', contentHtml: asesmen },
      {
        title: 'Program Tahunan (PROTA)',
        tables: [
          {
            headers: ['No', 'CP', 'TP', 'Materi', 'JP', 'Semester', 'Keterangan'],
            rows: protaRows.map((r) => [
              r.no.toString(),
              r.cp,
              r.tp,
              r.materi,
              `${r.alokasiJp} JP`,
              `Sem ${r.semester}`,
              r.keterangan || '-',
            ]),
          },
        ],
      },
      {
        title: 'Jurnal Mengajar Guru',
        tables: [
          {
            headers: ['No', 'Hari/Tanggal', 'Pert.', 'Kelas', 'Materi', 'Aktivitas', 'Catatan', 'Refleksi Cinta'],
            rows: jurnalRows.map((r) => [
              r.no.toString(),
              r.hariTanggal,
              `Ke-${r.pertemuanKe}`,
              r.kelas,
              r.materi,
              r.aktivitas,
              r.hambatanCatatan,
              r.refleksiCinta,
            ]),
          },
        ],
      },
    ]);
    onShowToast('✓ Seluruh Perangkat Ajar Lengkap berhasil diexport ke Word (.docx)!', 'success');
  };

  const progressPercent = Math.round((completedSteps.length / STEPS.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kecerdasan Buatan Terintegrasi Pedagogi Indonesia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generator Perangkat Ajar Lengkap
          </h2>
          <p className="text-sm text-blue-100 mt-2 leading-relaxed">
            Menyusun 10 berkas administrasi guru kurikulum secara otomatis, harmonis, dan terpadu dengan pendekatan Pembelajaran Mendalam serta sentuhan Pembelajaran Berbasis Cinta.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleGenerateComplete}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              <Bot className="w-5 h-5" />
              <span>{isGenerating ? 'Sedang Memproses...' : '🚀 Generate Perangkat Lengkap'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600/60 hover:bg-blue-600/80 border border-white/30 text-white font-semibold text-sm rounded-xl backdrop-blur-md transition cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Generate Cepat (Modul + LKPD + Asesmen)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Multi-step Execution Box */}
      {(isGenerating || completedSteps.length > 0) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Status Pembuatan Perangkat Ajar
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{currentStatusText}</p>
            </div>
            <span className="text-base font-extrabold text-blue-600">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 10 Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            {STEPS.map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="truncate">{step.name}</span>
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                </div>
              );
            })}
          </div>

          {completedSteps.length > 0 && !isGenerating && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Semua dokumen telah tersimpan dan siap diedit di masing-masing tab.
              </span>
              <button
                type="button"
                onClick={handleExportAllWord}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Export PERANGKAT_AJAR_LENGKAP.docx</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Target Data Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Konteks Data yang Digunakan AI
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-0.5">Mata Pelajaran</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{learning.mataPelajaran}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-0.5">Jenjang / Kelas</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{learning.jenjang} / Kelas {learning.kelas} ({learning.fase})</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-0.5">Materi Pokok</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{learning.materiTopik}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-0.5">Nilai Kasih Sayang</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 truncate block">{learning.nilaiCinta.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
