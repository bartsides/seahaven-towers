import type { Freecell } from "./freecell";

export interface FreecellRule {
  name: string;
  type: string;
  eval(freecell: Freecell): boolean;
}
