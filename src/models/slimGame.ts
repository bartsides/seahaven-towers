import type { Suit } from "./suit";

export interface SlimCard {
  suit: Suit;
  value: number;
  key: number;
}

export interface SlimMove {
  card: SlimCard;
  source: string;
  dest: string;
}

export interface SlimLocation {
  name: string;
  cards: SlimCard[];
}

export interface SlimColumn {
  name: string;
  cards: SlimCard[];
}

export interface SlimFreecell {
  name: string;
  cards: SlimCard[];
}

export interface SlimFoundation {
  name: string;
  cards: SlimCard[];
  suit: Suit;
}

export interface SlimLog {
  reverse: boolean;
  immediateReverse: boolean;
  move: SlimMove;
}

export interface SlimGame {
  columns: SlimColumn[];
  freecells: SlimFreecell[];
  foundations: SlimFoundation[];
  moveCount: number;
  totalMoves: number;
  log: SlimLog[];
}
