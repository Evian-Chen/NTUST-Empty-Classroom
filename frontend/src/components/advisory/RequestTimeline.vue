<template>
  <ol class="relative border-s border-gray-200 pl-4">
    <li v-for="(t, idx) in items" :key="idx" class="mb-3 ms-4">
      <div class="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -start-1.5 border border-white"></div>
      <time class="text-xs text-gray-500">{{ fmt(t.at) }}</time>
      <p class="text-sm">{{ t.action }}</p>
      <p v-if="t.by" class="text-xs text-gray-500">by {{ t.by }}</p>
    </li>
    <li v-if="!items?.length" class="text-sm text-gray-500">暫無進度。</li>
  </ol>
</template>

<script setup>
import { formatDateTime } from '@/utils/format'
defineProps({ items: { type: Array, default: () => [] } })
function fmt(d){ return formatDateTime(d) }
</script>
