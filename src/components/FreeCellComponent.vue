<script setup lang="ts">
import { defineProps } from "vue";
import type { Card } from "../types";
import CardComponent from "./CardComponent.vue";

const { card, index } = defineProps<{
  card: Card | undefined;
  index: number;
}>();
</script>
<template>
  <div class="free-cell">
    <CardComponent v-if="card?.face" class="card" :card="card" />
  </div>
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
  position: relative;
}
.card {
  margin: 4px;
}
</style>
