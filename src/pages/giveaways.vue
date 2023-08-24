<script setup>
</script>

<template>
  <div>
    <YouAreHere />
    <div class="flex flex-row flex-wrap mt-3">
      <GAhistory class="sm:w-full" />
      <div class="flex flex-col items-center w-full md:w-auto md:items-start mt-5">
        <GAstats />
        <LiveLog id="latestWinners" />
      </div>
    </div>
  </div>
</template>