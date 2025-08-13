import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: [],
    unreadCount: 0,
    settings: { email: true, site: true },
    loading: false,
  }),
  actions: {
    async list(){
      this.loading = true
      try {
        const res = await http.get('/me/notifications')
        const data = res.data || {}
        this.items = data.items || data || []
        this.unreadCount = (this.items || []).filter(x => !x.readAt).length
      } finally {
        this.loading = false
      }
    },
    async markRead(id){
      await http.post(`/me/notifications/${id}/read`)
      await this.list()
    },
    async markAllRead(){
      await http.post('/me/notifications/read-all')
      await this.list()
    },
    async loadSettings(){
      const res = await http.get('/me/notifications/settings')
      this.settings = res.data || { email: true, site: true }
    },
    async updateSettings(patch){
      const res = await http.post('/me/notifications/settings', patch)
      this.settings = res.data || patch
    }
  }
})
