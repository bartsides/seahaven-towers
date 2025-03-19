import type { Card } from "./card";
import type { Freecell } from "./freecell";

export interface FreecellRule {
  name: string;
  description: string;
  type: string;
  eval(cards: Card[], freecell: Freecell): boolean;
}
