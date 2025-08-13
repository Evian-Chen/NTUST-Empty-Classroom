<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">名錄管理</h1>
      <div class="flex gap-2"><button class="btn-primary" @click="openCreate">新增分會</button></div>
    </div>

    <TableWithFilters ref="table" endpoint="/admin/clubs" :columns="columns">
      <template #toolbar><button class="btn-ghost" @click="openImport">批次匯入</button></template>
      <template #actions="{ row }">
        <button class="btn-ghost" @click="edit(row)">編輯</button>
        <button class="btn-ghost" @click="del(row)">刪除</button>
      </template>
    </TableWithFilters>

    <BaseModal :open="importOpen" title="批次匯入" @close="importOpen=false">
      <BulkImport @import="bulkSave" />
    </BaseModal>

    <BaseModal :open="formOpen" :title="form.id ? '編輯分會' : '新增分會'" @close="formOpen=false">
      <form class="grid md:grid-cols-2 gap-3" @submit.prevent="save">
        <label class="grid gap-1"><span class="text-sm">名稱</span><input v-model="form.name" class="border rounded-2xl px-3 py-2" required></label>
        <label class="grid gap-1"><span class="text-sm">類型</span>
          <select v-model="form.type" class="border rounded-2xl px-3 py-2" required>
            <option value="student">學生</option><option value="community">社區</option><option value="corporate">企業</option>
          </select>
        </label>
        <label class="grid gap-1"><span class="text-sm">地區/Division</span><input v-model="form.area" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1"><span class="text-sm">城市</span><input v-model="form.city" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1 md:col-span-2"><span class="text-sm">聯絡 Email</span><input v-model="form.contact.email" class="border rounded-2xl px-3 py-2"></label>
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
import BulkImport from '@/components/admin/BulkImport.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const table = ref(null)
const columns = [
  { key: 'name', label: '名稱' },
  { key: 'type', label: '類型' },
  { key: 'area', label: '地區' },
  { key: 'city', label: '城市' },
  { key: 'language', label: '語言' },
  { key: 'meetingMode', label: '模式' },
]

const importOpen = ref(false)
function openImport(){ importOpen.value = true }
async function bulkSave(rows){
  await http.post('/admin/clubs/bulk', { items: rows })
  importOpen.value = false
  table.value?.refresh()
}

const formOpen = ref(false)
const form = ref({ id: null, name: '', type: 'student', area: '', city: '', description: '', contact: { email: '' } })
function openCreate(){ form.value = { id: null, name: '', type: 'student', area: '', city: '', description: '', contact: { email: '' } }; formOpen.value = true }
function edit(row){ form.value = JSON.parse(JSON.stringify(row)); formOpen.value = true }
async function save(){
  if (form.value.id) await http.patch(`/admin/clubs/${form.value.id}`, form.value)
  else await http.post('/admin/clubs', form.value)
  formOpen.value = false
  table.value?.refresh()
}
async function del(row){
  if (!confirm(`確定刪除「${row.name}」？`)) return
  await http.delete(`/admin/clubs/${row.id}`)
  table.value?.refresh()
}
</script>
