import type { Card } from "../models/card";
import type { Column } from "../models/column";
import type { Foundation } from "../models/foundation";
import type { Freecell } from "../models/freecell";
import type { Rule } from "../models/rule";

// Each rule is designed to check one specific detail.
// If what is passed is outside of its purpose, pass the test.
export const rules: Rule[] = [
  {
    name: "Freecell Hold One Max",
    description: "Freecells hold one card max",
    type: "freecell",
    eval(_: Card[], freecell: Freecell) {
      return freecell.cards.length <= 0;
    },
  },
  {
    name: "Freecell Move One Max",
    description: "Only one card can be placed on a freecell",
    type: "freecell",
    eval(cards: Card[], _: Freecell) {
      return cards.length === 1;
    },
  },
  {
    name: "Foundation Move One Max",
    description: "Cards must be placed on a foundation one at a time",
    type: "foundation",
    eval(cards: Card[], _: Foundation) {
      return cards.length === 1;
    },
  },
  {
    name: "Foundation Suits",
    description: "Foundation suits must match",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      return cards.every((c) => c.suit === foundation.suit);
    },
  },
  {
    name: "Foundation Starts Ace",
    description: "Foundation must start with an ace",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      if (!cards.length) return true;
      if (!foundation.cards.length) return cards[0].value === 0;
      return true;
    },
  },
  {
    name: "Foundation Low to High",
    description: "Foundation cards must be laid low to high",
    type: "foundation",
    eval(cards: Card[], foundation: Foundation) {
      if (!foundation.cards.length || !cards.length) return true;
      const topCard = foundation.cards[foundation.cards.length - 1];
      return cards[0].value - topCard.value === 1;
    },
  },
  {
    name: "Column Starts King",
    description: "Only kings can go to empty columns",
    type: "column",
    eval(cards: Card[], column: Column, _: Freecell[]) {
      if (column.cards.length) return true;
      return cards[0].value === 12;
    },
  },
  {
    name: "Column Low to High",
    description: "Column cards must be laid high to low",
    type: "column",
    eval(cards: Card[], column: Column, _: Freecell[]) {
      if (!column.cards.length) return true;
      if (column.cards[column.cards.length - 1].value - cards[0].value !== 1)
        return false;
      for (let i = 1; i < cards.length; i++) {
        if (cards[i - 1].value - cards[i].value !== 1) return false;
      }
      return true;
    },
  },
  {
    name: "Column Same Suit",
    description: "Column cards must be laid same suit",
    type: "column",
    eval(cards: Card[], column: Column, _: Freecell[]) {
      if (!column.cards.length) return true;
      return cards.every(
        (card) => card.suit === column.cards[column.cards.length - 1].suit
      );
    },
  },
  {
    name: "Column Move Multiple if Open Freecells",
    description:
      "Multiple cards can only be moved to a column if there are enough empty freecell spots",
    type: "column",
    eval(cards: Card[], column: Column, freecells: Freecell[]) {
      if (!column.cards.length) return true;
      const openFreecells = freecells.filter((f) => !f.cards.length).length;
      return cards.length - 1 <= openFreecells;
    },
  },
  {
    name: "Column Move Multiple Sequential",
    description:
      "Multiple cards can only be moved to a column if they are sequential (high to low)",
    type: "column",
    eval(cards: Card[], _column: Column, _freecells: Freecell[]) {
      for (let i = 1; i < cards.length; i++) {
        if (cards[i - 1].value - cards[i].value !== 1) return false;
      }
      return true;
    },
  },
];
