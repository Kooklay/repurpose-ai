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

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Пробует получить транскрипт с таймаутом.
 * Пробует русские → английские → авто-субтитры.
 * Ограничивает результат 15 000 символов.
 * Общий таймаут — 45 секунд (3 попытки × 15 сек).
 */
async function tryFetchTranscript(
  videoId: string,
  lang?: string
): Promise<string | null> {
  try {
    // Таймаут на одну попытку — 15 секунд
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 15000)
    );

    const fetchPromise = YoutubeTranscript.fetchTranscript(
      videoId,
      lang ? { lang } : undefined
    );

    const transcript = await Promise.race([fetchPromise, timeoutPromise]);

    if (!transcript || transcript.length === 0) {
      return null;
    }

    const fullText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (fullText.length < 50) {
      return null;
    }

    // Ограничиваем 15 000 символов — примерно 15 минут видео
    return fullText.substring(0, 15000);
  } catch {
    return null;
  }
}

/**
 * Получает транскрипт с YouTube.
 * Пробует несколько языков. Если ничего — понятная ошибка.
 */
export async function getYouTubeTranscript(url: string): Promise<string> {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    throw new Error("Неверная YouTube-ссылка. Проверьте URL.");
  }

  // Пробуем языки по очереди
  const languages: (string | undefined)[] = ["ru", "en", undefined];

  for (const lang of languages) {
    const result = await tryFetchTranscript(videoId, lang);
    if (result) {
      return result;
    }
  }

  // Ничего не получилось
  throw new Error(
    "Не удалось получить субтитры видео. Возможные причины: у видео нет субтитров, видео слишком длинное, или YouTube временно ограничил запросы. Попробуйте видео покороче или подождите минуту."
  );
}