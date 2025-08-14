import { defineStore } from 'pinia'
import { http } from '@/utils/http'

function now(){ return new Date().toISOString() }
let idseq = 0
function mid(){ return 'm'+(++idseq) }

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    isOpen: false,
    unread: 0,
    mode: 'local', // 'local' | 'api' (call /assistant/chat)
    messages: [
      { id: mid(), role: 'bot', ts: now(), text: '嗨～我是小精靈。告訴我你想做什麼，我會帶你去正確的地方！', actions: [
        { label: '我要幫忙（求助）', intent: 'help' },
        { label: '找分會', intent: 'directory' },
        { label: '找活動', intent: 'events' },
        { label: '資源中心', intent: 'resources' },
      ]},
    ],
  }),
  actions: {
    open(){ this.isOpen = true; this.unread = 0; localStorage.setItem('assistant.open','1') },
    close(){ this.isOpen = false; localStorage.setItem('assistant.open','0') },
    toggle(){ this.isOpen ? this.close() : this.open() },
    addBot(text, actions=[]) { this.messages.push({ id: mid(), role:'bot', ts: now(), text, actions }) },
    addUser(text) { this.messages.push({ id: mid(), role:'user', ts: now(), text }) },
    setMode(mode){ this.mode = mode },
    async ask({ text, context }){
      this.addUser(text)
      try {
        if (this.mode === 'api'){
          const res = await http.post('/assistant/chat', { text, context })
          const data = res.data || {}
          this.addBot(data.text || '已收到你的訊息！', data.actions || [])
        } else {
          // local rule-based
          const { respondLocal } = await import('@/utils/assistant-nlu')
          const reply = respondLocal(text, context)
          this.addBot(reply.text, reply.actions)
        }
      } catch (e){
        console.error(e)
        this.addBot('抱歉，我剛剛連線失敗了。要不要再試一次？', [
          { label: '找分會', intent: 'directory' },
          { label: '找活動', intent: 'events' },
          { label: '我要幫忙', intent: 'help' },
        ])
      }
    }
  }
})
