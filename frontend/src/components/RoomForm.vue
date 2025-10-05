<template>
  <div class="card">
    <div class="row">
      <div style="flex:2 1 260px">
        <label class="small">Room (e.g. TR-312)</label>
        <input class="input" v-model="roomKey" placeholder="TR-312" />
      </div>
      <div style="flex:1 1 200px">
        <label class="small">Weekday</label>
        <select class="select" v-model="weekday">
          <option v-for="(date, day) in weekdays" :key="day" :value="date">{{ day }} {{ date.toLocaleDateString() }}</option>
        </select>
      </div>
      <div style="align-self:end">
        <button class="btn" :disabled="!roomKey" @click="search">Search</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getRoomDetail } from '../api.js'
import { getLastSat } from '../utils/utils.js'

const emit = defineEmits(['results', 'timeSlotError'])
const roomKey = ref('')
const weekday = ref(new Date())
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
  console.log('Search started for roomKey:', roomKey.value)
  
  // 清理之前的錯誤狀態
  emit('timeSlotError', false)
  
  try {
    const data = await getRoomDetail(roomKey.value, weekday.value.toISOString() || undefined)
    console.log('API response:', data)
    
    // 檢查是否有錯誤信息
    if (data.message) {
      console.log('Error message received:', data.message)
      // 發送錯誤信息
      emit('timeSlotError', data.message)
      return
    }
    
    console.log('Success, emitting results')
    emit('results', { type:'room', params:{ roomKey: roomKey.value, weekday: weekday.value.toISOString() }, data })
  } catch (error) {
    console.log('Caught error:', error)
    emit('timeSlotError', error.message)
  }
}
</script>