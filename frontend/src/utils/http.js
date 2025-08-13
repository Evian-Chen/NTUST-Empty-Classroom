import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      const auth = useAuthStore()
      auth.logout()
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
      }
    }
    return Promise.reject(err)
  }
)
