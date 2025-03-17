import type { Card } from "./card";
import type { Suit } from "./suit";

export interface Foundation {
  name: string;
  suit: Suit;
  cards: Card[];
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
