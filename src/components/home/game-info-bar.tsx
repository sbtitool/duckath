"use client";

import Image from "next/image";
import { ThumbsUp, ThumbsDown, AlertCircle, Maximize2 } from "lucide-react";
import { GameItem } from "@/types/game";

export default function GameInfoBar({ game }: { game: GameItem | null }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-blue-100">
          {game?.thumb ? (
            <Image
              src={game.thumb}
              alt={game.title}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-pink-300 text-2xl">
              🎮
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{game?.title || "Game"}</h1>
          <p className="text-sm text-gray-500">{game?.category || "Game"}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
            <ThumbsUp className="size-6" />
            <span className="text-xs font-medium">14.0K</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-900">
            <ThumbsDown className="size-6" />
            <span className="text-xs font-medium">3.4K</span>
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <AlertCircle className="size-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <Maximize2 className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
