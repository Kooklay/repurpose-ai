import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://api.proxyapi.ru/openai/v1",
  apiKey: process.env.PROXYAPI_KEY,
});

// Доступные модели через ProxyAPI:
// - gpt-4o-mini — быстрая и дешёвая (для регенерации)
// - gpt-4o — более умная (для основных задач)
// - whisper-1 — транскрипция аудио