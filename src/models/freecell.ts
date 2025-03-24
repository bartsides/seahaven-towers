import type { Card } from "./card";

export interface Freecell {
  name: string;
  cards: Card[];
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  freecell: boolean;
}
