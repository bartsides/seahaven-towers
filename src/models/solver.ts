import hashObject from "hash-object";
import type { Card } from "./card";
import type { Game } from "./game";
import type {
  SlimCard,
  SlimColumn,
  SlimFoundation,
  SlimFreecell,
  SlimGame,
  SlimLocation,
  SlimLog,
  SlimMove,
} from "./slimGame";

const MAX_MOVES = 3;
const TOTAL_MAX_MOVES = 40;
// TODO: when moving card from column to anywhere but a foundation, try and see if can move
// Depth first approach
export function isGameWinnable(game: Game): boolean {
  console.log("start is game winnable");
  const slimGame: SlimGame = getSlimGame(game);

  tryFoundationMoves(slimGame);
  const states: any = {};
  states[getHash(slimGame)] = true;

  let winnable = false;
  const moves = findMoves(slimGame);
  for (let i = 0; i < moves.length; i++) {
    if (isWinnable(slimGame, states, moves[i])) {
      console.log("that's a win babyyy");
      return true;
    }
  }
  winnable = checkForWin(slimGame);
  printLog(slimGame);
  if (winnable) console.log("winnable!");
  else console.log("not winnable");
  return winnable;
}

function isWinnable(game: SlimGame, states: any, move: SlimMove): boolean {
  if (game.totalMoves > TOTAL_MAX_MOVES) return false;

  applyMove(game, move);
  // console.log(
  //   "is winnable",
  //   game.moveCount,
  //   `${move.card.value}${move.card.suit} ${move.source} -> ${move.dest}`
  // );

  const hash = getHash(game);
  if (states[hash]) {
    //console.log("been here before... skipping...", hash);
    reverseMove(game, move);
    return false;
  }
  states[hash] = true;

  const foundationMoves = tryFoundationMoves(game);

  if (game.moveCount < MAX_MOVES) {
    const moves = findMoves(game);
    for (let i = 0; i < moves.length; i++) {
      if (isWinnable(game, states, moves[i])) return true;
    }
  }
  const win = checkForWin(game);
  if (!win) {
    // reverse changes
    foundationMoves.forEach((m) => reverseMove(game, m));
    reverseMove(game, move);
  }
  return win;
}

function tryFoundationMoves(game: SlimGame): SlimMove[] {
  let moves: SlimMove[] = [];
  let moveFound = false;
  for (let i = 0; i < game.freecells.length; i++) {
    const freecell = game.freecells[i];
    if (!freecell.cards.length) continue;
    const card = freecell.cards[0];
    for (let f = 0; f < game.foundations.length; f++) {
      const foundation = game.foundations[f];
      if (canDropFoundation(card, foundation)) {
        moveFound = true;
        const move = {
          card,
          source: freecell.name,
          dest: foundation.name,
        };
        moves.unshift(move);
        applyMove(game, move);
        break;
      }
    }
  }
  if (!moveFound) {
    for (let i = 0; i < game.columns.length; i++) {
      const column = game.columns[i];
      if (!column.cards.length) continue;
      const card = column.cards[0];
      for (let f = 0; f < game.foundations.length; f++) {
        const foundation = game.foundations[f];
        if (canDropFoundation(card, foundation)) {
          moveFound = true;
          game.moveCount++;
          moves.unshift({
            card: card,
            source: column.name,
            dest: foundation.name,
          });
          moveCard(card, column, foundation);
          break;
        }
      }
      if (moveFound) break;
    }
  }
  if (moveFound) {
    moves.unshift(...tryFoundationMoves(game));
  }
  return moves;
}

function findMoves(game: SlimGame): SlimMove[] {
  const moves: SlimMove[] = [];
  game.freecells.forEach((freecell) => {
    if (!freecell.cards.length) return;
    const card = freecell.cards[0];
    game.columns.forEach((column) => {
      if (canDropColumn(card, column)) {
        moves.push({ card, source: freecell.name, dest: column.name });
      }
    });
  });
  game.columns.forEach((column) => {
    if (!column.cards.length) return;
    const card = column.cards[0];
    game.columns.forEach((dest) => {
      if (column.name === dest.name) return;
      // Avoid moving root card back and forth between empty columns
      if (column.cards.length === 1 && !dest.cards.length) return;
      if (canDropColumn(card, dest)) {
        moves.push({ card, source: column.name, dest: dest.name });
      }
    });
    for (let i = 0; i < game.freecells.length; i++) {
      if (canDropFreecell(game.freecells[i])) {
        moves.push({
          card,
          source: column.name,
          dest: game.freecells[i].name,
        });
        break;
      }
    }
  });

  return moves;
}

function canDropColumn(card: SlimCard, column: SlimColumn): boolean {
  if (!column.cards.length) return card.value === 12;
  const topCard = column.cards[column.cards.length - 1];
  return card.suit === topCard.suit && topCard.value - card.value === 1;
}

function canDropFreecell(freecell: SlimFreecell): boolean {
  return !freecell.cards.length;
}

function canDropFoundation(
  card: SlimCard,
  foundation: SlimFoundation
): boolean {
  if (card.suit !== foundation.suit) return false;
  if (!foundation.cards.length) return card.value === 0;
  return card.value - foundation.cards[foundation.cards.length - 1].value === 1;
}

function applyMove(game: SlimGame, move: SlimMove) {
  game.totalMoves++;
  game.moveCount++;

  game.log.push({ reverse: false, move, immediateReverse: false });

  moveCard(
    move.card,
    getSlimLocation(move.source, game),
    getSlimLocation(move.dest, game)
  );
}

function reverseMove(game: SlimGame, move: SlimMove) {
  game.moveCount--;

  const log: SlimLog = { reverse: true, move, immediateReverse: false };
  if (game.log.length) {
    const lastLog = game.log[game.log.length - 1];
    if (
      !lastLog.reverse &&
      lastLog.move.card.value === move.card.value &&
      lastLog.move.card.suit === move.card.suit &&
      lastLog.move.source === move.source &&
      lastLog.move.dest == move.dest
    ) {
      // Note which moves were immediately reversed
      lastLog.immediateReverse = true;
    } else {
      game.log.push(log);
    }
  } else {
    game.log.push(log);
  }

  moveCard(
    move.card,
    getSlimLocation(move.dest, game),
    getSlimLocation(move.source, game)
  );
}

function moveCard(card: SlimCard, source: SlimLocation, dest: SlimLocation) {
  source.cards = source.cards.filter((c) => c.key !== card.key);
  dest.cards.push(card);
}

function checkForWin(game: SlimGame) {
  if (game.columns.some((c) => c.cards.length)) return false;
  if (game.freecells.some((f) => f.cards.length)) return false;
  return true;
}

function getSlimLocation(name: string, game: SlimGame): SlimLocation {
  const [locationType, locationNumber] = name.split("-");
  const index = Number(locationNumber);
  if (locationType === "col") return game.columns[index];
  if (locationType === "fcl") return game.freecells[index];
  return game.foundations[index];
}

function getSlimCard(card: Card): SlimCard {
  return {
    suit: card.suit,
    value: card.value,
    key: card.key,
  };
}

function getSlimGame(game: Game): SlimGame {
  return {
    columns: game.columns.map((column) => {
      return {
        name: column.name,
        cards: column.cards.map(getSlimCard),
      };
    }),
    freecells: game.freecells.map((freecell) => {
      return {
        name: freecell.name,
        cards: freecell.cards.map(getSlimCard),
      };
    }),
    foundations: game.foundations.map((foundation) => {
      return {
        name: foundation.name,
        cards: foundation.cards.map(getSlimCard),
        suit: foundation.suit,
      };
    }),
    moveCount: 0,
    totalMoves: 0,
    log: [],
  };
}

function getHash(game: SlimGame): string {
  return hashObject(
    {
      columns: game.columns.map((c) => {
        return { name: c.name, cards: c.cards };
      }),
      freecells: game.freecells.map((f) => {
        return { name: f.name, cards: f.cards };
      }),
      foundations: game.foundations.map((f) => {
        return { name: f.name, cards: f.cards };
      }),
    },
    { algorithm: "md5" }
  );
}

export function printLog(game: SlimGame): void {
  console.log("-----------------------");
  console.log(`Solver move log - ${game.log.length}`);
  console.log("-----------------------");
  game.log.forEach((log) =>
    console.log(
      `${moveToString(log.move)} ${
        log.immediateReverse ? "🧨" : log.reverse ? "⬆️" : " "
      }`
    )
  );
  console.log("-----------------------");
  console.log(`Solver move log - ${game.log.length}`);
  console.log("-----------------------");
}

function moveToString(move: SlimMove): string {
  return `${move.card.value.toString().padStart(2, " ")}${move.card.suit} | ${
    move.source
  } -> ${move.dest}`;
}
