<template>
  <article class="card grid gap-2">
    <h3 class="font-semibold text-lg">{{ title }}</h3>
    <p class="text-sm text-gray-600">{{ desc }}</p>
    <div class="flex gap-2 pt-2">
      <RouterLink v-if="to" :to="to" class="btn-ghost">前往</RouterLink>
      <a v-if="href" :href="href" target="_blank" class="btn-ghost">開啟連結</a>
      <button v-if="cta" class="btn-primary" @click="$emit('action')">{{ cta }}</button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: String,
  desc: String,
  to: String,
  href: String,
  cta: String,
})
defineEmits(['action'])
</script>
