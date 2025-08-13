<template>
  <form class="card grid gap-3" @submit.prevent="submit">
    <h3 class="font-semibold text-lg">建立求助單</h3>
    <label class="grid gap-1">
      <span>主題</span>
      <select v-model="form.topic" class="border rounded-2xl px-3 py-2" required>
        <option value="manpower">人手不足</option>
        <option value="operation">營運流程</option>
        <option value="pr">PR/社群</option>
        <option value="recruiting">招募</option>
        <option value="mentoring">Mentoring</option>
        <option value="event">活動</option>
        <option value="others">其他</option>
      </select>
    </label>
    <label class="grid gap-1">
      <span>詳細說明</span>
      <textarea v-model="form.details" class="border rounded-2xl px-3 py-2 min-h-[120px]" required />
    </label>
    <button class="btn-primary">送出</button>
  </form>
</template>
<script setup>
import { reactive } from 'vue'
import { useRequestStore } from '@/stores/requests'

const form = reactive({
  topic: 'manpower',
  details: '',
})
const store = useRequestStore()

async function submit() {
  const res = await store.create(form)
  alert('已送出，案件編號：' + (res?.id || 'N/A'))
}
</script>
