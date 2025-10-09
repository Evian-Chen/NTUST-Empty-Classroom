<template>
  <div class="container">
    <div class="header">
      <h1 style="margin:0">台科空教室查詢</h1>
      <FloatingInfo />
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
    <FloatingVisitCount />
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
import FloatingVisitCount from './components/FloatingVisitCount.vue'
import FloatingInfo from './components/FloatingInfo.vue'

const tab = ref('building')
const results = ref([])
const holiday = ref(null)
const timeSlotError = ref(false)
const error = ref('')
const API_BASE = import.meta.env.VITE_API_BASE || 'api'; // dev 無就走 proxy 的 /api

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
  if (message === false) {
    timeSlotError.value = false
  } else {
    timeSlotError.value = message || true
    results.value = []  // 清空結果
    error.value = ''    // 清空其他錯誤
    holiday.value = null // 清空假期信息
  }
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
onMounted(async()=>{
  const sp = new URLSearchParams(location.search)
  if(sp.get('roomKey')) tab.value = 'room'
  else if(sp.get('weekday')) tab.value = 'weekday'
  else if(sp.get('date') && (sp.get('building') || sp.get('slotFrom') || sp.get('slotTo'))) tab.value = 'building'
  else if(sp.get('date')) tab.value = 'date'

  console.log("嗨！感謝你使用這個網站，如果你有任何建議或回饋，歡迎透過 GitHub 開 Issue，如果喜歡這個功能，歡迎留下星星 OuOb：https://github.com/Evian-Chen/NTUST-Empty-Classroom/tree/main")

  await fetch(`${API_BASE}/visit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userAgent: navigator.userAgent
    })
  });
})
</script>