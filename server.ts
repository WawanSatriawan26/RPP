import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini client safely
function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasEnvKey,
    timestamp: new Date().toISOString(),
  });
});

// Test Gemini Connection
app.post('/api/gemini/test', async (req, res) => {
  try {
    const { customApiKey, model = 'gemini-3.8-flash' } = req.body || {};
    const ai = getGeminiClient(customApiKey);

    if (!ai) {
      return res.status(400).json({
        success: false,
        error: 'API Key Gemini belum disetel. Masukkan API Key di pengaturan atau di server environment.',
      });
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: 'Ping test. Responlah singkat: "Koneksi Gemini AI Aktif dan Siap".',
    });

    const text = response.text || 'Koneksi Berhasil';
    return res.json({
      success: true,
      message: 'Gemini AI berhasil terhubung!',
      sampleResponse: text,
      modelUsed: model,
    });
  } catch (err: any) {
    console.error('Gemini test error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Gagal berkomunikasi dengan Gemini API',
    });
  }
});

// Generate Content via Gemini
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction,
      model = 'gemini-3.8-flash',
      temperature = 0.7,
      maxOutputTokens = 4096,
      responseMimeType,
      customApiKey,
    } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt wajib diisi' });
    }

    const ai = getGeminiClient(customApiKey);
    if (!ai) {
      return res.status(400).json({
        error: 'API Key Gemini belum dikonfigurasi. Silakan buka Pengaturan Gemini untuk memasukkan API Key Anda.',
      });
    }

    const config: Record<string, any> = {
      temperature: Number(temperature) || 0.7,
      maxOutputTokens: Number(maxOutputTokens) || 4096,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (responseMimeType === 'application/json') {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    const outputText = response.text || '';
    return res.json({
      success: true,
      text: outputText,
      modelUsed: model,
    });
  } catch (err: any) {
    console.error('Gemini generate error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Perangkat Ajar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
