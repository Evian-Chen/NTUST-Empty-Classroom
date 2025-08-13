<template>
  <div class="card grid md:grid-cols-6 gap-3 items-end">
    <div>
      <label class="text-xs text-gray-500">類型</label>
      <select v-model="model.type" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option value="student">學生分會</option>
        <option value="community">社區分會</option>
        <option value="corporate">企業分會</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-gray-500">地區（Area/Division）</label>
      <input v-model="model.area" class="border rounded-2xl px-3 py-2 w-full" placeholder="例：D67 Area A1" />
    </div>
    <div>
      <label class="text-xs text-gray-500">城市</label>
      <input v-model="model.city" class="border rounded-2xl px-3 py-2 w-full" placeholder="例：台北市" />
    </div>
    <div>
      <label class="text-xs text-gray-500">語言</label>
      <select v-model="model.language" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option value="zh">中文</option>
        <option value="en">English</option>
        <option value="bilingual">中英雙語</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-gray-500">Meeting 模式</label>
      <select v-model="model.mode" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option value="online">線上</option>
        <option value="offline">實體</option>
        <option value="hybrid">混合</option>
      </select>
    </div>
    <div class="flex gap-2">
      <input v-model="model.q" class="border rounded-2xl px-3 py-2 w-full" placeholder="搜尋關鍵字…" />
      <button class="btn-ghost" @click="reset">重設</button>
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
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const model = reactive({
  type: props.modelValue.type || '',
  area: props.modelValue.area || '',
  city: props.modelValue.city || '',
  language: props.modelValue.language || '',
  mode: props.modelValue.mode || '',
  q: props.modelValue.q || '',
  weekday: props.modelValue.weekday || '',
  timeSlot: props.modelValue.timeSlot || '',
})

watch(model, (v) => {
  emit('update:modelValue', { ...v })
}, { deep: true })

function reset(){
  model.type = ''
  model.area = ''
  model.city = ''
  model.language = ''
  model.mode = ''
  model.q = ''
  model.weekday = ''
  model.timeSlot = ''
}

const weekdays = ['日','一','二','三','四','五','六']
</script>
