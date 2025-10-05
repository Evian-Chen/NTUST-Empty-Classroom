<template>
  <div class="floating-visit">
    <div class="label">
      已有 <strong class="num">{{ count.total.toLocaleString() }}</strong> 人造訪過本站
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const count = ref({ total: 0 })

async function fetchVisits() {
  try {
    const res = await fetch('/api/visit/stats')
    if (!res.ok) throw new Error('Failed to load stats')
    count.value = await res.json()
  } catch (err) {
    console.error('訪客數載入失敗', err)
  }
}

onMounted(() => {
  fetchVisits()
})
</script>

<style scoped>
.floating-visit {
  position: fixed;
  left: 50%;            /* 水平置中 */
  right: auto;
  bottom: 24px;         /* 靠底部距離 */
  transform: translateX(-50%);

  z-index: 50;

  /* 樸實無華：純白底 + 細邊框 */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  /* 簡單內距與排版 */
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;

  color: #374151;
  font-size: 13px;
  line-height: 1.3;

  transition: background-color .2s ease, border-color .2s ease;
}
.floating-visit:hover {
  background: #fafafa;
  border-color: #d1d5db;
}

.label { display: inline-block; }
.num { font-weight: 600; color: #111827; }
</style>