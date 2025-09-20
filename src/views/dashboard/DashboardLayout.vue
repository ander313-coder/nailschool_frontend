<template>
  <div class="dashboard-layout">
    <div class="dashboard-main">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dashboard-layout {
  max-width: 1200px;
  margin: 40px auto 40px; 
  padding: 0 20px;
}

.dashboard-main {
  flex: 1;
}
</style>