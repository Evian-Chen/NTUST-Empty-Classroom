<template>
  <div class="tabbar">
    <button class="tab" :class="{active: model==='building'}" @click="$emit('update:modelValue','building')">館別＋日期</button>
    <button class="tab" :class="{active: model==='weekday'}" @click="$emit('update:modelValue','weekday')">星期</button>
    <button class="tab" :class="{active: model==='room'}" @click="$emit('update:modelValue','room')">教室</button>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: String })
const model = computed(()=>props.modelValue)
</script>