<template>
  <BaseModal :open="open" :title="title" @close="$emit('close')">
    <div class="max-h-[70vh] overflow-auto">
      <div v-if="isYouTube" class="aspect-video">
        <iframe :src="embedUrl" frameborder="0" allowfullscreen class="w-full h-full"></iframe>
      </div>
      <img v-else-if="isImage" :src="url" class="w-full rounded-xl" alt="preview" />
      <iframe v-else-if="isPdf" :src="url" class="w-full h-[70vh] rounded-xl"></iframe>
      <div v-else class="text-sm text-gray-600">
        無法預覽此檔案。你可以
        <a :href="url" target="_blank" class="underline text-tmblue">直接開啟</a>
        。
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
const props = defineProps({ open: Boolean, url: String, title: String })
defineEmits(['close'])
const isImage = computed(() => /\.(png|jpe?g|webp)$/i.test(props.url || ''))
const isPdf = computed(() => /\.pdf$/i.test(props.url || ''))
const isYouTube = computed(() => /(youtube\.com|youtu\.be)/i.test(props.url || ''))
const embedUrl = computed(() => {
  if (!props.url) return ''
  try {
    const u = new URL(props.url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
  } catch {}
  return props.url
})
</script>
