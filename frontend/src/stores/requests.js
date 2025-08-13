import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useRequestStore = defineStore('requests', {
  state: () => ({
    mine: [],
    loading: false,
  }),
  actions: {
    async create(payload) {
      const res = await http.post('/requests', payload)
      return res.data
    },
    async listMine() {
      this.loading = true
      try {
        const res = await http.get('/requests/mine')
        this.mine = res.data.items || res.data
      } finally {
        this.loading = false
      }
    },
    async timeline(id) {
      const res = await http.get(`/requests/${id}/timeline`)
      return res.data
    }
  }
})
