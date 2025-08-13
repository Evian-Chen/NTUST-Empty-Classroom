<template>
  <div class="card">
    <h3 class="font-semibold mb-2">批次匯入</h3>
    <p class="text-xs text-gray-500 mb-3">上傳 CSV（UTF-8）。第一列當作欄位名稱。</p>
    <div class="flex items-center gap-2">
      <input type="file" accept=".csv,text/csv" @change="onFile" />
      <button class="btn-ghost" @click="downloadSample">下載範例</button>
      <button class="btn-primary" :disabled="!rows.length" @click="$emit('import', rows)">匯入 {{ rows.length }} 筆</button>
    </div>
    <div v-if="rows.length" class="mt-4 overflow-auto">
      <table class="min-w-full text-xs">
        <thead><tr><th v-for="h in headers" :key="h" class="text-left py-1 pr-3">{{ h }}</th></tr></thead>
        <tbody>
          <tr v-for="(r,i) in rows.slice(0,10)" :key="i"><td v-for="h in headers" :key="h" class="py-1 pr-3">{{ r[h] }}</td></tr>
        </tbody>
      </table>
      <p class="text-xs text-gray-500 mt-2">只預覽前 10 筆。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const headers = ref([])
const rows = ref([])

function parseCSV(text){
  const lines = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').filter(Boolean)
  if (!lines.length) return { headers: [], rows: [] }
  const h = lines[0].split(',').map(s => s.trim())
  const rs = lines.slice(1).map(line => {
    const cols = line.split(',')
    const obj = {}
    h.forEach((k, idx) => obj[k] = (cols[idx] ?? '').trim())
    return obj
  })
  return { headers: h, rows: rs }
}

async function onFile(e){
  const file = e.target.files?.[0]
  if (!file) return
  const text = await file.text()
  const parsed = parseCSV(text)
  headers.value = parsed.headers
  rows.value = parsed.rows
}

function downloadSample(){
  const sample = 'name,city,language,meetingMode\nAwesome TM,台北市,bilingual,offline\n'
  const blob = new Blob([sample], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'clubs-sample.csv'
  document.body.appendChild(a); a.click(); URL.revokeObjectURL(a.href); a.remove()
}
</script>
