import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useEventStore = defineStore('events', {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async fetchEvents(params = {}) {
      this.loading = true
      try {
        const res = await http.get('/events', { params })
        this.items = res.data.items || res.data
      } finally {
        this.loading = false
      }
    }
  }
})
