<script setup lang="ts">
import { ref, watch } from "vue";
import { type Card } from "../models/card";
import { getDisplayFace } from "../models/face";
import { getDisplaySuit } from "../models/suit";
const { card } = defineProps<{ card: Card }>();
const face = ref<string>(getDisplayFace(card.face));
const suit = ref<string>(getDisplaySuit(card.suit));
watch(
  () => card,
  () => {}
);
</script>
<template>
  <div
    class="card"
    :class="{
      red: card.suit === 'H' || card.suit === 'D',
      'highlight-card': card.highlight,
    }"
    :style="[
      'left: ' + card.pos.x + 'px',
      'top: ' + card.pos.y + 'px',
      'z-index: ' + card.pos.z,
      card.draggable ? 'cursor: grab' : '',
    ]"
  >
    <div class="unselectable upper-left">{{ face }}{{ suit }}</div>
    <div class="unselectable bottom-right">{{ face }}{{ suit }}</div>
  </div>
</template>
<style scoped>
.card {
  position: absolute;
  width: 82px;
  height: 108px;
  display: flex;
  border: 1px solid black;
  border-radius: 4px;
  padding: 0;
  color: black;
  background-color: white;
  font-size: 20px;
}
.highlight-card {
  background-color: rgb(206 249 249);
}
.red {
  color: red;
}
.upper-left {
  position: absolute;
  left: 4px;
  top: -2px;
}
.bottom-right {
  position: absolute;
  right: 4px;
  bottom: -2px;
  transform: scale(-1, -1);
}
</style>
