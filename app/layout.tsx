import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Repurpose.ai — одно видео → контент на неделю вперёд",
  description:
    "Вставь ссылку на YouTube, статью или подкаст. Получи 30+ готовых постов для X, LinkedIn, TikTok, Telegram и email — за 60 секунд.",
  openGraph: {
    title: "Repurpose.ai — одно видео → контент на неделю вперёд",
    description:
      "30+ готовых постов для X, LinkedIn, TikTok, Telegram и email из одной ссылки.",
    type: "website",
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