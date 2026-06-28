import { User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GameIframe from "@/components/home/game-iframe";
import GameInfoBar from "@/components/home/game-info-bar";
import RelatedGames from "@/components/home/related-games";
import Footer from "@/components/layout/footer";
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
  const related = game ? getRelatedGames(slug, game.category, 44) : [];
  const title = game?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
    <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto max-w-[1420px] grid grid-flow-dense grid-cols-[repeat(auto-fill,120px)] auto-rows-[120px] gap-[10px] justify-center pb-10">

        {/* LEFT SIDEBAR */}
        <div className="hidden col-span-1 row-span-4 flex-col gap-[10px] lg:flex">
          <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <Link href="/" className="flex flex-1 flex-col items-center justify-center hover:opacity-90 min-h-0">
              <Image src="/imgs/duck.svg" alt="Logo" width={44} height={44} className="shrink-0" />
              <span className="text-[14px] font-black tracking-tight text-black mt-1 leading-none shrink-0">duckmath</span>
            </Link>
            <div className="flex h-12 shrink-0">
              <button className="flex flex-1 items-center justify-center bg-[#549E5E] text-white transition-colors hover:bg-[#46864F]">
                <User className="size-6" strokeWidth={3} />
              </button>
              <button className="flex flex-1 items-center justify-center bg-[#4AB27A] text-white transition-colors hover:bg-[#3D9465]">
                <Search className="size-6" strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-between rounded-[8px] bg-black p-4 text-center text-white">
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
        <div className="col-span-full row-span-4 lg:col-span-6 lg:row-span-5 xl:col-span-8 xl:row-span-6 flex flex-col overflow-hidden rounded-[8px] bg-white shadow-sm">
          <GameIframe game={game} />
          <GameInfoBar game={game} />
        </div>

        {/* Ad Placeholder */}
        <div className="col-span-full md:row-span-2 lg:col-span-7 xl:col-span-9 flex flex-col items-center justify-center rounded-[8px] bg-[#9ae8aa] p-4 text-center">
          <span className="text-xs font-bold tracking-widest text-green-800/60">ADVERTISEMENT</span>
          <div className="mt-2 w-full flex-1 rounded-[8px] bg-white/50 border border-green-700/10 flex items-center justify-center">
            <span className="text-sm text-green-900/50">Banner Ad</span>
          </div>
        </div>


        {/* RELATED GAMES */}
        <RelatedGames games={related} />

      </div>
      {/* Game Description - SEO visible */}
      {game && (
        <div className="mx-auto mt-4 max-w-[1420px] rounded-[8px] bg-[#1a1a1a] p-6 lg:p-8 text-white">
          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-300">
              <span className="text-white mr-2">4.2</span>
              <span>11,258 VOTES</span>
            </div>
            {game.category && (
              <span className="flex items-center rounded-full bg-[#1a56db] px-3 py-1.5 text-xs font-semibold text-white">
                <svg className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {game.category}
              </span>
            )}
          </div>

          <div className="text-sm leading-relaxed text-gray-300 space-y-4">
            {game.description.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Developer</h2>
              <p className="text-sm text-gray-300">Supersonic Studios Ltd</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Controls</h2>
              {game.instructions ? (
                <ul className="list-inside list-disc text-sm text-gray-300 space-y-1">
                  {game.instructions
                    .split(/(?:bull |- |\n|(?<=\.) )/)
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                    .map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                </ul>
              ) : (
                <ul className="list-inside list-disc text-sm text-gray-300 space-y-1">
                  <li>W, A, S, D to move</li>
                  <li>Space to jump</li>
                  <li>Left Mouse Click to place blocks</li>
                  <li>Right Mouse Click to delete blocks</li>
                  <li>E to interact with objects</li>
                </ul>
              )}
            </div>

            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Devices</h2>
              <p className="text-sm text-gray-300">{title} can be played on: Desktop, Tablet, Mobile</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-bold text-white">How can I play {title.toLowerCase()} for free?</h2>
              <p className="text-sm text-gray-300">You can play {title.toLowerCase()} for free on Duckmath. No downloads or registration required!</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Can I play {title.toLowerCase()} on mobile devices and desktop?</h2>
              <p className="text-sm text-gray-300">{title.toLowerCase()} can be played on your computer and mobile devices like phones and tablets. Works on all modern browsers.</p>
            </div>
          </div>
        </div>
      )}
    </main>
      <Footer />
    </>
  );
}
