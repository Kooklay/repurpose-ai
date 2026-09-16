"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { generateContent } from "@/app/actions";

const PLATFORMS = [
  { id: "twitter", label: "X (Twitter)" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok / Reels" },
  { id: "telegram", label: "Telegram" },
  { id: "email", label: "Email" },
];

const TONES = [
  { id: "expert", label: "Экспертная" },
  { id: "friendly", label: "Дружеская" },
  { id: "provocative", label: "Провокационная" },
];

type Status = "idle" | "loading" | "done" | "error";

function GeneratePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledSource = searchParams.get("source") || "";

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "twitter",
    "linkedin",
    "tiktok",
    "telegram",
    "email",
  ]);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setError(null);
    setResult(null);

    const platforms = formData.getAll("platforms") as string[];
    setSelectedPlatforms(platforms);

    try {
      const res = await generateContent(formData);

      if (res.success) {
        setResult(res.output);
        setGenerationId(res.generationId);
        setStatus("done");
        router.refresh();
      } else {
        setError(res.error);
        setStatus("error");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setStatus("error");
    }
  }

  function copyAll() {
    if (!result) return;
    const text = formatAllText(result, selectedPlatforms);
    navigator.clipboard.writeText(text);
    alert("Скопировано!");
  }

  function downloadMd() {
    if (!result) return;
    const text = formatAllText(result, selectedPlatforms);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `repurpose-${generationId || Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="generate-page">
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">R</span>
            Repurpose.ai
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost"
            style={{ display: "inline-block" }}
          >
            ← В дашборд
          </Link>
        </div>
      </header>

      <main className="generate-main">
        <h1 className="generate-title">Новая генерация</h1>
        <p className="generate-subtitle">
          Вставь ссылку на YouTube-видео — получим 30+ постов за 60 секунд
        </p>

        {status === "idle" && (
          <form action={handleSubmit} className="generate-form">
            <div className="form-field">
              <label className="form-label">Ссылка на YouTube</label>
              <input
                type="url"
                name="source"
                placeholder="https://youtube.com/watch?v=..."
                required
                defaultValue={prefilledSource}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Платформы</label>
              <div className="form-checkbox-grid">
                {PLATFORMS.map((p) => (
                  <label key={p.id} className="form-checkbox-label">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={p.id}
                      defaultChecked={true}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Тональность</label>
              <div className="form-radio-grid">
                {TONES.map((t) => (
                  <label key={t.id} className="form-radio-label">
                    <input
                      type="radio"
                      name="tone"
                      value={t.id}
                      defaultChecked={t.id === "friendly"}
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <input type="hidden" name="language" value="ru" />

            <button type="submit" className="form-submit">
              Сгенерировать
            </button>
          </form>
        )}

        {status === "loading" && (
          <div className="generate-loading">
            <div className="spinner" />
            <p className="loading-text">Обрабатываем видео...</p>
            <div className="loading-stages">
              <span>⏳ Транскрипция YouTube</span>
              <span>⏳ Анализ содержимого</span>
              <span>⏳ Генерация постов</span>
            </div>
            <p className="loading-hint">Обычно 30–60 секунд</p>
          </div>
        )}

        {status === "error" && (
          <div className="generate-error">
            <h2>Что-то пошло не так</h2>
            <p>{error}</p>
            <button
              onClick={() => setStatus("idle")}
              className="form-submit"
              style={{ maxWidth: "300px" }}
            >
              Попробовать снова
            </button>
          </div>
        )}

        {status === "done" && result && (
          <div className="generate-result">
            <div className="result-header">
              <h2>✅ Готово!</h2>
              <div className="result-actions">
                <button onClick={copyAll} className="btn-ghost">
                  Копировать всё
                </button>
                <button onClick={downloadMd} className="btn-primary">
                  Скачать .md
                </button>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setResult(null);
                  }}
                  className="btn-ghost"
                >
                  Новая
                </button>
              </div>
            </div>

            {result.twitter &&
              result.twitter.length > 0 &&
              selectedPlatforms.includes("twitter") && (
                <section className="result-section">
                  <h3>🐦 X (Twitter)</h3>
                  {result.twitter.map((t: any, i: number) => (
                    <div key={i} className="result-post">
                      <div className="result-post-head">
                        <span className="result-post-num">#{i + 1}</span>
                        {t.tone && (
                          <span className="result-post-tone">{t.tone}</span>
                        )}
                      </div>
                      <p>{t.text}</p>
                    </div>
                  ))}
                </section>
              )}

            {result.linkedin &&
              result.linkedin.length > 0 &&
              selectedPlatforms.includes("linkedin") && (
                <section className="result-section">
                  <h3>💼 LinkedIn</h3>
                  {result.linkedin.map((t: string, i: number) => (
                    <div key={i} className="result-post">
                      <div className="result-post-head">
                        <span className="result-post-num">#{i + 1}</span>
                      </div>
                      <p style={{ whiteSpace: "pre-line" }}>{t}</p>
                    </div>
                  ))}
                </section>
              )}

            {result.tiktok &&
              result.tiktok.length > 0 &&
              selectedPlatforms.includes("tiktok") && (
                <section className="result-section">
                  <h3>🎬 TikTok / Reels</h3>
                  {result.tiktok.map((t: any, i: number) => (
                    <div key={i} className="result-post">
                      <div className="result-post-head">
                        <span className="result-post-num">#{i + 1}</span>
                        <span className="result-post-tone">Hook</span>
                      </div>
                      <p style={{ fontWeight: 600, marginBottom: 12 }}>
                        {t.hook}
                      </p>
                      <p style={{ whiteSpace: "pre-line" }}>{t.script}</p>
                    </div>
                  ))}
                </section>
              )}

            {result.telegram &&
              result.telegram.length > 0 &&
              selectedPlatforms.includes("telegram") && (
                <section className="result-section">
                  <h3>📱 Telegram</h3>
                  {result.telegram.map((t: string, i: number) => (
                    <div key={i} className="result-post">
                      <div className="result-post-head">
                        <span className="result-post-num">#{i + 1}</span>
                      </div>
                      <p style={{ whiteSpace: "pre-line" }}>{t}</p>
                    </div>
                  ))}
                </section>
              )}

            {result.email &&
              selectedPlatforms.includes("email") &&
              result.email.subject && (
                <section className="result-section">
                  <h3>✉️ Email-рассылка</h3>
                  <div className="result-post">
                    <div className="result-post-head">
                      <span className="result-post-tone">Subject</span>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 12 }}>
                      {result.email.subject}
                    </p>
                    <p style={{ whiteSpace: "pre-line" }}>{result.email.body}</p>
                  </div>
                </section>
              )}

            {result.hooks && result.hooks.length > 0 && (
              <section className="result-section">
                <h3>🎣 Хуки</h3>
                <ul className="result-list">
                  {result.hooks.map((h: string, i: number) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            {result.ctas && result.ctas.length > 0 && (
              <section className="result-section">
                <h3>📢 CTA</h3>
                <ul className="result-list">
                  {result.ctas.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={null}>
      <GeneratePageInner />
    </Suspense>
  );
}

function formatAllText(result: any, selectedPlatforms: string[]): string {
  let text = "# Repurpose.ai — Результат генерации\n\n";

  if (result.twitter && selectedPlatforms.includes("twitter")) {
    text += "## X (Twitter)\n\n";
    result.twitter.forEach((t: any, i: number) => {
      text += `### Пост ${i + 1}${t.tone ? ` (${t.tone})` : ""}\n${t.text}\n\n`;
    });
  }

  if (result.linkedin && selectedPlatforms.includes("linkedin")) {
    text += "## LinkedIn\n\n";
    result.linkedin.forEach((t: string, i: number) => {
      text += `### Пост ${i + 1}\n${t}\n\n`;
    });
  }

  if (result.tiktok && selectedPlatforms.includes("tiktok")) {
    text += "## TikTok / Reels\n\n";
    result.tiktok.forEach((t: any, i: number) => {
      text += `### Сценарий ${i + 1}\n**Hook:** ${t.hook}\n\n${t.script}\n\n`;
    });
  }

  if (result.telegram && selectedPlatforms.includes("telegram")) {
    text += "## Telegram\n\n";
    result.telegram.forEach((t: string, i: number) => {
      text += `### Пост ${i + 1}\n${t}\n\n`;
    });
  }

  if (result.email && selectedPlatforms.includes("email")) {
    text += "## Email\n\n";
    text += `**Тема:** ${result.email.subject}\n\n${result.email.body}\n\n`;
  }

  if (result.hooks && result.hooks.length > 0) {
    text += "## Хуки\n\n";
    result.hooks.forEach((h: string) => {
      text += `- ${h}\n`;
    });
    text += "\n";
  }

  if (result.ctas && result.ctas.length > 0) {
    text += "## CTA\n\n";
    result.ctas.forEach((c: string) => {
      text += `- ${c}\n`;
    });
  }

  return text;
}