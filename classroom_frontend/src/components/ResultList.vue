<template>
  <div class="card" v-if="error">
    <strong>錯誤：</strong> {{ error }}
  </div>
  <div class="card" v-else-if="holiday">
    <strong>今日放假</strong> — {{ holiday.note || '無課程與空教室清單' }}
  </div>
  <div class="card" v-else-if="timeSlotError">
    <strong>查詢錯誤</strong> — {{ timeSlotError === true ? '課程節數區間錯誤。' : timeSlotError }}
  </div>
  <div class="card" v-else-if="!items.length">
    無符合條件的空教室。
  </div>
  <div v-else>
    <!-- Tab 選擇器 -->
    <div class="filter-tabs" style="margin-bottom: 16px;">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.key"
        :class="['filter-tab', { active: activeFilter === tab.key }]"
        @click="activeFilter = tab.key"
      >
        {{ tab.label }} ({{ getFilteredCount(tab.key) }})
      </button>
    </div>
    
    <!-- 結果列表 -->
    <div class="grid">
      <RoomCard 
        v-for="(it,idx) in filteredItems" 
        :key="idx" 
        :item="normalize(it)" 
        class="col-span-12"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import RoomCard from './RoomCard.vue'

const props = defineProps({ items:{type:Array,default:()=>[]}, error:String, holiday:Object, timeSlotError:[Boolean, String] })

// 篩選器狀態
const activeFilter = ref('all')

// 篩選選項
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'empty', label: '空教室' },
  { key: 'occupied', label: '上課教室' }
]

// 判斷教室是否為空
function isEmptyRoom(item) {
  return !item?.professor || !item?.courseName || 
         item.professor.trim() === '' || item.courseName.trim() === ''
}

// 篩選後的項目
const filteredItems = computed(() => {
  const normalizedItems = props.items.map(normalize)
  
  if (activeFilter.value === 'empty') {
    return normalizedItems.filter(isEmptyRoom)
  } else if (activeFilter.value === 'occupied') {
    return normalizedItems.filter(item => !isEmptyRoom(item))
  } else {
    return normalizedItems
  }
})

// 獲取各篩選器的數量
function getFilteredCount(filterKey) {
  const normalizedItems = props.items.map(normalize)
  
  if (filterKey === 'empty') {
    return normalizedItems.filter(isEmptyRoom).length
  } else if (filterKey === 'occupied') {
    return normalizedItems.filter(item => !isEmptyRoom(item)).length
  } else {
    return normalizedItems.length
  }
}

// 嘗試把 API 回傳 normalize 成統一欄位（roomKey/freeRanges）
function normalize(x){
  const roomKey = x.roomKey || (x.buildingCode && (x.roomNumber || x.roomNo) ? `${x.buildingCode}-${x.roomNumber || x.roomNo}` : x.name)
  // 若後端直接回 freeSlotRanges 用之；若有 occMask 可在後端轉
  const freeRanges = x.freeSlotRanges || x.freeRanges || []
  return { ...x, roomKey, freeRanges }
}
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.filter-tab {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9em;
  color: #6b7280;
}

.filter-tab:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.filter-tab.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.filter-tab.active:hover {
  background-color: #2563eb;
}
</style>