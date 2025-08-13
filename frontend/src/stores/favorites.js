import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    clubs: [],
    events: [],
    loading: false,
  }),
  actions: {
    async list(type){
      this.loading = true
      try {
        const res = await http.get('/me/favorites', { params: { type }})
        if (type === 'club') this.clubs = res.data.items || res.data || []
        if (type === 'event') this.events = res.data.items || res.data || []
      } finally {
        this.loading = false
      }
    },
    async toggle(type, targetId){
      const existed = (type === 'club' ? this.clubs : this.events).some(x => String(x.id) === String(targetId))
      if (existed){
        await http.delete(`/me/favorites/${type}/${targetId}`)
      } else {
        await http.post('/me/favorites', { type, targetId })
      }
      await this.list(type)
    },
    async remove(type, targetId){
      await http.delete(`/me/favorites/${type}/${targetId}`)
      await this.list(type)
    }
  }
})
