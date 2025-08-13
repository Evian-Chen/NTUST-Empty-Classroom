<template>
  <div>
    <header class="bg-tmblue text-white">
      <div class="container-responsive py-3 flex items-center justify-between">
        <RouterLink to="/" class="font-bold tracking-wide">TM Campus Committee</RouterLink>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink to="/help" class="hover:underline">我們能幫什麼</RouterLink>
          <RouterLink to="/advisory" class="hover:underline">顧問&媒合</RouterLink>
          <RouterLink to="/directory" class="hover:underline">分會名錄</RouterLink>
          <RouterLink to="/events" class="hover:underline">活動</RouterLink>
          <RouterLink to="/resources" class="hover:underline">資源</RouterLink>
          <RouterLink to="/promote" class="hover:underline">對外合作</RouterLink>
          <RouterLink to="/me" class="hover:underline">個人中心</RouterLink>
          <RouterLink to="/admin" class="btn-ghost text-white">後台</RouterLink>
          <RouterLink to="/login" class="btn-primary">登入</RouterLink>
        </nav>
      </div>
    </header>
    <main class="container-responsive py-6">
      <RouterView />
    </main>
    <footer class="border-t mt-8">
      <div class="container-responsive py-6 text-sm text-gray-500">
        © {{ new Date().getFullYear() }} Toastmasters Campus Committee
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>
