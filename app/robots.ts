import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://repurpose-ai-kooklay.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/generate", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}