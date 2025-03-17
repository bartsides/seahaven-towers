<script setup lang="ts">
import { defineProps, watch } from "vue";
import { positionCard } from "../models/card";
import type { Column } from "../models/column";

const ySpacer = 28;

const { column, index, update } = defineProps<{
  column: Column;
  index: number;
  update: number;
}>();
function placeCards() {
  column.cards.forEach((card, i) => {
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
