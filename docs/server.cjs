var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
function getGeminiClient(customApiKey) {
  const apiKey = customApiKey && customApiKey.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasEnvKey,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/gemini/test", async (req, res) => {
  try {
    const { customApiKey, model = "gemini-3.8-flash" } = req.body || {};
    const ai = getGeminiClient(customApiKey);
    if (!ai) {
      return res.status(400).json({
        success: false,
        error: "API Key Gemini belum disetel. Masukkan API Key di pengaturan atau di server environment."
      });
    }
    const response = await ai.models.generateContent({
      model: model || "gemini-3.8-flash",
      contents: 'Ping test. Responlah singkat: "Koneksi Gemini AI Aktif dan Siap".'
    });
    const text = response.text || "Koneksi Berhasil";
    return res.json({
      success: true,
      message: "Gemini AI berhasil terhubung!",
      sampleResponse: text,
      modelUsed: model
    });
  } catch (err) {
    console.error("Gemini test error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Gagal berkomunikasi dengan Gemini API"
    });
  }
});
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction,
      model = "gemini-3.8-flash",
      temperature = 0.7,
      maxOutputTokens = 4096,
      responseMimeType,
      customApiKey
    } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Prompt wajib diisi" });
    }
    const ai = getGeminiClient(customApiKey);
    if (!ai) {
      return res.status(400).json({
        error: "API Key Gemini belum dikonfigurasi. Silakan buka Pengaturan Gemini untuk memasukkan API Key Anda."
      });
    }
    const config = {
      temperature: Number(temperature) || 0.7,
      maxOutputTokens: Number(maxOutputTokens) || 4096
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseMimeType === "application/json") {
      config.responseMimeType = "application/json";
    }
    const response = await ai.models.generateContent({
      model: model || "gemini-3.8-flash",
      contents: prompt,
      config
    });
    const outputText = response.text || "";
    return res.json({
      success: true,
      text: outputText,
      modelUsed: model
    });
  } catch (err) {
    console.error("Gemini generate error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Terjadi kesalahan saat memproses permintaan AI."
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Perangkat Ajar Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
