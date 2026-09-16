"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

function SignupPageInner() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-mark">R</span>
          <span>Repurpose.ai</span>
        </Link>

        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="auth-subtitle">3 бесплатные генерации. Без карты.</p>

        <form action={handleSubmit} className="auth-form">
          <input type="hidden" name="source" value={source} />

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm" className="auth-label">
              Повтори пароль
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Ещё раз"
              required
              minLength={6}
              className="auth-input"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Создаём..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="auth-footer">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="auth-link">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}