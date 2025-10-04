<template>
  <div class="card">
    <div class="row">
      <div style="flex:1 1 200px">
        <label class="small">Weekday</label>
        <select class="select" v-model.number="weekday">
          <option :value="1">Mon</option>
          <option :value="2">Tue</option>
          <option :value="3">Wed</option>
          <option :value="4">Thu</option>
          <option :value="5">Fri</option>
        </select>
      </div>
      <div style="flex:1 1 220px">
        <label class="small">Time Slots (optional)</label>
        <div class="row">
          <input class="input" style="flex:1" type="number" min="1" max="14" v-model.number="state.slotFrom" placeholder="From"/>
          <input class="input" style="flex:1" type="number" min="1" max="14" v-model.number="state.slotTo" placeholder="To"/>
        </div>
      </div>
      <div style="align-self:end">
        <button class="btn" @click="search">Search</button>
      </div>
    </div>
    <p class="small" v-if="resolvedDate">實際日期：<strong>{{ resolvedDate }}</strong></p>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { getWeekAvailability } from '../api.js'
import { useQuerySync } from '../composables/useQuerySync'

const emit = defineEmits(['results'])
const state = useQuerySync(reactive({ slotFrom:'', slotTo:'' }))
const weekday = ref(1)
const resolvedDate = ref('')

async function search(){
  const params = { weekday: weekday.value }
  if(state.slotFrom) params.slotFrom = state.slotFrom
  if(state.slotTo) params.slotTo = state.slotTo
  const data = await getWeekAvailability(params)
  resolvedDate.value = data?.date ?? ''
  emit('results', { type:'weekday', params, data })
}
</script>