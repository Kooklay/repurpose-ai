import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Защита: если не залогинен — на /login
  if (!user) {
    redirect("/login");
  }

  // Берём профиль из public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const generationsUsed = profile?.generations_used ?? 0;
  const generationsLimit = profile?.generations_limit ?? 3;
  const plan = profile?.plan ?? "free";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#fafafa" }}>
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">R</span>
            Repurpose.ai
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn-ghost" style={{ display: "inline-block" }}>
              Выйти
            </button>
          </form>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ maxWidth: "1152px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "60px" }}>
          <p style={{ fontSize: "14px", color: "#a1a1aa", marginBottom: "8px" }}>
            Личный кабинет
          </p>
          <h1 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Привет, {user.email}
          </h1>
          <p style={{ fontSize: "16px", color: "#a1a1aa" }}>
            Тариф: <strong style={{ color: "#7c3aed" }}>{plan.toUpperCase()}</strong>
          </p>
        </div>

        {/* USAGE CARD */}
        <div
          style={{
            padding: "32px",
            border: "1px solid #26262b",
            borderRadius: "16px",
            background: "rgba(24, 24, 27, 0.6)",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Использование</h2>
            <span style={{ fontSize: "14px", color: "#a1a1aa" }}>
              {generationsUsed} из {generationsLimit} генераций
            </span>
          </div>
          <div
            style={{
              height: "8px",
              background: "#18181b",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (generationsUsed / generationsLimit) * 100)}%`,
                height: "100%",
                background: "linear-gradient(to right, #7c3aed, #a78bfa)",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* NEW GENERATION BUTTON */}
        <div
          style={{
            padding: "48px 32px",
            border: "1px dashed #34343a",
            borderRadius: "16px",
            background: "rgba(24, 24, 27, 0.3)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
            Новая генерация
          </h2>
          <p style={{ fontSize: "14px", color: "#a1a1aa", marginBottom: "24px" }}>
            Вставь ссылку на YouTube, статью или подкаст — получи 30+ постов
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: "12px 24px", fontSize: "14px" }}
            disabled
          >
            Скоро — генерация через AI
          </button>
        </div>

        {/* INFO */}
        <p style={{ marginTop: "32px", fontSize: "13px", color: "#71717a", textAlign: "center" }}>
          Генерация контента появится после подключения OpenAI API. Следи за обновлениями.
        </p>
      </main>
    </div>
  );
}