import { type Card, type DeckHolder } from "./card";
import type { Column } from "./column";
import type { ColumnRule } from "./columnRule";
import type { Config } from "./config";
import { faces } from "./face";
import type { Foundation } from "./foundation";
import type { FoundationRule } from "./foundationRule";
import type { Freecell } from "./freecell";
import type { FreecellRule } from "./freecellRule";
import type { Rule } from "./rule";
import { suits } from "./suit";

export class Game {
  public victory = false;
  public config: Config;
  public rules: Rule[];
  public cards: Card[] = [];
  public deck: Card[] = [];
  public columns: Column[] = [];
  public freecells: Freecell[] = [];
  public foundations: Foundation[] = [];

  private shuffleTimes = 10;

  constructor(config: Config, rules: Rule[]) {
    this.config = config;
    this.rules = rules;
    this.newGame();
  }

  public newGame() {
    this.columns = JSON.parse(JSON.stringify(this.config.columns));
    this.freecells = JSON.parse(JSON.stringify(this.config.freecells));
    this.foundations = JSON.parse(JSON.stringify(this.config.foundations));
    this.deck = this.getNewDeck();
    this.cards = [...this.deck];
    this.shuffle(this.deck);
    this.deal();
    this.checkForFoundationMove();
  }

  public tryMoveToColumn(
    cards: Card[],
    source: DeckHolder,
    x: number,
    y: number
  ): boolean {
    const columnMatches = this.columns.filter(
      (c) => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
    );
    if (!columnMatches.length) return false;
    const column = columnMatches[0];
    if (!this.canDropColumn(cards[0], column, this.rules)) return false;
    cards.forEach((c) => this.moveCard(c, source, column));
    this.checkForFoundationMove();
    return true;
  }

  public tryMoveToFreecell(
    cards: Card[],
    source: DeckHolder,
    x: number,
    y: number,
    rules: Rule[]
  ): boolean {
    const freecellMatches = this.freecells.filter(
      (f) => x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
    );
    if (!freecellMatches.length) return false;
    const freecell = freecellMatches[0];
    if (!this.canDropFreecell(freecell, rules)) return false;
    cards.forEach((card) => this.moveCard(card, source, freecell));
    this.checkForFoundationMove();
    return true;
  }

  public tryMoveToFoundation(
    card: Card,
    source: DeckHolder,
    x: number,
    y: number
  ): boolean {
    const foundationMatches = this.foundations.filter(
      (f) => x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
    );
    if (!foundationMatches.length) return false;
    const foundation = foundationMatches[0];
    if (!this.canDropFoundation(card, foundation, this.rules)) return false;
    this.moveCard(card, source, foundation);
    this.checkForFoundationMove();
    return true;
  }

  private getNewDeck(): Card[] {
    const res: Card[] = [];
    let i = 0;
    suits.forEach((suit) => {
      faces.forEach((face, value) => {
        res.push({
          suit,
          face,
          value,
          pos: { x: 0, y: 0, z: 0 },
          lastPos: { x: 0, y: 0, z: 0 },
          key: i++,
          location: "",
          draggable: false,
          dragging: false,
        });
      });
    });
    return res;
  }

  private shuffle(deck: Card[]) {
    for (let i = 0; i < Math.max(Math.random() * 10, this.shuffleTimes); i++) {
      deck.sort(() => Math.random() - 0.5);
    }
  }

  private drawCard(): Card | undefined {
    return this.deck.shift();
  }

  private deal() {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        const card = this.drawCard();
        if (!card) break;
        const column = this.columns[col];
        card.location = column.name;
        if (!column.cards?.length) {
          column.cards = [card];
        } else {
          column.cards.unshift(card);
        }
      }
    }
    let card = this.drawCard();
    if (card) {
      const freecell = this.freecells[1];
      freecell.cards = [card];
      card.location = freecell.name;
    }
    card = this.drawCard();
    if (card) {
      const freecell = this.freecells[2];
      freecell.cards = [card];
      card.location = freecell.name;
    }
  }

  private checkForFoundationMove() {
    let moveFound = false;
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (!column.cards.length) continue;
      const topCard = column.cards[column.cards.length - 1];
      for (let j = 0; j < this.foundations.length; j++) {
        const foundation = this.foundations[j];
        if (this.canDropFoundation(topCard, foundation, this.rules)) {
          moveFound = true;
          this.moveCard(topCard, column, foundation);
          break;
        }
      }
      if (moveFound) break;
    }
    if (!moveFound) {
      for (let i = 0; i < this.freecells.length; i++) {
        const freecell = this.freecells[i];
        if (!freecell.cards.length) continue;
        const topCard = freecell.cards[freecell.cards.length - 1];
        for (let j = 0; j < this.foundations.length; j++) {
          const foundation = this.foundations[j];
          if (this.canDropFoundation(topCard, foundation, this.rules)) {
            moveFound = true;
            this.moveCard(topCard, freecell, foundation);
            break;
          }
        }
        if (moveFound) break;
      }
    }
    if (moveFound) this.checkForFoundationMove();
    else this.checkForWin();
  }

  private checkForWin() {
    if (this.columns.some((c) => c.cards.length)) return;
    if (this.freecells.some((f) => f.cards.length)) return;
    this.victory = true;
  }

  private canDropColumn(card: Card, column: Column, rules: Rule[]): boolean {
    const columnRules = rules.filter((r) => r.type === "column");
    for (let i = 0; i < columnRules.length; i++) {
      const rule = <ColumnRule>columnRules[i];
      if (!rule.eval(card, column)) return false;
    }
    return true;
  }

  private canDropFreecell(freecell: Freecell, rules: Rule[]): boolean {
    const freecellRules = rules.filter((r) => r.type === "freecell");
    for (let i = 0; i < freecellRules.length; i++) {
      const rule = <FreecellRule>freecellRules[i];
      if (!rule.eval(freecell)) return false;
    }
    return true;
  }

  private canDropFoundation(
    card: Card,
    foundation: Foundation,
    rules: Rule[]
  ): boolean {
    const foundationRules = rules.filter((r) => r.type === "foundation");
    for (let i = 0; i < foundationRules.length; i++) {
      const rule = <FoundationRule>foundationRules[i];
      if (!rule.eval(card, foundation)) return false;
    }
    return true;
  }

  private moveCard(card: Card, source: DeckHolder, dest: DeckHolder) {
    source.cards = source.cards.filter((c) => c.key !== card.key);
    dest.cards.push(card);
    card.location = dest.name;
  }
}
