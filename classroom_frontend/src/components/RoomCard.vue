<template>
  <div class="card" :class="cardClass" style="display:flex;justify-content:space-between;align-items:center">
    <div style="flex: 1">
      <h3 style="margin:0 0 6px 0">{{ title }}</h3>
      <div v-if="isEmpty" class="status-text" style="color: #059669; font-weight: 500;">
        空教室
      </div>
      <div v-else class="course-info">
        <div style="color: #1e40af; font-weight: 500; margin-bottom: 2px;">
          {{ item.courseName }}
        </div>
        <div style="color: #6b7280; font-size: 0.9em;">
          授課教師：{{ item.professor }}
        </div>
      </div>
    </div>
    <div class="time-info" style="text-align: right; color: #6b7280; font-size: 0.85em;">
      節次：{{ item.timeSlotNo }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({ item: Object })

const title = computed(() => props.item?.roomKey || `${props.item?.buildingCode||''}-${props.item?.roomNumber||props.item?.roomNo||''}`)

const isEmpty = computed(() => {
  const item = props.item
  return !item?.professor || !item?.courseName || 
         item.professor.trim() === '' || item.courseName.trim() === ''
})

const cardClass = computed(() => {
  return isEmpty.value ? 'empty-room' : 'occupied-room'
})
</script>
<style scoped>
.card {
  transition: all 0.2s ease;
}

.empty-room {
  border-left: 4px solid #059669;
  background-color: #f0fdf4;
}

.occupied-room {
  border-left: 4px solid #2563eb;
  background-color: #eff6ff;
}

.empty-room:hover {
  background-color: #ecfdf5;
  transform: translateY(-1px);
}

.occupied-room:hover {
  background-color: #dbeafe;
  transform: translateY(-1px);
}
</style>