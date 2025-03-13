<script setup lang="ts">
import { defineProps, watch } from "vue";
import type { Card } from "../card";
import { MoveCard } from "../card";

const { card, index, x, y } = defineProps<{
  card: Card | undefined;
  index: number;
  x: number;
  y: number;
}>();
function placeCard() {
  if (card) {
    MoveCard(card, x + 4, y + 4, 2);
  }
}
watch(
  () => card,
  () => placeCard()
);
</script>
<template>
  <div
    class="free-cell"
    :style="['left: ' + x + 'px', 'top: ' + y + 'px']"
  ></div>
</template>
<style scoped>
.free-cell {
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
  margin: 4px;
}
</style>
