import type { Card } from "./card";

export interface Column {
  cards: Card[];
  index: number;
  x: number;
  y: number;
}
