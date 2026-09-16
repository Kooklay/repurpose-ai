"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "../auth/actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
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

        <h1 className="auth-title">Вход</h1>
        <p className="auth-subtitle">
          Войди, чтобы продолжить работу
        </p>

        <form action={handleSubmit} className="auth-form">
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
              className="auth-input"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="auth-footer">
          Нет аккаунта?{" "}
          <Link href="/signup" className="auth-link">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}