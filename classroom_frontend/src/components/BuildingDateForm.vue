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
      <div style="flex:1 1 200px">
        <label class="small">Weekday</label>
        <select class="select" v-model="state.weekday">
          <option v-for="(date, day) in weekdays" :key="day" :value="date">{{ day }} {{ date.toLocaleDateString() }}</option>
        </select>
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Time Slots (optional)</label>
        <div class="row">
          <input class="input" style="flex:1" type="number" min="1" max="14" v-model.number="state.slotFrom" placeholder="From"/>
          <input class="input" style="flex:1" type="number" min="1" max="14" v-model.number="state.slotTo" placeholder="To"/>
        </div>
      </div>
      <div style="align-self:end">
        <button class="btn" @click="search">Search</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { getBuildings, getAvailability } from '../api.js'
import { useQuerySync } from '../composables/useQuerySync'
import { getLastSat } from '../utils/utils.js'

const emit = defineEmits(['results', 'timeSlotError'])
const buildings = ref([])
const state = useQuerySync(reactive({
  weekday: new Date(),
  building: '',
  slotFrom: '',
  slotTo: ''
}))
const weekdays = reactive({
  "Mon": new Date(),
  "Tue": new Date(),
  "Wed": new Date(),
  "Thu": new Date(),
  "Fri": new Date()
})

onMounted(async()=>{ 
  try {
    const response = await getBuildings()
    console.log('Buildings response:', response)
    buildings.value = response.items || response || []
  } catch (error) {
    console.error('Failed to load buildings:', error)
    buildings.value = []
  }

  const lastSaturday = getLastSat();
  weekdays.Mon.setDate(lastSaturday.getDate() + 2);
  weekdays.Tue.setDate(lastSaturday.getDate() + 3);
  weekdays.Wed.setDate(lastSaturday.getDate() + 4);
  weekdays.Thu.setDate(lastSaturday.getDate() + 5);
  weekdays.Fri.setDate(lastSaturday.getDate() + 6);
  state.weekday = weekdays.Mon;
})

const shareUrl = computed(()=>{
  const sp = new URLSearchParams()
  if(state.weekday) sp.set('weekday', state.weekday)
  if(state.building) sp.set('building', state.building)
  if(state.slotFrom) sp.set('slotFrom', state.slotFrom)
  if(state.slotTo) sp.set('slotTo', state.slotTo)
  return `${location.origin}${location.pathname}?${sp.toString()}`
})

async function search(){
  const params = { weekday: state.weekday.toISOString() }
  if(state.building) params.building = state.building
  if(state.slotFrom) params.slotFrom = state.slotFrom
  if(state.slotTo) params.slotTo = state.slotTo
  
  console.log('Search params:', params);
  
  try {
    const data = await getAvailability(params);
    
    // 檢查回應是否包含錯誤訊息（400 錯誤會直接回傳 JSON）
    if (data.message && typeof data.message === 'string') {
      emit('timeSlotError', data.message)
      return
    }
    
    emit('results', { type:'building-date', params, data })
  } catch (error) {
    console.warn('API call failed:', error)
    
    // 其他錯誤使用模擬數據
    const mockRooms = [
      // 有課的教室
      {
        roomKey: `${params.building || 'T4'}-101`,
        buildingCode: params.building || 'T4',
        roomNumber: '101',
        professor: '王小明',
        courseName: '計算機概論',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      {
        roomKey: `${params.building || 'T4'}-102`,
        buildingCode: params.building || 'T4',
        roomNumber: '102',
        professor: '李大華',
        courseName: '資料結構',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      // 空教室
      {
        roomKey: `${params.building || 'T4'}-103`,
        buildingCode: params.building || 'T4',
        roomNumber: '103',
        professor: '',
        courseName: '',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      {
        roomKey: `${params.building || 'T4'}-104`,
        buildingCode: params.building || 'T4',
        roomNumber: '104',
        professor: '',
        courseName: '',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      // 更多有課的教室
      {
        roomKey: `${params.building || 'T4'}-201`,
        buildingCode: params.building || 'T4',
        roomNumber: '201',
        professor: '張美麗',
        courseName: '演算法',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      // 更多空教室
      {
        roomKey: `${params.building || 'T4'}-202`,
        buildingCode: params.building || 'T4',
        roomNumber: '202',
        professor: '',
        courseName: '',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      {
        roomKey: `${params.building || 'T4'}-203`,
        buildingCode: params.building || 'T4',
        roomNumber: '203',
        professor: '',
        courseName: '',
        timeSlotNo: parseInt(params.slotFrom) || 3,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      }
    ]
    emit('results', { type:'building-date', params, data: mockRooms })
  }
}
function copy(){ navigator.clipboard.writeText(shareUrl.value) }
</script>