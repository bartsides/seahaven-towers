<script setup lang="ts">
import { onMounted, ref } from "vue";
import CardComponent from "./components/CardComponent.vue";
import { type Card, faces, suits } from "./types";

// 10 columns
// 4 freeCells
// H & D foundations left side
// C & S foundations right side

// TODO: Setup tableau

const shuffleDeck = true;
const shuffleNumber = 5;

let deck = ref<Card[]>([]);
let columns = ref<Card[][]>(Array(10).fill([]));
let freeCells = ref<Card[][]>(Array(4).fill([]));
let foundations = ref<Card[][]>(Array(4).fill([]));

function getNewDeck(): Card[] {
  const res: Card[] = [];
  suits.forEach((suit) => {
    faces.forEach((face) => {
      res.push({ suit, face });
    });
  });
  if (shuffleDeck) {
    for (let i = 0; i < Math.max(Math.random() * 10, shuffleNumber); i++) {
      res.sort(() => Math.random() - 0.5);
    }
  }
  console.log(res);
  return res;
}

function deal() {}

function newGame() {
  deck.value = getNewDeck();
  deal();
}

onMounted(() => {
  newGame();
});
</script>
<template>
  <div class="tableau">
    <CardComponent v-for="(card, i) in deck" :key="i" :card="card" />
  </div>
</template>
<style scoped>
.tableau {
  background-color: green;
  width: 1000px;
  height: 800px;
}
</style>
