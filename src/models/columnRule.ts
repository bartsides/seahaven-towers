import type { Card } from "./card";
import type { Column } from "./column";

export interface ColumnRule {
  name: string;
  type: string;
  eval(card: Card, column: Column): boolean;
}
