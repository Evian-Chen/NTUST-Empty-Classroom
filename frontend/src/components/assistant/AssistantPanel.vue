<template>
  <div class="fixed bottom-24 right-4 md:bottom-24 md:right-6 z-[60] w-[92vw] max-w-md">
    <div class="rounded-2xl shadow-2xl border bg-white overflow-hidden">
      <header class="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-[#004165] to-[#2563eb] text-white">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
          <div class="font-semibold">AI 小精靈</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-white/80 text-sm underline" @click="$emit('minimize')">最小化</button>
          <button class="text-white/80" aria-label="關閉" @click="$emit('close')">✕</button>
        </div>
      </header>

      <div ref="scrollRef" class="max-h-[60vh] overflow-auto p-3 space-y-3 bg-gray-50">
        <MessageBubble v-for="m in messages" :key="m.id" :role="m.role" :text="m.text" :actions="m.actions" @action="onAction" />
      </div>

      <form class="p-3 border-t bg-white" @submit.prevent="send">
        <div class="flex items-end gap-2">
          <textarea v-model="input" rows="1" placeholder="請輸入你的問題：如「找 台北 晚上 雙語 的分會」"
                    class="flex-1 border rounded-2xl px-3 py-2 resize-none" @keydown.enter.exact.prevent="send"></textarea>
          <button class="btn-primary whitespace-nowrap">送出</button>
        </div>
        <div class="mt-1 text-[11px] text-gray-500">提示：你可以直接說「我要幫忙」、「Pathways 在哪」、「活動日曆」。</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { useRouter, useRoute } from 'vue-router'
import { navigateForIntent, respondLocal } from '@/utils/assistant-nlu'
import MessageBubble from './MessageBubble.vue'

const store = useAssistantStore()
const router = useRouter()
const route = useRoute()

const messages = computed(() => store.messages)
const input = ref('')
const scrollRef = ref(null)

function scrollToBottom(){
  nextTick(() => {
    const el = scrollRef.value
    if (!el) return
    el.scrollTop = el.scrollHeight
  })
}
watch(messages, scrollToBottom, { deep: true })

async function send(){
  const text = (input.value || '').trim()
  if (!text) return
  input.value = ''
  await store.ask({ text, context: { path: route.fullPath } })
}

function onAction(a){
  if (a.intent) {
    navigateForIntent(router, a.intent, a.params || {})
    // 也回覆一句話增強感
    const text = {
      directory: '好的，我帶你去分會名錄。',
      events: '收到～開啟活動頁。',
      help: '馬上帶你到「我們能幫什麼」。',
      advisory: '前往顧問與媒合頁面。',
      resources: '為你開啟資源中心。',
      me: '開啟個人中心。'
    }[a.intent] || '好的，這就帶你去。'
    store.addBot(text)
  }
}

onMounted(scrollToBottom)
</script>
