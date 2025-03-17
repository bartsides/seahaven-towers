<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardColumnComponent from "./components/CardColumnComponent.vue";
import CardComponent from "./components/CardComponent.vue";
import FoundationComponent from "./components/FoundationComponent.vue";
import FreeCellComponent from "./components/FreeCellComponent.vue";
import { moveCard, type Card, type DeckHolder } from "./models/card";
import type { Column } from "./models/column";
import type { Config } from "./models/config";
import { configs } from "./models/configs";
import { faces } from "./models/face";
import type { Foundation } from "./models/foundation";
import type { Freecell } from "./models/freecell";
import { suits } from "./models/suit";

const shuffleNumber = 5;

let config = ref<Config>(configs[0]);
let update = ref<number>(0);
let deck = ref<Card[]>([]);
let cards = ref<Card[]>([]);
let columns = ref<Column[]>(JSON.parse(JSON.stringify(config.value.columns)));
let freecells = ref<Freecell[]>(
  JSON.parse(JSON.stringify(config.value.freecells))
);
let foundations = ref<Foundation[]>(
  JSON.parse(JSON.stringify(config.value.foundations))
);

function drawCard(): Card | undefined {
  return deck.value.shift();
}

function getNewDeck(): Card[] {
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
        dragging: false,
      });
    });
  });
  return res;
}

function shuffle(deck: Card[]) {
  for (let i = 0; i < Math.max(Math.random() * 10, shuffleNumber); i++) {
    deck.sort(() => Math.random() - 0.5);
  }
}

function deal() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const card = drawCard();
      if (!card) break;
      const column = columns.value[col];
      card.location = column.name;
      if (!column.cards?.length) {
        column.cards = [card];
      } else {
        column.cards.unshift(card);
      }
    }
  }
  let card = drawCard();
  if (card) {
    const freecell = freecells.value[1];
    freecell.cards = [card];
    card.location = freecell.name;
  }
  card = drawCard();
  if (card) {
    const freecell = freecells.value[2];
    freecell.cards = [card];
    card.location = freecell.name;
  }
  updateCards();
}

function newGame() {
  columns.value = JSON.parse(JSON.stringify(config.value.columns));
  freecells.value = JSON.parse(JSON.stringify(config.value.freecells));
  foundations.value = JSON.parse(JSON.stringify(config.value.foundations));
  deck.value = getNewDeck();
  cards.value = [...deck.value];
  shuffle(deck.value);
  deal();
  checkForFoundationMove();
}

onMounted(() => {
  newGame();
});

function updateCards() {
  update.value = update.value + 1;

  // columns.value.forEach((c) =>
  //   console.log("column" + c.index, debugPrintDeck(c.cards))
  // );
}
function getSource(name: string): DeckHolder {
  const [locationType, locationNumber] = name.split("-");
  const index = Number(locationNumber);
  if (locationType === "column") {
    return columns.value[index];
  }
  if (locationType === "freecell") {
    return freecells.value[index];
  }
  return foundations.value[index];
}
function dragStart(e: any) {
  const index = e.target.attributes["index"].value;
  const card = cards.value[index];
  card.dragging = true;
}
function dragging(e: any) {
  //console.log("dragging", e);
  const card = cards.value[Number(e.target.id.replace("card", ""))];
  card.pos.x = e.screenX;
  card.pos.y = e.screenY;
  card.pos.z = 1000;
  card.dragging = true;
}
function dragEnd(e: any) {
  const x: number = e.clientX;
  const y: number = e.clientY;
  const card = cards.value[Number(e.target.id.replace("card", ""))];
  const source = getSource(card.location);
  card.dragging = false;
  if (source.name.includes("foundation")) return;
  let cardMoved = tryMoveToFreecell(card, source, x, y);
  if (!cardMoved) cardMoved = tryMoveToColumn(card, source, x, y);
  if (!cardMoved) cardMoved = tryMoveToFoundation(card, source, x, y);
  if (!cardMoved) {
    card.pos = { ...card.lastPos };
    updateCards();
    return;
  }
  updateCards();
  checkForFoundationMove();
}
function checkForWin() {
  if (columns.value.some((c) => c.cards.length)) return;
  if (freecells.value.some((f) => f.cards.length)) return;
  console.log("victory!!!!!");
}
function checkForFoundationMove() {
  let moveFound = false;
  for (let i = 0; i < columns.value.length; i++) {
    const column = columns.value[i];
    if (!column.cards.length) continue;
    const topCard = column.cards[column.cards.length - 1];
    for (let j = 0; j < foundations.value.length; j++) {
      const foundation = foundations.value[j];
      if (canDropFoundation(topCard, foundation)) {
        moveFound = true;
        moveCard(topCard, column, foundation);
        break;
      }
    }
    if (moveFound) break;
  }
  if (!moveFound) {
    for (let i = 0; i < freecells.value.length; i++) {
      const freecell = freecells.value[i];
      if (!freecell.cards.length) continue;
      const topCard = freecell.cards[freecell.cards.length - 1];
      for (let j = 0; j < foundations.value.length; j++) {
        const foundation = foundations.value[j];
        if (canDropFoundation(topCard, foundation)) {
          moveFound = true;
          moveCard(topCard, freecell, foundation);
          break;
        }
      }
      if (moveFound) break;
    }
  }
  if (moveFound) checkForFoundationMove();
  else checkForWin();
}
function tryMoveToColumn(
  card: Card,
  source: DeckHolder,
  x: number,
  y: number
): boolean {
  const columnMatches = columns.value.filter(
    (c) => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
  );
  if (!columnMatches.length) return false;
  const column = columnMatches[0];
  if (!canDropColumn(card, column)) return false;
  moveCard(card, source, column);
  return true;
}
function tryMoveToFreecell(
  card: Card,
  source: DeckHolder,
  x: number,
  y: number
): boolean {
  const freecellMatches = freecells.value.filter(
    (f) => x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
  );
  if (!freecellMatches.length) return false;
  const freecell = freecellMatches[0];
  if (!canDropFreecell(card, freecell)) return false;
  moveCard(card, source, freecell);
  return true;
}
function tryMoveToFoundation(
  card: Card,
  source: DeckHolder,
  x: number,
  y: number
): boolean {
  const foundationMatches = foundations.value.filter(
    (f) => x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
  );
  if (!foundationMatches.length) return false;
  const foundation = foundationMatches[0];
  if (!canDropFoundation(card, foundation)) return false;
  moveCard(card, source, foundation);
  return true;
}
function allowDrop(e: DragEvent) {
  e.preventDefault();
}
function canDropColumn(card: Card, column: Column): boolean {
  if (!column.cards.length) {
    return card.value === 12; // Kings can go into empty columns
  }
  const topCard = column.cards[column.cards.length - 1];
  return topCard.suit === card.suit; // && topCard.value - card.value === 1;
}
function canDropFreecell(card: Card, freecell: Freecell): boolean {
  return !freecell.cards.length;
}
function canDropFoundation(card: Card, foundation: Foundation): boolean {
  if (card.suit !== foundation.suit) return false;
  if (!foundation.cards.length) return card.value === 0;
  const topCard = foundation.cards[foundation.cards.length - 1];
  return card.value - topCard.value === 1;
}
</script>
<template>
  <div class="tableau">
    <div class="foundations">
      <FoundationComponent
        v-for="(foundation, i) in foundations"
        :foundation="foundation"
        :key="i"
        :index="i"
        :update="update"
        :id="foundation.name"
      />
    </div>
    <div class="freecells">
      <FreeCellComponent
        v-for="(freecell, i) in freecells"
        :freecell="freecell"
        :key="i"
        :index="i"
        :update="update"
        :id="freecell.name"
      />
    </div>
    <div class="columns">
      <CardColumnComponent
        v-for="(column, i) in columns"
        :column="column"
        :key="i"
        :index="i"
        :id="column.name"
        :update="update"
        v-on:dragover="allowDrop"
      />
    </div>
    <div class="cards">
      <CardComponent
        v-for="(card, i) in cards"
        :key="i"
        :index="card.key"
        :card="card"
        :id="'card' + i"
        draggable="true"
        v-on:dragstart="dragStart"
        v-on:dragend="dragEnd"
        v-on:drag="dragging"
      />
    </div>
  </div>
</template>
<style scoped>
.tableau {
  background-color: green;
  min-width: 1080px;
  min-height: 700px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
