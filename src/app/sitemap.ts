import type { MetadataRoute } from "next";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://duckmath.com";
const DATA_FILES = ["/games/data_1.json", "/games/data_2.json", "/games/data_3.json"];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gameEntries: MetadataRoute.Sitemap = [];

  for (const file of DATA_FILES) {
    try {
      const res = await fetch(`${WEB_URL}${file}`, { next: { revalidate: 86400 } });
      if (!res.ok) continue;
      const games: GameItem[] = await res.json();
      for (const game of games) {
        gameEntries.push({
          url: `${WEB_URL}/class/${slugify(game.title)}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    } catch {
      continue;
    }
  }

  return [
    {
      url: WEB_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...gameEntries,
  ];
}
