import {
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
  DocumentItem
} from '../types';

import {
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_SCHOOL_IDENTITY,
  DEFAULT_LEARNING_DATA,
  DEFAULT_GEMINI_SETTINGS,
  DEFAULT_ALOKASI_WAKTU,
  DEFAULT_ANALISIS_CP_ATP,
  DEFAULT_ATP_ROWS,
  DEFAULT_PROTA_ROWS,
  DEFAULT_PROMES_ROWS,
  DEFAULT_JURNAL_ROWS
} from '../data/defaults';

const STORAGE_KEYS = {
  TEACHER: 'pp_teacher_profile',
  SCHOOL: 'pp_school_identity',
  LEARNING: 'pp_learning_data',
  GEMINI: 'pp_gemini_settings',
  ALOKASI: 'pp_alokasi_waktu',
  CP_ATP: 'pp_cp_atp_analysis',
  CP: 'pp_cp_content',
  ATP: 'pp_atp_rows',
  BAHAN_AJAR: 'pp_bahan_ajar',
  MODUL_AJAR: 'pp_modul_ajar',
  LKPD: 'pp_lkpd',
  ASESMEN: 'pp_asesmen',
  JURNAL: 'pp_jurnal',
  PROTA: 'pp_prota',
  PROMES: 'pp_promes',
  DOCUMENTS: 'pp_documents',
  THEME: 'pp_theme_mode',
};

export function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`pp_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`pp_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export function exportAppStateBackup(): void {
  storageService.exportBackupJson();
}

export async function importAppStateBackup(file: File): Promise<boolean> {
  return storageService.importBackupJson(file);
}

export const storageService = {
  getTeacherProfile(): TeacherProfile {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHER);
    return data ? JSON.parse(data) : DEFAULT_TEACHER_PROFILE;
  },
  saveTeacherProfile(profile: TeacherProfile): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(profile));
  },

  getSchoolIdentity(): SchoolIdentity {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    return data ? JSON.parse(data) : DEFAULT_SCHOOL_IDENTITY;
  },
  saveSchoolIdentity(school: SchoolIdentity): void {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(school));
  },

  getLearningData(): LearningData {
    const data = localStorage.getItem(STORAGE_KEYS.LEARNING);
    return data ? JSON.parse(data) : DEFAULT_LEARNING_DATA;
  },
  saveLearningData(data: LearningData): void {
    localStorage.setItem(STORAGE_KEYS.LEARNING, JSON.stringify(data));
  },

  getGeminiSettings(): GeminiSettings {
    const data = localStorage.getItem(STORAGE_KEYS.GEMINI);
    return data ? JSON.parse(data) : DEFAULT_GEMINI_SETTINGS;
  },
  saveGeminiSettings(settings: GeminiSettings): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI, JSON.stringify(settings));
  },

  getAlokasiWaktu(): AlokasiWaktuData {
    const data = localStorage.getItem(STORAGE_KEYS.ALOKASI);
    return data ? JSON.parse(data) : DEFAULT_ALOKASI_WAKTU;
  },
  saveAlokasiWaktu(data: AlokasiWaktuData): void {
    localStorage.setItem(STORAGE_KEYS.ALOKASI, JSON.stringify(data));
  },

  getCpAtpAnalysis(): AnalisisCpAtpRow[] {
    const data = localStorage.getItem(STORAGE_KEYS.CP_ATP);
    return data ? JSON.parse(data) : DEFAULT_ANALISIS_CP_ATP;
  },
  saveCpAtpAnalysis(data: AnalisisCpAtpRow[]): void {
    localStorage.setItem(STORAGE_KEYS.CP_ATP, JSON.stringify(data));
  },

  getCpContent(): string {
    return localStorage.getItem(STORAGE_KEYS.CP) || '';
  },
  saveCpContent(content: string): void {
    localStorage.setItem(STORAGE_KEYS.CP, content);
  },

  getAtpRows(): AtpRow[] {
    const data = localStorage.getItem(STORAGE_KEYS.ATP);
    return data ? JSON.parse(data) : DEFAULT_ATP_ROWS;
  },
  saveAtpRows(rows: AtpRow[]): void {
    localStorage.setItem(STORAGE_KEYS.ATP, JSON.stringify(rows));
  },

  getBahanAjar(): string {
    return localStorage.getItem(STORAGE_KEYS.BAHAN_AJAR) || '';
  },
  saveBahanAjar(content: string): void {
    localStorage.setItem(STORAGE_KEYS.BAHAN_AJAR, content);
  },

  getModulAjar(): string {
    return localStorage.getItem(STORAGE_KEYS.MODUL_AJAR) || '';
  },
  saveModulAjar(content: string): void {
    localStorage.setItem(STORAGE_KEYS.MODUL_AJAR, content);
  },

  getLkpd(): string {
    return localStorage.getItem(STORAGE_KEYS.LKPD) || '';
  },
  saveLkpd(content: string): void {
    localStorage.setItem(STORAGE_KEYS.LKPD, content);
  },

  getAsesmen(): string {
    return localStorage.getItem(STORAGE_KEYS.ASESMEN) || '';
  },
  saveAsesmen(content: string): void {
    localStorage.setItem(STORAGE_KEYS.ASESMEN, content);
  },

  getJurnalRows(): JurnalRow[] {
    const data = localStorage.getItem(STORAGE_KEYS.JURNAL);
    return data ? JSON.parse(data) : DEFAULT_JURNAL_ROWS;
  },
  saveJurnalRows(rows: JurnalRow[]): void {
    localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify(rows));
  },

  getProtaRows(): ProtaRow[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROTA);
    return data ? JSON.parse(data) : DEFAULT_PROTA_ROWS;
  },
  saveProtaRows(rows: ProtaRow[]): void {
    localStorage.setItem(STORAGE_KEYS.PROTA, JSON.stringify(rows));
  },

  getPromesRows(): PromesRow[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROMES);
    return data ? JSON.parse(data) : DEFAULT_PROMES_ROWS;
  },
  savePromesRows(rows: PromesRow[]): void {
    localStorage.setItem(STORAGE_KEYS.PROMES, JSON.stringify(rows));
  },

  getDocuments(): DocumentItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [];
  },
  saveDocuments(docs: DocumentItem[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getThemeMode(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  saveThemeMode(mode: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  },

  // Export full backup JSON
  exportBackupJson(): void {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      teacherProfile: this.getTeacherProfile(),
      schoolIdentity: this.getSchoolIdentity(),
      learningData: this.getLearningData(),
      geminiSettings: {
        ...this.getGeminiSettings(),
        apiKey: '',
      },
      alokasiWaktu: this.getAlokasiWaktu(),
      cpAtpAnalysis: this.getCpAtpAnalysis(),
      cpContent: this.getCpContent(),
      atpRows: this.getAtpRows(),
      bahanAjar: this.getBahanAjar(),
      modulAjar: this.getModulAjar(),
      lkpd: this.getLkpd(),
      asesmen: this.getAsesmen(),
      jurnalRows: this.getJurnalRows(),
      protaRows: this.getProtaRows(),
      promesRows: this.getPromesRows(),
      documents: this.getDocuments(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BACKUP_PERANGKAT_AJAR_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import backup JSON
  async importBackupJson(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.teacherProfile) this.saveTeacherProfile(data.teacherProfile);
      if (data.schoolIdentity) this.saveSchoolIdentity(data.schoolIdentity);
      if (data.learningData) this.saveLearningData(data.learningData);
      if (data.alokasiWaktu) this.saveAlokasiWaktu(data.alokasiWaktu);
      if (data.cpAtpAnalysis) this.saveCpAtpAnalysis(data.cpAtpAnalysis);
      if (data.cpContent !== undefined) this.saveCpContent(data.cpContent);
      if (data.atpRows) this.saveAtpRows(data.atpRows);
      if (data.bahanAjar !== undefined) this.saveBahanAjar(data.bahanAjar);
      if (data.modulAjar !== undefined) this.saveModulAjar(data.modulAjar);
      if (data.lkpd !== undefined) this.saveLkpd(data.lkpd);
      if (data.asesmen !== undefined) this.saveAsesmen(data.asesmen);
      if (data.jurnalRows) this.saveJurnalRows(data.jurnalRows);
      if (data.protaRows) this.saveProtaRows(data.protaRows);
      if (data.promesRows) this.savePromesRows(data.promesRows);
      if (data.documents) this.saveDocuments(data.documents);

      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },
};
