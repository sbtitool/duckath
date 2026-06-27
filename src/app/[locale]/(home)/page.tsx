import { User, Search } from "lucide-react";
import GameGrid, { HomeGame } from "@/components/home/game-grid";
import Image from "next/image";
import Link from "next/link";

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
    title: "DuckMath - Games",
    description:
      "Play games and study math.",
    openGraph: {
      title: "DuckMath - Games",
      description:
        "Play games and study math.",
      images: ["/imgs/duck.svg"],
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Generate some placeholder games with varying sizes
const PLACEHOLDER_GAMES: HomeGame[] = Array.from({ length: 120 }).map((_, i) => {
  // Make some games larger (span 3x3 or 2x2) for a masonry/dynamic feel
  const isLarge = [0, 18, 45, 77, 102].includes(i); // 3x3 (380x380)
  const isMedium = [4, 9, 12, 22, 31, 35, 42, 51, 58, 67, 82, 88, 95].includes(i); // 2x2 (250x250)

  let spanClass = "col-span-1 row-span-1";
  if (isLarge) spanClass = "col-span-3 row-span-3";
  else if (isMedium) spanClass = "col-span-2 row-span-2";

  // Assign random vibrant background colors to placeholders
  const colors = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", 
    "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-teal-400",
    "bg-orange-400", "bg-cyan-400"
  ];
  const bgColor = colors[i % colors.length];

  return {
    id: i,
    title: `Game ${i + 1}`,
    spanClass,
    bgColor,
    href: `/class/game-${i + 1}`,
  };
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#80D893] p-2 lg:p-4">
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
          <div className="flex flex-1 flex-col items-center justify-between rounded-lg bg-black p-4 text-center text-white">
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

        {/* Main Games */}
        <GameGrid games={PLACEHOLDER_GAMES} />
      </div>
    </main>
  );
}
