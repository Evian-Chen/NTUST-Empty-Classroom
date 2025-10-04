<template>
  <div class="card">
    <div class="row">
      <div style="flex:2 1 260px">
        <label class="small">Room (e.g. TR-312)</label>
        <input class="input" v-model="roomKey" placeholder="TR-312" />
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Date (optional)</label>
        <input class="input" type="date" v-model="date" />
      </div>
      <div style="align-self:end">
        <button class="btn" :disabled="!roomKey" @click="search">Search</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getRoomDetail } from '../api.js'

const emit = defineEmits(['results'])
const roomKey = ref('')
const date = ref('')

async function search(){
  const data = await getRoomDetail(roomKey.value, date.value || undefined)
  emit('results', { type:'room', params:{ roomKey: roomKey.value, date: date.value || undefined }, data })
}
</script>