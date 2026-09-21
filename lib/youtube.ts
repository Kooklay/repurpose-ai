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
 * Получает транскрипт с YouTube.
 * Пробует русские субтитры → английские → автоматические.
 * Если ни одного нет — понятная ошибка.
 */
export async function getYouTubeTranscript(url: string): Promise<string> {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    throw new Error("Неверная YouTube-ссылка. Проверьте URL.");
  }

  const languages: (string | undefined)[] = ["ru", "en", undefined];

  for (const lang of languages) {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(
        videoId,
        lang ? { lang } : undefined
      );

      if (transcript && transcript.length > 0) {
        const fullText = transcript
          .map((item) => item.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        if (fullText.length > 0) {
          return fullText;
        }
      }
    } catch {
      continue;
    }
  }

  // Если ни одного языка не нашли — понятная ошибка
  throw new Error(
    "У этого видео нет субтитров. Попробуйте другое видео — например, обучающее, интервью или подкаст. У большинства таких роликов субтитры включены."
  );
}