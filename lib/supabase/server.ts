import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — не может менять cookies
          }
        },
      },
      global: {
        fetch: async (url, options) => {
          // Retry для ECONNRESET (частый в РФ)
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              return await fetch(url, options);
            } catch (error) {
              const isLastAttempt = attempt === 2;
              if (isLastAttempt) throw error;
              await new Promise((r) => setTimeout(r, 500));
            }
          }
          throw new Error("Все попытки исчерпаны");
        },
      },
    }
  );
}