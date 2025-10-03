<template>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center">
    <div>
      <h3 style="margin:0 0 6px 0">{{ title }}</h3>
      <div class="small">容量：{{ item.capacity ?? '-' }}，樓層：{{ item.floor ?? '-' }}</div>
      <div class="small" v-if="item.tags">設備：
        <span class="badge" v-if="item.tags.projector">投影</span>
        <span class="badge" v-if="item.tags.whiteboard">白板</span>
        <span class="badge" v-if="item.tags.pc">電腦</span>
        <span class="badge" v-if="item.tags.sockets">插座 {{ item.tags.sockets }}</span>
      </div>
    </div>
    <div>
      <div class="small" v-if="item.freeRanges?.length">空檔：
        <span v-for="(r,idx) in item.freeRanges" :key="idx" class="badge">{{ r[0] }}-{{ r[1] }}</span>
      </div>
      <div class="small" v-else>空檔：—</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ item:Object })
const title = computed(()=> props.item?.roomKey || `${props.item?.buildingCode||''}-${props.item?.roomNo||''}`)
</script>