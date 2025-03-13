<script setup lang="ts">
import { defineProps, watch } from "vue";
import type { Card, Suit } from "../types";

const { cards, index, suit, x, y, update } = defineProps<{
  cards: Card[];
  index: number;
  suit: Suit;
  x: number;
  y: number;
  update: number;
}>();
function placeCards() {
  cards.forEach((card, i) => {
    card.pos.x = x + 4;
    card.pos.y = y + 4;
    card.pos.z = i + 2;
  });
}
watch(
  () => update,
  () => placeCards()
);
</script>
<template>
  <div
    class="foundation"
    :style="['left: ' + x + 'px', 'top: ' + y + 'px']"
  ></div>
</template>
<style scoped>
.foundation {
  min-width: 90px;
  width: 90px;
  min-height: 116px;
  height: 116px;
  border: 1px solid brown;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  place-items: center;
  position: absolute;
}
.card {
  position: absolute;
  margin: 4px;
}
</style>
