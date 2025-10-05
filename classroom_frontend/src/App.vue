<template>
  <div class="container">
    <div class="header">
      <h1 style="margin:0">空教室查詢</h1>
      <!-- <FloatingLike/> -->
    </div>

    <SearchTabs v-model="tab" @update:modelValue="onTabChange"/>

    <component 
      :is="activeForm" 
      :key="tab"
      @results="onResults" 
      @holiday="onHoliday" 
      @timeSlotError="onTimeSlotError"
    />

    <div style="height:12px"></div>
    <ResultsList :items="results" :holiday="holiday" :timeSlotError="timeSlotError" :error="error"/>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import SearchTabs from './components/SearchTabs.vue'
import BuildingDateForm from './components/BuildingDateForm.vue'
import DateForm from './components/DateForm.vue'
import WeekdayForm from './components/WeekdayForm.vue'
import RoomForm from './components/RoomForm.vue'
import ResultsList from './components/ResultList.vue'

const tab = ref('building')
const results = ref([])
const holiday = ref(null)
const timeSlotError = ref(false)
const error = ref('')

const activeForm = computed(()=>({
  building: BuildingDateForm,
  date: DateForm,
  weekday: WeekdayForm,
  room: RoomForm
}[tab.value]))

function onResults(payload){
  error.value = ''
  holiday.value = null
  timeSlotError.value = false
  // 確保數據結構一致性
  const data = payload?.data || []
  results.value = Array.isArray(data) ? data : (data?.items || [])
}

function onHoliday(h){ 
  holiday.value = h 
}

function onTimeSlotError(message){ 
  timeSlotError.value = message || true
  results.value = []
}

function onTabChange(newTab) {
  // 清理狀態當切換 tab 時
  results.value = []
  error.value = ''
  holiday.value = null
  timeSlotError.value = false
  
  // 清理 URL 參數
  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

// 根據網址參數決定預設分頁（有 building/date 時選 Building+Date；有 roomKey 時選教室）
onMounted(()=>{
  const sp = new URLSearchParams(location.search)
  if(sp.get('roomKey')) tab.value = 'room'
  else if(sp.get('weekday')) tab.value = 'weekday'
  else if(sp.get('date') && (sp.get('building') || sp.get('slotFrom') || sp.get('slotTo'))) tab.value = 'building'
  else if(sp.get('date')) tab.value = 'date'
})
</script>