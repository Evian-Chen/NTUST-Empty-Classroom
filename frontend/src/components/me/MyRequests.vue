<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">我的求助單</h3>
      <RouterLink to="/advisory/requests" class="btn-ghost">全部</RouterLink>
    </div>

    <article v-for="r in requests" :key="r.id" class="card">
      <header class="flex items-start justify-between gap-3">
        <div>
          <h4 class="font-semibold">[{{ statusLabel(r.status) }}] {{ topicLabel(r.topic) }}</h4>
          <p class="text-xs text-gray-500">#{{ r.id }} · {{ r.city || '未填城市' }}</p>
        </div>
        <button class="btn-ghost" @click="toggle(r.id)">{{ openId===r.id ? '收合' : '查看進度' }}</button>
      </header>
      <p class="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{{ r.details }}</p>
      <div v-if="openId===r.id" class="mt-3">
        <RequestTimeline :items="timelines[r.id] || []" />
      </div>
    </article>

    <p v-if="!loading && !requests.length" class="text-sm text-gray-500">尚無求助單。</p>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRequestStore } from '@/stores/requests'
import RequestTimeline from '@/components/advisory/RequestTimeline.vue'

const store = useRequestStore()
const loading = computed(() => store.loading)
const requests = computed(() => store.mine)

const openId = ref(null)
const timelines = ref({})

function statusLabel(s){
  const map = { submitted:'已提交', triage:'分流中', assigned:'已指派', 'in-progress':'進行中', resolved:'已結案', archived:'已封存' }
  return map[s] || s
}
function topicLabel(t){
  const map = { manpower:'人手不足', operation:'營運', pr:'PR', recruiting:'招募', mentoring:'Mentoring', event:'活動', others:'其他' }
  return map[t] || t
}
function toggle(id){
  openId.value = openId.value === id ? null : id
  if (openId.value && !timelines.value[id]) fetchTimeline(id)
}
async function fetchTimeline(id){
  const data = await store.timeline(id)
  timelines.value = { ...timelines.value, [id]: data || [] }
}
onMounted(async () => { await store.listMine() })
</script>
