import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useClubStore = defineStore('clubs', {
  state: () => ({
    items: [],
    total: 0,
    filters: { type: '', city: '', language: '', mode: '', q: '' },
    loading: false,
  }),
  actions: {
    async fetchClubs(params = {}) {
      this.loading = true
      try {
        const res = await http.get('/clubs', { params: { ...this.filters, ...params } })
        this.items = res.data.items || res.data
        this.total = res.data.total || this.items.length
      } finally {
        this.loading = false
      }
    },
    getById(id) {
      return this.items.find(c => c.id === id)
    }
  }
})
