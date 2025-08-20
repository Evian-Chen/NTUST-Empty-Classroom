<template>
  <div>
    <AssistantButton :unread="unread" @click="toggle" />
    <AssistantHint :open="showHint" @close="dismissHint" @try="openAndSeed" />

    <div v-if="isOpen">
      <div class="fixed inset-0 z-[55]" @click="toggle" aria-hidden="true"></div>
      <AssistantPanel @close="toggle" @minimize="toggle" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAssistantStore } from '@/stores/assistant'
import AssistantButton from './AssistantButton.vue'
import AssistantPanel from './AssistantPanel.vue'
import AssistantHint from './AssistantHint.vue'

const store = useAssistantStore()
const isOpen = computed(() => store.isOpen)
const unread = computed(() => store.unread)

// --- Coachmark (一次性) ---
const route = useRoute()
const hintKey = 'assistant.hint.seen'
const showHint = computed(() => store._hintOpen)
store._hintOpen = false // 在 store 上掛個臨時 flag（JS 版 Pinia允許）
function dismissHint(){ store._hintOpen = false; localStorage.setItem(hintKey, '1') }
function openAndSeed(){
  dismissHint()
  if (!isOpen.value) store.open()
  // 回一則指引訊息
  store.addBot('你可以直接跟我說：找 台北 晚上 雙語 的分會。')
}
function maybeShowHint(){
  if (localStorage.getItem(hintKey) === '1' || isOpen.value) return
  const important = ['/help','/directory','/events','/resources']
  const onKeyPage = important.includes(route.path)
  setTimeout(() => { store._hintOpen = true }, onKeyPage ? 1200 : 6000) // 重要頁快顯，其他頁 6s 後
}
onMounted(maybeShowHint)
watch(() => route.path, () => { if (!isOpen.value) maybeShowHint() })

function toggle(){ store.toggle() }
</script>
