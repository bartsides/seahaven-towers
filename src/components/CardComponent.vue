<script setup lang="ts">
import { defineProps } from "vue";
import { type Card } from "../types";
const { card } = defineProps<{ card: Card }>();
function getSuitChar(): string {
  if (card.suit === "S") return "♠";
  if (card.suit === "C") return "♣";
  if (card.suit === "H") return "♥";
  return "◆";
}
</script>
<template>
  <div class="card" :class="{ red: card.suit === 'H' || card.suit === 'D' }">
    <div class="upper-left">{{ card.face }}{{ getSuitChar() }}</div>
    <div class="bottom-right">{{ card.face }}{{ getSuitChar() }}</div>
  </div>
</template>
<style scoped>
.card {
  position: relative;
  width: 100px;
  height: 129px;
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
