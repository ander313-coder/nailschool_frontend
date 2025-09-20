<template>
  <DashboardLayout>
    <div class="progress-view">
      <div class="page-header">
        <h1>Мой прогресс</h1>
        <p>Здесь вы можете отслеживать свой прогресс в обучении</p>
      </div>
      
      <div class="coming-soon">
        <div class="coming-soon-content">
          <span class="icon">📈</span>
          <h2>Скоро будет доступно</h2>
          <p>Раздел находится в разработке</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from './DashboardLayout.vue';
</script>

<style scoped>
.progress-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon-content {
  text-align: center;
  color: #666;
}

.coming-soon-content .icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.coming-soon-content h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}
</style>