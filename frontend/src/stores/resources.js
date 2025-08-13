import { defineStore } from 'pinia'
export const useResourceStore = defineStore('resources', {
  state: () => ({ items: [] }),
})
