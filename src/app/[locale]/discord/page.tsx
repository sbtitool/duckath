import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonical = locale === "en"
    ? `${WEB_URL}/discord`
    : `${WEB_URL}/${locale}/discord`;

  return {
    title: "Plants vs Brainrots Discord - Join Official Community",
    description: "Join the official Plants vs Brainrots Discord community. Connect with 50K+ players, get the latest codes, trading, event updates, and find teammates.",
    keywords: "plants vs brainrots discord, pvb discord, pvb community, plants vs brainrots official discord",
    openGraph: {
      title: "Plants vs Brainrots Discord - Official Community",
      description: "Join 50K+ players on the official Discord for codes, trading, and events.",
      type: "website",
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}

export default function DiscordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const pvbHref = `/game/plants-vs-brainrots`;

  // FAQPage JSON-LD: Discord 社区价值
  const discordFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I join the Plants vs Brainrots Discord?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Click the Join Discord Server button on this page to join the official Plants vs Brainrots Discord community with 50K+ players.",
        },
      },
      {
        "@type": "Question",
        name: "What can I get from the PVB Discord?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Exclusive codes, trading community, event alerts, update patch notes, and teammates for coop play.",
        },
      },
    ],
  };

  return (
    <>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(discordFaqJsonLd) }}
      />

      <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto max-w-[800px] py-8">
        <Link href="/" className="text-sm text-green-700 hover:text-green-900 mb-4 inline-block">
          ← Back to Games
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Plants vs Brainrots Discord</h1>

        <div className="rounded-[8px] bg-[#5865F2] p-8 mb-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Join Our Community!</h2>
          <p className="text-white/80 mb-6">50,000+ active players & growing</p>
          <a
            href="https://discord.gg/plantsvsbrainrots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#5865F2] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Join Discord Server
          </a>
        </div>

        <div className="rounded-[8px] bg-white shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why Join the PVB Discord?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">1</span>
              <div>
                <h3 className="font-bold text-gray-900">Exclusive Codes</h3>
                <p className="text-sm text-gray-600">Get new codes first before they expire. Exclusive Discord-only giveaways.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">2</span>
              <div>
                <h3 className="font-bold text-gray-900">Trading Community</h3>
                <p className="text-sm text-gray-600">Trade plants, brainrots, and items with other players. Find fair value trades.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">3</span>
              <div>
                <h3 className="font-bold text-gray-900">Event Alerts</h3>
                <p className="text-sm text-gray-600">Get notified about Admin Abuse, Frozen Biome, and limited-time events.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">4</span>
              <div>
                <h3 className="font-bold text-gray-900">Update Patch Notes</h3>
                <p className="text-sm text-gray-600">Stay updated with the latest game changes, balance patches, and new content.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-pink-100 text-pink-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">5</span>
              <div>
                <h3 className="font-bold text-gray-900">Find Teammates</h3>
                <p className="text-sm text-gray-600">Connect with other players for coop, trading, and farming tips.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-[8px] bg-[#1a1a1a] p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <div className="space-y-3">
            <a href="https://discord.gg/plantsvsbrainrots" target="_blank" rel="noopener noreferrer" className="block text-green-400 hover:text-green-300 underline text-sm">
              Official Discord Invite →
            </a>
            <Link href="/codes" className="block text-green-400 hover:text-green-300 underline text-sm">
              Plants vs Brainrots Codes (Updated Daily) →
            </Link>
            <Link href={pvbHref} className="block text-green-400 hover:text-green-300 underline text-sm">
              Play Plants vs Brainrots Unblocked →
            </Link>
          </div>
        </div>

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