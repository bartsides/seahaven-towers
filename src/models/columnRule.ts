import type { Card } from "./card";
import type { Column } from "./column";
import type { Freecell } from "./freecell";

export interface ColumnRule {
  name: string;
  description: string;
  column: boolean;
  eval(cards: Card[], column: Column, freecells: Freecell[]): boolean;
}
