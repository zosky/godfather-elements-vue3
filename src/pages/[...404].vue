<script setup>
import { Loading } from 'mdue'
useHead({ title: '404=>302',})
const route = useRoute()
const router = useRouter()
const redirect = route.path.includes('/frame/') 
  ? route.path
  : '/giveaways'
router.replace(redirect)
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-purple-900 text-7xl">
        <Loading class="animate-spin" />
        goTime...
      </h1>
    </div>
  </header>
</template>
