<script setup lang="ts">
import { defineProps } from "vue";
import type { Card } from "../types";
import CardComponent from "./CardComponent.vue";

const { cards, index } = defineProps<{ cards: Card[]; index: number }>();
</script>
<template>
  <div class="card-column">
    <CardComponent
      class="card"
      v-for="(card, i) in cards"
      :key="card.key"
      :card="card"
      :style="{ top: i * 28 + 'px', 'z-index': i + 2 }"
    />
  </div>
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
  position: relative;
}
.card {
  position: absolute;
  margin: 4px;
}
</style>
