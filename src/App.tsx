import React, { useState, useEffect, useRef } from 'react';
import {
  TeacherProfile,
  SchoolIdentity,
  LearningData,
  AlokasiWaktuData,
  AnalisisCpAtpRow,
  AtpRow,
  ProtaRow,
  PromesRow,
  JurnalRow,
  GeminiSettings,
  NavigationTab,
} from './types';
import {
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_SCHOOL_IDENTITY,
  DEFAULT_LEARNING_DATA,
  DEFAULT_ALOKASI_WAKTU,
  DEFAULT_ANALISIS_CP_ATP,
  DEFAULT_ATP_ROWS,
  DEFAULT_PROTA_ROWS,
  DEFAULT_PROMES_ROWS,
  DEFAULT_JURNAL_ROWS,
  DEFAULT_GEMINI_SETTINGS,
} from './data/defaults';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  exportAppStateBackup,
  importAppStateBackup,
} from './services/storageService';
import { exportAllDevicesCombined, exportSingleDocx } from './services/docxExportService';
import { downloadStandaloneHtml } from './services/standaloneGenerator';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { GeminiSettingsModal } from './components/GeminiSettingsModal';
import { DashboardView } from './components/DashboardView';
import { TeacherProfileView } from './components/TeacherProfileView';
import { SchoolIdentityView } from './components/SchoolIdentityView';
import { LearningDataView } from './components/LearningDataView';
import { TimeAllocationView } from './components/TimeAllocationView';
import { CpAtpAnalysisView } from './components/CpAtpAnalysisView';
import { CpView } from './components/CpView';
import { AtpView } from './components/AtpView';
import { TeachingMaterialView } from './components/TeachingMaterialView';
import { ModulAjarView } from './components/ModulAjarView';
import { LkpdView } from './components/LkpdView';
import { AssessmentView } from './components/AssessmentView';
import { JournalView } from './components/JournalView';
import { ProtaView } from './components/ProtaView';
import { PromesView } from './components/PromesView';
import { AiGeneratorView } from './components/AiGeneratorView';
import { QualityCheckView } from './components/QualityCheckView';
import { TeacherAssistantView } from './components/TeacherAssistantView';
import { MyDocumentsView } from './components/MyDocumentsView';
import { AboutAppView } from './components/AboutAppView';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return loadFromLocalStorage<'light' | 'dark'>('theme_mode', 'light');
  });
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Hidden file input for importing JSON backup
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Data States with LocalStorage Persistence
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() =>
    loadFromLocalStorage<TeacherProfile>('teacher_profile', DEFAULT_TEACHER_PROFILE)
  );

  const [schoolIdentity, setSchoolIdentity] = useState<SchoolIdentity>(() =>
    loadFromLocalStorage<SchoolIdentity>('school_identity', DEFAULT_SCHOOL_IDENTITY)
  );

  const [learningData, setLearningData] = useState<LearningData>(() =>
    loadFromLocalStorage<LearningData>('learning_data', DEFAULT_LEARNING_DATA)
  );

  const [alokasiWaktuData, setAlokasiWaktuData] = useState<AlokasiWaktuData>(() =>
    loadFromLocalStorage<AlokasiWaktuData>('alokasi_waktu', DEFAULT_ALOKASI_WAKTU)
  );

  const [analisisCpAtpData, setAnalisisCpAtpData] = useState<AnalisisCpAtpRow[]>(() =>
    loadFromLocalStorage<AnalisisCpAtpRow[]>('analisis_cp_atp', DEFAULT_ANALISIS_CP_ATP)
  );

  const [cpContent, setCpContent] = useState<string>(() =>
    loadFromLocalStorage<string>('cp_content', '')
  );

  const [atpRows, setAtpRows] = useState<AtpRow[]>(() =>
    loadFromLocalStorage<AtpRow[]>('atp_rows', DEFAULT_ATP_ROWS)
  );

  const [bahanAjarContent, setBahanAjarContent] = useState<string>(() =>
    loadFromLocalStorage<string>('bahan_ajar_content', '')
  );

  const [modulAjarContent, setModulAjarContent] = useState<string>(() =>
    loadFromLocalStorage<string>('modul_ajar_content', '')
  );

  const [lkpdContent, setLkpdContent] = useState<string>(() =>
    loadFromLocalStorage<string>('lkpd_content', '')
  );

  const [asesmenContent, setAsesmenContent] = useState<string>(() =>
    loadFromLocalStorage<string>('asesmen_content', '')
  );

  const [jurnalRows, setJurnalRows] = useState<JurnalRow[]>(() =>
    loadFromLocalStorage<JurnalRow[]>('jurnal_rows', DEFAULT_JURNAL_ROWS)
  );

  const [protaRows, setProtaRows] = useState<ProtaRow[]>(() =>
    loadFromLocalStorage<ProtaRow[]>('prota_rows', DEFAULT_PROTA_ROWS)
  );

  const [promesRows, setPromesRows] = useState<PromesRow[]>(() =>
    loadFromLocalStorage<PromesRow[]>('promes_rows', DEFAULT_PROMES_ROWS)
  );

  const [geminiSettings, setGeminiSettings] = useState<GeminiSettings>(() =>
    loadFromLocalStorage<GeminiSettings>('gemini_settings', DEFAULT_GEMINI_SETTINGS)
  );

  // Sync Theme with HTML Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveToLocalStorage('theme_mode', theme);
  }, [theme]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // State Save Handlers
  const handleSaveTeacher = (updated: TeacherProfile) => {
    setTeacherProfile(updated);
    saveToLocalStorage('teacher_profile', updated);
  };

  const handleSaveSchool = (updated: SchoolIdentity) => {
    setSchoolIdentity(updated);
    saveToLocalStorage('school_identity', updated);
  };

  const handleSaveLearning = (updated: LearningData) => {
    setLearningData(updated);
    saveToLocalStorage('learning_data', updated);
  };

  const handleSaveAlokasi = (updated: AlokasiWaktuData) => {
    setAlokasiWaktuData(updated);
    saveToLocalStorage('alokasi_waktu', updated);
  };

  const handleSaveAnalisisCpAtp = (updated: AnalisisCpAtpRow[]) => {
    setAnalisisCpAtpData(updated);
    saveToLocalStorage('analisis_cp_atp', updated);
  };

  const handleSaveCp = (content: string) => {
    setCpContent(content);
    saveToLocalStorage('cp_content', content);
  };

  const handleSaveAtp = (rows: AtpRow[]) => {
    setAtpRows(rows);
    saveToLocalStorage('atp_rows', rows);
  };

  const handleSaveBahanAjar = (content: string) => {
    setBahanAjarContent(content);
    saveToLocalStorage('bahan_ajar_content', content);
  };

  const handleSaveModulAjar = (content: string) => {
    setModulAjarContent(content);
    saveToLocalStorage('modul_ajar_content', content);
  };

  const handleSaveLkpd = (content: string) => {
    setLkpdContent(content);
    saveToLocalStorage('lkpd_content', content);
  };

  const handleSaveAsesmen = (content: string) => {
    setAsesmenContent(content);
    saveToLocalStorage('asesmen_content', content);
  };

  const handleSaveJurnal = (rows: JurnalRow[]) => {
    setJurnalRows(rows);
    saveToLocalStorage('jurnal_rows', rows);
  };

  const handleSaveProta = (rows: ProtaRow[]) => {
    setProtaRows(rows);
    saveToLocalStorage('prota_rows', rows);
  };

  const handleSavePromes = (rows: PromesRow[]) => {
    setPromesRows(rows);
    saveToLocalStorage('promes_rows', rows);
  };

  const handleSaveGeminiSettings = (settings: GeminiSettings) => {
    setGeminiSettings(settings);
    saveToLocalStorage('gemini_settings', settings);
  };

  // Completion calculation
  const docStatuses: { id: NavigationTab; title: string; category: string; isComplete: boolean; summary: string }[] = [
    {
      id: 'alokasi-waktu',
      title: 'Analisis Alokasi Waktu',
      category: 'Perencanaan',
      isComplete: alokasiWaktuData.totalJpEfektif > 0,
      summary: 'Perhitungan rincian minggu efektif semester dan total jam pelajaran mengajar.',
    },
    {
      id: 'analisis-cp-atp',
      title: 'Analisis CP & ATP',
      category: 'Perencanaan',
      isComplete: analisisCpAtpData.length > 0,
      summary: 'Analisis kompetensi dan konten esensial capaian pembelajaran.',
    },
    {
      id: 'cp',
      title: 'Capaian Pembelajaran (CP)',
      category: 'Perencanaan',
      isComplete: cpContent.trim().length > 100,
      summary: 'Teks utuh capaian pembelajaran fase dan elemen mata pelajaran.',
    },
    {
      id: 'atp',
      title: 'Alur Tujuan Pembelajaran (ATP)',
      category: 'Perencanaan',
      isComplete: atpRows.length > 0,
      summary: 'Alur kronologis tujuan pembelajaran, aktivitas, alokasi JP, dan asesmen.',
    },
    {
      id: 'bahan-ajar',
      title: 'Bahan Ajar Kontekstual',
      category: 'Perangkat Ajar',
      isComplete: bahanAjarContent.trim().length > 150,
      summary: 'Materi belajar bermakna dengan pengantar pemantik, studi kasus, dan refleksi.',
    },
    {
      id: 'modul-ajar',
      title: 'Modul Ajar / RPP Lengkap',
      category: 'Perangkat Ajar',
      isComplete: modulAjarContent.trim().length > 200,
      summary: 'Modul ajar lengkap berbasis Pembelajaran Mendalam (Mindful, Meaningful, Joyful).',
    },
    {
      id: 'lkpd',
      title: 'Lembar Kerja Peserta Didik (LKPD)',
      category: 'Perangkat Ajar',
      isComplete: lkpdContent.trim().length > 150,
      summary: 'Lembar kerja kelompok & individu terstruktur dengan tabel pengamatan dan rubrik.',
    },
    {
      id: 'asesmen',
      title: 'Asesmen & Kisi-Kisi Soal',
      category: 'Perangkat Ajar',
      isComplete: asesmenContent.trim().length > 150,
      summary: 'Kisi-kisi soal, naskah asesmen HOTS kontekstual, rubrik dan kunci jawaban.',
    },
    {
      id: 'jurnal',
      title: 'Jurnal Mengajar Guru',
      category: 'Administrasi',
      isComplete: jurnalRows.length > 0,
      summary: 'Agenda catatan harian proses pembelajaran, hambatan, dan refleksi cinta.',
    },
    {
      id: 'prota',
      title: 'Program Tahunan (PROTA)',
      category: 'Administrasi',
      isComplete: protaRows.length > 0,
      summary: 'Distribusi jam pelajaran selama satu tahun ajaran penuh (Semester 1 & 2).',
    },
    {
      id: 'promes',
      title: 'Program Semester (PROMES)',
      category: 'Administrasi',
      isComplete: promesRows.length > 0,
      summary: 'Matriks pembagian materi dan minggu efektif mengajar per bulan.',
    },
  ];

  const completedCount = docStatuses.filter((d) => d.isComplete).length;
  const completionPercentage = Math.round((completedCount / docStatuses.length) * 100);

  // Bulk Export All to Word
  const handleExportAllDocx = async () => {
    try {
      await exportAllDevicesCombined(teacherProfile, schoolIdentity, learningData, [
        {
          title: 'ANALISIS ALOKASI WAKTU',
          tables: [
            {
              headers: ['No', 'Bulan', 'Minggu Total', 'Minggu Efektif', 'Keterangan'],
              rows: alokasiWaktuData.semester1.map((b) => [
                b.no.toString(),
                b.bulan,
                b.totalMinggu.toString(),
                b.mingguEfektif.toString(),
                b.keterangan || '-',
              ]),
            },
          ],
        },
        {
          title: 'ANALISIS CAPAIAN PEMBELAJARAN & ATP',
          tables: [
            {
              headers: ['No', 'Komponen', 'Hasil Analisis', 'Rekomendasi'],
              rows: analisisCpAtpData.map((r) => [r.no.toString(), r.komponen, r.hasilAnalisis, r.rekomendasi]),
            },
          ],
        },
        { title: 'CAPAIAN PEMBELAJARAN (CP)', contentHtml: cpContent },
        {
          title: 'ALUR TUJUAN PEMBELAJARAN (ATP)',
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
        { title: 'BAHAN AJAR', contentHtml: bahanAjarContent },
        { title: 'MODUL AJAR', contentHtml: modulAjarContent },
        { title: 'LEMBAR KERJA PESERTA DIDIK (LKPD)', contentHtml: lkpdContent },
        { title: 'ASESMEN PEMBELAJARAN', contentHtml: asesmenContent },
        {
          title: 'JURNAL MENGAJAR GURU',
          tables: [
            {
              headers: ['No', 'Hari/Tanggal', 'Pert.', 'Kelas', 'Materi', 'Aktivitas', 'Catatan', 'Refleksi'],
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
        {
          title: 'PROGRAM TAHUNAN (PROTA)',
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
      ]);
      showToast('✓ Berhasil mengekspor 10 Perangkat Ajar Lengkap ke Microsoft Word (.docx)!', 'success');
    } catch (e: any) {
      showToast('Gagal ekspor dokumen: ' + (e?.message || 'Error'), 'error');
    }
  };

  // Export Single Document from My Documents
  const handleExportSingleDocxFromList = async (tab: NavigationTab) => {
    try {
      if (tab === 'cp') {
        await exportSingleDocx({
          title: `CAPAIAN PEMBELAJARAN (CP) - FASE ${learningData.fase}`,
          teacher: teacherProfile,
          school: schoolIdentity,
          learning: learningData,
          contentHtml: cpContent,
          fileName: `CP_${learningData.mataPelajaran.replace(/\s+/g, '_')}.docx`,
        });
      } else if (tab === 'modul-ajar') {
        await exportSingleDocx({
          title: `MODUL AJAR: ${learningData.materiTopik.toUpperCase()}`,
          teacher: teacherProfile,
          school: schoolIdentity,
          learning: learningData,
          contentHtml: modulAjarContent,
          fileName: `Modul_Ajar_${learningData.materiTopik.replace(/\s+/g, '_')}.docx`,
        });
      } else if (tab === 'bahan-ajar') {
        await exportSingleDocx({
          title: `BAHAN AJAR: ${learningData.materiTopik.toUpperCase()}`,
          teacher: teacherProfile,
          school: schoolIdentity,
          learning: learningData,
          contentHtml: bahanAjarContent,
          fileName: `Bahan_Ajar_${learningData.materiTopik.replace(/\s+/g, '_')}.docx`,
        });
      } else if (tab === 'lkpd') {
        await exportSingleDocx({
          title: `LEMBAR KERJA PESERTA DIDIK (LKPD)`,
          teacher: teacherProfile,
          school: schoolIdentity,
          learning: learningData,
          contentHtml: lkpdContent,
          fileName: `LKPD_${learningData.materiTopik.replace(/\s+/g, '_')}.docx`,
        });
      } else if (tab === 'asesmen') {
        await exportSingleDocx({
          title: `ASESMEN PEMBELAJARAN`,
          teacher: teacherProfile,
          school: schoolIdentity,
          learning: learningData,
          contentHtml: asesmenContent,
          fileName: `Asesmen_${learningData.materiTopik.replace(/\s+/g, '_')}.docx`,
        });
      } else {
        handleExportAllDocx();
        return;
      }
      showToast('✓ Berkas berhasil diexport ke Word (.docx)!', 'success');
    } catch (e: any) {
      showToast('Gagal ekspor: ' + (e?.message || 'Error'), 'error');
    }
  };

  // Standalone HTML Download
  const handleDownloadStandalone = () => {
    try {
      downloadStandaloneHtml(teacherProfile, schoolIdentity, learningData);
      showToast('✓ Berkas HTML aplikasi portabel berhasil diunduh!', 'success');
    } catch (e: any) {
      showToast('Gagal unduh file HTML: ' + (e?.message || 'Error'), 'error');
    }
  };

  // Backup JSON
  const handleBackupJson = () => {
    exportAppStateBackup();
    showToast('✓ Cadangan data (.json) berhasil diunduh!', 'success');
  };

  // Import JSON trigger
  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await importAppStateBackup(file);
    if (success) {
      showToast('✓ Data berhasil dipulihkan dari berkas cadangan! Memuat ulang...', 'success');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('Gagal memulihkan cadangan: format JSON tidak valid', 'error');
    }
  };

  // Sidebar navigation handler
  const handleSelectTab = (tab: NavigationTab) => {
    if (tab === 'pengaturan-gemini') {
      setIsGeminiModalOpen(true);
      return;
    }
    if (tab === 'backup-data') {
      handleBackupJson();
      return;
    }
    if (tab === 'import-data') {
      handleTriggerImport();
      return;
    }
    if (tab === 'export-word') {
      handleExportAllDocx();
      return;
    }
    if (tab === 'pengaturan-tampilan') {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      showToast(`Tema diganti ke mode ${theme === 'light' ? 'Gelap' : 'Terang'}`, 'info');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Hidden File Input for JSON restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Main Top Header */}
      <Header
        teacher={teacherProfile}
        school={schoolIdentity}
        gemini={geminiSettings}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        onOpenGeminiSettings={() => setIsGeminiModalOpen(true)}
        onOpenQuickGenerate={() => setActiveTab('ai-generator')}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab === 'ai-generator' ? ('generator-ai' as any) : activeTab}
          onSelectTab={(tab) => {
            if (tab === ('generator-ai' as any)) {
              setActiveTab('ai-generator');
            } else {
              handleSelectTab(tab);
            }
          }}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          completionPercentage={completionPercentage}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              completionPercent={completionPercentage}
              docStatuses={docStatuses}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onExportAllDocx={handleExportAllDocx}
              onDownloadPortableHtml={handleDownloadStandalone}
            />
          )}

          {activeTab === 'profil-guru' && (
            <TeacherProfileView
              profile={teacherProfile}
              onSave={handleSaveTeacher}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'identitas-sekolah' && (
            <SchoolIdentityView
              school={schoolIdentity}
              onSave={handleSaveSchool}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'data-pembelajaran' && (
            <LearningDataView
              data={learningData}
              onSave={handleSaveLearning}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'alokasi-waktu' && (
            <TimeAllocationView
              data={alokasiWaktuData}
              onSave={handleSaveAlokasi}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'analisis-cp-atp' && (
            <CpAtpAnalysisView
              data={analisisCpAtpData}
              onSave={handleSaveAnalisisCpAtp}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'cp' && (
            <CpView
              content={cpContent}
              onSave={handleSaveCp}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'atp' && (
            <AtpView
              rows={atpRows}
              onSave={handleSaveAtp}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'bahan-ajar' && (
            <TeachingMaterialView
              content={bahanAjarContent}
              onSave={handleSaveBahanAjar}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'modul-ajar' && (
            <ModulAjarView
              content={modulAjarContent}
              onSave={handleSaveModulAjar}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'lkpd' && (
            <LkpdView
              content={lkpdContent}
              onSave={handleSaveLkpd}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'asesmen' && (
            <AssessmentView
              content={asesmenContent}
              onSave={handleSaveAsesmen}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'jurnal' && (
            <JournalView
              rows={jurnalRows}
              onSave={handleSaveJurnal}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'prota' && (
            <ProtaView
              rows={protaRows}
              onSave={handleSaveProta}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'promes' && (
            <PromesView
              rows={promesRows}
              onSave={handleSavePromes}
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'ai-generator' && (
            <AiGeneratorView
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              alokasi={alokasiWaktuData}
              cpContent={cpContent}
              atpRows={atpRows}
              bahanAjar={bahanAjarContent}
              modulAjar={modulAjarContent}
              lkpd={lkpdContent}
              asesmen={asesmenContent}
              jurnalRows={jurnalRows}
              protaRows={protaRows}
              promesRows={promesRows}
              onUpdateAlokasi={handleSaveAlokasi}
              onUpdateCp={handleSaveCp}
              onUpdateAtp={handleSaveAtp}
              onUpdateBahanAjar={handleSaveBahanAjar}
              onUpdateModulAjar={handleSaveModulAjar}
              onUpdateLkpd={handleSaveLkpd}
              onUpdateAsesmen={handleSaveAsesmen}
              onUpdateJurnal={handleSaveJurnal}
              onUpdateProta={handleSaveProta}
              onUpdatePromes={handleSavePromes}
              onShowToast={showToast}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'asisten-guru' && (
            <TeacherAssistantView
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'quality-check' && (
            <QualityCheckView
              teacher={teacherProfile}
              school={schoolIdentity}
              learning={learningData}
              cpContent={cpContent}
              modulAjar={modulAjarContent}
              lkpd={lkpdContent}
              asesmen={asesmenContent}
              onShowToast={showToast}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'dokumen-saya' && (
            <MyDocumentsView
              documents={docStatuses}
              onOpenDocument={(tab) => setActiveTab(tab)}
              onExportSingleDocx={handleExportSingleDocxFromList}
              onExportAllDocx={handleExportAllDocx}
            />
          )}

          {activeTab === 'tentang-aplikasi' && (
            <AboutAppView onDownloadStandaloneHtml={handleDownloadStandalone} />
          )}
        </main>
      </div>

      {/* Gemini Settings Modal */}
      <GeminiSettingsModal
        isOpen={isGeminiModalOpen}
        settings={geminiSettings}
        onClose={() => setIsGeminiModalOpen(false)}
        onSave={(updated) => {
          handleSaveGeminiSettings(updated);
        }}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
