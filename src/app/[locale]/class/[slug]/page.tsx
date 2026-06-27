import { User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GameIframe from "@/components/home/game-iframe";
import GameInfoBar from "@/components/home/game-info-bar";
import RelatedGames from "@/components/home/related-games";
import { getGameBySlug, getRelatedGames } from "@/lib/games-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const title = game?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = game?.description || `Play ${title} online for free on DuckMath. No download required.`;

  return {
    title: `Play ${title} Online Free - DuckMath`,
    description: description.slice(0, 160),
    keywords: game?.tags || `${title}, online game, free game, browser game`,
    openGraph: {
      title: `Play ${title} Online Free - DuckMath`,
      description: description.slice(0, 160),
      images: game?.thumb ? [game.thumb] : ["/imgs/duck.svg"],
      type: "website",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/class/${slug}`,
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const related = game ? getRelatedGames(slug, game.category) : [];
  const title = game?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#80D893] p-2 lg:p-4">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-start lg:justify-center">

        {/* LEFT SIDEBAR */}
        <div className="hidden w-[140px] shrink-0 flex-col gap-[10px] lg:flex">
          <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <Link href="/" className="flex flex-1 flex-col items-center justify-center pt-2 hover:opacity-90">
              <Image src="/imgs/duck.svg" alt="Logo" width={40} height={40} />
              <span className="text-[13px] font-black tracking-tight text-black">duckmath</span>
            </Link>
            <div className="flex h-10 shrink-0">
              <button className="flex flex-1 items-center justify-center bg-[#549E5E] text-white transition-colors hover:bg-[#46864F]">
                <User className="size-5" />
              </button>
              <button className="flex flex-1 items-center justify-center bg-[#4AB27A] text-white transition-colors hover:bg-[#3D9465]">
                <Search className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[360px] flex-col items-center justify-between rounded-lg bg-black p-4 text-center text-white">
            <div className="text-sm font-black tracking-widest text-white/90">DUCKMATH</div>
            <div className="flex flex-col items-center">
              <div className="mb-1 text-3xl text-red-500">↓</div>
              <div className="mb-1 text-3xl text-red-500">↓</div>
              <div className="mb-3 text-3xl text-red-500">↓</div>
              <button className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black hover:bg-gray-200">JOIN NOW</button>
            </div>
          </div>
        </div>

        {/* MAIN GAME AREA */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <GameIframe game={game} />
            <GameInfoBar game={game} />
          </div>

          {/* Game Description - SEO visible */}
          {game && (
            <div className="rounded-xl bg-white p-4 lg:p-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{game.description}</p>
              {game.instructions && (
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">How to play</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{game.instructions}</p>
                </div>
              )}
              {game.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {game.tags.split(",").map((tag) => (
                    <span key={tag.trim()} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ad Placeholder */}
          <div className="rounded-xl bg-[#9ae8aa] p-4 text-center">
            <span className="text-xs font-bold tracking-widest text-green-800/60">ADVERTISEMENT</span>
            <div className="mt-2 h-[90px] w-full rounded-lg bg-white/50 border border-green-700/10 flex items-center justify-center">
              <span className="text-sm text-green-900/50">Banner Ad</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[280px]">
          <div className="flex justify-between items-center rounded-lg bg-black/10 px-4 py-2">
            <span className="text-sm font-bold text-green-900">MORE {game?.category?.toUpperCase() || "GAMES"}</span>
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            <RelatedGames games={related} />
          </div>
        </div>

      </div>
    </main>
  );
}
