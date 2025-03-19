<script setup lang="ts">
import { watch } from "vue";
import { type Card } from "../models/card";
const { card } = defineProps<{ card: Card }>();
watch(
  () => card,
  () => {}
);
</script>
<template>
  <div
    class="card"
    :class="{ red: card.suit === '♥' || card.suit === '◆' }"
    :style="[
      'left: ' + card.pos.x + 'px',
      'top: ' + card.pos.y + 'px',
      'z-index: ' + card.pos.z,
      card.draggable ? 'cursor: grab' : '',
    ]"
  >
    <div class="unselectable upper-left">{{ card.face }}{{ card.suit }}</div>
    <div class="unselectable bottom-right">{{ card.face }}{{ card.suit }}</div>
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
