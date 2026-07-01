import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

// Hardcoded working codes — update periodically
const CODES = [
  { code: "frozenbiome", reward: "Frozen Biome Potion + Gems", added: "2026-06-28", working: true },
  { code: "gymevent", reward: "Free XP Vial + Speed Potion", added: "2026-06-25", working: true },
  { code: "newyear2026", reward: "Firework Bazooka + Gems", added: "2026-01-01", working: true },
  { code: "release", reward: "Starter Pack (Coins + Potions)", added: "2025-12-15", working: true },
  { code: "5mvisits", reward: "5M Celebration Reward", added: "2026-03-10", working: false },
  { code: "discord50k", reward: "50K Discord Reward", added: "2026-02-20", working: false },
];

// 动态月份，避免过期
function currentMonthYear(): string {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const monthYear = currentMonthYear();
  const canonical = locale === "en"
    ? `${WEB_URL}/codes`
    : `${WEB_URL}/${locale}/codes`;

  // FAQPage JSON-LD（codes 页 How-to-Redeem 部分）
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I redeem Plants vs Brainrots codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Launch Plants vs Brainrots on Roblox, click the Shop button, then click Codes on the left side. Type or paste a working code and click Claim to receive your free rewards.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I find new Plants vs Brainrots codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New codes are released on the official Plants vs Brainrots Discord server, during Admin Abuse events (every Saturday), seasonal events, and when the game hits visit milestones.",
        },
      },
      {
        "@type": "Question",
        name: "Are Plants vs Brainrots codes case-sensitive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Plants vs Brainrots codes are not case-sensitive. You can type them in any combination of uppercase or lowercase letters.",
        },
      },
    ],
  };

  return {
    title: `Plants vs Brainrots Codes (${monthYear}) - All Working Redeem Codes`,
    description: `Get all working Plants vs Brainrots codes for ${monthYear}. Free rewards, potions, gears, and exclusive items. Updated daily. Redeem now!`,
    keywords: "plants vs brainrots codes, pvb codes, plants vs brainrots redeem codes, plants vs brainrots code list",
    openGraph: {
      title: `Plants vs Brainrots Codes (${monthYear}) - All Working Codes`,
      description: `Updated daily. Free rewards and exclusive items for Plants vs Brainrots. ${monthYear}.`,
      type: "website",
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}

const codesPageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I redeem Plants vs Brainrots codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Launch Plants vs Brainrots on Roblox, click the Shop button, then click Codes on the left side. Type or paste a working code and click Claim to receive your free rewards.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find new Plants vs Brainrots codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "New codes are released on the official Plants vs Brainrots Discord server, during Admin Abuse events (every Saturday), seasonal events, and when the game hits visit milestones.",
      },
    },
    {
      "@type": "Question",
      name: "Are Plants vs Brainrots codes case-sensitive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Plants vs Brainrots codes are not case-sensitive. You can type them in any combination of uppercase or lowercase letters.",
      },
    },
  ],
};

export default function CodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const pvbHref = `/game/plants-vs-brainrots`;
  const workingCodes = CODES.filter(c => c.working);
  const expiredCodes = CODES.filter(c => !c.working);
  // 动态"Last updated"日期
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(codesPageFaqJsonLd) }}
      />
      <main className="min-h-screen p-2 lg:p-4">
        <div className="mx-auto max-w-[800px] py-8">
          {/* Back link */}
          <Link href="/" className="text-sm text-green-700 hover:text-green-900 mb-4 inline-block">
            ← Back to Games
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plants vs Brainrots Codes</h1>
          <p className="text-gray-500 mb-6">Last updated: {lastUpdated}</p>

        <div className="rounded-[8px] bg-[#1a1a1a] p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">How to Redeem Codes</h2>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
            <li>Launch <strong>Plants vs Brainrots</strong> on Roblox</li>
            <li>Click the <strong>Shop</strong> button in the menu</li>
            <li>Click the <strong>Codes</strong> button on the left side</li>
            <li>Type or paste a working code</li>
            <li>Click <strong>Claim</strong> to get your free rewards</li>
          </ol>
          <p className="text-sm text-gray-400 mt-3">Codes are not case-sensitive. New codes drop during events and on the official Discord.</p>
        </div>

        {/* Working Codes */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Working Codes</h2>
        <div className="space-y-3 mb-10">
          {workingCodes.map((c) => (
            <div key={c.code} className="rounded-[8px] bg-white shadow-sm border border-green-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <code className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-lg font-bold">{c.code}</code>
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">WORKING</span>
              </div>
              <p className="text-sm text-gray-600">{c.reward}</p>
              <p className="text-xs text-gray-400 mt-1">Added: {c.added}</p>
            </div>
          ))}
        </div>

        {/* Expired Codes */}
        {expiredCodes.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">❌ Expired Codes</h2>
            <div className="space-y-3 mb-10">
              {expiredCodes.map((c) => (
                <div key={c.code} className="rounded-[8px] bg-gray-50 shadow-sm border border-gray-200 p-5 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <code className="bg-gray-200 text-gray-500 px-3 py-1 rounded font-mono text-lg font-bold line-through">{c.code}</code>
                    <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded">EXPIRED</span>
                  </div>
                  <p className="text-sm text-gray-400">{c.reward}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info section */}
        <div className="rounded-[8px] bg-[#1a1a1a] p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-3">Where to Find New Codes</h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
            <li>Official Plants vs Brainrots Discord server</li>
            <li>Admin Abuse events (every Saturday)</li>
            <li>New Year / seasonal events</li>
            <li>Hit milestones (5M visits, etc.)</li>
          </ul>
        </div>

        {/* Related game link */}
        <div className="rounded-[8px] bg-white shadow-sm border p-5">
          <h3 className="font-bold text-gray-900 mb-1">Play the Game</h3>
          <Link href={pvbHref} className="text-green-700 hover:text-green-900 text-sm underline">
            Play Plants vs Brainrots Unblocked Online Free →
          </Link>
        </div>
        </div>
      </main>
    </>
  );
}
