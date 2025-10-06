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
      <!-- Для студентов -->
      <template v-if="userRole === 'TRAINEE' || userRole === 'MASTER'">
        <DashboardStatus />
        <StatsCards />
        <UserCourses />
      </template>

      <!-- Для преподавателей -->
      <template v-else-if="userRole === 'INSTRUCTOR'">
        <InstructorDashboardStatus />
        <InstructorStatsCards />
        <InstructorUserCourses />
      </template>
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCoursesStore } from '@/stores/courses';
import { useInstructorStore } from '../../stores/instructorStore';
import DashboardLayout from '@/components/DashboardLayout.vue';

// Компоненты для студентов
import DashboardStatus from '@/components/dashboard/DashboardStatus.vue';
import UserCourses from '@/components/dashboard/UserCourses.vue';
import StatsCards from '@/components/dashboard/StatsCards.vue';

// Компоненты для преподавателей - ПРАВИЛЬНЫЕ ПУТИ
import InstructorDashboardStatus from '@/components/dashboard/InstructorDashboardStatus.vue';
import InstructorUserCourses from '@/components/dashboard/InstructorUserCourses.vue';
import InstructorStatsCards from '@/components/dashboard/InstructorStatsCards.vue';

const authStore = useAuthStore();
const coursesStore = useCoursesStore();
const instructorStore = useInstructorStore();

const localLoading = ref(true);
const error = ref<string | null>(null);

// Определяем роль пользователя
const userRole = computed(() => authStore.user?.role || 'TRAINEE');

// Состояния загрузки

const loadData = async () => {
  localLoading.value = true;
  error.value = null;
  
  try {
    if (userRole.value === 'INSTRUCTOR') {
      // Для преподавателя загружаем данные преподавателя
      await Promise.all([
        coursesStore.fetchUserCourses(),
        instructorStore.loadPendingHomeworks(),
        instructorStore.loadPendingTextAnswers()
      ]);
    } else {
      // Для студентов загружаем обычные данные
      await coursesStore.fetchUserCourses();
    }
  } catch (err: any) {
    console.error('Error loading dashboard data:', err);
    error.value = err.message || 'Ошибка загрузки данных';
  } finally {
    localLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});
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
  font-weight: 500;
}

.retry-button:hover {
  background: #7b3fb3;
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
  .dashboard {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 12px;
  }
  
  .loading-state, .error-state {
    padding: 40px 20px;
  }
}
</style>