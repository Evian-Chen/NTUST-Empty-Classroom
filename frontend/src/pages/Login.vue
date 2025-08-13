<template>
  <section class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">登入</h1>
    <form class="card grid gap-3" @submit.prevent="onSubmit">
      <label class="grid gap-1">
        <span>Email</span>
        <input v-model="form.email" type="email" class="border rounded-2xl px-3 py-2" required>
      </label>
      <label class="grid gap-1">
        <span>Password</span>
        <input v-model="form.password" type="password" class="border rounded-2xl px-3 py-2" required>
      </label>
      <button class="btn-primary" :disabled="loading">{{ loading ? '處理中…' : '登入' }}</button>
    </form>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const onSubmit = async () => {
  loading.value = true
  try {
    await auth.login(form)
    const redirect = route.query.redirect || '/'
    router.replace(String(redirect))
  } finally {
    loading.value = false
  }
}
</script>
