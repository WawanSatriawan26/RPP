import React, { useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Printer,
  FileDown,
  Copy,
  Check
} from 'lucide-react';

interface RichDocumentEditorProps {
  title: string;
  value: string;
  onChange: (newHtml: string) => void;
  onExportDocx?: () => void;
  readOnly?: boolean;
}

export const RichDocumentEditor: React.FC<RichDocumentEditorProps> = ({
  title,
  value,
  onChange,
  onExportDocx,
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertTable = () => {
    const rows = prompt('Masukkan jumlah baris tabel:', '3');
    const cols = prompt('Masukkan jumlah kolom tabel:', '3');
    if (!rows || !cols) return;

    let tableHtml = '<table class="w-full border-collapse border border-slate-400 my-4 text-xs font-doc">';
    for (let r = 0; r < parseInt(rows); r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < parseInt(cols); c++) {
        if (r === 0) {
          tableHtml += '<th class="border border-slate-400 p-2 bg-slate-100 font-bold text-center">Judul Kolom</th>';
        } else {
          tableHtml += '<td class="border border-slate-400 p-2">Isi data...</td>';
        }
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table><p></p>';
    executeCommand('insertHTML', tableHtml);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Editor Toolbar */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-2 no-print">
        {/* Left Formatting Group */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Garis Bawah (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Daftar Poin (Bullets)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Daftar Angka (Numbering)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertTable}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Sisipkan Tabel"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Rata Kiri"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Rata Tengah"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Rata Kanan"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Group: Copy, Print, Export Word */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition cursor-pointer"
            title="Salin Teks"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition cursor-pointer"
            title="Pratinjau & Cetak Dokumen"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>

          {onExportDocx && (
            <button
              type="button"
              onClick={onExportDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Unduh file Microsoft Word (.docx)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Word (.docx)</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Surface - Paper Styled */}
      <div className="p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white text-slate-900 shadow-md p-8 sm:p-12 min-h-[650px] rounded-lg border border-slate-200 doc-sheet font-doc leading-relaxed text-[15px]">
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: value }}
            className="outline-hidden focus:outline-hidden prose max-w-none prose-headings:font-doc prose-p:font-doc"
          />
        </div>
      </div>
    </div>
  );
};
