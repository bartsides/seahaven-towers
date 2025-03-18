import type { Card } from "../models/card";
import type { Column } from "../models/column";
import type { Foundation } from "../models/foundation";
import type { Freecell } from "../models/freecell";
import type { Rule } from "../models/rule";

export const rules: Rule[] = [
  {
    name: "Max one freecell card",
    type: "freecell",
    eval(freecell: Freecell) {
      return freecell.cards.length <= 0;
    },
  },
  {
    name: "Foundation suits must match",
    type: "foundation",
    eval(card: Card, foundation: Foundation) {
      return card.suit === foundation.suit;
    },
  },
  {
    name: "Foundation must start with an ace",
    type: "foundation",
    eval(card: Card, foundation: Foundation) {
      if (!foundation.cards.length) return card.value === 0;
      return true;
    },
  },
  {
    name: "Foundation cards must be laid low to high",
    type: "foundation",
    eval(card: Card, foundation: Foundation) {
      if (!foundation.cards.length) return true;
      const topCard = foundation.cards[foundation.cards.length - 1];
      return card.value - topCard.value === 1;
    },
  },
  {
    name: "Only kings can go to empty columns",
    type: "column",
    eval(card: Card, column: Column) {
      if (column.cards.length) return true;
      return card.value === 12;
    },
  },
  {
    name: "Column cards must be laid high to low",
    type: "column",
    eval(card: Card, column: Column) {
      if (!column.cards.length) return true;
      return column.cards[column.cards.length - 1].value - card.value === 1;
    },
  },
  {
    name: "Column cards must be laid same suit",
    type: "column",
    eval(card: Card, column: Column) {
      if (!column.cards.length) return true;
      return card.suit === column.cards[column.cards.length - 1].suit;
    },
  },
];
