"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";
import { getYouTubeTranscript, isYouTubeUrl } from "@/lib/youtube";
import { REPURPOSE_SYSTEM_PROMPT, REPURPOSE_USER_PROMPT } from "@/lib/prompts";

export type GenerateResult =
  | { success: true; generationId: string; output: any }
  | { success: false; error: string };

export async function generateContent(
  formData: FormData
): Promise<GenerateResult> {
  const supabase = await createClient();

  // 1. Проверяем авторизацию
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Не авторизован" };
  }

  // 2. Проверяем лимит
  const { data: profile } = await supabase
    .from("users")
    .select("generations_used, generations_limit, plan")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Профиль не найден" };
  }

  if (profile.generations_used >= profile.generations_limit) {
    return {
      success: false,
      error: `Лимит исчерпан (${profile.generations_used}/${profile.generations_limit}). Обновите тариф.`,
    };
  }

  // 3. Читаем входные данные
  const sourceUrl = formData.get("source") as string;
  const tone = formData.get("tone") as string;
  const language = formData.get("language") as string;
  const platforms = formData.getAll("platforms") as string[];

  if (!sourceUrl || sourceUrl.trim().length < 10) {
    return { success: false, error: "Укажите ссылку на видео" };
  }

  if (platforms.length === 0) {
    return { success: false, error: "Выберите хотя бы одну платформу" };
  }

  // 4. Создаём запись в БД (status: pending)
  const { data: generation, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      source_url: sourceUrl,
      source_type: isYouTubeUrl(sourceUrl) ? "youtube" : "article",
      status: "transcribing",
    })
    .select()
    .single();

  if (insertError || !generation) {
    return { success: false, error: "Ошибка создания записи" };
  }

  try {
    // 5. Получаем транскрипт
    let sourceText = "";

    if (isYouTubeUrl(sourceUrl)) {
      sourceText = await getYouTubeTranscript(sourceUrl);
    } else {
      return {
        success: false,
        error: "Пока поддерживаются только YouTube-ссылки",
      };
    }

    // Обрезаем до 10000 символов
    sourceText = sourceText.substring(0, 5000);

    // 6. Обновляем статус
    await supabase
      .from("generations")
      .update({ status: "generating" })
      .eq("id", generation.id);

    // 7. Отправляем в AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
      messages: [
        { role: "system", content: REPURPOSE_SYSTEM_PROMPT },
        {
          role: "user",
          content: REPURPOSE_USER_PROMPT({
            source: sourceText,
            platforms,
            tone,
            language,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const output = JSON.parse(raw);
    const tokensUsed = completion.usage?.total_tokens || 0;

    // 8. Сохраняем результат
    await supabase
      .from("generations")
      .update({
        status: "done",
        output_json: output,
        tokens_used: tokensUsed,
      })
      .eq("id", generation.id);

    // 9. Увеличиваем счётчик
    await supabase
      .from("users")
      .update({ generations_used: profile.generations_used + 1 })
      .eq("id", user.id);

    // 10. Обновляем кэш страниц
    revalidatePath("/dashboard");
    revalidatePath("/generate");

    return {
      success: true,
      generationId: generation.id,
      output,
    };
  } catch (error) {
    // Обновляем статус на error
    await supabase
      .from("generations")
      .update({
        status: "error",
        error_message:
          error instanceof Error ? error.message : "Неизвестная ошибка",
      })
      .eq("id", generation.id);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Ошибка генерации",
    };
  }
}