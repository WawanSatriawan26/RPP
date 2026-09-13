import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Trash2, Heart, BookOpen, Lightbulb } from 'lucide-react';
import { TeacherProfile, SchoolIdentity, LearningData } from '../types';
import { callGeminiAI, buildLearningContextString } from '../services/geminiService';

interface TeacherAssistantViewProps {
  teacher: TeacherProfile;
  school: SchoolIdentity;
  learning: LearningData;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const TeacherAssistantView: React.FC<TeacherAssistantViewProps> = ({
  teacher,
  school,
  learning,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Halo ${teacher.namaPembuat || 'Bapak/Ibu Guru'}! Saya adalah Asisten Pedagogi Gemini AI Anda. Saya siap membantu merancang ide pembelajaran mendalam, variasi aktivitas ice-breaking mindful, diferensiasi siswa, lembar asesmen, maupun integrasi nilai cinta kasih dalam kelas ${learning.mataPelajaran}. Apa yang ingin kita diskusikan hari ini?`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Berikan ide ice-breaking mindful & joyful 5 menit sebelum belajar',
    'Bagaimana diferensiasi untuk siswa yang lambat memahami konsep ini?',
    'Buatkan studi kasus kontekstual nyata untuk topik materi ini',
    'Bagaimana mengintegrasikan nilai cinta sesama pada kerja kelompok?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const systemContext = `Anda adalah Asisten Pakar Pedagogi Kurikulum Indonesia berlandaskan Pembelajaran Mendalam (Mindful, Meaningful, Joyful) dan Pembelajaran Berbasis Cinta (Kasih Sayang Tuhan, Diri Sendiri, Sesama, Ilmu, Lingkungan, Bangsa).
Konteks Pembelajaran:
${buildLearningContextString(learning, teacher, school)}

Jawablah pertanyaan guru secara praktis, solutif, empatik, inspiratif, dan mudah diterapkan di kelas nyata.`;

      const prompt = `${systemContext}\n\nPertanyaan Guru:\n${text}`;
      const reply = await callGeminiAI(prompt);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      onShowToast('Gagal mengirim pesan: ' + (e?.message || 'Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: `Percakapan telah direset. Ada ide pembelajaran baru yang ingin kita eksplorasi bersama, ${teacher.namaPembuat || 'Bapak/Ibu'}?`,
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Asisten Guru Gemini AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Konsultasikan ide pengajaran, rubrik penilaian, metode diferensiasi, dan inovasi kelas berkesadaran.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
          title="Reset Percakapan"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Bersihkan</span>
        </button>
      </div>

      {/* Chat messages container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-4 h-[460px] overflow-y-auto flex flex-col space-y-3.5">
        {messages.map((m) => {
          const isAi = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[88%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div
                  className="prose prose-xs dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }}
                />
                <span
                  className={`block text-[10px] mt-1.5 ${
                    isAi ? 'text-slate-400' : 'text-blue-200 text-right'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 self-start items-center text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Gemini AI sedang berpikir dan merumuskan saran terbaik...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          Saran:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(qp)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanyakan ide pedagogi, strategi pembelajaran, ice-breaking, atau rubrik..."
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
};
