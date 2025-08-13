import { defineStore } from 'pinia'
import { http } from '@/utils/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    roles: (s) => s.user?.roles || [],
  },
  actions: {
    hasAnyRole(required = []) {
      if (required.length === 0) return true
      return required.some(r => this.roles.includes(r))
    },
    async login(payload) {
      const res = await http.post('/auth/login', payload)
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    async me() {
      if (!this.token) return
      const res = await http.get('/auth/me')
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(this.user))
    }
  }
})
