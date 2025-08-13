<template>
  <ol class="relative border-l border-gray-200 pl-4">
    <li v-for="(it, idx) in items" :key="idx" class="mb-6">
      <div class="absolute -left-1.5 w-3 h-3 rounded-full bg-tmblue"></div>
      <time class="text-xs text-gray-500">{{ it.at }}</time>
      <p class="text-sm"><b>{{ it.action }}</b> <span class="text-gray-500" v-if="it.by">— {{ it.by }}</span></p>
    </li>
  </ol>
</template>
<script setup>
defineProps({ items: { type: Array, default: () => [] } })
</script>
