import { defineStore } from 'pinia'
export const useNotificationStore = defineStore('notifications', {
  state: () => ({ items: [] }),
})
