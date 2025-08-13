import { defineStore } from 'pinia'
export const useUiStore = defineStore('ui', {
  state: () => ({ loading: false, toast: null }),
  actions: {
    showToast(message, type='info') { this.toast = { message, type, id: Date.now() } },
    hideToast() { this.toast = null }
  }
})
