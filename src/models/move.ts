import type { Card } from "./card";
import type { Location } from "./location";

export interface Move {
  card: Card;
  source: Location;
  dest: Location;
}
