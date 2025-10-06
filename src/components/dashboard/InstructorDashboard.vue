<template>
  <div class="instructor-dashboard">
    <div class="dashboard-header">
      <h1>Панель преподавателя</h1>
      <p>Управление курсами и проверка работ</p>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <div class="action-card" @click="goToPendingHomeworks">
          <div class="action-icon">📋</div>
          <div class="action-text">Проверить ДЗ</div>
          <div class="action-badge" v-if="instructorStore.pendingHomeworksCount > 0">
            {{ instructorStore.pendingHomeworksCount }}
          </div>
        </div>

        <div class="action-card" @click="goToTextAnswers">
          <div class="action-icon">📝</div>
          <div class="action-text">Текстовые ответы</div>
          <div class="action-badge" v-if="instructorStore.pendingTextAnswersCount > 0">
            {{ instructorStore.pendingTextAnswersCount }}
          </div>
        </div>

        <router-link to="/courses" class="action-card">
          <div class="action-icon">🎓</div>
          <div class="action-text">Мои курсы</div>
        </router-link>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-section">
      <InstructorStatsCards />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useInstructorStore } from '../../stores/instructorStore'
import InstructorStatsCards from './InstructorStatsCards.vue'

const router = useRouter()
const instructorStore = useInstructorStore()

const goToPendingHomeworks = () => {
  // Временная заглушка - позже создадим страницу
  alert('Страница проверки ДЗ будет создана позже')
}

const goToTextAnswers = () => {
  // Временная заглушка - позже создадим страницу
  alert('Страница текстовых ответов будет создана позже')
}
</script>

<style scoped>
.instructor-dashboard {
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
  position: relative;
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
  cursor: pointer;
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

.action-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FF6B6B;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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