export type Suit = "H" | "D" | "C" | "S";
export const suits: Suit[] = ["H", "D", "C", "S"];
export function getDisplaySuit(suit: Suit): string {
  if (suit === "H") return "♥";
  if (suit === "D") return "◆";
  if (suit === "C") return "♣";
  return "♠";
}
