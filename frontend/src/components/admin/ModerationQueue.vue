<template>
  <div class="grid md:grid-cols-2 gap-3">
    <article v-for="it in items" :key="it.id" class="card">
      <header class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold">{{ it.title }}</h3>
          <p class="text-xs text-gray-500">提交時間：{{ it.createdAt }}</p>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100">{{ it.target }}</span>
      </header>
      <p class="text-sm text-gray-700 mt-2">{{ it.summary }}</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <a v-for="l in it.links || []" :key="l.url" :href="l.url" target="_blank" class="underline text-tmblue text-sm">{{ l.label || '連結' }}</a>
      </div>
      <div class="flex items-center gap-2 mt-3 justify-end">
        <button class="btn-ghost" @click="$emit('reject', it)">退回</button>
        <button class="btn-primary" @click="$emit('approve', it)">發布</button>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
defineEmits(['approve','reject'])
</script>
