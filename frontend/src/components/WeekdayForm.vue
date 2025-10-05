<template>
  <div class="card">
    <div class="row">
      <div style="flex:1 1 200px">
        <label class="small">Weekday</label>
        <select class="select" v-model="weekday">
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
    <p class="small" v-if="resolvedDate">實際日期：<strong>{{ resolvedDate }}</strong></p>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAvailability } from '../api.js'
import { useQuerySync } from '../composables/useQuerySync.js'
import { getLastSat } from '../utils/utils.js'

const emit = defineEmits(['results', 'timeSlotError'])
const state = useQuerySync(reactive({ slotFrom:'', slotTo:'' }))
const weekday = ref(new Date())
const resolvedDate = ref('')

const weekdays = reactive({
  "Mon": new Date(),
  "Tue": new Date(),
  "Wed": new Date(),
  "Thu": new Date(),
  "Fri": new Date()
})

onMounted(()=>{ 
  const lastSaturday = getLastSat();
  
  // 創建這週的工作日日期
  weekdays.Mon = new Date(lastSaturday);
  weekdays.Mon.setDate(lastSaturday.getDate() + 2);
  
  weekdays.Tue = new Date(lastSaturday);
  weekdays.Tue.setDate(lastSaturday.getDate() + 3);
  
  weekdays.Wed = new Date(lastSaturday);
  weekdays.Wed.setDate(lastSaturday.getDate() + 4);
  
  weekdays.Thu = new Date(lastSaturday);
  weekdays.Thu.setDate(lastSaturday.getDate() + 5);
  
  weekdays.Fri = new Date(lastSaturday);
  weekdays.Fri.setDate(lastSaturday.getDate() + 6);
  
  // 設定預設選擇
  weekday.value = weekdays.Mon;
})

async function search(){
  const params = { weekday: weekday.value.toISOString() }
  if(state.slotFrom) params.slotFrom = state.slotFrom
  if(state.slotTo) params.slotTo = state.slotTo
  
  console.log('Weekday search params:', params);
  
  try {
    const data = await getAvailability(params);
    
    // 檢查回應是否包含錯誤訊息（400 錯誤會直接回傳 JSON）
    if (data.message && typeof data.message === 'string') {
      emit('timeSlotError', data.message)
      return
    }
    
    resolvedDate.value = weekday.value.toLocaleDateString() || ''
    emit('results', { type:'weekday', params, data })
  } catch (error) {
    console.warn('Weekday API call failed:', error)
    
    // 使用模擬數據
    const mockRooms = [
      // 有課的教室
      {
        roomKey: 'T4-101',
        buildingCode: 'T4',
        roomNumber: '101',
        professor: '王小明',
        courseName: '計算機概論',
        timeSlotNo: parseInt(params.slotFrom) || 2,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      },
      // 空教室
      {
        roomKey: 'T4-102',
        buildingCode: 'T4',
        roomNumber: '102',
        professor: '',
        courseName: '',
        timeSlotNo: parseInt(params.slotFrom) || 2,
        weekday: 'Mon',
        dateTime: new Date(params.weekday)
      }
    ]
    
    resolvedDate.value = weekday.value.toLocaleDateString() || ''
    emit('results', { type:'weekday', params, data: mockRooms })
  }
}
</script>