<template>
  <DashboardLayout>
    <!-- Заголовок страницы -->
    <div class="dashboard-header">
      <h1>Обзор</h1>
      <p>Добро пожаловать в ваш личный кабинет! Здесь вы можете отслеживать свой прогресс.</p>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="coursesStore.isLoading" class="loading-state">
      <p>Загрузка данных...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="coursesStore.error" class="error-state">
      <p>Ошибка загрузки данных: {{ coursesStore.error }}</p>
      <button @click="loadData" class="retry-button">Попробовать снова</button>
    </div>

    <!-- Основной контент -->
    <template v-else>
      <!-- Компонент с прогрессом -->
      <DashboardStatus />
      <!-- Карточки статистики -->
      <StatsCards />
      <!-- Компонент с курсами -->
      <UserCourses />

      <!-- Блок быстрых действий -->
      <div class="quick-actions">
        <h2>Быстрые действия</h2>
        <div class="actions-grid">
          <router-link to="/my-courses" class="action-card">
            <span class="action-icon">🎓</span>
            <span class="action-text">Мои курсы</span>
          </router-link>
          
          <router-link to="/progress" class="action-card">
            <span class="action-icon">📈</span>
            <span class="action-text">Прогресс</span>
          </router-link>
          
          <router-link to="/profile" class="action-card">
            <span class="action-icon">👤</span>
            <span class="action-text">Профиль</span>
          </router-link>
          
          <router-link to="/courses" class="action-card">
            <span class="action-icon">🔍</span>
            <span class="action-text">Все курсы</span>
          </router-link>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardLayout from './DashboardLayout.vue';
import DashboardStatus from '@/components/dashboard/DashboardStatus.vue';
import UserCourses from '@/components/dashboard/UserCourses.vue';
import StatsCards from '@/components/dashboard/StatsCards.vue';
import { useCoursesStore } from '@/stores/courses';

const coursesStore = useCoursesStore();

onMounted(() => {
  loadData();
});

const loadData = async () => {
  await coursesStore.fetchUserCourses();
};
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

.quick-actions {
  margin-top: 40px;
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

.loading-state, .error-state {
  text-align: center;
  padding: 60px;
  color: #666;
}

.retry-button {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 16px;
  cursor: pointer;
}

.retry-button:hover {
  background: #7b3fb3;
}

/* Адаптивность */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    padding: 20px;
  }
}
</style>