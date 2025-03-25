import type { Config } from "../models/config";
import type { Foundation } from "../models/foundation";
import type { Suit } from "../models/suit";

export const configs: Config[] = [
  {
    name: "Standard",
    columns: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          name: "col-" + i,
          cards: [],
          index: i,
          x: 8 + 104 * i,
          y: 136,
          width: 90,
          height: 500,
          column: true,
        };
      }),
    freecells: Array(4)
      .fill(0)
      .map((_, i) => {
        return {
          name: "fcl-" + i,
          cards: [],
          index: i,
          x: 320 + 104 * i,
          y: 8,
          width: 90,
          height: 116,
          freecell: true,
        };
      }),
    foundations: (<{ suit: Suit; x: number }[]>[
      { suit: "♥", x: 8 },
      { suit: "◆", x: 112 },
      { suit: "♣", x: 840 },
      { suit: "♠", x: 944 },
    ]).map((f, i) => {
      return <Foundation>{
        name: "fdn-" + i,
        suit: f.suit,
        cards: [],
        index: i,
        x: f.x,
        y: 8,
        width: 90,
        height: 116,
        foundation: true,
      };
    }),
  },
];
