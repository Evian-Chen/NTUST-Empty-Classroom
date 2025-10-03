<template>
  <div class="card" v-if="error">
    <strong>錯誤：</strong> {{ error }}
  </div>
  <div class="card" v-else-if="holiday">
    <strong>今日放假</strong> — {{ holiday.note || '無課程與空教室清單' }}
  </div>
  <div class="card" v-else-if="!items.length">
    無符合條件的空教室。
  </div>
  <div v-else class="grid">
    <RoomCard v-for="(it,idx) in items" :key="idx" :item="normalize(it)" class="col-span-12"/>
  </div>
</template>
<script setup>
import RoomCard from './RoomCard.vue'

const props = defineProps({ items:{type:Array,default:()=>[]}, error:String, holiday:Object })

// 嘗試把 API 回傳 normalize 成統一欄位（roomKey/freeRanges）
function normalize(x){
  const roomKey = x.roomKey || (x.buildingCode && x.roomNo ? `${x.buildingCode}-${x.roomNo}` : x.name)
  // 若後端直接回 freeSlotRanges 用之；若有 occMask 可在後端轉
  const freeRanges = x.freeSlotRanges || x.freeRanges || []
  return { ...x, roomKey, freeRanges }
}
</script>