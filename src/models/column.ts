import type { Card } from "./card";

export interface Column {
  name: string;
  cards: Card[];
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
