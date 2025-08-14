<template>
  <div class="flex gap-2 items-start" :class="role==='bot' ? '' : 'flex-row-reverse'">
    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white"
         :class="role==='bot' ? 'bg-tmblue' : 'bg-gray-400'">
      <span v-if="role==='bot'">🤖</span>
      <span v-else>🙂</span>
    </div>
    <div class="max-w-[70%] rounded-2xl px-3 py-2 whitespace-pre-wrap"
         :class="role==='bot' ? 'bg-white border' : 'bg-tmblue text-white'">
      <div v-if="title" class="text-xs font-semibold mb-1 opacity-70">{{ title }}</div>
      <div class="text-sm">{{ text }}</div>
      <div v-if="actions?.length" class="flex flex-wrap gap-2 mt-2">
        <button v-for="a in actions" :key="a.label" class="text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
                @click="$emit('action', a)">
          {{ a.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  role: { type: String, required: true },
  text: { type: String, required: true },
  title: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
})
defineEmits(['action'])
</script>
