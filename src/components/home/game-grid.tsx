"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type HomeGame = {
  id: number;
  title: string;
  spanClass: string;
  bgColor: string;
  href?: string;
  image?: {
    src: string;
    alt?: string;
  };
};

type GameGridProps = {
  games: HomeGame[];
  initialCount?: number;
  pageSize?: number;
};

export default function GameGrid({
  games,
  initialCount = 48,
  pageSize = 24,
}: GameGridProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, games.length)
  );

  useEffect(() => {
    setVisibleCount(Math.min(initialCount, games.length));
  }, [games.length, initialCount]);

  useEffect(() => {
    if (visibleCount >= games.length) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleCount((current) =>
          Math.min(current + pageSize, games.length)
        );
      },
      { rootMargin: "640px 0px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [games.length, pageSize, visibleCount]);

  const visibleGames = useMemo(
    () => games.slice(0, visibleCount),
    [games, visibleCount]
  );

  return (
    <>
      {visibleGames.map((game) => {
        const content = (
          <article
            className={`group relative overflow-hidden rounded-lg shadow-sm transition-transform duration-150 hover:scale-[1.01] hover:shadow-md [contain:layout_paint_style] [content-visibility:auto] [contain-intrinsic-size:120px_120px] ${game.bgColor} h-full`}
          >
            {game.image?.src ? (
              <Image
                src={game.image.src}
                alt={game.image.alt || game.title}
                fill
                sizes="(min-width: 1024px) 380px, 250px"
                className="object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white/50 mix-blend-overlay">
                    {game.id + 1}
                  </span>
                </div>
              </>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <span className="text-center text-sm font-bold text-white drop-shadow-md lg:text-base">
                {game.title}
              </span>
              <button
                type="button"
                className="mt-2 rounded-full bg-white/25 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-white/40"
              >
                PLAY
              </button>
            </div>
          </article>
        );

        if (game.href) {
          return (
            <Link key={game.id} href={game.href} className={`block w-full h-full ${game.spanClass}`}>
              {content}
            </Link>
          );
        }

        return <div key={game.id} className={`block w-full h-full ${game.spanClass}`}>{content}</div>;
      })}

      {visibleCount < games.length && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="col-span-full h-1"
        />
      )}
    </>
  );
}
