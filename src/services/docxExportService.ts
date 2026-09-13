import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ImageRun
} from 'docx';
import { saveAs } from 'file-saver';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';

interface ExportDocOptions {
  title: string;
  subtitle?: string;
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  contentHtml?: string;
  tables?: Array<{ headers: string[]; rows: string[][] }>;
  customSections?: Paragraph[];
  fileName?: string;
}

// Convert HTML content into clean docx Paragraphs and bullet points
function htmlToDocxParagraphs(html: string): Paragraph[] {
  if (!html) return [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const paragraphs: Paragraph[] = [];

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text, font: 'Times New Roman', size: 24 })],
            spacing: { after: 120, line: 276 },
          })
        );
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
        paragraphs.push(
          new Paragraph({
            heading:
              tag === 'h1'
                ? HeadingLevel.HEADING_1
                : tag === 'h2'
                ? HeadingLevel.HEADING_2
                : HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: el.innerText.trim(),
                bold: true,
                font: 'Times New Roman',
                size: tag === 'h1' ? 32 : tag === 'h2' ? 28 : 24,
                color: '1E293B',
              }),
            ],
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tag === 'p') {
        const text = el.innerText.trim();
        if (text) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text, font: 'Times New Roman', size: 24 })],
              spacing: { after: 140, line: 276 }, // 1.15 line spacing
            })
          );
        }
      } else if (tag === 'ul' || tag === 'ol') {
        Array.from(el.children).forEach((li, idx) => {
          paragraphs.push(
            new Paragraph({
              bullet: tag === 'ul' ? { level: 0 } : undefined,
              children: [
                new TextRun({
                  text: tag === 'ol' ? `${idx + 1}. ${li.textContent?.trim()}` : li.textContent?.trim() || '',
                  font: 'Times New Roman',
                  size: 24,
                }),
              ],
              spacing: { after: 100, line: 276 },
            })
          );
        });
      } else {
        Array.from(el.childNodes).forEach(processNode);
      }
    }
  }

  Array.from(tempDiv.childNodes).forEach(processNode);
  return paragraphs;
}

// Create Kop Surat / Header
function createKopSurat(school: SchoolIdentity): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.DOUBLE, size: 24, color: '000000' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `PEMERINTAH PROVINSI / DAERAH KABUPATEN/KOTA ${school.kabupatenKota.toUpperCase()}`,
                    bold: true,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: school.namaSekolah.toUpperCase(),
                    bold: true,
                    font: 'Times New Roman',
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${school.alamat}, Kec. ${school.kecamatan}, ${school.kabupatenKota}, ${school.provinsi} ${school.kodePos}`,
                    font: 'Times New Roman',
                    size: 18,
                  }),
                ],
                spacing: { after: 160 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Create Signature Block (Tanda Tangan)
function createSignatureBlock(teacher: TeacherProfile, school: SchoolIdentity): Table {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 22 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Kepala Sekolah', bold: true, font: 'Times New Roman', size: 22 })],
                spacing: { after: 1200 }, // Signature blank space
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: teacher.namaKepalaSekolah,
                    bold: true,
                    underline: {},
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: `NIP. ${teacher.nipKepalaSekolah || '.....................................'}`, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${school.kabupatenKota || 'Tempat'}, ${today}`, font: 'Times New Roman', size: 22 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Guru Mata Pelajaran', bold: true, font: 'Times New Roman', size: 22 })],
                spacing: { after: 1200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: teacher.namaPembuat,
                    bold: true,
                    underline: {},
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: `NIP. ${teacher.nip || '.....................................'}`, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Convert table data to Docx Table
function createDocxTable(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: h, bold: true, font: 'Times New Roman', size: 20 })],
                }),
              ],
              shading: { fill: 'F1F5F9' },
            })
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, font: 'Times New Roman', size: 20 })],
                      spacing: { line: 240 },
                    }),
                  ],
                })
            ),
          })
      ),
    ],
  });
}

export async function exportSingleDocx(opts: ExportDocOptions): Promise<void> {
  const contentParagraphs = opts.contentHtml ? htmlToDocxParagraphs(opts.contentHtml) : [];

  const bodyChildren: any[] = [
    createKopSurat(opts.school),
    new Paragraph({ spacing: { after: 240 } }),

    // Document Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text: opts.title.toUpperCase(),
          bold: true,
          font: 'Times New Roman',
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Pendekatan Pembelajaran Mendalam Berbasis Cinta`,
          italics: true,
          font: 'Times New Roman',
          size: 24,
          color: '334155',
        }),
      ],
      spacing: { after: 320 },
    }),

    // Identity summary table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Mata Pelajaran', bold: true, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `: ${opts.learning.mataPelajaran}`, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Jenjang / Kelas', bold: true, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `: ${opts.learning.jenjang} / Kelas ${opts.learning.kelas} (${opts.learning.fase})`, font: 'Times New Roman', size: 20 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Materi Pokok', bold: true, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `: ${opts.learning.materiTopik}`, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Tahun / Semester', bold: true, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `: ${opts.school.tahunPelajaran} / Semester ${opts.school.semester}`, font: 'Times New Roman', size: 20 })] })],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 320 } }),

    ...contentParagraphs,
  ];

  if (opts.tables && opts.tables.length > 0) {
    opts.tables.forEach((t) => {
      bodyChildren.push(new Paragraph({ spacing: { before: 180, after: 120 } }));
      bodyChildren.push(createDocxTable(t.headers, t.rows));
    });
  }

  // Signature Block at end
  bodyChildren.push(new Paragraph({ spacing: { before: 480, after: 240 } }));
  bodyChildren.push(createSignatureBlock(opts.teacher, opts.school));

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 24 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch / standard normal
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${opts.school.namaSekolah} | ${opts.title}`,
                    font: 'Times New Roman',
                    size: 16,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    text: ' dari ',
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const targetFileName = opts.fileName || `${opts.title.replace(/\s+/g, '_')}.docx`;
  saveAs(blob, targetFileName);
}

// Export All Teaching Devices Combined
export async function exportAllDevicesCombined(
  teacher: TeacherProfile,
  school: SchoolIdentity,
  learning: LearningData,
  devices: Array<{ title: string; contentHtml?: string; tables?: Array<{ headers: string[]; rows: string[][] }> }>
): Promise<void> {
  const sections: any[] = [];

  // 1. Cover Page
  sections.push({
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
    },
    children: [
      new Paragraph({ spacing: { after: 720 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.TITLE,
        children: [
          new TextRun({
            text: 'PERANGKAT AJAR LENGKAP',
            bold: true,
            font: 'Times New Roman',
            size: 40,
            color: '0F172A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'PENDEKATAN PEMBELAJARAN MENDALAM BERBASIS CINTA',
            bold: true,
            font: 'Times New Roman',
            size: 26,
            color: '1E3A8A',
          }),
        ],
        spacing: { after: 1200 },
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Mata Pelajaran: ${learning.mataPelajaran}\nKelas: ${learning.kelas} (${learning.fase})\nTahun Pelajaran: ${school.tahunPelajaran}`,
            font: 'Times New Roman',
            size: 26,
          }),
        ],
        spacing: { after: 1440 },
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Disusun Oleh:\n',
            font: 'Times New Roman',
            size: 22,
          }),
          new TextRun({
            text: teacher.namaPembuat,
            bold: true,
            font: 'Times New Roman',
            size: 28,
          }),
          new TextRun({
            text: `\nNIP: ${teacher.nip}\nNUPTK: ${teacher.nuptk || '-'}\n\n`,
            font: 'Times New Roman',
            size: 22,
          }),
          new TextRun({
            text: `${school.namaSekolah}\n${school.kabupatenKota}, ${school.provinsi}`,
            bold: true,
            font: 'Times New Roman',
            size: 26,
          }),
        ],
      }),
    ],
  });

  // 2. Add each device as its own section
  devices.forEach((dev) => {
    const children: any[] = [
      createKopSurat(school),
      new Paragraph({ spacing: { after: 200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: dev.title.toUpperCase(),
            bold: true,
            font: 'Times New Roman',
            size: 30,
          }),
        ],
        spacing: { after: 240 },
      }),
    ];

    if (dev.contentHtml) {
      children.push(...htmlToDocxParagraphs(dev.contentHtml));
    }

    if (dev.tables && dev.tables.length > 0) {
      dev.tables.forEach((t) => {
        children.push(new Paragraph({ spacing: { before: 180, after: 120 } }));
        children.push(createDocxTable(t.headers, t.rows));
      });
    }

    children.push(new Paragraph({ spacing: { before: 400, after: 200 } }));
    children.push(createSignatureBlock(teacher, school));

    sections.push({
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `${school.namaSekolah} | ${dev.title}`,
                  font: 'Times New Roman',
                  size: 16,
                  color: '64748B',
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Halaman ',
                  font: 'Times New Roman',
                  size: 18,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: 'Times New Roman',
                  size: 18,
                }),
                new TextRun({
                  text: ' dari ',
                  font: 'Times New Roman',
                  size: 18,
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: 'Times New Roman',
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      children,
    });
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 24 },
        },
      },
    },
    sections,
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'PERANGKAT_AJAR_LENGKAP.docx');
}
