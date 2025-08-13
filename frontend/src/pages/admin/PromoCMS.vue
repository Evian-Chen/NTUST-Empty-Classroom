<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">審核中心</h1>
      <div class="text-sm text-gray-500">處理外部分會投稿、顧問資格等</div>
    </div>
    <ModerationQueue :items="items" @approve="approve" @reject="reject" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'
import ModerationQueue from '@/components/admin/ModerationQueue.vue'

const items = ref([])

async function load(){
  const res = await http.get('/admin/moderation')
  items.value = res.data.items || res.data
}
async function approve(it){
  await http.post(`/admin/moderation/${it.id}/approve`)
  await load()
}
async function reject(it){
  await http.post(`/admin/moderation/${it.id}/reject`)
  await load()
}

onMounted(load)
</script>
