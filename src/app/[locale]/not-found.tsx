import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getHomeGames } from "@/lib/games-server";
import type { HomeGame } from "@/components/home/game-grid";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

export const metadata = {
  title: "Page Not Found - Plants vs Brainrots Unblocked",
  description: "The page you are looking for does not exist. Browse 600+ free online games on Plants vs Brainrots Unblocked.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Page Not Found - Plants vs Brainrots Unblocked",
    description: "Browse 600+ free online games. Play now!",
    url: WEB_URL,
    images: [{ url: "/imgs/og-cover.jpg", width: 1200, height: 630 }],
  },
};

export default function NotFound() {
  const homeGames: HomeGame[] = getHomeGames();
  const popularGames = homeGames.slice(0, 8);

  return (
    <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto max-w-[800px] py-12 text-center">

        {/* Logo & Brand */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-90">
          <Image
            src="/imgs/Plants-Vs-Brainrots-logo.png"
            alt="Plants vs Brainrots Unblocked"
            width={88}
            height={36}
            className="object-contain"
          />
          <span className="text-xl font-black tracking-tight text-gray-900">
            Plants vs Brainrots
          </span>
        </Link>

        {/* 404 Content */}
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
          Browse 600+ free online games instead.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/game/plants-vs-brainrots"
            className="inline-flex items-center rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors"
          >
            Play Plants vs Brainrots
          </Link>
        </div>

        {/* Popular Games Grid */}
        {popularGames.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">
              Popular Free Games
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularGames.map((game) => (
                <Link
                  key={game.id}
                  href={game.href || `/game/${game.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-lg bg-white shadow-sm border p-3 hover:shadow-md transition-shadow text-left"
                >
                  {game.image?.src && (
                    <Image
                      src={game.image.src}
                      alt={game.image.alt || game.title}
                      width={120}
                      height={90}
                      className="w-full h-20 object-cover rounded mb-2"
                      unoptimized
                    />
                  )}
                  <span className="text-xs font-semibold text-gray-800 line-clamp-2">
                    {game.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Prompt */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition-colors"
          >
            <Search className="size-4" />
            Browse All 600+ Games
          </Link>
        </div>
      </div>
    </main>
  );
}