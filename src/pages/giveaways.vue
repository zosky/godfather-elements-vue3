<script setup>
</script>

<template>
  <div>
    <YouAreHere />
    <div class="flex flex-row flex-wrap mt-3">
      <div class="flex flex-row flex-wrap items-center w-full md:w-auto md:items-start mt-5">
        <Redeems class="w-full" />
        <GAhistoryDay class="max-w-full"  />
        <div class="max-w-full">
          <UserEngagment />
          <LiveLog id="latestWinners" />
        </div>
      </div>
      <GAhistory class="w-full" />
    </div>
  </div>
</template>