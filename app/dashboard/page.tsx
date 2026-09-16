import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const generationsUsed = profile?.generations_used ?? 0;
  const generationsLimit = profile?.generations_limit ?? 3;
  const plan = profile?.plan ?? "free";

  // История генераций
  const { data: generations } = await supabase
    .from("generations")
    .select("id, source_url, status, created_at, tokens_used")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

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
            <button
              type="submit"
              className="btn-ghost"
              style={{ display: "inline-block" }}
            >
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
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            Привет, {user.email}
          </h1>
          <p style={{ fontSize: "16px", color: "#a1a1aa" }}>
            Тариф:{" "}
            <strong style={{ color: "#7c3aed" }}>{plan.toUpperCase()}</strong>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
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
                width: `${Math.min(
                  100,
                  (generationsUsed / generationsLimit) * 100
                )}%`,
                height: "100%",
                background: "linear-gradient(to right, #7c3aed, #a78bfa)",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* NEW GENERATION */}
        <div
          style={{
            padding: "48px 32px",
            border: "1px dashed #34343a",
            borderRadius: "16px",
            background: "rgba(24, 24, 27, 0.3)",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
            Новая генерация
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#a1a1aa",
              marginBottom: "24px",
            }}
          >
            Вставь ссылку на YouTube, статью или подкаст — получи 30+ постов
          </p>
          <Link
            href="/generate"
            className="btn-primary"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Новая генерация →
          </Link>
        </div>

        {/* HISTORY */}
        {generations && generations.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              История генераций
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    border: "1px solid #26262b",
                    borderRadius: "12px",
                    background: "rgba(24, 24, 27, 0.6)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#e4e4e7",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {gen.source_url || "Текстовая генерация"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#71717a" }}>
                      {new Date(gen.created_at).toLocaleString("ru-RU")}
                      {" · "}
                      {gen.status === "done" &&
                        `✅ Готово (${gen.tokens_used} токенов)`}
                      {gen.status === "pending" && "⏳ В процессе"}
                      {gen.status === "transcribing" && "🎤 Транскрипция"}
                      {gen.status === "generating" && "🤖 Генерация"}
                      {gen.status === "error" && "❌ Ошибка"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}