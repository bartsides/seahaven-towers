export type Suit = "♥" | "◆" | "♣" | "♠";
export const suits: Suit[] = ["♥", "◆", "♣", "♠"];

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

export interface Pos {
  x: number;
  y: number;
  z: number;
}
