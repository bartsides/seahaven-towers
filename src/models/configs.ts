import type { Config } from "./config";
import type { Foundation } from "./foundation";
import type { Suit } from "./suit";

export const configs: Config[] = [
  {
    name: "Standard",
    columns: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          cards: [],
          index: i,
          x: 8 + 104 * i,
          y: 136,
        };
      }),
    freecells: Array(4)
      .fill(0)
      .map((_, i) => {
        return {
          card: undefined,
          index: i,
          x: 320 + 104 * i,
          y: 8,
        };
      }),
    foundations: (<{ suit: Suit; val: number }[]>[
      { suit: "♥", val: 0 },
      { suit: "◆", val: 1 },
      { suit: "♣", val: 8 },
      { suit: "♠", val: 9 },
    ]).map((f, i) => {
      return <Foundation>{
        suit: f.suit,
        cards: [],
        index: i,
        x: 8 + 112 * f.val,
        y: 8,
      };
    }),
  },
];
