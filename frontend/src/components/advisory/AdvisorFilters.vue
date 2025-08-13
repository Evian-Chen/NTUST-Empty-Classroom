<template>
  <div class="card grid md:grid-cols-6 gap-3 items-end">
    <div class="md:col-span-2">
      <label class="text-xs text-gray-500">專長（多選）</label>
      <div class="flex flex-wrap gap-2">
        <label v-for="tag in tags" :key="tag" class="inline-flex items-center gap-1 text-xs">
          <input type="checkbox" :value="tag" v-model="model.expertise" />
          <span>{{ tag }}</span>
        </label>
      </div>
    </div>
    <div>
      <label class="text-xs text-gray-500">星期</label>
      <select v-model="model.weekday" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">不限</option>
        <option v-for="(w,idx) in weekdays" :key="idx" :value="idx">週{{ w }}</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-gray-500">時段</label>
      <select v-model="model.timeSlot" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">不限</option>
        <option value="morning">早上</option>
        <option value="afternoon">下午</option>
        <option value="evening">晚上</option>
      </select>
    </div>
    <div class="md:col-span-2 flex gap-2">
      <input v-model="model.q" class="border rounded-2xl px-3 py-2 w-full" placeholder="搜尋顧問姓名/簡介…" />
      <button class="btn-ghost whitespace-nowrap" @click="reset">重設</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  tags: { type: Array, default: () => ['招募','PR','評審','教育','活動企劃','Mentoring'] }
})
const emit = defineEmits(['update:modelValue'])

const model = reactive({
  expertise: props.modelValue.expertise || [],
  weekday: props.modelValue.weekday || '',
  timeSlot: props.modelValue.timeSlot || '',
  q: props.modelValue.q || '',
})

watch(model, (v) => emit('update:modelValue', { ...v }), { deep: true })

const weekdays = ['日','一','二','三','四','五','六']

function reset(){
  model.expertise = []
  model.weekday = ''
  model.timeSlot = ''
  model.q = ''
}
</script>
