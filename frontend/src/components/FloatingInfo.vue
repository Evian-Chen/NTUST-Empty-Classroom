<template>
  <div class="fi-root" :class="{ 'fi-open': open }">
    <!-- Toggle badge -->
    <button
      class="fi-badge"
      aria-label="Open info"
      @click="open = true"
    >
      ℹ️
    </button>

    <!-- Overlay (click outside to close) -->
    <div v-if="open" class="fi-overlay" @click="close"></div>

    <!-- Panel -->
    <section
      v-if="open"
      class="fi-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fi-title"
    >
      <header class="fi-header">
        <h2 id="fi-title" class="fi-title">教室更新資訊</h2>
        <button class="fi-close" aria-label="Close" @click="close">✖</button>
      </header>
      <div class="fi-content">
        <slot>
          週一至週五凌晨五點更新當天教室資訊，每週六凌晨五點更新下週教室資訊。
        </slot>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
function close() { open.value = false }

// ESC to close
function onKey(e) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* Root (relative positioning when in header) */
.fi-root {
  position: relative;
  z-index: 60;
}

/* Badge button */
.fi-badge {
  appearance: none;
  border: 1px solid #e5e7eb;     /* gray-200 */
  background: #fff;
  border-radius: 999px;
  padding: 6px 10px;
  line-height: 1;
  font-size: 14px;
  cursor: pointer;
}
.fi-badge:hover { background: #f9fafb; }  /* gray-50 */

/* Simple overlay (click outside to close) */
.fi-overlay {
  position: fixed;
  inset: 0;
  background: transparent; /* keeps it subtle; still catches clicks */
  z-index: 61;
}

/* Panel - positioned relative to the root container */
.fi-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: min(92vw, 360px);
  background: #ffffff;
  border: 1px solid #e5e7eb;     /* gray-200 */
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.06);
  z-index: 62;
}

/* Header */
.fi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6; /* gray-100 */
}
.fi-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827; /* gray-900 */
}

/* Close button */
.fi-close {
  appearance: none;
  border: none;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  color: #6b7280; /* gray-500 */
}
.fi-close:hover { color: #111827; }

/* Content */
.fi-content {
  padding: 12px;
  font-size: 14px;
  color: #374151; /* gray-700 */
  line-height: 1.5;
}
</style>
