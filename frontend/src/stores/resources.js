import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useResourceStore = defineStore('resources', {
  state: () => ({
    items: [],
    total: 0,
    loading: false,
    filters: { category: '', source: '', tag: '', q: '' },
    contacts: { officers: [], coaches: [], clubContacts: [] },
    meta: { categories: ['template','guide','video','case'], sources: ['official','district','club','committee'], tags: [] },
  }),
  actions: {
    async fetch(params = {}){
      this.loading = true
      try {
        const res = await http.get('/resources', { params: { ...this.filters, ...params } })
        const data = res.data
        this.items = data.items || data || []
        this.total = data.total || this.items.length
        if (!this.meta.tags?.length) {
          const tags = new Set()
          this.items.forEach(it => (it.tags || []).forEach(t => tags.add(t)))
          this.meta.tags = Array.from(tags)
        }
      } finally { this.loading = false }
    },
    async fetchContacts(){
      try {
        const res = await http.get('/resources/contacts')
        const d = res.data || {}
        this.contacts = {
          officers: d.officers || [],
          coaches: d.coaches || [],
          clubContacts: d.clubContacts || []
        }
      } catch(e){
        this.contacts = { officers: [], coaches: [], clubContacts: [] }
      }
    }
  }
})
