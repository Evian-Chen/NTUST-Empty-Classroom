<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">分會名錄</h1>
      <div class="text-sm text-gray-500" v-if="total">共 {{ total }} 筆</div>
    </div>

    <ClubFilters v-model="filters" />

    <div class="grid md:grid-cols-2 gap-4">
      <!-- List column -->
      <div class="space-y-3">
        <ClubCard
          v-for="c in clubs"
          :key="c.id"
          :ref="el => setCardRef(c.id, el)"
          :club="c"
          :selected="String(selectedId) === String(c.id)"
          @select="selectClub"
        />
        <p v-if="!loading && clubs.length===0" class="text-sm text-gray-500">目前查無資料，調整篩選條件試試。</p>
      </div>

      <!-- Map column -->
      <div class="md:sticky md:top-4 h-fit">
        <ClubMap ref="mapRef" :clubs="clubs" :selected-id="selectedId" @select="selectClub" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed, nextTick } from 'vue'
import { useClubStore } from '@/stores/clubs'
import ClubFilters from '@/components/clubs/ClubFilters.vue'
import ClubCard from '@/components/clubs/ClubCard.vue'
import ClubMap from '@/components/clubs/ClubMap.vue'

const store = useClubStore()
const loading = computed(() => store.loading)
const clubs = computed(() => store.items)
const total = computed(() => store.total)

// two-way bind to store.filters with a local proxy
const filters = reactive({ ...store.filters })
watch(filters, (v) => debounceFetch(v), { deep: true })

let fetchTimer = null
async function debounceFetch(params){
  clearTimeout(fetchTimer)
  fetchTimer = setTimeout(async () => {
    await store.fetchClubs(params)
    // After fetching, fit bounds
    await nextTick()
    mapRef.value?.fitToMarkers?.()
  }, 300)
}

onMounted(async () => {
  if (!store.items.length) {
    await store.fetchClubs(filters)
  }
})

const selectedId = ref(null)
const mapRef = ref(null)

function selectClub(c){
  selectedId.value = c?.id ?? null
  const el = cardRefs.get(String(selectedId.value))
  if (el && typeof el.$el?.scrollIntoView === 'function'){
    el.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Manage card element refs by id to scroll into view
const cardRefs = new Map()
function setCardRef(id, el){ if (el) cardRefs.set(String(id), el) }
</script>
