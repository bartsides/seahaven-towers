<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardColumnComponent from "./components/CardColumnComponent.vue";
import CardComponent from "./components/CardComponent.vue";
import FoundationComponent from "./components/FoundationComponent.vue";
import FreeCellComponent from "./components/FreeCellComponent.vue";
import { configs } from "./data/configs";
import { rules as defaultRules } from "./data/rules";
import { type Card } from "./models/card";
import type { Column } from "./models/column";
import type { Foundation } from "./models/foundation";
import type { Freecell } from "./models/freecell";
import { Game } from "./models/game";
import type { Location } from "./models/location";
import type { Rule } from "./models/rule";

const game = ref<Game>(new Game(configs[0], defaultRules));

let rules = ref<Rule[]>(defaultRules);
let update = ref<number>(0);
let deck = ref<Card[]>([]);
let cards = ref<Card[]>([]);
let columns = ref<Column[]>([]);
let freecells = ref<Freecell[]>([]);
let foundations = ref<Foundation[]>([]);
let openFreecells = ref<number>(2);
let selectedCards = ref<Card[]>([]);
let selectedOffsetY = ref<number>(0);

function newGame() {
  game.value.newGame();
  deck.value = game.value.deck;
  cards.value = game.value.cards;
  columns.value = game.value.columns;
  freecells.value = game.value.freecells;
  foundations.value = game.value.foundations;
  setTimeout(() => updateCards(), 50);
}

onMounted(() => {
  newGame();
});

function updateCards() {
  update.value = update.value + 1;
  openFreecells.value = game.value.freecells.filter(
    (f) => f.cards.length === 0
  ).length;
}
function getSource(name: string): Location {
  const [locationType, locationNumber] = name.split("-");
  const index = Number(locationNumber);
  if (locationType === "column") return columns.value[index];
  if (locationType === "freecell") return freecells.value[index];
  return foundations.value[index];
}
function dragStart(e: any) {
  e.dataTransfer.setDragImage(createEmptyImage(), 0, 0);
  e.dataTransfer.effectAllowed = "copyMove";
  e.dataTransfer.dropEffect = "copy";
  const index = e.target.attributes["index"].value;
  const card = cards.value[index];
  selectedOffsetY.value = card.pos.y - e.clientY;
  const source = getSource(card.location);
  selectedCards.value = [card];
  let addRemainder = false;
  for (let i = 0; i < source.cards.length; i++) {
    const c = source.cards[i];
    if (addRemainder) {
      selectedCards.value.push(c);
    } else {
      addRemainder = card.key === c.key;
    }
  }
}
function dragging(e: DragEvent) {
  selectedCards.value.forEach((card, i) => {
    card.pos.x = e.screenX - 41;
    card.pos.y = e.screenY + i * 28 + selectedOffsetY.value;
    card.pos.z = 1000 + i;
  });
}
function dragEnd(e: any) {
  const x: number = e.clientX;
  const y: number = e.clientY;
  const card = selectedCards.value[0];
  const source = getSource(card.location);
  let cardMoved = game.value.tryMoveToFreecell(
    selectedCards.value,
    source,
    x,
    y,
    rules.value
  );
  if (!cardMoved)
    cardMoved = game.value.tryMoveToColumn(selectedCards.value, source, x, y);
  if (!cardMoved)
    cardMoved = game.value.tryMoveToFoundation(
      selectedCards.value,
      source,
      x,
      y
    );
  if (!cardMoved) card.pos = { ...card.lastPos };
  updateCards();
  selectedCards.value = [];
}
function allowDrop(e: DragEvent) {
  e.preventDefault();
}
function createEmptyImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create 2d context");
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, 1, 1);
  const img = new Image(1, 1);
  img.src = canvas.toDataURL();

  return img;
}
function undo() {
  game.value.undoMove();
  updateCards();
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
        v-on:dragover="allowDrop"
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
        v-on:dragover="allowDrop"
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
        :open-freecells="openFreecells"
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
        :draggable="card.draggable"
        v-on:dragstart="dragStart"
        v-on:dragend="dragEnd"
        v-on:drag="dragging"
      />
    </div>
    <div class="buttons">
      <button @click="newGame()">New Game</button>
      <button @click="undo()">Undo</button>
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
.buttons {
  position: absolute;
  top: 8px;
  left: 1046px;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
}
</style>
