<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">活動管理</h1>
      <div class="flex gap-2"><button class="btn-primary" @click="openCreate">新增活動</button></div>
    </div>

    <TableWithFilters ref="table" endpoint="/admin/events" :columns="columns">
      <template #actions="{ row }">
        <button class="btn-ghost" @click="dup(row)">複製</button>
        <button class="btn-ghost" @click="edit(row)">編輯</button>
        <button class="btn-ghost" @click="del(row)">刪除</button>
      </template>
      <template #cell.datetimeStart="{ row }">{{ formatDateTime(row.datetimeStart) }}</template>
      <template #cell.datetimeEnd="{ row }">{{ formatDateTime(row.datetimeEnd) }}</template>
    </TableWithFilters>

    <BaseModal :open="formOpen" :title="form.id ? '編輯活動' : '新增活動'" @close="formOpen=false">
      <form class="grid md:grid-cols-2 gap-3" @submit.prevent="save">
        <label class="grid gap-1 md:col-span-2"><span class="text-sm">標題</span><input v-model="form.title" class="border rounded-2xl px-3 py-2" required></label>
        <label class="grid gap-1"><span class="text-sm">開始</span><input v-model="form.datetimeStart" type="datetime-local" class="border rounded-2xl px-3 py-2" required></label>
        <label class="grid gap-1"><span class="text-sm">結束</span><input v-model="form.datetimeEnd" type="datetime-local" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1"><span class="text-sm">城市</span><input v-model="form.city" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1"><span class="text-sm">場地</span><input v-model="form.venue" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1 md:col-span-2"><span class="text-sm">報名連結</span><input v-model="form.registration.url" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1 md:col-span-2"><span class="text-sm">描述</span><textarea v-model="form.description" class="border rounded-2xl px-3 py-2 min-h-[100px]"></textarea></label>
        <div class="md:col-span-2 flex justify-end gap-2 mt-2"><button type="button" class="btn-ghost" @click="formOpen=false">取消</button><button class="btn-primary">儲存</button></div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { http } from '@/utils/http'
import TableWithFilters from '@/components/admin/TableWithFilters.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { formatDateTime } from '@/utils/format'

const table = ref(null)
const columns = [
  { key: 'title', label: '標題' },
  { key: 'datetimeStart', label: '開始' },
  { key: 'datetimeEnd', label: '結束' },
  { key: 'city', label: '城市' },
  { key: 'venue', label: '場地' },
]

const formOpen = ref(false)
const form = ref({ id: null, title: '', datetimeStart: '', datetimeEnd: '', city: '', venue: '', registration: { url: '' }, description: '' })

function openCreate(){ form.value = { id: null, title: '', datetimeStart: '', datetimeEnd: '', city: '', venue: '', registration: { url: '' }, description: '' }; formOpen.value = true }
function edit(row){
  const copy = JSON.parse(JSON.stringify(row))
  form.value = { registration: { url: '' }, ...copy, registration: { url: copy?.registration?.url || '' } }
  formOpen.value = true
}
async function dup(row){
  const copy = JSON.parse(JSON.stringify(row))
  delete copy.id
  copy.title += '（複製）'
  await http.post('/admin/events', copy)
  table.value?.refresh()
}
async function save(){
  const payload = { ...form.value }
  if (payload.datetimeStart && !payload.datetimeStart.endsWith('Z')) payload.datetimeStart = new Date(payload.datetimeStart).toISOString()
  if (payload.datetimeEnd && !payload.datetimeEnd.endsWith('Z')) payload.datetimeEnd = new Date(payload.datetimeEnd).toISOString()
  if (payload.id) await http.patch(`/admin/events/${payload.id}`, payload)
  else await http.post('/admin/events', payload)
  formOpen.value = false
  table.value?.refresh()
}
async function del(row){
  if (!confirm(`確定刪除活動「${row.title}」？`)) return
  await http.delete(`/admin/events/${row.id}`)
  table.value?.refresh()
}
</script>
