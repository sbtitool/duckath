import { User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/home/game-grid";
import { getHomeGames } from "@/lib/games-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    title: "DuckMath - Free Online Games | Play Instantly in Browser",
    description:
      "Play 600+ free online games instantly in your browser. No download required. Action, puzzle, racing, sports, arcade games and more.",
    keywords: "free online games, browser games, html5 games, unblocked games, play games online, no download games",
    openGraph: {
      title: "DuckMath - Free Online Games",
      description:
        "Play 600+ free online games instantly in your browser. No download required.",
      images: ["/imgs/duck.svg"],
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function LandingPage() {
  const homeGames = getHomeGames();

  return (
    <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto grid grid-flow-dense grid-cols-[repeat(auto-fill,120px)] auto-rows-[120px] gap-[10px] justify-center pb-10">

        {/* Navigation & Ad Column - Blends into grid but stays vertical */}
        <div className="col-span-1 row-span-4 flex flex-col gap-[10px]">
          {/* Logo & Actions Card (120x120 container) */}
          <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Logo Area */}
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

            {/* Action Buttons */}
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
          <div className="flex flex-1 flex-col items-center justify-between rounded-[8px] bg-black p-4 text-center text-white">
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
        </div>

        {/* Main Games - server-rendered */}
        <GameGrid games={homeGames} />
      </div>
    </main>
  );
}
