<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">資源管理</h1>
      <div class="flex gap-2">
        <label class="btn-ghost cursor-pointer">
          <input type="file" class="hidden" @change="uploadFile">
          上傳檔案
        </label>
      </div>
    </div>

    <TableWithFilters ref="table" endpoint="/admin/resources" :columns="columns">
      <template #actions="{ row }">
        <button class="btn-ghost" @click="edit(row)">編輯</button>
        <button class="btn-ghost" @click="del(row)">刪除</button>
      </template>
    </TableWithFilters>

    <BaseModal :open="formOpen" :title="form.id ? '編輯資源' : '新增資源'" @close="formOpen=false">
      <form class="grid gap-3" @submit.prevent="save">
        <label class="grid gap-1"><span class="text-sm">標題</span><input v-model="form.title" class="border rounded-2xl px-3 py-2" required></label>
        <label class="grid gap-1"><span class="text-sm">類別</span><input v-model="form.category" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1"><span class="text-sm">外部連結（或上傳檔案 URL）</span><input v-model="form.url" class="border rounded-2xl px-3 py-2"></label>
        <label class="grid gap-1"><span class="text-sm">描述</span><textarea v-model="form.description" class="border rounded-2xl px-3 py-2 min-h-[100px]"></textarea></label>
        <div class="flex justify-end gap-2 mt-2"><button type="button" class="btn-ghost" @click="formOpen=false">取消</button><button class="btn-primary">儲存</button></div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { http } from '@/utils/http'
import TableWithFilters from '@/components/admin/TableWithFilters.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const table = ref(null)
const columns = [
  { key: 'title', label: '標題' },
  { key: 'category', label: '類別' },
  { key: 'url', label: '連結' },
]

const formOpen = ref(false)
const form = ref({ id: null, title: '', category: '', url: '', description: '' })

function edit(row){ form.value = JSON.parse(JSON.stringify(row)); formOpen.value = true }
function openCreate(){ form.value = { id: null, title: '', category: '', url: '', description: '' }; formOpen.value = true }
async function save(){
  if (form.value.id) await http.patch(`/admin/resources/${form.value.id}`, form.value)
  else await http.post('/admin/resources', form.value)
  formOpen.value = false
  table.value?.refresh()
}
async function del(row){
  if (!confirm(`確定刪除資源「${row.title}」？`)) return
  await http.delete(`/admin/resources/${row.id}`)
  table.value?.refresh()
}

async function uploadFile(e){
  const file = e.target.files?.[0]
  if (!file) return
  const body = new FormData()
  body.append('file', file)
  const res = await http.post('/uploads', body, { headers: { 'Content-Type': 'multipart/form-data' } })
  form.value = { id: null, title: file.name, url: res.data.url, category: '', description: '' }
  formOpen.value = true
}
</script>
