import { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://tafsiir.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/quran`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/chat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const surahRoutes: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${base}/quran/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...surahRoutes];
}
