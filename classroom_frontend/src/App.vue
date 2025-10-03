<template>
  <div class="container">
    <div class="header">
      <h1 style="margin:0">空教室查詢</h1>
      <FloatingLike/>
    </div>

    <SearchTabs v-model="tab"/>

    <component :is="activeForm" @results="onResults" @holiday="onHoliday"/>

    <div style="height:12px"></div>
    <ResultsList :items="results" :holiday="holiday" :error="error"/>
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
import FloatingLike from './components/FloatingLike.vue'

const tab = ref('building')
const results = ref([])
const holiday = ref(null)
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
  results.value = Array.isArray(payload?.data) ? payload.data : (payload?.data?.items || [])
}
function onHoliday(h){ holiday.value = h }

// 根據網址參數決定預設分頁（有 building/date 時選 Building+Date；有 roomKey 時選教室）
onMounted(()=>{
  const sp = new URLSearchParams(location.search)
  if(sp.get('roomKey')) tab.value = 'room'
  else if(sp.get('weekday')) tab.value = 'weekday'
  else if(sp.get('date') && (sp.get('building') || sp.get('slotFrom') || sp.get('slotTo'))) tab.value = 'building'
  else if(sp.get('date')) tab.value = 'date'
})
</script>