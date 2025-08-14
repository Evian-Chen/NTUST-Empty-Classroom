<template>
  <article class="card grid gap-2">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-lg">{{ item.title }}</h3>
        <p class="text-xs text-gray-500">
          {{ categoryLabel }} · {{ sourceLabel }}
          <span v-if="item.clubName"> · 由 {{ item.clubName }}</span>
        </p>
      </div>
      <div class="flex gap-2">
        <button v-if="canPreview" class="btn-ghost" @click="$emit('preview', item)">預覽</button>
        <a v-if="item.url" :href="item.url" target="_blank" class="btn-primary">開啟</a>
      </div>
    </header>
    <p v-if="item.description" class="text-sm text-gray-700">{{ item.description }}</p>
    <div v-if="(item.tags||[]).length" class="flex flex-wrap gap-2 pt-1">
      <span v-for="t in item.tags" :key="t" class="text-xs px-2 py-1 rounded-full bg-gray-100"># {{ t }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['preview'])
const categoryLabel = computed(() => ({ template:'模板', guide:'指南', video:'教學影片', case:'案例' }[props.item.category] || props.item.category || '其他'))
const sourceLabel = computed(() => ({ official:'總會官方', district:'地區/分區', club:'各分會', committee:'Campus Committee' }[props.item.source] || props.item.source || '其他'))
const canPreview = computed(() => {
  const url = props.item.url || props.item.fileUrl
  if (!url) return false
  return /\.(pdf|png|jpe?g|webp)$/i.test(url) || /youtube\.com|youtu\.be/i.test(url)
})
</script>
