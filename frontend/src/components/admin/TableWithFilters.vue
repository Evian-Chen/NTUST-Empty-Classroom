<template>
  <div class="card">
    <div class="flex flex-col gap-3">
      <div class="grid md:grid-cols-5 gap-2">
        <input v-model="q" placeholder="搜尋關鍵字…" class="border rounded-2xl px-3 py-2 md:col-span-2" />
        <slot name="filters" />
        <div class="flex gap-2 justify-end">
          <button class="btn-ghost" @click="refresh">查詢</button>
          <button class="btn-ghost" @click="reset">重設</button>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">共 {{ total }} 筆</div>
        <div class="flex gap-2"><slot name="toolbar" /></div>
      </div>
      <div class="overflow-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b">
              <th v-for="col in columns" :key="col.key" class="py-2 pr-4">{{ col.label }}</th>
              <th class="py-2 pr-2 w-40">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in items" :key="row.id" class="border-b hover:bg-gray-50">
              <td v-for="col in columns" :key="col.key" class="py-2 pr-4 align-top">
                <slot :name="'cell.'+col.key" :row="row">{{ row[col.key] }}</slot>
              </td>
              <td class="py-2 pr-2"><slot name="actions" :row="row" /></td>
            </tr>
            <tr v-if="!loading && !items.length">
              <td :colspan="columns.length+1" class="text-center text-gray-500 py-6">暫無資料</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-end gap-2">
        <button class="btn-ghost" :disabled="page===1" @click="page-- && refresh()">上一頁</button>
        <span class="text-sm">第 {{ page }} 頁</span>
        <button class="btn-ghost" :disabled="page*pageSize>=total" @click="page++ && refresh()">下一頁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { http } from '@/utils/http'

const props = defineProps({
  endpoint: { type: String, required: true },
  columns: { type: Array, required: true },
  initialParams: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['loaded'])

const q = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const items = ref([])
const loading = ref(false)

async function refresh(){
  loading.value = true
  try {
    const params = { ...props.initialParams, q: q.value, page: page.value, pageSize: pageSize.value }
    const res = await http.get(props.endpoint, { params })
    if (Array.isArray(res.data)) {
      items.value = res.data
      total.value = res.data.length
    } else {
      items.value = res.data.items || []
      total.value = res.data.total || items.value.length
    }
    emit('loaded', items.value)
  } finally {
    loading.value = false
  }
}
function reset(){
  q.value = ''
  page.value = 1
  refresh()
}

watch(() => props.endpoint, () => reset(), { immediate: true })

defineExpose({ refresh, reset, state: { q, page, pageSize, total, items, loading } })
</script>
