<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="tabs">
        <button class="tab" :class="{ 'tab-active': tab==='club' }" @click="tab='club'">分會</button>
        <button class="tab" :class="{ 'tab-active': tab==='event' }" @click="tab='event'">活動</button>
      </div>
      <div class="text-sm text-gray-500">共 {{ total }} 筆</div>
    </div>

    <div v-if="tab==='club'" class="grid md:grid-cols-2 gap-3">
      <article v-for="c in fav.clubs" :key="c.id" class="card">
        <header class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold">{{ c.name }}</h3>
            <p class="text-xs text-gray-500">{{ c.city }} · {{ labelLang(c.language) }} · {{ labelMode(c.meetingMode) }}</p>
          </div>
          <div class="flex gap-2">
            <RouterLink class="btn-ghost" :to="`/directory/${c.id}`">查看</RouterLink>
            <button class="btn-ghost" @click="remove('club', c.id)">移除</button>
          </div>
        </header>
        <p class="text-sm text-gray-700" v-if="c.description">{{ c.description }}</p>
      </article>
      <p v-if="!fav.loading && !fav.clubs.length" class="text-sm text-gray-500">尚未收藏任何分會。</p>
    </div>

    <div v-else class="space-y-2">
      <article v-for="e in fav.events" :key="e.id" class="card">
        <header class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold">{{ e.title }}</h3>
            <p class="text-xs text-gray-500">{{ formatDateTime(e.datetimeStart) }} · {{ e.city || e.venue || '' }}</p>
          </div>
          <div class="flex gap-2">
            <RouterLink class="btn-ghost" :to="`/events/${e.id}`">查看</RouterLink>
            <button class="btn-ghost" @click="remove('event', e.id)">移除</button>
          </div>
        </header>
        <p class="text-sm text-gray-700" v-if="e.description">{{ e.description }}</p>
      </article>
      <p v-if="!fav.loading && !fav.events.length" class="text-sm text-gray-500">尚未收藏任何活動。</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFavoriteStore } from '@/stores/favorites'
import { formatDateTime } from '@/utils/format'

const fav = useFavoriteStore()
const tab = ref('club')
const total = computed(() => tab.value==='club' ? fav.clubs.length : fav.events.length)

function labelLang(v){ return v==='zh' ? '中文' : v==='en' ? 'English' : v==='bilingual' ? '中英雙語' : v }
function labelMode(v){ return v==='online' ? '線上' : v==='offline' ? '實體' : v==='hybrid' ? '混合' : v }

async function remove(type, id){ await fav.remove(type, id) }

onMounted(async () => {
  await fav.list('club'); await fav.list('event')
})
</script>
