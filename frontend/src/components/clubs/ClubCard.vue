<template>
  <article
    class="card hover:shadow-md transition cursor-pointer"
    :class="selected ? 'ring-2 ring-tmblue' : ''"
    @click="$emit('select', club)"
  >
    <header class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold">{{ club.name }}</h3>
        <p class="text-sm text-gray-600">
          <span class="uppercase">{{ club.type }}</span>
          <span v-if="club.area"> · {{ club.area }}</span>
          <span v-if="club.city"> · {{ club.city }}</span>
          <span v-if="club.meetingTime"> · {{ club.meetingTime }}</span>
          <span v-if="club.language"> · {{ langLabel }}</span>
          <span v-if="club.meetingMode"> · {{ modeLabel }}</span>
        </p>
      </div>
      <RouterLink class="btn-ghost" :to="`/directory/${club.id}`">詳情</RouterLink>
    </header>
    <p v-if="club.description" class="mt-2 text-sm text-gray-700 line-clamp-2">{{ club.description }}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <a v-if="club.contact?.website" :href="club.contact.website" target="_blank" class="btn-ghost">官網</a>
      <a v-if="club.contact?.facebook" :href="club.contact.facebook" target="_blank" class="btn-ghost">Facebook</a>
      <a v-if="club.contact?.email" :href="`mailto:${club.contact.email}`" class="btn-ghost">Email</a>
      <button class="btn-ghost" @click.stop="$emit('favorite', club)">收藏</button>
      <button class="btn-ghost" @click.stop="$emit('share', club)">分享</button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  club: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})

const langLabel = computed(() => {
  switch (props.club.language) {
    case 'zh': return '中文'
    case 'en': return 'English'
    case 'bilingual': return '中英雙語'
    default: return props.club.language
  }
})
const modeLabel = computed(() => {
  switch (props.club.meetingMode) {
    case 'online': return '線上'
    case 'offline': return '實體'
    case 'hybrid': return '混合'
    default: return props.club.meetingMode
  }
})
</script>
