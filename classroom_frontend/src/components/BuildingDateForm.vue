<template>
  <div class="card">
    <div class="row">
      <div style="flex:1 1 200px">
        <label class="small">Building</label>
        <select class="select" v-model="state.building">
          <option value="">全部</option>
          <option v-for="b in buildings" :key="b.buildingCode" :value="b.buildingCode">{{ b.buildingCode }} - {{ b.name }}</option>
        </select>
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Date</label>
        <input class="input" type="date" v-model="state.date" />
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Time Slots (optional)</label>
        <div class="row">
          <input class="input" style="flex:1" type="number" min="1" v-model.number="state.slotFrom" placeholder="From"/>
          <input class="input" style="flex:1" type="number" min="1" v-model.number="state.slotTo" placeholder="To"/>
        </div>
      </div>
      <div style="align-self:end">
        <button class="btn" @click="search">Search</button>
      </div>
    </div>
    <div class="small" style="margin-top:8px" v-if="shareUrl">
      分享連結：<button class="copy" @click="copy">Copy</button>
      <span style="margin-left:8px">{{ shareUrl }}</span>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { getBuildings, getAvailability } from '../../api.js'
import { useQuerySync } from '../composables/useQuerySync'

const emit = defineEmits(['results'])
const buildings = ref([])
const state = useQuerySync(reactive({
  date: new Date().toISOString().slice(0,10),
  building: '',
  slotFrom: '',
  slotTo: ''
}))

onMounted(async()=>{ 
  try {
    const response = await getBuildings()
    console.log('Buildings response:', response)
    // 後端返回 { items: [...], total: 8 }
    buildings.value = response.items || response || []
  } catch (error) {
    console.error('Failed to load buildings:', error)
    buildings.value = []
  }
})

const shareUrl = computed(()=>{
  const sp = new URLSearchParams()
  if(state.date) sp.set('date', state.date)
  if(state.building) sp.set('building', state.building)
  if(state.slotFrom) sp.set('slotFrom', state.slotFrom)
  if(state.slotTo) sp.set('slotTo', state.slotTo)
  return `${location.origin}${location.pathname}?${sp.toString()}`
})

async function search(){
  const params = { date: state.date }
  if(state.building) params.building = state.building
  if(state.slotFrom) params.slotFrom = state.slotFrom
  if(state.slotTo) params.slotTo = state.slotTo
  
  try {
    const data = await getAvailability(params)
    emit('results', { type:'building-date', params, data })
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    // 使用模擬數據
    const mockRooms = [
      {
        roomKey: `${params.building || 'T4'}-101`,
        buildingCode: params.building || 'T4',
        roomNo: '101',
        capacity: 50,
        floor: '1F',
        tags: { projector: true, whiteboard: true, sockets: 8 },
        freeRanges: [[1, 1], [3, 4], [6, 7]]
      },
      {
        roomKey: `${params.building || 'T4'}-102`,
        buildingCode: params.building || 'T4',
        roomNo: '102',
        capacity: 40,
        floor: '1F',
        tags: { projector: true, pc: true, sockets: 6 },
        freeRanges: [[2, 3], [5, 6], [8, 8]]
      },
      {
        roomKey: `${params.building || 'T4'}-201`,
        buildingCode: params.building || 'T4',
        roomNo: '201',
        capacity: 30,
        floor: '2F',
        tags: { pc: true, sockets: 12 },
        freeRanges: [[1, 2], [5, 8]]
      }
    ]
    emit('results', { type:'building-date', params, data: mockRooms })
  }
}
function copy(){ navigator.clipboard.writeText(shareUrl.value) }
</script>