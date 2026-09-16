import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем путям КРОМЕ:
     * - _next/static (статические файлы)
     * - _next/image (оптимизация картинок)
     * - favicon.ico, sitemap.xml, robots.txt
     * - картинок (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};