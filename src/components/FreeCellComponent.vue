<script setup lang="ts">
import { watch } from "vue";
import { positionCard } from "../models/card";
import type { Freecell } from "../models/freecell";

const { freecell, update } = defineProps<{
  freecell: Freecell;
  update: number;
}>();
function placeCard() {
  freecell.cards.forEach((card, i) => {
    card.draggable = true;
    positionCard(card, freecell.x + 4, freecell.y + 4, i + 2);
  });
}
watch(
  () => update,
  () => placeCard()
);
</script>
<template>
  <div
    class="free-cell"
    :style="[
      'left: ' + freecell.x + 'px',
      'top: ' + freecell.y + 'px',
      'width: ' + freecell.width + 'px',
      'min-width: ' + freecell.width + 'px',
      'min-height: ' + freecell.height + 'px',
    ]"
  ></div>
</template>
<style scoped>
.free-cell {
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
