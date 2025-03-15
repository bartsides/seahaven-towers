<script setup lang="ts">
import { defineProps, watch } from "vue";
import { MoveCard } from "../models/card";
import type { Foundation } from "../models/foundation";

const { foundation, update } = defineProps<{
  foundation: Foundation;
  update: number;
}>();
function placeCards() {
  foundation.cards.forEach((card, i) => {
    MoveCard(card, foundation.x + 4, foundation.y + 4, i + 2);
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
    :style="['left: ' + foundation.x + 'px', 'top: ' + foundation.y + 'px']"
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
