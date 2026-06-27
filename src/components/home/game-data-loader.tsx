"use client";

import GameGrid, { HomeGame } from "@/components/home/game-grid";

export default function GameDataLoader({ games }: { games: HomeGame[] }) {
  return <GameGrid games={games} />;
}
