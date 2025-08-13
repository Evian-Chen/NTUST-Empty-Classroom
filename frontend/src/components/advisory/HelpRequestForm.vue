<template>
  <form class="grid gap-3" @submit.prevent="submit">
    <div class="grid md:grid-cols-2 gap-3">
      <label class="grid gap-1">
        <span class="text-sm">您的姓名</span>
        <input v-model="form.requesterName" class="border rounded-2xl px-3 py-2" required />
      </label>
      <label class="grid gap-1">
        <span class="text-sm">您的職務</span>
        <input v-model="form.requesterRole" class="border rounded-2xl px-3 py-2" placeholder="例：會長、副會長教育" />
      </label>
      <label class="grid gap-1">
        <span class="text-sm">聯絡 Email</span>
        <input v-model="form.contactEmail" type="email" class="border rounded-2xl px-3 py-2" required />
      </label>
      <label class="grid gap-1">
        <span class="text-sm">所在城市</span>
        <input v-model="form.city" class="border rounded-2xl px-3 py-2" placeholder="例：台北市" />
      </label>
    </div>

    <div class="grid md:grid-cols-3 gap-3">
      <label class="grid gap-1 md:col-span-1">
        <span class="text-sm">主題</span>
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
      <label class="grid gap-1 md:col-span-1">
        <span class="text-sm">偏好的協助模式</span>
        <select v-model="form.preferredMode" class="border rounded-2xl px-3 py-2">
          <option value="">不限</option>
          <option value="online">線上</option>
          <option value="offline">實體</option>
          <option value="hybrid">混合</option>
        </select>
      </label>
      <div class="md:col-span-1" v-if="selectedAdvisor">
        <span class="text-sm text-gray-500">指定顧問</span>
        <div class="text-sm rounded-2xl border px-3 py-2 mt-1">
          {{ selectedAdvisor.name }}
          <button class="text-xs underline ml-2" type="button" @click="clearAdvisor">移除</button>
        </div>
      </div>
    </div>

    <label class="grid gap-1">
      <span class="text-sm">詳細說明</span>
      <textarea v-model="form.details" class="border rounded-2xl px-3 py-2 min-h-[140px]" required />
    </label>

    <div class="flex gap-2 justify-end">
      <button type="button" class="btn-ghost" @click="$emit('cancel')">取消</button>
      <button class="btn-primary" :disabled="loading">{{ loading ? '送出中…' : '送出' }}</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRequestStore } from '@/stores/requests'

const props = defineProps({
  preset: { type: Object, default: () => ({}) }, // { topic, assignedAdvisorIds, selectedAdvisor }
})
const emit = defineEmits(['submitted','cancel'])

const store = useRequestStore()
const loading = ref(false)

const form = reactive({
  requesterName: '',
  requesterRole: '',
  contactEmail: '',
  topic: props.preset.topic || 'mentoring',
  details: '',
  preferredMode: '',
  city: '',
  assignedAdvisorIds: props.preset.assignedAdvisorIds || [],
})

const selectedAdvisor = computed(() => props.preset.selectedAdvisor || null)
function clearAdvisor(){
  form.assignedAdvisorIds = []
}

async function submit(){
  loading.value = true
  try {
    const payload = { ...form }
    const res = await store.create(payload)
    emit('submitted', res?.id || null)
  } finally {
    loading.value = false
  }
}
</script>
