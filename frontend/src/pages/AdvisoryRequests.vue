<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">我的求助單</h1>
      <RouterLink to="/advisory" class="btn-ghost">+ 新增</RouterLink>
    </div>

    <div v-if="loading" class="text-sm text-gray-500">載入中…</div>

    <div v-else class="space-y-3">
      <article v-for="r in requests" :key="r.id" class="card">
        <header class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold">[{{ statusLabel(r.status) }}] {{ r.topic }} — {{ r.city || '未填城市' }}</h3>
            <p class="text-xs text-gray-500">案件編號：{{ r.id }}</p>
          </div>
          <button class="btn-ghost" @click="toggle(r.id)">{{ openId===r.id ? '收合' : '查看進度' }}</button>
        </header>
        <p class="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{{ r.details }}</p>

        <div v-if="openId===r.id" class="mt-3">
          <RequestTimeline :items="timelines[r.id] || []" />
        </div>
      </article>

      <p v-if="requests.length===0" class="text-sm text-gray-500">尚無求助單。</p>
    </div>
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
  const map = {
    submitted: '已提交',
    triage: '分流中',
    assigned: '已指派',
    'in-progress': '進行中',
    resolved: '已結案',
    archived: '已封存'
  }
  return map[s] || s
}

function toggle(id){
  openId.value = openId.value === id ? null : id
  if (openId.value && !timelines.value[id]) {
    fetchTimeline(id)
  }
}

async function fetchTimeline(id){
  const data = await store.timeline(id)
  timelines.value = { ...timelines.value, [id]: data || [] }
}

onMounted(async () => {
  await store.listMine()
})
</script>
