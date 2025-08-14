<template>
  <div
    v-if="open"
    class="fixed bottom-24 right-4 md:right-6 z-[60] bg-white border shadow-xl rounded-2xl px-3 py-2
           max-w-[250px] text-sm">
    <div class="font-semibold mb-1">需要幫忙定位嗎？</div>
    <p class="text-gray-600">跟我說「找 台北 晚上 雙語 的分會」，我帶你去！</p>
    <div class="flex justify-end gap-2 mt-2">
      <button class="text-xs underline" @click="$emit('close')">知道了</button>
      <button class="text-xs underline" @click="$emit('try')">試試看</button>
    </div>
    <!-- 小三角形 -->
    <div class="absolute -bottom-2 right-6 w-3 h-3 bg-white rotate-45 border-b border-r"></div>
  </div>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close','try'])
</script>
