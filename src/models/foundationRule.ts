import type { Card } from "./card";
import type { Foundation } from "./foundation";

export interface FoundationRule {
  name: string;
  type: string;
  eval(card: Card, foundation: Foundation): boolean;
}
