import { User, Search, ThumbsUp, ThumbsDown, AlertCircle, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GameGrid, { HomeGame } from "@/components/home/game-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return {
    title: `DuckMath - Play ${slug}`,
    description: "Play this game on DuckMath.",
  };
}

// Generate some placeholder right-sidebar games
const RIGHT_SIDEBAR_GAMES: HomeGame[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1000,
  title: `Side Game ${i + 1}`,
  spanClass: "col-span-1 row-span-1",
  bgColor: ["bg-blue-400", "bg-red-400", "bg-green-400", "bg-purple-400"][i % 4],
  href: `/class/side-game-${i + 1}`,
}));

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  // Format the title from the slug (e.g., game-1 -> Game 1)
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#80D893] p-2 lg:p-4">
      {/* 
        Layout Grid:
        - Left Sidebar: fixed width or a small column (hidden on mobile, visible on lg)
        - Main Content: flex-1
        - Right Sidebar: fixed width or small column
      */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-start lg:justify-center">
        
        {/* LEFT SIDEBAR */}
        <div className="hidden w-[140px] shrink-0 flex-col gap-[10px] lg:flex">
          {/* Logo & Actions Card */}
          <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <Link href="/" className="flex flex-1 flex-col items-center justify-center pt-2 hover:opacity-90">
              <Image 
                src="/imgs/duck.svg" 
                alt="Logo" 
                width={40} 
                height={40} 
              />
              <span className="text-[13px] font-black tracking-tight text-black">
                duckmath
              </span>
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

          {/* Ad Placeholder */}
          <div className="flex h-[360px] flex-col items-center justify-between rounded-lg bg-black p-4 text-center text-white">
            <div className="text-sm font-black tracking-widest text-white/90">
              DUCKMATH
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-1 text-3xl text-red-500">↓</div>
              <div className="mb-1 text-3xl text-red-500">↓</div>
              <div className="mb-3 text-3xl text-red-500">↓</div>
              <button className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black hover:bg-gray-200">
                JOIN NOW
              </button>
            </div>
          </div>
          
          <div className="h-[200px] rounded-lg bg-cover bg-center shadow-sm" style={{ backgroundImage: "url('/imgs/game-ad.jpg')" }}>
             {/* Small game ad placeholder */}
             <div className="h-full w-full rounded-lg bg-black/20" />
          </div>
        </div>

        {/* MAIN GAME AREA */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/* Game Container (16:9 ratio approximately) */}
            <div className="relative aspect-video w-full bg-gradient-to-br from-[#805099] to-[#3a1c4a]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Fake Game Loading UI */}
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 rounded-3xl bg-yellow-400 p-2 shadow-xl ring-4 ring-purple-600/30">
                    <div className="h-full w-full rounded-2xl bg-yellow-300 flex items-center justify-center">
                       <span className="text-5xl">🙂</span>
                    </div>
                  </div>
                  <div className="mt-8 h-2 w-64 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-1/3 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-blue-100">
                  {/* Game Icon Placeholder */}
                  <div className="h-full w-full flex items-center justify-center bg-pink-300 text-2xl">
                    🎮
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{title} Unblocked</h1>
                  <p className="text-sm text-gray-500">by Freeplay LLC</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
                    <ThumbsUp className="size-6" />
                    <span className="text-xs font-medium">14.0K</span>
                  </button>
                  <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
                    <ThumbsDown className="size-6" />
                    <span className="text-xs font-medium">3.4K</span>
                  </button>
                </div>
                
                <div className="h-8 w-px bg-gray-200" />
                
                <div className="flex items-center gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                    <AlertCircle className="size-5" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                    <Maximize2 className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Below Game Ads / Additional Content */}
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
             <span className="text-sm font-bold text-green-900">RECOMMENDED</span>
           </div>
           {/* Right sidebar grid using the same components but in a smaller configuration */}
           <div className="grid grid-cols-2 gap-[10px]">
             {RIGHT_SIDEBAR_GAMES.map((game) => (
                <Link 
                  key={game.id} 
                  href={game.href || "#"}
                  className={`group relative overflow-hidden rounded-lg shadow-sm transition-transform duration-150 hover:scale-[1.01] hover:shadow-md aspect-square ${game.bgColor}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-white/50 mix-blend-overlay">
                      {game.id - 1000 + 1}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <span className="text-center text-sm font-bold text-white drop-shadow-md">
                      {game.title}
                    </span>
                    <button
                      type="button"
                      className="mt-2 rounded-full bg-white/25 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-white/40"
                    >
                      PLAY
                    </button>
                  </div>
                </Link>
             ))}
           </div>
        </div>

      </div>
    </main>
  );
}
