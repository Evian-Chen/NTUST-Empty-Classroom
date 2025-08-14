<template>
  <div>
    <AssistantButton :unread="unread" @click="toggle" />
    <div v-if="isOpen">
      <div class="fixed inset-0 z-[55]" @click="toggle" aria-hidden="true"></div>
      <AssistantPanel @close="toggle" @minimize="toggle" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import AssistantButton from './AssistantButton.vue'
import AssistantPanel from './AssistantPanel.vue'

const store = useAssistantStore()
const isOpen = computed(() => store.isOpen)
const unread = computed(() => store.unread)
function toggle(){ store.toggle() }

onMounted(() => {
  const open = localStorage.getItem('assistant.open')
  if (open === '1') store.open()
})
</script>
