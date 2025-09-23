<template>
  <DashboardLayout>

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
    </template>
        <!-- Временная кнопка для тестирования -->
    <div class="debug-section">
      <button @click="testAPI" class="debug-btn">Test API Endpoints</button>
      <div v-if="apiTestResult" class="api-result">
        <pre>{{ apiTestResult }}</pre>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DashboardLayout from './DashboardLayout.vue';
import DashboardStatus from '@/components/dashboard/DashboardStatus.vue';
import UserCourses from '@/components/dashboard/UserCourses.vue';
import StatsCards from '@/components/dashboard/StatsCards.vue';
import { useCoursesStore } from '@/stores/courses';

// тестирование API
import { testEndpoints } from '@/utils/apiTester';

const coursesStore = useCoursesStore();
const apiTestResult = ref<string>('');
const localLoading = ref(true); // Локальное состояние загрузки

// Используем вычисляемые свойства для синхронизации состояний
const isLoading = computed(() => coursesStore.isLoading || localLoading.value);
const error = computed(() => coursesStore.error);

const testAPI = async () => {
  apiTestResult.value = 'Testing...';
  await testEndpoints();
  apiTestResult.value = 'Check browser console for results';
};

onMounted(() => {
  loadData();
});

const loadData = async () => {
  localLoading.value = true;
  try {
    await coursesStore.fetchUserCourses();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    localLoading.value = false;
  }
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

.debug-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.debug-btn {
  background: #666;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.debug-btn:hover {
  background: #555;
}

.api-result {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
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