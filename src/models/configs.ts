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
          name: "column-" + i,
          cards: [],
          index: i,
          x: 8 + 104 * i,
          y: 136,
          width: 90,
          height: 500,
        };
      }),
    freecells: Array(4)
      .fill(0)
      .map((_, i) => {
        return {
          name: "freecell-" + i,
          cards: [],
          index: i,
          x: 320 + 104 * i,
          y: 8,
          width: 90,
          height: 116,
        };
      }),
    foundations: (<{ suit: Suit; x: number }[]>[
      { suit: "♥", x: 8 },
      { suit: "◆", x: 112 },
      { suit: "♣", x: 840 },
      { suit: "♠", x: 944 },
    ]).map((f, i) => {
      return <Foundation>{
        name: "foundation-" + i,
        suit: f.suit,
        cards: [],
        index: i,
        x: f.x,
        y: 8,
        width: 90,
        height: 116,
      };
    }),
  },
];
