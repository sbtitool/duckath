import { GameItem } from "@/types/game";

const DATA_FILES = ["/games/data_1.json", "/games/data_2.json", "/games/data_3.json"];

let allCached: GameItem[] | null = null;

export async function loadAllGames(): Promise<GameItem[]> {
  if (allCached) return allCached;
  const results = await Promise.all(
    DATA_FILES.map(async (file) => {
      try {
        const res = await fetch(file, { cache: "force-cache" });
        if (!res.ok) return [];
        return (await res.json()) as GameItem[];
      } catch {
        return [];
      }
    })
  );
  allCached = results.flat();
  return allCached;
}

/** Load a single page (JSON file) by index. Returns [] if out of range. */
export async function loadGamesPage(pageIndex: number): Promise<GameItem[]> {
  if (pageIndex < 0 || pageIndex >= DATA_FILES.length) return [];
  try {
    const res = await fetch(DATA_FILES[pageIndex], { cache: "force-cache" });
    if (!res.ok) return [];
    return (await res.json()) as GameItem[];
  } catch {
    return [];
  }
}

export function getTotalPages(): number {
  return DATA_FILES.length;
}

export function getCategories(games: GameItem[]): string[] {
  const cats = new Set(games.map((g) => g.category));
  return ["All", ...Array.from(cats).sort()];
}

export function filterGames(
  games: GameItem[],
  opts: { category?: string; search?: string } = {}
): GameItem[] {
  let result = games;

  if (opts.category && opts.category !== "All") {
    result = result.filter((g) => g.category === opts.category);
  }

  if (opts.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.tags.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }

  return result;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
