<template>
  <div class="card grid md:grid-cols-6 gap-3 items-end">
    <div>
      <label class="text-xs text-gray-500">分類</label>
      <select v-model="model.category" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option value="template">模板</option>
        <option value="guide">指南</option>
        <option value="video">教學影片</option>
        <option value="case">案例</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-gray-500">來源</label>
      <select v-model="model.source" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option value="official">總會官方</option>
        <option value="district">地區/分區</option>
        <option value="club">各分會</option>
        <option value="committee">Campus Committee</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-gray-500">標籤</label>
      <select v-model="model.tag" class="border rounded-2xl px-3 py-2 w-full">
        <option value="">全部</option>
        <option v-for="t in tags" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <div class="md:col-span-3 flex gap-2">
      <input v-model="model.q" class="border rounded-2xl px-3 py-2 w-full" placeholder="搜尋標題/描述/標籤…" />
      <button class="btn-ghost whitespace-nowrap" @click="reset">重設</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ modelValue: Object, tags: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])
const model = reactive({ category: props.modelValue?.category || '', source: props.modelValue?.source || '', tag: props.modelValue?.tag || '', q: props.modelValue?.q || '' })
watch(model, (v) => emit('update:modelValue', { ...v }), { deep: true })
function reset(){ model.category=''; model.source=''; model.tag=''; model.q='' }
</script>
