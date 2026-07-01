import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";
const DATA_FILES = ["main.json", "data_1.json", "data_2.json", "data_3.json"];

type GameItem = {
  id: string;
  title: string;
  category: string;
  description: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readGamesJson(filename: string): GameItem[] {
  try {
    const filePath = path.join(process.cwd(), "public", "games", filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as GameItem[];
  } catch {
    return [];
  }
}

const PVB_SLUG = "plants-vs-brainrots";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: WEB_URL,                         lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${WEB_URL}/codes`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${WEB_URL}/about-game`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${WEB_URL}/discord`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${WEB_URL}/game/${PVB_SLUG}`,    lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
  ];

  const gameEntries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  for (const filename of DATA_FILES) {
    const games = readGamesJson(filename);
    for (const game of games) {
      const slug = slugify(game.title);
      if (seen.has(slug)) continue;
      seen.add(slug);

      const isPvb = slug === PVB_SLUG;
      gameEntries.push({
        url: `${WEB_URL}/game/${slug}`,
        lastModified: new Date(),
        changeFrequency: isPvb ? ("daily" as const) : ("weekly" as const),
        priority: isPvb ? 0.95 : 0.7,
      });
    }
  }

  return [...staticPages, ...gameEntries];
}
