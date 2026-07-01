import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/home/game-grid";
import AdUnit from "@/components/home/adsense-ad";
import { getHomeGames } from "@/lib/games-server";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const canonicalUrl = locale === "en" ? WEB_URL : `${WEB_URL}/${locale}`;

  return {
    title: "Plants vs Brainrots Unblocked - Play FREE Online Games 2026",
    description:
      "Play Plants vs Brainrots unblocked + 600 free online games instantly in your browser. No download required. Action, puzzle, racing, sports, arcade games and more. Play now!",
    keywords:
      "plants vs brainrots, plants vs brainrots unblocked, plants vs brainrots game, free online games, browser games, html5 games, unblocked games, no download games",
    openGraph: {
      title: "Plants vs Brainrots Unblocked - Play Free Online Games",
      description:
        "Play Plants vs Brainrots unblocked + 600 free online games. No download required. Play now!",
      // ① OG image
      images: [{ url: "/imgs/og-cover.jpg", width: 1200, height: 630 }],
      type: "website",
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ② WebSite JSON-LD（含 SearchAction，sitelinks searchbox 信号）
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Plants vs Brainrots Unblocked",
  url: WEB_URL,
  description:
    "Play Plants vs Brainrots unblocked + 600 free online games. No download required.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${WEB_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function LandingPage() {
  const homeGames = getHomeGames();

  return (
    <>
      {/* ③ WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <main className="min-h-screen p-2 lg:p-4">

        <div className="mx-auto max-w-[1420px] grid grid-flow-dense grid-cols-[repeat(auto-fill,120px)] auto-rows-[120px] gap-[10px] justify-center pb-10">

          {/* Navigation & Ad Column */}
          <div className="col-span-1 row-span-4 flex flex-col gap-[10px]">
            {/* Logo & Actions Card */}
            <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* ⑤ nav 语义化包裹 Logo 区 */}
              <nav aria-label="Site navigation">
                <Link href="/" className="flex flex-1 flex-col items-center justify-center hover:opacity-90 min-h-0 h-[72px]">
                  {/* ⑥ alt 改为有 SEO 语义的描述 */}
                  <Image
                    src="/imgs/Plants-Vs-Brainrots-logo.png"
                    alt="Plants vs Brainrots – Free Unblocked Games"
                    width={88}
                    height={36}
                    className="shrink-0 object-contain"
                  />
                  {/* Logo text hidden — logo image already contains brand name */}
                </Link>
              </nav>

              {/* Action Buttons — removed User & Search */}
            </div>

          {/* Sidebar Ad Placeholder */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px] bg-[#9ae8aa] p-3 text-center">
              <span className="text-[10px] font-bold tracking-widest text-green-800/60">AD</span>
              <AdUnit slot="2522279605" />
            </div>
          </div>

          {/* Main Games - server-rendered */}
          <GameGrid games={homeGames} />
        </div>

        {/* ⑦ 首页详情模块 */}
        <div className="mx-[50px] mt-4 max-w-[1420px] rounded-[8px] bg-[#1a1a1a] p-6 lg:p-8 text-white">
          <h1 className="mb-4 text-3xl font-bold">
            Plants vs Brainrots Unblocked – 600+ Free Browser Games
          </h1>

          <div className="text-sm leading-relaxed text-gray-300 space-y-4 mb-8">
            <p>
              Plants vs Brainrots Unblocked is your go-to destination for free browser games,
              featuring the viral Roblox tower defense hit <strong>Plants vs Brainrots</strong> and
              600+ additional HTML5 games across action, puzzle, racing, sports, and arcade genres.
              No download, no registration — play instantly on desktop, tablet, or mobile.
            </p>
            <p>
              All games run directly in your browser via HTML5 and WebGL, making them fully
              unblocked on school Chromebooks and work networks. New games are added daily.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            {/* About PVB */}
            <div>
              <h3 className="mb-2 text-xl font-bold text-white">What is Plants vs Brainrots?</h3>
              <p className="text-sm text-gray-300">
                Plants vs Brainrots is a viral Roblox tower defense game developed by Yo Gurt Studio.
                It combines the classic Plants vs Zombies formula with internet meme culture, featuring
                15+ unique plants, collectible Brainrots that generate passive income, a fusion system,
                and rebirth multipliers. With over 8.6 million concurrent players at peak, it is one of
                the most popular Roblox games in 2026.
              </p>
            </div>

            {/* How to Play */}
            <div>
              <h3 className="mb-2 text-xl font-bold text-white">How to Play Plants vs Brainrots</h3>
              <p className="text-sm text-gray-300">
                Click the featured Plants vs Brainrots tile to launch the game in your browser. Buy seeds,
                plant them in your garden, defend against Brainrot waves, and collect defeated Brainrots as
                passive income sources. Fuse plants and Brainrots for rare hybrids, then rebirth to earn
                permanent multipliers. No download required — plays entirely in your browser.
              </p>
            </div>

            {/* FAQ rows */}
            <div>
              <h3 className="mb-2 text-xl font-bold text-white">Are all games free to play?</h3>
              <p className="text-sm text-gray-300">
                Yes. Every game on Plants vs Brainrots Unblocked is 100% free. There are no paywalls,
                no mandatory accounts, and no time limits. Just click and play.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-bold text-white">Do games work on mobile and tablet?</h3>
              <p className="text-sm text-gray-300">
                Yes. All HTML5 games support touch controls and run on modern mobile browsers (Chrome,
                Safari, Firefox). The layout is responsive and adapts automatically to your screen size.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-bold text-white">Why are these games &quot;unblocked&quot;?</h3>
              <p className="text-sm text-gray-300">
                The games are hosted directly and do not rely on blocked platforms. They load over standard
                HTTPS, which means they work on school Chromebooks and networks that restrict gaming sites.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/game/plants-vs-brainrots"
                className="inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-gray-200 transition-colors"
              >
                Play Plants vs Brainrots Now →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
