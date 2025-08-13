<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">個人中心</h1>
        <p class="text-sm text-gray-600">管理你的收藏、報名、求助單與通知。</p>
      </div>
      <RouterLink to="/advisory" class="btn-ghost">我要幫忙</RouterLink>
    </header>

    <nav class="tabs">
      <button class="tab" :class="{ 'tab-active': tab==='favorites' }" @click="tab='favorites'">收藏</button>
      <button class="tab" :class="{ 'tab-active': tab==='registrations' }" @click="tab='registrations'">報名</button>
      <button class="tab" :class="{ 'tab-active': tab==='requests' }" @click="tab='requests'">求助單</button>
      <button class="tab" :class="{ 'tab-active': tab==='notifications' }" @click="tab='notifications'">通知</button>
    </nav>

    <MyFavorites v-if="tab==='favorites'" />
    <MyRegistrations v-else-if="tab==='registrations'" />
    <MyRequests v-else-if="tab==='requests'" />
    <MyNotifications v-else />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MyFavorites from '@/components/me/MyFavorites.vue'
import MyRegistrations from '@/components/me/MyRegistrations.vue'
import MyRequests from '@/components/me/MyRequests.vue'
import MyNotifications from '@/components/me/MyNotifications.vue'

const tab = ref('favorites')
</script>
