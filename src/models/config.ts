import type { Column } from "./column";
import type { Foundation } from "./foundation";
import type { Freecell } from "./freecell";

export interface Config {
  name: string;
  columns: Column[];
  freecells: Freecell[];
  foundations: Foundation[];
}
