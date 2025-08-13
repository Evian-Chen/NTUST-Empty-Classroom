<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-[92vw] max-w-2xl p-4 md:p-6">
      <header class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button class="btn-ghost" @click="$emit('close')">關閉</button>
      </header>
      <div><slot /></div>
    </div>
  </div>
</template>

<script setup>
defineProps({ open: Boolean, title: String })
defineEmits(['close'])
</script>
