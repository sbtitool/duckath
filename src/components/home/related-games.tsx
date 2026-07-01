"use client";

import Link from "next/link";
import Image from "next/image";
import { GameItem } from "@/types/game";
import { slugify } from "@/lib/games";
import { useState } from "react";

function RelatedGameCard({ game }: { game: GameItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/game/${slugify(game.title)}`}
      className="group relative overflow-hidden rounded-[8px] transition-transform duration-150 hover:scale-[1.01] aspect-square bg-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.1)]"
    >
      {!imgError ? (
        <Image
          src={game.thumb}
          alt={game.title}
          fill
          sizes="140px"
          className="object-cover text-transparent"
          loading="lazy"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        null
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="text-center text-[11px] font-bold text-white drop-shadow-md line-clamp-2">
          {game.title}
        </span>
        <span className="mt-1 rounded-full bg-white/90 px-3 py-0.5 text-[9px] font-black text-black">
          PLAY
        </span>
      </div>
    </Link>
  );
}

export default function RelatedGames({ games }: { games: GameItem[] }) {
  if (games.length === 0) return null;

  return (
    <>
      {games.map((game) => (
        <RelatedGameCard key={game.id} game={game} />
      ))}
    </>
  );
}
