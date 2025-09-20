<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Личный кабинет</h1>
      <p>Здесь вы можете управлять своим обучением</p>
    </div>
    <DashboardStatus />
    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Активные курсы</h3>
          <p class="stat-number">2</p>
        </div>
        <div class="stat-card">
          <h3>Пройдено уроков</h3>
          <p class="stat-number">15</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardStatus from '@/components/dashboard/DashboardStatus.vue';

</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.dashboard-header p {
  color: #666;
  font-size: 16px;
}

.dashboard-content {
  margin-top: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #8C4CC3; 
  margin: 0;
}
</style>