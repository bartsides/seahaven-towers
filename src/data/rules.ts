import type { Card } from "../models/card";
import type { Column } from "../models/column";
import type { Foundation } from "../models/foundation";
import type { Freecell } from "../models/freecell";
import type { Rule } from "../models/rule";

// TODO: Add rules about multiple cards going to a column
export const rules: Rule[] = [
  {
    name: "Freecells hold one card max",
    type: "freecell",
    eval(cards: Card[], freecell: Freecell) {
      return freecell.cards.length <= 0;
    },
  },
  {
    name: "Only one card can be placed on a freecell",
    type: "freecell",
    eval(cards: Card[], freecell: Freecell) {
      return cards.length === 1;
    },
  },
  {
    name: "Cards must be placed on a foundation one at a time",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      return cards.length === 1;
    },
  },
  {
    name: "Foundation suits must match",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      return cards.every((c) => c.suit === foundation.suit);
    },
  },
  {
    name: "Foundation must start with an ace",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      if (!cards.length) return true;
      if (!foundation.cards.length) return cards[0].value === 0;
      return true;
    },
  },
  {
    name: "Foundation cards must be laid low to high",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      if (!foundation.cards.length || !cards.length) return true;
      const topCard = foundation.cards[foundation.cards.length - 1];
      return cards[0].value - topCard.value === 1;
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
