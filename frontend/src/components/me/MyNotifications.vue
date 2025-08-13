<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">通知</h3>
      <div class="flex gap-2">
        <button class="btn-ghost" @click="markAllRead" :disabled="!unreadCount">全部標示已讀</button>
        <button class="btn-ghost" @click="reload">重新整理</button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-3">
      <article v-for="n in items" :key="n.id" class="card border-l-4" :class="n.readAt ? 'border-gray-200' : 'border-tmblue'">
        <header class="flex items-start justify-between gap-3">
          <div>
            <h4 class="font-semibold">{{ n.title }}</h4>
            <p class="text-xs text-gray-500">{{ formatDateTime(n.createdAt) }}</p>
          </div>
          <span v-if="!n.readAt" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">新</span>
        </header>
        <p class="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{{ n.message }}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <RouterLink v-for="link in n.links || []" :key="link.to || link.href" :to="link.to" v-if="link.to" class="underline text-tmblue text-sm">{{ link.label || '查看' }}</RouterLink>
          <a v-for="link in n.links || []" :key="link.href" :href="link.href" v-if="link.href" class="underline text-tmblue text-sm" target="_blank">{{ link.label || '開啟' }}</a>
        </div>
        <div class="flex justify-end mt-2">
          <button v-if="!n.readAt" class="btn-ghost" @click="markRead(n.id)">標示已讀</button>
        </div>
      </article>
      <p v-if="!loading && !items.length" class="text-sm text-gray-500">目前沒有通知。</p>
    </div>

    <div class="card">
      <h4 class="font-semibold mb-2">通知設定</h4>
      <div class="flex items-center gap-3">
        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="settings.email" @change="saveSettings"> Email 通知
        </label>
        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="settings.site" @change="saveSettings"> 站內通知
        </label>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { formatDateTime } from '@/utils/format'

const store = useNotificationStore()
const items = computed(() => store.items)
const unreadCount = computed(() => store.unreadCount)
const settings = computed({
  get: () => store.settings,
  set: (v) => store.updateSettings(v)
})
const loading = computed(() => store.loading)

async function reload(){ await store.list() }
async function markRead(id){ await store.markRead(id) }
async function markAllRead(){ await store.markAllRead() }
async function saveSettings(){ await store.updateSettings(settings.value) }

onMounted(async () => { await store.list(); await store.loadSettings() })
</script>
