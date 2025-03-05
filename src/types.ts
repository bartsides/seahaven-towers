export interface Card {
  suit: Suit;
  face: Face;
}

export type Suit = "H" | "D" | "C" | "S";
export const suits: Suit[] = ["H", "D", "C", "S"];

export type Face =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
export const faces: Face[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
