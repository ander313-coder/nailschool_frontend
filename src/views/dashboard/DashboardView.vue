<template>
  <div class="dashboard">
    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <p>Загрузка данных...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error-state">
      <p>Ошибка загрузки данных: {{ error }}</p>
      <button @click="loadData" class="retry-button">Попробовать снова</button>
    </div>

    <!-- Основной контент -->
    <template v-else>
      <!-- Для преподавателей -->
      <template v-if="authStore.user?.role === 'INSTRUCTOR'">
        <!-- Заголовок дашборда -->
        <div class="dashboard-header">
          <h1>Панель преподавателя</h1>
          <p>Управление курсами и проверка работ</p>
        </div>

        <!-- Карточки статистики -->
        <div class="stats-section">
          <InstructorStatsCards />
        </div>

        <!-- Быстрые действия -->
        <div class="quick-actions">
          <InstructorQuickActions />
        </div>
      </template>

      <!-- Для студентов -->
      <template v-else>
        <!-- Компонент с прогрессом -->
        <DashboardStatus />
        <!-- Карточки статистики -->
        <StatsCards />
        <!-- Компонент с курсами -->
        <UserCourses />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useInstructorStore } from '../../stores/instructorStore'
import { useCoursesStore } from '../../stores/courses'

// Компоненты для студентов
import DashboardStatus from '../../components/dashboard/DashboardStatus.vue'
import UserCourses from '../../components/dashboard/UserCourses.vue'
import StatsCards from '../../components/dashboard/StatsCards.vue'

// Компоненты для преподавателей
import InstructorStatsCards from '../../components/dashboard/InstructorStatsCards.vue'
import InstructorQuickActions from '@/components/dashboard/InstructorQuickActions.vue'

const authStore = useAuthStore()
const instructorStore = useInstructorStore()
const coursesStore = useCoursesStore()

const isLoading = ref(true)
const error = ref<string | null>(null)

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('🔄 Загрузка данных дашборда...')
    
    if (authStore.user?.role === 'INSTRUCTOR') {
      await instructorStore.loadPendingHomeworks()
      await instructorStore.loadPendingTextAnswers()
      console.log('✅ Данные преподавателя загружены')
    } else {
      await coursesStore.fetchUserCourses()
      console.log('✅ Курсы студента загружены')
    }
  } catch (err: any) {
    console.error('❌ Ошибка загрузки данных:', err)
    error.value = err.message || 'Не удалось загрузить данные'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
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