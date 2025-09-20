<template>
  <div class="dashboard-layout">
    <!-- Навигация -->
    <DashboardNav />
    
    <div class="dashboard-main">
      <!-- Контент страницы -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardNav from '@/components/dashboard/DashboardNav.vue';
</script>

<style scoped>
.dashboard-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-main {
  flex: 1;
}
</style>