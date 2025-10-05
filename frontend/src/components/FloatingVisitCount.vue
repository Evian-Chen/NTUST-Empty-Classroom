<template>
  <div class="floating-visit" @mouseenter="showSearch = true" @mouseleave="showSearch = false" @click="showSearch = !showSearch">
    <div class="label" v-if="!showSearch">
      已有
      <strong class="num">{{ count.total.toLocaleString() }}</strong>
      人造訪過本站
    </div>
    <div class="label" v-if="showSearch">
      已有
      <strong class="num">{{ countSearch.total.toLocaleString() }}</strong>
      人搜尋過空教室
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSearchCount } from "@/api";
const API_BASE = import.meta.env.VITE_API_BASE || "api"; // dev 無就走 proxy 的 /api

const count = ref({ total: 0 });
const countSearch = ref({ total: 0 });
const showSearch = ref(false);

async function fetchVisits() {
  try {
    const res = await fetch(`${API_BASE}/visit/stats`);
    if (!res.ok) throw new Error("Failed to load stats");
    count.value = await res.json();
  } catch (err) {
    console.error("訪客數載入失敗", err);
  }
}

onMounted(() => {
  fetchVisits();

  getSearchCount()
    .then((res) => {
      console.log("Current search count:", res.total);
      countSearch.value.total = res.total;
    })
    .catch((err) => {
      console.warn("Failed to get search count:", err);
    });
});
</script>

<style scoped>
.floating-visit {
  position: fixed;
  left: 50%; /* 水平置中 */
  right: auto;
  bottom: 24px; /* 靠底部距離 */
  transform: translateX(-50%);

  z-index: 50;

  /* 樸實無華：純白底 + 細邊框 */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  opacity: 0.3;

  /* 簡單內距與排版 */
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;

  color: #374151;
  font-size: 13px;
  line-height: 1.3;
  cursor: pointer;

  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.floating-visit:hover {
  background: #fafafa;
  border-color: #d1d5db;
}

.label {
  display: inline-block;
}
.num {
  font-weight: 600;
  color: #111827;
}
</style>
