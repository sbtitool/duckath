import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";

// FAQPage + HowTo JSON-LD（复用页面已有内容）
const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Plants vs Brainrots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Plants vs Brainrots is a viral Roblox tower defense game developed by Yo Gurt Studio (creator: jandel). It reimagines the classic Plants vs Zombies formula with modern internet meme culture. With over 8.6 million concurrent players at peak, it is one of the most popular games on Roblox in 2026.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Rebirth system in Plants vs Brainrots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rebirth resets your progress but gives permanent multipliers for luck, damage, and income. You should complete your first rebirth as soon as possible because the multipliers compound exponentially.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Fusion system work in Plants vs Brainrots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Fuse Machine lets you combine specific plants with specific brainrots to create powerful hybrid entities. For example, Mr Carrot + Los Tralaleritos = Los Mr Carrotitos. Fusion is the key to end-game progression.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Play Plants vs Brainrots",
    step: [
      { "@type": "HowToStep", position: 1, name: "Buy a seed", text: "Buy a seed from NPC George in the game lobby." },
      { "@type": "HowToStep", position: 2, name: "Plant it", text: "Plant it on your land using equip + click." },
      { "@type": "HowToStep", position: 3, name: "Defend", text: "Your plants automatically attack incoming Brainrots." },
      { "@type": "HowToStep", position: 4, name: "Collect", text: "Defeated Brainrots go to your inventory." },
      { "@type": "HowToStep", position: 5, name: "Earn", text: "Place Brainrots on pedestals to generate cash per second (CPS)." },
      { "@type": "HowToStep", position: 6, name: "Fuse", text: "Combine plants and brainrots at the Fuse Machine for rare hybrids." },
      { "@type": "HowToStep", position: 7, name: "Rebirth", text: "Reset progress for permanent multipliers. Do this as soon as possible." },
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonical = locale === "en"
    ? `${WEB_URL}/about-game`
    : `${WEB_URL}/${locale}/about-game`;

  return {
    title: "Plants vs Brainrots Wiki - Game Guide, Plants, Brainrots & More",
    description: "Learn everything about Plants vs Brainrots Roblox game. Complete guide including plants tier list, brainrots farming, fusion recipes, rebirth system, codes and more.",
    keywords: "plants vs brainrots wiki, plants vs brainrots guide, plants vs brainrots how to play, pvb wiki",
    openGraph: {
      title: "Plants vs Brainrots Wiki - Complete Game Guide",
      description: "Complete guide for Plants vs Brainrots including plants, brainrots, fusion and codes.",
      type: "website",
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}

export default function AboutGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const pvbHref = `/game/plants-vs-brainrots`;

  return (
    <>
      {/* FAQPage + HowTo JSON-LD */}
      {aboutJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto max-w-[800px] py-8">
        <Link href="/" className="text-sm text-green-700 hover:text-green-900 mb-4 inline-block">
          ← Back to Games
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Plants vs Brainrots Wiki & Game Guide</h1>

        <div className="rounded-[8px] bg-white shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What is Plants vs Brainrots?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Plants vs Brainrots is a viral <strong>Roblox tower defense game</strong> developed by Yo Gurt Studio (creator: jandel).
            It reimagines the classic Plants vs Zombies formula with modern internet meme culture. With over 8.6 million
            concurrent players at peak, it is one of the most popular games on Roblox in 2026.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            In the game, players buy seeds and plant them in their garden. Plants automatically fight waves of attacking
            Brainrots. Defeated Brainrots become collectibles that generate passive income. The goal is to collect rare
            plants and brainrots, fuse powerful hybrids, and progress through rebirths.
          </p>
        </div>

        <div className="rounded-[8px] bg-[#1a1a1a] p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-3">How to Play Plants vs Brainrots</h2>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
            <li><strong>Buy a seed</strong> from NPC George in the game lobby</li>
            <li><strong>Plant it</strong> on your land using equip + click</li>
            <li><strong>Defend</strong> — your plants automatically attack incoming Brainrots</li>
            <li><strong>Collect</strong> — defeated Brainrots go to your inventory</li>
            <li><strong>Earn</strong> — place Brainrots on pedestals to generate cash per second (CPS)</li>
            <li><strong>Upgrade</strong> — buy better seeds for more damage, unlock more Brainrot pedestals</li>
            <li><strong>Fuse</strong> — combine plants and brainrots at the Fuse Machine for rare hybrids</li>
            <li><strong>Rebirth</strong> — reset progress for permanent multipliers (do this ASAP!)</li>
          </ol>
        </div>

        <div className="rounded-[8px] bg-white shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Key Game Features</h2>

          <h3 className="font-bold text-gray-900 mt-4 mb-2">🌱 Plants</h3>
          <p className="text-sm text-gray-600 mb-2">
            There are 15+ unique plants in Plants vs Brainrots, ranging from Common to Godly rarity.
            Top plants include Brussel Sprouts (19.5k DPS), Commando Apple (11.6k DPS), and Mango (9k+ DPS).
            Each plant has different damage, range, and special abilities.
          </p>

          <h3 className="font-bold text-gray-900 mt-4 mb-2">🧠 Brainrots (Passive Income)</h3>
          <p className="text-sm text-gray-600 mb-2">
            Defeated Brainrots become your workers. Place them on pedestals to earn cash per second (CPS).
            Top earners: Lemowzio (50.9k CPS), La Blazetto (50k CPS), Los Mr Carrotitos (31k CPS).
            Brainrots generate income even while you are offline at a reduced rate.
          </p>

          <h3 className="font-bold text-gray-900 mt-4 mb-2">🔬 Fusion System</h3>
          <p className="text-sm text-gray-600 mb-2">
            The Fuse Machine lets you combine specific plants with specific brainrots to create powerful
            hybrid entities. For example, Mr Carrot + Los Tralaleritos = Los Mr Carrotitos.
            Fusion is the key to end-game progression.
          </p>

          <h3 className="font-bold text-gray-900 mt-4 mb-2">🔄 Rebirth System</h3>
          <p className="text-sm text-gray-600 mb-2">
            Rebirth resets your progress but gives permanent multipliers (luck, damage, income).
            Complete your first rebirth as soon as possible the multipliers compound exponentially.
          </p>

          <h3 className="font-bold text-gray-900 mt-4 mb-2">📅 Events</h3>
          <p className="text-sm text-gray-600">
            Regular events include: Admin Abuse (every Saturday), Frozen Biome (every 2 hours),
            Planet Freshness Gym, and seasonal events like New Year 2026.
          </p>
        </div>

        <div className="rounded-[8px] bg-white shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Game Controls</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Desktop</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>WASD / Arrow keys — Move</li>
                <li>Space — Jump</li>
                <li>Shift — Shiftlock</li>
                <li>Mouse Click — Plant / Collect</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Mobile</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Virtual joystick — Move</li>
                <li>Tap — Plant / Collect</li>
                <li>Touch buttons — Actions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] bg-white shadow-sm border p-5">
          <h3 className="font-bold text-gray-900 mb-1">Play Now</h3>
          <Link href={pvbHref} className="text-green-700 hover:text-green-900 text-sm underline">
            Play Plants vs Brainrots Unblocked Online Free →
          </Link>
        </div>
      </div>
      </main>
    </>
  );
}
