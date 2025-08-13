<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">後台儀表板</h1>
      <button class="btn-ghost" @click="load">重新整理</button>
    </div>

    <MetricsDashboard :kpis="kpis" />

    <div class="grid md:grid-cols-2 gap-4">
      <div class="card">
        <h3 class="font-semibold mb-2">待審核貼文</h3>
        <ul class="text-sm list-disc pl-6">
          <li v-for="p in pendingPromo" :key="p.id">{{ p.title }}</li>
          <li v-if="!pendingPromo.length" class="text-gray-500">無</li>
        </ul>
      </div>
      <div class="card">
        <h3 class="font-semibold mb-2">最新求助單</h3>
        <ul class="text-sm list-disc pl-6">
          <li v-for="r in latestRequests" :key="r.id">#{{ r.id }} — {{ r.topic }}（{{ r.status }}）</li>
          <li v-if="!latestRequests.length" class="text-gray-500">無</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'
import MetricsDashboard from '@/components/admin/MetricsDashboard.vue'

const kpis = ref([])
const pendingPromo = ref([])
const latestRequests = ref([])

async function load(){
  const res = await http.get('/admin/metrics')
  const data = res.data || {}
  kpis.value = [
    { label: '本學期求助案件', value: data.requestsCount ?? 0, spark: data.requestsTrend || [1,2,3,2,4,5,4] },
    { label: '跨分會活動', value: data.jointEvents ?? 0, spark: data.jointEventsTrend || [1,1,2,3,2,3,4] },
    { label: '名錄查詢（近30天）', value: data.directoryViews ?? 0, spark: data.directoryViewsTrend || [10,12,9,14,16,15,18] },
    { label: '學生滿意度', value: (data.satisfaction ?? 4.6).toFixed(1) + '/5' },
  ]
  pendingPromo.value = data.pendingPromo || []
  latestRequests.value = data.latestRequests || []
}

onMounted(load)
</script>
