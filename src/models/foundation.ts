import type { Card } from "./card";
import type { Suit } from "./suit";

export interface Foundation {
  suit: Suit;
  cards: Card[];
  index: number;
  x: number;
  y: number;
}
