import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useRegistrationStore = defineStore('registrations', {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async list(){
      this.loading = true
      try {
        const res = await http.get('/me/registrations')
        this.items = res.data.items || res.data || []
      } finally {
        this.loading = false
      }
    },
    async cancel(id){
      await http.post(`/me/registrations/${id}/cancel`)
      await this.list()
    }
  }
})
