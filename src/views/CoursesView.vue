<template>
  <div class="courses-page">
    <!-- Хедер страницы -->
    <div class="page-header">
      <h1>Все курсы</h1>
      <p>Выберите курс для начала обучения</p>
    </div>

    <!-- Состояния загрузки -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загружаем курсы...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="loadCourses" class="retry-button">Попробовать снова</button>
    </div>

    <div v-else-if="filteredCourses.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>Курсы не найдены</h3>
      <p>На данный момент нет доступных курсов для вашего уровня</p>
    </div>

    <!-- Список курсов -->
    <div v-else class="courses-content">
      <!-- Статистика -->
      <div class="stats-bar">
        <span class="stat">Доступно курсов: {{ filteredCourses.length }}</span>
        <div class="user-role-info">
          <span class="role-badge" :class="userRole.toLowerCase()">
            {{ getRoleDisplayText(userRole) }}
          </span>
        </div>
      </div>

      <!-- Сетка курсов -->
      <div class="courses-grid">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
          @click="openCourse(course.id)"
        >
          <!-- Обложка курса -->
          <div class="course-cover">
            <img
              v-if="course.cover_image"
              :src="course.cover_image"
              :alt="course.title"
              class="cover-image"
            />
            <div v-else class="cover-placeholder">
              🎓
            </div>
            <div class="course-type-badge" :class="course.course_type.toLowerCase()">
              {{ getCourseTypeText(course.course_type) }}
            </div>
            <div class="access-level-badge" :class="course.access_level.toLowerCase()">
              {{ getAccessLevelText(course.access_level) }}
            </div>
          </div>

          <!-- Контент карточки -->
          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ truncateText(course.description, 120) }}</p>

            <!-- Мета-информация -->
            <div class="course-meta">
              <div class="meta-item">
                <span class="meta-icon">📖</span>
                <span>{{ course.lesson_count || 0 }} уроков</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">👤</span>
                <span>{{ getAccessLevelText(course.access_level) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🎯</span>
                <span>{{ getCourseTypeText(course.course_type) }}</span>
              </div>
            </div>
          </div>

          <!-- Футер карточки -->
          <div class="course-footer">
            <button class="view-course-btn">
              Смотреть курс →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'


const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

// Состояния
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed свойства
const coursesList = computed(() => coursesStore.courses || [])
const userRole = computed(() => authStore.user?.role || 'TRAINEE')

// Фильтрация курсов по роли пользователя
const filteredCourses = computed(() => {
  const role = userRole.value
  
  return coursesList.value.filter(course => {
    const courseAccess = course.access_level
    
    switch (role) {
      case 'INSTRUCTOR':
        // Инструктор видит все курсы
        return true
        
      case 'MASTER':
        // Мастер видит: ALL, BASIC, ADVANCED
        return courseAccess === 'ALL' || courseAccess === 'BASIC' || courseAccess === 'ADVANCED'
        
      case 'TRAINEE':
      default:
        // Стажер видит: ALL, BASIC
        return courseAccess === 'ALL' || courseAccess === 'BASIC'
    }
  })
})

// Загрузка данных
const loadCourses = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Используем существующий метод из store
    await coursesStore.fetchUserCourses()
    
    console.log('👤 Роль пользователя:', userRole.value)
    console.log('📚 Всего курсов:', coursesList.value.length)
    console.log('🎯 Доступно курсов:', filteredCourses.value.length)
    
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки курсов'
    console.error('❌ Ошибка загрузки курсов:', err)
  } finally {
    isLoading.value = false
  }
}

// Навигация
const openCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

// Вспомогательные функции
const getCourseTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'FREE': 'Бесплатный',
    'PAID': 'Платный',
    'VIDEO': 'Видеокурс'
  }
  return typeMap[type] || type
}

const getAccessLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    'BASIC': 'Для стажеров',
    'ADVANCED': 'Для мастеров', 
    'ALL': 'Для всех'
  }
  return levelMap[level] || level
}

const getRoleDisplayText = (role: string): string => {
  const roleMap: Record<string, string> = {
    'TRAINEE': 'Стажер',
    'MASTER': 'Мастер',
    'INSTRUCTOR': 'Инструктор'
  }
  return roleMap[role] || role
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Инициализация
onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.courses-page {
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

/* Состояния */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8C4CC3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #e74c3c;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.retry-button {
  margin-top: 16px;
  padding: 10px 20px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Статистика и информация о роли */
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat {
  font-weight: 600;
  color: #8C4CC3;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.role-badge.trainee {
  background: #3498db;
}

.role-badge.master {
  background: #9b59b6;
}

.role-badge.instructor {
  background: #e74c3c;
}

/* Сетка курсов */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.course-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Обложка курса */
.course-cover {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #8C4CC3, #6A3093);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: white;
}

.course-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.course-type-badge.free {
  background: #4CAF50;
}

.course-type-badge.paid {
  background: #FF6B6B;
}

.course-type-badge.video {
  background: #2196F3;
}

.access-level-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.7);
}

/* Контент карточки */
.course-content {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.course-description {
  color: #666;
  line-height: 1.4;
  margin-bottom: 16px;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Футер карточки */
.course-footer {
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.view-course-btn {
  width: 100%;
  padding: 12px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.view-course-btn:hover {
  background: #7b3fb3;
}

/* Адаптивность */
@media (max-width: 768px) {
  .courses-page {
    padding: 16px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>