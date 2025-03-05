<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardColumnComponent from "./components/CardColumnComponent.vue";
import FoundationComponent from "./components/FoundationComponent.vue";
import FreeCellComponent from "./components/FreeCellComponent.vue";
import { type Card, faces, suits } from "./types";

const shuffleDeck = true;
const shuffleNumber = 5;

function getEmptyCardArray(num: number): Card[][] {
  const res: Card[][] = [];
  for (let i = 0; i < num; i++) {
    res.push([]);
  }
  return res;
}

let deck = ref<Card[]>([]);
let columns = ref<Card[][]>(getEmptyCardArray(10));
let freeCells = ref<Card[]>(Array(4));
let foundations = ref<Card[][]>(getEmptyCardArray(4));

function drawCard(): Card | undefined {
  return deck.value.shift();
}

function getNewDeck(): Card[] {
  const res: Card[] = [];
  let i = 0;
  suits.forEach((suit) => {
    faces.forEach((face) => {
      res.push({ suit, face, key: i++ });
    });
  });
  if (shuffleDeck) {
    for (let i = 0; i < Math.max(Math.random() * 10, shuffleNumber); i++) {
      res.sort(() => Math.random() - 0.5);
    }
  }
  return res;
}

function deal() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const card = drawCard();
      if (!card) break;
      const column = columns.value[col];
      if (!column.length) {
        columns.value[col] = [card];
      } else {
        column.unshift(card);
      }
    }
  }
  let card = drawCard();
  if (card) {
    freeCells.value[1] = card;
  }
  card = drawCard();
  if (card) {
    freeCells.value[2] = card;
  }
}

function newGame() {
  columns.value = Array(10).fill([]);
  freeCells.value = Array(4).fill([]);
  foundations.value = Array(4).fill([]);
  deck.value = getNewDeck();
  deal();
}

onMounted(() => {
  newGame();
});
</script>
<template>
  <div class="tableau">
    <div class="top-row">
      <FoundationComponent :cards="foundations[0]" :index="0" suit="♥" />
      <FoundationComponent
        :cards="foundations[1]"
        :index="1"
        suit="◆"
        style="margin-right: 100px"
      />
      <FreeCellComponent
        v-for="(freeCell, i) in freeCells"
        :key="i"
        :index="i"
        :card="freeCell"
      />
      <FoundationComponent
        :cards="foundations[2]"
        :index="2"
        suit="♣"
        style="margin-left: 100px"
      />
      <FoundationComponent :cards="foundations[3]" :index="3" suit="♠" />
    </div>
    <div class="card-columns">
      <CardColumnComponent
        v-for="(cards, i) in columns"
        :key="i"
        :index="i"
        :cards="cards"
      />
    </div>
  </div>
</template>
<style scoped>
.tableau {
  background-color: green;
  min-width: 1000px;
  min-height: 800px;
  width: 100%;
  height: 100%;
}
.top-row {
  margin-top: 8px;
  display: inline-flex;
  gap: 8px;
}
.card-columns {
  display: inline-flex;
  gap: 8px;
}
</style>
