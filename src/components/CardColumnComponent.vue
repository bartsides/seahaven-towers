<script setup lang="ts">
import { defineProps, watch } from "vue";
import type { Card } from "../card";
import { MoveCard } from "../card";

const ySpacer = 28;

const { cards, index, x, y, update } = defineProps<{
  cards: Card[];
  index: number;
  x: number;
  y: number;
  update: number;
}>();
function placeCards() {
  cards.forEach((card, i) => MoveCard(card, x + 4, y + 4 + i * ySpacer, i + 2));
}
watch(
  () => update,
  () => placeCards()
);
</script>
<template>
  <div
    class="card-column"
    :style="['left: ' + x + 'px', 'top: ' + y + 'px']"
  ></div>
</template>
<style scoped>
.card-column {
  min-width: 90px;
  width: 90px;
  min-height: 500px;
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
