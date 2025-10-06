<template>
  <div class="dashboard">
    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <p>Загрузка данных...</p>
    </div>

    <!-- Основной контент -->
    <div v-else class="dashboard-content">
      <div class="dashboard-header">
        <h1>Добро пожаловать, {{ authStore.user?.username }}!</h1>
        <p>Ваша роль: {{ userRoleDisplay }}</p>
      </div>

      <!-- Для преподавателей -->
      <div v-if="authStore.user?.role === 'INSTRUCTOR'" class="instructor-section">
        <h2>Панель преподавателя</h2>
        
        <div class="stats">
          <div class="stat-card">
            <h3>ДЗ на проверку</h3>
            <p class="stat-number">{{ instructorStore.pendingHomeworksCount }}</p>
          </div>
          <div class="stat-card">
            <h3>Ответы в тестах</h3>
            <p class="stat-number">{{ instructorStore.pendingTextAnswersCount }}</p>
          </div>
        </div>

        <div class="actions">
          <button @click="showAlert('Проверить ДЗ')" class="action-btn">
            📋 Проверить ДЗ
          </button>
          <button @click="showAlert('Текстовые ответы')" class="action-btn">
            📝 Текстовые ответы
          </button>
        </div>
      </div>

      <!-- Для студентов -->
      <div v-else class="student-section">
        <h2>Мои курсы</h2>
        <p>Количество активных курсов: {{ coursesStore.courses.length }}</p>
        <div class="actions">
          <router-link to="/my-courses" class="action-btn">
            📚 Мои курсы
          </router-link>
          <router-link to="/courses" class="action-btn">
            🔍 Все курсы
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useInstructorStore } from '../../stores/instructorStore'
import { useCoursesStore } from '../../stores/courses'

const authStore = useAuthStore()
const instructorStore = useInstructorStore()
const coursesStore = useCoursesStore()

const isLoading = ref(true)

const userRoleDisplay = computed(() => {
  const roleMap = {
    'TRAINEE': 'Стажер',
    'MASTER': 'Мастер', 
    'INSTRUCTOR': 'Инструктор'
  }
  return authStore.user ? roleMap[authStore.user.role] || authStore.user.role : 'Неизвестно'
})

const showAlert = (message: string) => {
  alert(`${message} - функционал в разработке`)
}

const loadData = async () => {
  try {
    if (authStore.user?.role === 'INSTRUCTOR') {
      await instructorStore.loadPendingHomeworks()
      await instructorStore.loadPendingTextAnswers()
    } else {
      await coursesStore.fetchUserCourses()
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
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

.loading-state {
  text-align: center;
  padding: 60px;
  color: #666;
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

.instructor-section, .student-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #8C4CC3;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #7b3fb3;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>