import { Innertube } from "youtubei.js";

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Получает транскрипт через youtubei.js (внутренний API YouTube).
 * Работает без субтитров — через caption_tracks.
 */
export async function getYouTubeTranscript(url: string): Promise<string> {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    throw new Error("Неверная YouTube-ссылка. Проверьте URL.");
  }

  try {
    console.log("[youtube] creating innertube client...");
    const youtube = await Innertube.create({
      lang: "ru",
      location: "RU",
      retrieve_player: false,
    });

    console.log("[youtube] fetching video info:", videoId);
    const info = await youtube.getInfo(videoId);

    console.log("[youtube] getting transcript...");
    const transcriptData = await info.getTranscript();

    if (!transcriptData || !transcriptData.transcript) {
      throw new Error("no transcript data");
    }

    // Собираем весь текст
    const segments = transcriptData.transcript.content?.body?.initial_segments;
    if (!segments || segments.length === 0) {
      throw new Error("no segments");
    }

    const fullText = segments
      .map((s: any) => s.snippet?.text || "")
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (fullText.length < 50) {
      throw new Error("too short");
    }

    console.log(`[youtube] got ${fullText.length} chars`);

    // Ограничиваем 15 000 символов
    return fullText.substring(0, 15000);
  } catch (error) {
    console.error("[youtube] transcript failed:", error);

    const msg = error instanceof Error ? error.message : "unknown";

    if (msg.includes("no transcript") || msg.includes("no segments") || msg.includes("too short")) {
      throw new Error(
        "У этого видео нет субтитров. Попробуйте другое видео — обучающее, интервью или подкаст."
      );
    }

    if (msg.includes("video unavailable") || msg.includes("private") || msg.includes("not found")) {
      throw new Error(
        "Видео недоступно. Проверьте что ссылка ведёт на публичное видео."
      );
    }

    throw new Error(
      "Не удалось получить субтитры видео. Попробуйте другое видео или подождите минуту."
    );
  }
}