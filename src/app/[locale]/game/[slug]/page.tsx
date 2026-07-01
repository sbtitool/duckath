import { User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GameIframe from "@/components/home/game-iframe";
import GameInfoBar from "@/components/home/game-info-bar";
import RelatedGames from "@/components/home/related-games";
import AdUnit from "@/components/home/adsense-ad";
import Footer from "@/components/layout/footer";
import { getGameBySlug, getRelatedGames } from "@/lib/games-server";
import { slugify } from "@/lib/games";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const game = getGameBySlug(slug);
  const title = game?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = game?.description || `Play ${title} online for free on Plants vs Brainrots. No download required.`;

  // localePrefix "as-needed": en 无前缀，其他语言有 /locale/ 前缀
  const canonical = locale === "en"
    ? `${WEB_URL}/game/${slug}`
    : `${WEB_URL}/${locale}/game/${slug}`;

  return {
    title: `Play ${title} Unblocked FREE - Plants vs Brainrots`,
    description: description.slice(0, 145) + " Play now for free!",
    keywords: game?.tags || `${title}, unblocked, online game, free game, browser game`,
    openGraph: {
      title: `Play ${title} Unblocked FREE - Plants vs Brainrots`,
      description: description.slice(0, 145) + " Play now for free!",
      // OG image: 优先用游戏缩略图（外链），回退 JPG
      images: game?.thumb
        ? [{ url: game.thumb, width: 512, height: 384 }]
        : [{ url: "/imgs/og-cover.jpg", width: 1200, height: 630 }],
      type: "website",
      url: canonical,
    },
    // hreflang via alternates.languages（Next.js 自动输出 <link rel="alternate">）
    alternates: {
      canonical,
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
  const isPvb = slug === "plants-vs-brainrots";
  const title = game?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // VideoGame JSON-LD（服务端渲染，替代 game-iframe.tsx 中的 client 端版本）
  const videoGameJsonLd = game
    ? {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        description: game.description,
        genre: game.category,
        gamePlatform: ["Web Browser", "Desktop", "Mobile", "Tablet"],
        applicationCategory: "Game",
        operatingSystem: "Any",
        url: `${WEB_URL}/game/${slugify(game.title)}`,
        image: game.thumb,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: WEB_URL },
      { "@type": "ListItem", position: 2, name: title, item: `${WEB_URL}/game/${slug}` },
    ],
  };

  // FAQPage JSON-LD（匹配页面下方的 Q&A 内容）
  const faqJsonLd = game
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How can I play ${title} for free?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can play ${title} for free on Plants vs Brainrots Unblocked. No download or registration required — just open your browser and click Play.`,
            },
          },
          {
            "@type": "Question",
            name: `Can I play ${title} on mobile devices and desktop?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${title} can be played on Desktop, Tablet, and Mobile. Works on all modern browsers with no installation needed.`,
            },
          },
        ],
      }
    : null;

  return (
    <>
      {/* JSON-LD 服务端注入 */}
      {videoGameJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <main className="min-h-screen p-2 lg:p-4">
        <div className="mx-auto max-w-[1420px] grid grid-flow-dense grid-cols-[repeat(auto-fill,120px)] auto-rows-[120px] gap-[10px] justify-center pb-10">

          {/* LEFT SIDEBAR — nav 语义化 */}
          <div className="hidden col-span-1 row-span-4 flex-col gap-[10px] lg:flex">
            <div className="flex h-[120px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
              <nav aria-label="Site navigation">
                <Link href="/" className="flex flex-1 flex-col items-center justify-center hover:opacity-90 min-h-0 h-[72px]">
                  {/* alt 改为语义描述 */}
                  <Image
                    src="/imgs/Plants-Vs-Brainrots-logo.png"
                    alt="Plants vs Brainrots – Free Unblocked Games"
                    width={88}
                    height={36}
                    className="shrink-0 object-contain"
                  />
                </Link>
              </nav>
              <div className="flex h-12 shrink-0">
                <button
                  className="flex flex-1 items-center justify-center bg-[#549E5E] text-white transition-colors hover:bg-[#46864F]"
                  aria-label="User account"
                >
                  <User className="size-6" strokeWidth={3} />
                </button>
                <button
                  className="flex flex-1 items-center justify-center bg-[#4AB27A] text-white transition-colors hover:bg-[#3D9465]"
                  aria-label="Search games"
                >
                  <Search className="size-6" strokeWidth={3} />
                </button>
              </div>
            </div>
          {/* Sidebar Ad Placeholder */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px] bg-[#9ae8aa] p-3 text-center">
              <span className="text-[10px] font-bold tracking-widest text-green-800/60">AD</span>
              <div className="mt-2 w-full flex-1 rounded-[8px] bg-white/50 border border-green-700/10 flex items-center justify-center">
                <AdUnit slot="2522279605" />
              </div>
            </div>
          </div>

          {/* MAIN GAME AREA */}
          <div className="col-span-full row-span-4 lg:col-span-6 lg:row-span-4 xl:col-span-8 xl:row-span-5 flex flex-col overflow-hidden rounded-[8px] bg-white shadow-sm">
            <GameIframe game={game} />
            <GameInfoBar game={game} />
          </div>

          {/* Ad Placeholder */}
          <div className="col-span-full md:row-span-2 lg:col-span-7 xl:col-span-9 flex flex-col items-center justify-center rounded-[8px] bg-[#9ae8aa] p-4 text-center">
            <span className="text-xs font-bold tracking-widest text-green-800/60">ADVERTISEMENT</span>
            <div className="mt-2 w-full flex-1 rounded-[8px] bg-white/50 border border-green-700/10 flex items-center justify-center">
              <AdUnit slot="5687077530" />
            </div>
          </div>

          {/* RELATED GAMES */}
          <RelatedGames games={related} />

        </div>

        {/* Game Description — SEO section */}
        {game && (
          <div className="mx-[50px] mt-4 max-w-[1420px] rounded-[8px] bg-[#1a1a1a] p-6 lg:p-8 text-white">
            {/* Breadcrumb 可见轻量导航（复用 about/codes 页文字样式） */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1.5 text-xs text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-300 truncate max-w-[240px]">{title}</li>
              </ol>
            </nav>

            {/* H1：游戏页面核心标题 */}
            <h1 className="mb-4 text-3xl font-bold">{title}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-300">
                <span className="text-white mr-2">Free</span>
                <span>Online Game</span>
              </div>
              {game.category && (
                <span className="flex items-center rounded-full bg-[#1a56db] px-3 py-1.5 text-xs font-semibold text-white">
                  <svg className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                <h3 className="mb-2 text-xl font-bold text-white">Developer</h3>
                <p className="text-sm text-gray-300">Supersonic Studios Ltd</p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold text-white">Controls</h3>
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
                <h3 className="mb-2 text-xl font-bold text-white">Devices</h3>
                <p className="text-sm text-gray-300">{title} can be played on: Desktop, Tablet, Mobile</p>
              </div>

              {/* FAQ 内容与 FAQPage JSON-LD 保持一致 */}
              <div>
                <h3 className="mb-2 text-xl font-bold text-white">How can I play {title.toLowerCase()} for free?</h3>
                <p className="text-sm text-gray-300">
                  You can play {title.toLowerCase()} for free on Plants vs Brainrots Unblocked. No download or registration required — just open your browser and click Play.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold text-white">Can I play {title.toLowerCase()} on mobile devices and desktop?</h3>
                <p className="text-sm text-gray-300">
                  {title} can be played on Desktop, Tablet, and Mobile. Works on all modern browsers with no installation needed.
                </p>
              </div>

              {/* ── 内链区块：关键词锚文字链向核心页面 ─────────────── */}
              <div className="mt-4 border-t border-white/10 pt-6">
                <h3 className="mb-3 text-base font-semibold text-gray-400 uppercase tracking-widest">
                  {isPvb ? "Plants vs Brainrots Resources" : "More Free Unblocked Games"}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  {isPvb ? (
                    // PVB 专属内链：融入高搜索量 PVB 关键词（480~880/mo）
                    <>
                      <Link href="/codes" className="rounded-full border border-green-700/50 bg-green-900/20 px-4 py-1.5 text-green-300 hover:bg-green-900/40 hover:text-green-200 transition-colors">
                        Plants vs Brainrots Codes
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Game Guide
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Rebirths
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Fuse Guide
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Mutations
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Events
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Unblocked
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Online
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Free Online Games
                      </Link>
                    </>
                  ) : (
                    // 通用游戏内链：覆盖 unblocked games 系列关键词
                    <>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Unblocked
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Free Online Games
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Unblocked Games for School
                      </Link>
                      <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Browser Games No Download
                      </Link>
                      <Link href="/game/plants-vs-brainrots" className="rounded-full border border-green-700/50 bg-green-900/20 px-4 py-1.5 text-green-300 hover:bg-green-900/40 hover:text-green-200 transition-colors">
                        Play Plants vs Brainrots
                      </Link>
                      <Link href="/codes" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Codes
                      </Link>
                      <Link href="/about-game" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Plants vs Brainrots Guide
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
