import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Repurpose.ai — одно видео → 30+ постов для соцсетей",
    template: "%s | Repurpose.ai",

  },
  description:
    "AI-инструмент, который превращает ссылку на YouTube в 30+ готовых постов для X, LinkedIn, TikTok, Telegram и email. Бесплатно 3 генерации.",
  keywords: [
    "AI контент",
    "репурпозинг",
    "YouTube в посты",
    "генерация постов",
    "AI для маркетологов",
    "SaaS",
  ],
  authors: [{ name: "Kooklay" }],
  creator: "Kooklay",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://repurpose-ai-kooklay.vercel.app",
    title: "Repurpose.ai — одно видео → 30+ постов",
    description:
      "AI-инструмент для создания контента из одного YouTube-видео. 30+ постов за 60 секунд.",
    siteName: "Repurpose.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repurpose.ai — одно видео → 30+ постов",
    description: "AI-инструмент для репурпозинга контента.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Добавь после добавления в Яндекс.Вебмастер и Google Search Console
    // yandex: "твой-код-подтверждения",
    // google: "твой-код-подтверждения",
  },
  other: {
    telderi: "5ad07242091e57a07ef9d42270ac95e5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}