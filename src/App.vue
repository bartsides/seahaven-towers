<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardComponent from "./components/CardComponent.vue";
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

let update = ref<number>(0);
let deck = ref<Card[]>([]);
let cards = ref<Card[]>([]);
let columns = ref<Card[][]>(getEmptyCardArray(10));
let freeCells = ref<Card[]>(Array(4));
let foundations = ref<Card[][]>(getEmptyCardArray(4));
const foundationSuits = ref<string[]>(["♥", "◆", "♣", "♠"]);
const foundX = ref<number[]>([8, 112, 8 + 104 * 8, 8 + 104 * 9]);
const colX = ref<number[]>(
  Array(10)
    .fill(0)
    .map((v, i) => 8 + 104 * i)
);
const colY = 136;
const freeCellX = ref<number[]>(
  Array(4)
    .fill(0)
    .map((v, i) => 320 + 104 * i)
);

function drawCard(): Card | undefined {
  return deck.value.shift();
}

function getNewDeck(): Card[] {
  const res: Card[] = [];
  let i = 0;
  suits.forEach((suit) => {
    faces.forEach((face) => {
      res.push({ suit, face, pos: { x: 0, y: 0, z: 0 }, key: i++ });
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
  update.value = update.value + 1;
}

function newGame() {
  columns.value = Array(10).fill([]);
  freeCells.value = Array(4).fill([]);
  foundations.value = Array(4).fill([]);
  deck.value = getNewDeck();
  cards.value = [...deck.value];
  deal();
}

onMounted(() => {
  newGame();
});
</script>
<template>
  <div class="tableau">
    <div>{{ console.log(update) }}</div>
    <div class="foundations">
      <FoundationComponent
        v-for="(foundation, i) in foundations"
        :cards="foundations[i]"
        :index="0"
        :suit="foundationSuits[i]"
        :x="foundX[i]"
        :y="8"
        :update="update"
      />
    </div>
    <div class="free-cells">
      <FreeCellComponent
        v-for="(freeCell, i) in freeCells"
        :key="i"
        :index="i"
        :card="freeCell"
        class="free-cell"
        :x="freeCellX[i]"
        :y="8"
      />
    </div>
    <div class="columns">
      <CardColumnComponent
        v-for="(cards, i) in columns"
        :key="i"
        :index="i"
        :cards="cards"
        class="col"
        :x="colX[i]"
        :y="colY"
        :update="update"
      />
    </div>
    <div class="cards">
      <CardComponent
        v-for="(card, i) in cards"
        :key="i"
        :index="i"
        :card="card"
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
