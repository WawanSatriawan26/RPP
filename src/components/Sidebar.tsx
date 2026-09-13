import React from 'react';
import {
  LayoutDashboard,
  User,
  School,
  BookOpen,
  Clock,
  GitMerge,
  Target,
  FileText,
  BookMarked,
  ClipboardList,
  CheckSquare,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Bot,
  MessageSquare,
  ShieldCheck,
  FolderClosed,
  FileDown,
  DownloadCloud,
  UploadCloud,
  Settings,
  Palette,
  Info,
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';

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

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  completionPercentage: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  completionPercentage,
}) => {
  const menuGroups = [
    {
      group: 'DASHBOARD',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'DATA GURU',
      items: [
        { id: 'profil-guru', label: 'Profil Pembuat', icon: User },
        { id: 'identitas-sekolah', label: 'Identitas Sekolah', icon: School },
      ],
    },
    {
      group: 'PERENCANAAN PEMBELAJARAN',
      items: [
        { id: 'data-pembelajaran', label: 'Data Pembelajaran', icon: BookOpen },
        { id: 'alokasi-waktu', label: 'Analisis Alokasi Waktu', icon: Clock },
        { id: 'analisis-cp-atp', label: 'Analisis CP & ATP', icon: GitMerge },
        { id: 'cp', label: 'Capaian Pembelajaran (CP)', icon: Target },
        { id: 'atp', label: 'Alur Tujuan Pembelajaran (ATP)', icon: FileText },
      ],
    },
    {
      group: 'PERANGKAT AJAR',
      items: [
        { id: 'bahan-ajar', label: 'Bahan Ajar', icon: BookMarked },
        { id: 'modul-ajar', label: 'Modul Ajar / RPP', icon: FileText, highlight: true },
        { id: 'lkpd', label: 'LKPD Siswa', icon: ClipboardList },
        { id: 'asesmen', label: 'Asesmen Pembelajaran', icon: CheckSquare },
        { id: 'jurnal', label: 'Jurnal Mengajar Guru', icon: CalendarCheck },
        { id: 'prota', label: 'Program Tahunan (PROTA)', icon: CalendarDays },
        { id: 'promes', label: 'Program Semester (PROMES)', icon: CalendarRange },
      ],
    },
    {
      group: 'AI PEDAGOGI',
      items: [
        { id: 'generator-ai', label: 'Generator AI (Lengkap)', icon: Bot, special: true },
        { id: 'asisten-guru', label: 'Asisten Guru Gemini', icon: MessageSquare },
        { id: 'quality-check', label: 'Pemeriksa Kualitas', icon: ShieldCheck },
      ],
    },
    {
      group: 'DOKUMEN & ARSIP',
      items: [
        { id: 'dokumen-saya', label: 'Dokumen Saya', icon: FolderClosed },
        { id: 'export-word', label: 'Export Word (.docx)', icon: FileDown },
        { id: 'backup-data', label: 'Backup Data (.json)', icon: DownloadCloud },
        { id: 'import-data', label: 'Import Data (.json)', icon: UploadCloud },
      ],
    },
    {
      group: 'PENGATURAN',
      items: [
        { id: 'pengaturan-gemini', label: 'Pengaturan Gemini AI', icon: Settings },
        { id: 'pengaturan-tampilan', label: 'Tampilan & Tema', icon: Palette },
        { id: 'tentang-aplikasi', label: 'Tentang Aplikasi', icon: Info },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Banner */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Panel Perangkat Ajar
              </div>
              <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                Pembelajaran Mendalam
              </div>
            </div>
          </div>
        </div>

        {/* Completion Indicator Card */}
        <div className="p-3 mx-3 mt-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-700 dark:text-slate-300">Kelengkapan Berkas</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Menu Navigation Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-sm">
          {menuGroups.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id as NavigationTab);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : item.special
                          ? 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? 'text-white'
                              : item.special
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.special && !isActive && (
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kurikulum Nasional Indonesia &bull; v1.0
          </p>
        </div>
      </aside>
    </>
  );
};
