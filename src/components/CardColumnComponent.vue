<script setup lang="ts">
import { defineProps, watch } from "vue";
import { positionCard, type Card } from "../models/card";
import type { Column } from "../models/column";

const ySpacer = 28;

const { column, update, openFreecells } = defineProps<{
  column: Column;
  update: number;
  openFreecells: number;
}>();
function setCardIsDraggable(card: Card, i: number, length: number) {
  if (length === 1) {
    card.draggable = true;
    return;
  }
  const cardsAbove = length - 1 - i;
  const enoughMoves = cardsAbove <= openFreecells;
  if (!enoughMoves) {
    card.draggable = false;
    return;
  }
  for (let j = i + 1; j < length; j++) {
    const c = column.cards[j];
    if (c.suit !== card.suit) {
      card.draggable = false;
      return;
    }
    if (column.cards[j - 1].value - c.value !== 1) {
      card.draggable = false;
      return;
    }
  }
  card.draggable = true;
}
function placeCards() {
  const length = column.cards.length;
  column.cards.forEach((card, i) => {
    setCardIsDraggable(card, i, length);
    positionCard(card, column.x + 4, column.y + 4 + i * ySpacer, i + 2);
  });
}
watch(
  () => update,
  () => placeCards()
);
</script>
<template>
  <div
    class="card-column"
    :style="[
      'left: ' + column.x + 'px',
      'top: ' + column.y + 'px',
      'width: ' + column.width + 'px',
      'min-width: ' + column.width + 'px',
      'min-height: ' + column.height + 'px',
    ]"
  ></div>
</template>
<style scoped>
.card-column {
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
