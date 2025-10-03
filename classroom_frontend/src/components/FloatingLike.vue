<template>
  <button class="like" :disabled="clicked" @click="like">
    <span>❤️</span>
    <strong>{{ count }}</strong>
  </button>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getLikes, postLike } from '../../api.js'

const count = ref(0)
const clicked = ref(false)

onMounted(async()=>{
  try{
    const data = await getLikes()
    count.value = data?.likesTotal ?? 0
    // 今日是否已按過
    const key = new Date().toISOString().slice(0,10)
    clicked.value = localStorage.getItem('siteLiked:'+key)==='1'
  }catch(e){ console.error(e) }
})

async function like(){
  try{
    const data = await postLike()
    count.value = data?.likesTotal ?? count.value+1
    const key = new Date().toISOString().slice(0,10)
    localStorage.setItem('siteLiked:'+key,'1')
    clicked.value = true
  }catch(e){ console.error(e) }
}
</script>
<style scoped>
.like{position:fixed;top:18px;right:18px;background:#fff;border:1px solid var(--border);padding:8px 10px;border-radius:999px;display:flex;gap:8px;align-items:center;box-shadow:0 6px 20px rgba(0,0,0,.06);cursor:pointer}
.like:disabled{opacity:.6;cursor:not-allowed}
</style>