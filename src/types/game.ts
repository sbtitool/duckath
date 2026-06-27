export type GameItem = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
};

export type GameCategory =
  | "All"
  | "Puzzle"
  | "Hypercasual"
  | "Arcade"
  | "Shooting"
  | "Sports"
  | "Adventure"
  | "Racing"
  | "Action"
  | "Clicker"
  | "Soccer"
  | "Cooking"
  | "Other";
