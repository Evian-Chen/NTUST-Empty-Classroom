<template>
  <div class="card">
    <header class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">{{ title }}</h3>
      <slot name="toolbar" />
    </header>
    <div class="grid md:grid-cols-2 gap-3">
      <article v-for="p in items" :key="p.id || p.email" class="border rounded-2xl p-3">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-medium">{{ p.name }}</div>
            <div class="text-xs text-gray-500">{{ p.role || p.title }}</div>
            <div v-if="p.clubName" class="text-xs text-gray-500">所屬：{{ p.clubName }}</div>
          </div>
          <a v-if="p.email" :href="`mailto:${p.email}`" class="btn-ghost">Email</a>
        </div>
        <p v-if="p.note" class="text-sm text-gray-700 mt-1">{{ p.note }}</p>
      </article>
      <p v-if="!items?.length" class="text-sm text-gray-500">尚無資料。</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, items: { type: Array, default: () => [] } })
</script>
