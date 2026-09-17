import { YoutubeTranscript } from "youtube-transcript";

/**
 * Извлекает ID видео из YouTube-ссылки.
 * Поддерживает форматы:
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - с таймкодами и параметрами
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Проверяет, является ли ссылка YouTube-ссылкой.
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Получает транскрипт (текст) видео с YouTube.
 * Работает только если у видео есть субтитры.
 */
export async function getYouTubeTranscript(url: string): Promise<string> {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    throw new Error("Неверная YouTube-ссылка. Проверьте URL.");
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      throw new Error(
        "У этого видео нет субтитров. Попробуйте другое видео — с автогенерированными или ручными субтитрами."
      );
    }

    const fullText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return fullText;
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      // Специфические ошибки YouTube
      if (msg.includes("disabled") || msg.includes("no transcript")) {
        throw new Error(
          "У этого видео отключены субтитры. Выберите другое видео — где есть субтитры или включён автоперевод."
        );
      }

      if (msg.includes("not found") || msg.includes("unavailable")) {
        throw new Error(
          "Видео недоступно. Проверьте что оно публичное и ссылка корректна."
        );
      }

      if (msg.includes("too many requests") || msg.includes("rate limit")) {
        throw new Error(
          "Слишком много запросов к YouTube. Подождите минуту и попробуйте снова."
        );
      }

      throw new Error(`Не удалось загрузить транскрипт: ${error.message}`);
    }

    throw new Error("Не удалось загрузить транскрипт. Попробуйте другое видео.");
  }
}