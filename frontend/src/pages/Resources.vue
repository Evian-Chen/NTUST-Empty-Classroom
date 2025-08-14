<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">資源中心</h1>
      <RouterLink v-if="canManage" to="/admin/resources" class="btn-ghost">管理資源</RouterLink>
    </div>

    <!-- 官方入口（外部網站） -->
    <div class="card">
      <h3 class="font-semibold mb-2">官方入口（外部網站）</h3>
      <div class="grid md:grid-cols-3 gap-3">
        <a v-for="link in officialLinks" :key="link.href" :href="link.href" target="_blank" class="border rounded-2xl p-3 hover:bg-gray-50">
          <div class="font-medium">{{ link.label }}</div>
          <p class="text-sm text-gray-600">{{ link.desc }}</p>
        </a>
      </div>
    </div>

    <!-- 篩選 + 列表 -->
    <ResourceFilters v-model="filters" :tags="tags" />
    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <ResourceCard v-for="it in items" :key="it.id || it.url" :item="it" @preview="openPreview" />
        <p v-if="!loading && !items.length" class="text-sm text-gray-500">目前沒有符合條件的資源。</p>
      </div>

      <!-- 側邊：聯繫與名錄 -->
      <div class="grid gap-4 h-fit md:sticky md:top-4">
        <ContactList title="Toastmasters 總會幹部" :items="contacts.officers" />
        <ContactList title="救援教練 / 顧問名單" :items="contacts.coaches" />
        <ContactList title="各社團聯絡窗口" :items="contacts.clubContacts" />
      </div>
    </div>

    <DocPreview :open="previewOpen" :title="previewItem?.title" :url="previewUrl" @close="previewOpen=false" />
  </section>
</template>

<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'
import { useResourceStore } from '@/stores/resources'
import ResourceFilters from '@/components/resources/ResourceFilters.vue'
import ResourceCard from '@/components/resources/ResourceCard.vue'
import ContactList from '@/components/resources/ContactList.vue'
import DocPreview from '@/components/resources/DocPreview.vue'

const store = useResourceStore()
const items = computed(() => store.items)
const tags = computed(() => store.meta.tags || [])
const loading = computed(() => store.loading)
const contacts = computed(() => store.contacts)
const filters = reactive({ ...store.filters })
watch(filters, (v) => debounceFetch(v), { deep: true })
let t = null
function debounceFetch(p){ clearTimeout(t); t = setTimeout(() => store.fetch(p), 250) }

onMounted(async () => {
  await Promise.all([store.fetch(), store.fetchContacts()])
  if (!store.items?.length) {
    store.items = defaultOfficialResources
    store.total = store.items.length
  }
})

const canManage = false // 依角色顯示管理入口
const officialLinks = [
  { label: 'Toastmasters International', desc: '官方網站、找資源、活動與政策。', href: 'https://www.toastmasters.org/' },
  { label: 'Pathways Base Camp', desc: 'Pathways 學習平台入口。', href: 'https://www.toastmasters.org/pathways-overview' },
  { label: 'Find a Club', desc: '全球分會查詢與聯絡資訊。', href: 'https://www.toastmasters.org/find-a-club' },
]
const defaultOfficialResources = [
  { title: 'Pathways 入門指南', category: 'guide', source: 'official', url: 'https://www.toastmasters.org/pathways-overview', tags: ['Pathways','入門'], description: '快速理解 Pathways 的運作與進修方式。' },
  { title: 'Find a Club：分會查詢', category: 'guide', source: 'official', url: 'https://www.toastmasters.org/find-a-club', tags: ['分會查詢','官方'], description: '依據地點與時間查找你附近的分會。' },
  { title: 'Club Officer Resources', category: 'guide', source: 'official', url: 'https://www.toastmasters.org/leadership-central/club-officer-tools', tags: ['幹部工具'], description: '官網的幹部工具包與手冊。' },
]

const previewOpen = ref(false)
const previewItem = ref(null)
const previewUrl = computed(() => previewItem.value?.fileUrl || previewItem.value?.url || '')
function openPreview(item){ previewItem.value = item; previewOpen.value = true }
</script>
