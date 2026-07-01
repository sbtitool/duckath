"use client";

import { useRef } from "react";
import { GameItem } from "@/types/game";

// JSON-LD 已移至 app/[locale]/game/[slug]/page.tsx（服务端），此处移除 client 端重复注入

export default function GameIframe({ game }: { game: GameItem | null }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!game) {
    return (
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#805099] to-[#3a1c4a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/70 text-lg">Game not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-black min-h-0">
      <div
        className="relative"
        style={{ aspectRatio: "4/3", height: "100%", maxWidth: "min(100%, 800px)" }}
      >
        <iframe
          ref={iframeRef}
          data-game-iframe
          src={game.url}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          allow="fullscreen; autoplay"
          sandbox="allow-scripts allow-same-origin allow-popups"
          title={game.title}
          loading="lazy"
        />
        <div className="sr-only">
          <p>{game.description}</p>
          <p>Category: {game.category}</p>
          <p>Tags: {game.tags}</p>
          <p>How to play: {game.instructions}</p>
          <p>Play {game.title} unblocked free online. No download required.</p>
        </div>
      </div>
    </div>
  );
}
