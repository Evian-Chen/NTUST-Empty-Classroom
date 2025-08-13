<template>
  <div class="grid md:grid-cols-4 gap-4">
    <div class="card" v-for="kpi in kpis" :key="kpi.label">
      <div class="text-xs text-gray-500">{{ kpi.label }}</div>
      <div class="text-2xl font-bold">{{ kpi.value }}</div>
      <svg v-if="kpi.spark && kpi.spark.length" :width="180" :height="32" class="mt-2">
        <polyline :points="sparkPoints(kpi.spark)" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ kpis: { type: Array, default: () => [] } })
function sparkPoints(arr){
  const w = 180, h = 32
  const min = Math.min(...arr), max = Math.max(...arr)
  const scaleX = (i) => (i/(arr.length-1))*w
  const scaleY = (v) => h - ((v - min) / (max - min || 1)) * h
  return arr.map((v,i) => `${scaleX(i)},${scaleY(v)}`).join(' ')
}
</script>
