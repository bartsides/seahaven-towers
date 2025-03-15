<script setup lang="ts">
import { defineProps, watch } from "vue";
import { MoveCard } from "../models/card";
import type { Freecell } from "../models/freecell";

const { freecell } = defineProps<{
  freecell: Freecell;
}>();
function placeCard() {
  if (freecell.card) {
    MoveCard(freecell.card, freecell.x + 4, freecell.y + 4, 2);
  }
}
watch(
  () => freecell.card,
  () => placeCard()
);
</script>
<template>
  <div
    class="free-cell"
    :style="['left: ' + freecell.x + 'px', 'top: ' + freecell.y + 'px']"
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
