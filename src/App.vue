<script setup>
let counter = ref(0)

setInterval(() => {
  counter.value++
}, 1000)
</script>

<template>
  <div>
    <header v-if="$route.meta.title" class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1
          class="text-3xl font-bold leading-tight text-gray-900"
          title="click to reset a counter"
          @click="counter = 0">
          {{ $route.meta.title }} / {{ counter }}
        </h1>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
