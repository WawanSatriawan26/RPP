import React, { useState } from 'react';
import {
  FolderClosed,
  FileDown,
  Search,
  ExternalLink,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { NavigationTab } from '../types';

interface DocumentItem {
  id: NavigationTab;
  title: string;
  category: string;
  isComplete: boolean;
  summary: string;
}

interface MyDocumentsViewProps {
  documents: DocumentItem[];
  onOpenDocument: (tab: NavigationTab) => void;
  onExportSingleDocx: (tab: NavigationTab) => void;
  onExportAllDocx: () => void;
}

export const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({
  documents,
  onOpenDocument,
  onExportSingleDocx,
  onExportAllDocx,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Perencanaan', 'Perangkat Ajar', 'Administrasi'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderClosed className="w-5 h-5 text-blue-600" />
            Dokumen Saya & Manajemen Berkas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar 10 berkas perangkat pembelajaran yang telah tersimpan di browser secara lokal.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportAllDocx}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Semua Dokumen (.docx)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama berkas perangkat atau topik..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {c === 'all' ? 'Semua Berkas' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc, idx) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 dark:hover:border-blue-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {doc.category}
                </span>
                {doc.isComplete ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Lengkap
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Draf
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {doc.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDocument(doc.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                <span>Buka & Edit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onExportSingleDocx(doc.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition"
                title="Export berkas ini ke Word"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Word</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
