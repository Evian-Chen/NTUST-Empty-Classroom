<template>
  <div class="fixed bottom-20 right-30 md:right-20 z-[60] group">
    <div class="relative">
      <!-- 呼吸光圈：不吃指標事件，放在下層 -->
      <span
        class="pointer-events-none absolute inset-0 rounded-full bg-[#004165]/30 motion-safe:animate-ping -z-10"
        aria-hidden="true"></span>

      <button
        class="relative z-10 rounded-full shadow-2xl w-18 h-18 md:w-16 md:h-16 flex items-center justify-center text-2xl
               bg-[#004165] text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-blue-300
               transition-all"
        :class="unread ? 'motion-safe:animate-bounce' : ''"
        aria-label="AI 小精靈（開啟對話）"
        @click="$emit('click')">
        🤖
      </button>

      <span v-if="unread"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        {{ unread }}
      </span>

      <span
        class="hidden md:block absolute right-full mr-2 top-1/2 -translate-y-1/2
               bg-[#004165] text-white text-xs rounded-full px-2 py-1 shadow
               opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        需要幫忙？
      </span>
    </div>
  </div>
</template>


<script setup>
defineProps({ unread: { type: Number, default: 0 } })
defineEmits(['click'])
</script>

<style scoped>
/* Tailwind 已有 animate-ping / animate-bounce；這裡無需自訂 keyframe */
</style>
