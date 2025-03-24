import type { Card } from "./card";
import type { Foundation } from "./foundation";

export interface FoundationRule {
  name: string;
  description: string;
  foundation: true;
  eval(cards: Card[], foundation: Foundation): boolean;
}
