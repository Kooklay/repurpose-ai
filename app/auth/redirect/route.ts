import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source") || "";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Если залогинен → сразу на /generate с предзаполненным URL
  if (user) {
    return NextResponse.redirect(
      new URL(`/generate?source=${encodeURIComponent(source)}`, request.url)
    );
  }

  // Если не залогинен → на /signup, но с сохранением source
  return NextResponse.redirect(
    new URL(`/signup?source=${encodeURIComponent(source)}`, request.url)
  );
}