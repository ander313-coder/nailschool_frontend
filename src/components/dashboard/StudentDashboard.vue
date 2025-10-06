<template>
  <div class="student-dashboard">
    <div class="dashboard-header">
      <h1>Мой прогресс</h1>
      <p>Продолжайте обучение и достигайте новых высот</p>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <router-link to="/my-courses" class="action-card">
          <div class="action-icon">📚</div>
          <div class="action-text">Мои курсы</div>
        </router-link>

        <router-link to="/progress" class="action-card">
          <div class="action-icon">📊</div>
          <div class="action-text">Мой прогресс</div>
        </router-link>

        <router-link to="/courses" class="action-card">
          <div class="action-icon">🔍</div>
          <div class="action-text">Все курсы</div>
        </router-link>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-section">
      <StatsCards />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatsCards from './StatsCards.vue'
</script>

<style scoped>
.student-dashboard {
  padding: 20px 0;
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

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #8C4CC3;
  color: #8C4CC3;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.action-text {
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>