<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">案件看板</h1>
      <div class="flex gap-2"><button class="btn-ghost" @click="refresh">重新整理</button></div>
    </div>

    <KanbanBoard :items="items" @move="move" @open="open" @assign="assignOpen=true; current=$event" />

    <BaseModal :open="detailOpen" title="案件詳情" @close="detailOpen=false">
      <div v-if="current" class="grid gap-2">
        <div class="text-sm"><b>#{{ current.id }}</b> — {{ current.topic }} / {{ current.city || '未填城市' }}</div>
        <p class="text-sm whitespace-pre-wrap">{{ current.details }}</p>
        <div class="text-xs text-gray-500">偏好模式：{{ current.preferredMode || '無' }}</div>
      </div>
    </BaseModal>

    <BaseModal :open="assignOpen" title="指派顧問" @close="assignOpen=false">
      <form class="grid gap-2" @submit.prevent="doAssign">
        <label class="grid gap-1">
          <span class="text-sm">顧問 ID（以逗號分隔可多位）</span>
          <input v-model="assignForm.ids" class="border rounded-2xl px-3 py-2" placeholder="advisor_001,advisor_002">
        </label>
        <div class="flex justify-end gap-2">
          <button class="btn-ghost" type="button" @click="assignOpen=false">取消</button>
          <button class="btn-primary">指派</button>
        </div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'
import KanbanBoard from '@/components/admin/KanbanBoard.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const items = ref([])
const current = ref(null)
const detailOpen = ref(false)
const assignOpen = ref(false)
const assignForm = ref({ ids: '' })

async function refresh(){
  const res = await http.get('/admin/requests', { params: { all: 1 } })
  items.value = res.data.items || res.data
}
function open(it){ current.value = it; detailOpen.value = true }
async function move({ id, from, to }){
  if (from === to) return
  await http.patch(`/requests/${id}`, { status: to })
  await refresh()
}
async function doAssign(){
  const ids = assignForm.value.ids.split(',').map(s => s.trim()).filter(Boolean)
  if (!current.value) return
  await http.post(`/requests/${current.value.id}/assign`, { advisorIds: ids })
  assignOpen.value = false
  await refresh()
}

onMounted(refresh)
</script>
