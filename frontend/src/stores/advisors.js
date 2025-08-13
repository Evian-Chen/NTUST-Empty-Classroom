import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useAdvisorStore = defineStore('advisors', {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async fetchAdvisors(params = {}) {
      this.loading = true
      try {
        const res = await http.get('/advisors', { params })
        this.items = res.data.items || res.data
      } finally {
        this.loading = false
      }
    }
  }
})
