import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldAlert, Cpu } from 'lucide-react';
import { GeminiSettings } from '../types';
import { testGeminiConnection } from '../services/geminiService';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GeminiSettings;
  onSave: (newSettings: GeminiSettings) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onShowToast,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'gemini-3.8-flash');
  const [temperature, setTemperature] = useState(settings.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(settings.maxOutputTokens ?? 4096);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempSettings: GeminiSettings = {
      apiKey,
      model,
      temperature,
      maxOutputTokens: maxTokens,
      isConnected: false,
    };

    const res = await testGeminiConnection(tempSettings);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      onShowToast?.('✓ Gemini AI berhasil terhubung!', 'success');
    } else {
      onShowToast?.('✕ Gemini AI gagal terhubung: ' + res.message, 'error');
    }
  };

  const handleSave = () => {
    const updated: GeminiSettings = {
      apiKey: apiKey.trim(),
      model: model.trim() || 'gemini-3.8-flash',
      temperature: Number(temperature),
      maxOutputTokens: Number(maxTokens),
      isConnected: testResult ? testResult.success : (Boolean(apiKey) || settings.isConnected),
      lastTested: new Date().toISOString(),
    };

    onSave(updated);
    onShowToast?.('Pengaturan Gemini berhasil disimpan.', 'success');
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setTestResult(null);
    const updated: GeminiSettings = {
      ...settings,
      apiKey: '',
      isConnected: false,
    };
    onSave(updated);
    onShowToast?.('API Key telah dihapus.', 'info');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Pengaturan Gemini AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Konfigurasi integrasi model AI untuk generator otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Security Notice Box */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Catatan Keamanan & Fleksibilitas:</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300 leading-relaxed">
                Di lingkungan AI Studio, server telah dilengkapi kunci environment. Jika Anda mengunduh aplikasi untuk digunakan secara offline/standalone di komputer sekolah pribadi, Anda dapat memasukkan Gemini API Key pribadi di sini. Kunci disimpan di localStorage browser Anda.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-gemini-api-key"
                type="password"
                placeholder="AIzaSy... (Opsional jika server sudah terpasang kunci)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dapatkan API Key gratis di <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">Google AI Studio</a>.
            </p>
          </div>

          {/* Model Gemini Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Model Gemini
            </label>
            <div className="relative">
              <Cpu className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                id="select-gemini-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Rekomendasi Utama Cepat & Cerdas)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Sangat Cepat / Ringan)</option>
                <option value="gemini-flash-latest">gemini-flash-latest</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Model fleksibel dan dapat diganti sesuai ketersediaan versi terbaru Google.
            </p>
          </div>

          {/* Parameter Sliders: Temperature & Max Tokens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Temperature
                </label>
                <span className="text-xs font-mono text-blue-600">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">0.7 ideal untuk pedagogi kreatif terarah</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Max Output Tokens
                </label>
                <span className="text-xs font-mono text-blue-600">{maxTokens}</span>
              </div>
              <select
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value={2048}>2048 Tokens</option>
                <option value={4096}>4096 Tokens (Rekomendasi)</option>
                <option value={8192}>8192 Tokens (Dokumen Panjang)</option>
              </select>
            </div>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji...' : 'Test Connection'}</span>
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                Clear API Key
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
