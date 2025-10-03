<template>
  <div class="card">
    <div class="row">
      <div style="flex:1 1 220px">
        <label class="small">Date</label>
        <input class="input" type="date" v-model="state.date" />
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Time Slots (optional)</label>
        <div class="row">
          <input class="input" style="flex:1" type="number" min="1" v-model.number="state.slotFrom" placeholder="From"/>
          <input class="input" style="flex:1" type="number" min="1" v-model.number="state.slotTo" placeholder="To"/>
        </div>
      </div>
      <div style="align-self:end">
        <button class="btn" @click="search">Search</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { getAvailability, getHoliday } from '../../api.js'
import { useQuerySync } from '../composables/useQuerySync'

const emit = defineEmits(['results','holiday'])
const state = useQuerySync(reactive({
  date: new Date().toISOString().slice(0,10),
  slotFrom: '',
  slotTo: ''
}))

async function search(){
  const cal = await getHoliday(state.date)
  if(cal?.isHoliday){
    emit('holiday', cal)
    emit('results', { type:'date', params:{...state}, data: [] })
    return
  }
  const params = { date: state.date }
  if(state.slotFrom) params.slotFrom = state.slotFrom
  if(state.slotTo) params.slotTo = state.slotTo
  const data = await getAvailability(params)
  emit('results', { type:'date', params, data })
}
</script>