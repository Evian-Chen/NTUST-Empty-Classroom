<template>
  <article class="card grid gap-3">
    <div class="flex items-start gap-4">
      <img
        v-if="advisor.avatarUrl"
        :src="advisor.avatarUrl"
        class="w-16 h-16 rounded-full object-cover"
        alt="avatar"
      />
      <div class="flex-1">
        <h3 class="text-lg font-semibold">{{ advisor.name }}</h3>
        <div class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="(tag, idx) in advisor.expertise || []"
            :key="idx"
            class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-100"
          ># {{ tag }}</span>
        </div>
        <p v-if="advisor.bio" class="text-sm text-gray-700 mt-2">{{ advisor.bio }}</p>
        <p v-if="advisor.clubsAffiliated?.length" class="text-xs text-gray-500 mt-1">
          隸屬：{{ advisor.clubsAffiliated.join('、') }}
        </p>
        <p v-if="availabilityText" class="text-xs text-gray-500 mt-1">
          可用時段：{{ availabilityText }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <button class="btn-primary" @click="$emit('request', advisor)">發起媒合</button>
        <a v-if="advisor.contact?.email" :href="`mailto:${advisor.contact.email}`" class="btn-ghost">Email</a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ advisor: { type: Object, required: true } })

const weekdayMap = ['日','一','二','三','四','五','六']
const availabilityText = computed(() => {
  if (!props.advisor?.availability) return ''
  const w = props.advisor.availability.weekdays || []
  const t = props.advisor.availability.timeSlots || []
  const wd = w.map(i => '週' + (weekdayMap[Number(i)] ?? i)).join('、')
  const ts = t.join('/')
  return [wd, ts].filter(Boolean).join(' ')
})
</script>
