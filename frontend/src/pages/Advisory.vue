<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">顧問 & 媒合</h1>
      <button class="btn-primary" @click="openRequest()">我要求助</button>
    </div>

    <AdvisorFilters v-model="filters" />

    <div class="grid md:grid-cols-2 gap-4">
      <AdvisorCard
        v-for="a in advisors"
        :key="a.id"
        :advisor="a"
        @request="openRequest($event)"
      />
      <p v-if="!loading && advisors.length===0" class="text-sm text-gray-500">目前沒有符合條件的顧問。</p>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="modalOpen=false">
      <HelpRequestForm
        :preset="preset"
        @submitted="onSubmitted"
        @cancel="modalOpen=false"
      />
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useAdvisorStore } from '@/stores/advisors'
import AdvisorFilters from '@/components/advisory/AdvisorFilters.vue'
import AdvisorCard from '@/components/advisory/AdvisorCard.vue'
import HelpRequestForm from '@/components/advisory/HelpRequestForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const store = useAdvisorStore()
const loading = computed(() => store.loading)
const advisors = computed(() => store.items)

const filters = reactive({ expertise: [], weekday: '', timeSlot: '', q: '' })

watch(filters, (v) => debounceFetch(v), { deep: true })

let timer = null
function debounceFetch(params){
  clearTimeout(timer)
  timer = setTimeout(() => store.fetchAdvisors(params), 300)
}

onMounted(async () => {
  await store.fetchAdvisors({})
})

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('建立求助單')
const preset = reactive({ topic: 'mentoring', assignedAdvisorIds: [], selectedAdvisor: null })

function openRequest(advisor){
  if (advisor) {
    preset.topic = 'mentoring'
    preset.assignedAdvisorIds = [advisor.id]
    preset.selectedAdvisor = advisor
    modalTitle.value = `向「${advisor.name}」發起媒合`
  } else {
    preset.topic = 'mentoring'
    preset.assignedAdvisorIds = []
    preset.selectedAdvisor = null
    modalTitle.value = '建立求助單'
  }
  modalOpen.value = true
}

function onSubmitted(id){
  modalOpen.value = false
  alert('已送出！案件編號：' + (id ?? 'N/A'))
}
</script>
