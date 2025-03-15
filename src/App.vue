<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardColumnComponent from "./components/CardColumnComponent.vue";
import CardComponent from "./components/CardComponent.vue";
import FoundationComponent from "./components/FoundationComponent.vue";
import FreeCellComponent from "./components/FreeCellComponent.vue";
import type { Card } from "./models/card";
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
      if (!column.cards?.length) {
        column.cards = [card];
      } else {
        column.cards.unshift(card);
      }
    }
  }
  let card = drawCard();
  if (card) {
    freecells.value[1].card = card;
  }
  card = drawCard();
  if (card) {
    freecells.value[2].card = card;
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
}

onMounted(() => {
  newGame();
});

function updateCards() {
  update.value = update.value + 1;
}
function dragStart(e: any) {
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.setData("index", e.target.attributes["index"].value);
}
function allowDrop(e: DragEvent) {
  e.preventDefault();
}
function canDropColumn(card: Card, column: Column): boolean {
  if (!column.cards.length) return false;
  const topCard = column.cards[column.cards.length - 1];
  return topCard.suit === card.suit && topCard.value - card.value === 1;
}
function dropCard(e: any) {
  e.preventDefault();

  const card = cards.value[e.dataTransfer.getData("index")];
  const [targetType, targetNumber] = e.target.id.split("-");
  if (targetType === "column") {
    const column = columns.value[targetNumber];
    if (canDropColumn(card, column)) {
      // TODO: Remove card from original place
      column.cards.push(card);
      updateCards();
    }
  }
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
        :id="'foundation' + i"
      />
    </div>
    <div class="freecells">
      <FreeCellComponent
        v-for="(freecell, i) in freecells"
        :freecell="freecell"
        :key="i"
        :index="i"
        :id="'freecell-' + i"
      />
    </div>
    <div class="columns">
      <CardColumnComponent
        v-for="(column, i) in columns"
        :column="column"
        :key="i"
        :index="i"
        :id="'column-' + i"
        :update="update"
        v-on:drop="dropCard"
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
