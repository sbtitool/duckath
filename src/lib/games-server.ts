import fs from "fs";
import path from "path";
import { GameItem } from "@/types/game";
import { slugify } from "@/lib/games";

const CATEGORY_COLORS: Record<string, string> = {
  Puzzle: "bg-purple-400",
  Hypercasual: "bg-pink-400",
  Arcade: "bg-orange-400",
  Shooting: "bg-red-400",
  Sports: "bg-green-400",
  Adventure: "bg-teal-400",
  Racing: "bg-yellow-400",
  Action: "bg-indigo-400",
  Clicker: "bg-cyan-400",
  Soccer: "bg-green-400",
  Cooking: "bg-orange-400",
  Boys: "bg-blue-400",
  Girls: "bg-pink-400",
  Stickman: "bg-gray-400",
};

const LARGE_INDICES = [0, 18, 45, 77, 102];
const MEDIUM_INDICES = [4, 9, 12, 22, 31, 35, 42, 51, 58, 67, 82, 88, 95];

type HomeGame = {
  id: number;
  title: string;
  spanClass: string;
  bgColor: string;
  href?: string;
  image?: { src: string; alt?: string };
};

// ---- Module-level cache (lives across requests in the same server process) ----

let _allGames: GameItem[] | null = null;
let _slugIndex: Map<string, GameItem> | null = null;
let _homeGames: HomeGame[] | null = null;

function readJsonFile(filename: string): GameItem[] {
  try {
    const filePath = path.join(process.cwd(), "public", "games", filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as GameItem[];
  } catch {
    return [];
  }
}

function ensureAllGames(): GameItem[] {
  if (_allGames) return _allGames;
  const main = readJsonFile("main.json");
  const page1 = readJsonFile("data_1.json");
  const page2 = readJsonFile("data_2.json");
  const page3 = readJsonFile("data_3.json");
  _allGames = [...main, ...page1, ...page2, ...page3];
  return _allGames;
}

function ensureSlugIndex(): Map<string, GameItem> {
  if (_slugIndex) return _slugIndex;
  const all = ensureAllGames();
  _slugIndex = new Map();
  for (const game of all) {
    _slugIndex.set(slugify(game.title), game);
  }
  return _slugIndex;
}

/** Server-side: load games for homepage (first 2 files, slice to 397 + PVB featured) */
export function getHomeGames(): HomeGame[] {
  if (_homeGames) return _homeGames;

  const page1 = readJsonFile("data_1.json");
  const page2 = readJsonFile("data_2.json");
  const all = [...page1, ...page2.slice(0, 197)];

  // Featured game: Plants vs Brainrots at index 0 with large span
  const pvbGame = ensureAllGames()[0];
  const featured: HomeGame = {
    id: -1,
    title: pvbGame.title,
    spanClass: "col-span-3 row-span-3",
    bgColor: "bg-indigo-400",
    href: `/game/${slugify(pvbGame.title)}`,
    image: { src: "/imgs/PlantsVsBrainrots-f500x500.webp", alt: "Plants vs Brainrots Unblocked Featured Game" },
  };

  const mappedGames = all.map((game, i) => {
    const isLarge = LARGE_INDICES.includes(i);
    const isMedium = MEDIUM_INDICES.includes(i);
    let spanClass = "col-span-1 row-span-1";
    if (isLarge) spanClass = "col-span-3 row-span-3";
    else if (isMedium) spanClass = "col-span-2 row-span-2";

    return {
      id: i,
      title: game.title,
      spanClass,
      bgColor: CATEGORY_COLORS[game.category] || "bg-gray-400",
      href: `/game/${slugify(game.title)}`,
      image: { src: game.thumb, alt: game.title },
    };
  });

  _homeGames = [featured, ...mappedGames];

  return _homeGames;
}

/** Server-side: find one game by slug (O(1) lookup via cached index) */
export function getGameBySlug(slug: string): GameItem | null {
  const index = ensureSlugIndex();
  return index.get(slug) || null;
}

/** Server-side: find related games by category */
export function getRelatedGames(slug: string, category: string, limit = 20): GameItem[] {
  const all = ensureAllGames();
  return all
    .filter((g) => g.category === category && slugify(g.title) !== slug)
    .slice(0, limit);
}
