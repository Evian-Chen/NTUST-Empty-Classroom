<template>
  <section class="space-y-8">
    <div class="rounded-2xl bg-tmblue text-white p-8">
      <h1 class="text-3xl font-bold mb-2">拉近學生分會與校外分會的距離</h1>
      <p class="opacity-90">當你人手不足或不知如何經營社團，我們會在這裡。</p>
      <div class="mt-6 flex gap-3">
        <RouterLink to="/help" class="btn-primary">我要幫忙</RouterLink>
        <RouterLink to="/promote" class="btn-ghost text-white border-white/30">我要合作</RouterLink>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="card">
        <h2 class="font-semibold mb-2">近期活動</h2>
        <RouterLink to="/events" class="text-tmblue underline">查看所有活動 →</RouterLink>
      </div>
      <div class="card">
        <h2 class="font-semibold mb-2">成功案例</h2>
        <p class="text-sm text-gray-600">展示學生分會對外合作與求助成果。</p>
      </div>
    </div>
  </section>
</template>
<script setup>
</script>
