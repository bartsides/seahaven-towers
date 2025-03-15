import type { Card } from "./card";

export interface Freecell {
  card: Card | undefined;
  index: number;
  x: number;
  y: number;
}
