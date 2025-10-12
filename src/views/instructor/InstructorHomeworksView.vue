<template>
  <div class="instructor-homeworks">
    <!-- Заголовок страницы -->
    <div class="page-header">
      <h1>Проверка домашних заданий</h1>
      <p>Домашние задания, ожидающие вашей проверки</p>
    </div>
    <!-- Статистика по статусам -->
    <div class="stats-cards">
      <div class="stat-card" :class="getStatusClass('ALL')" @click="setFilter('ALL')">
        <div class="stat-number">{{ totalHomeworks }}</div>
        <div class="stat-label">Всего ДЗ</div>
      </div>
      <div class="stat-card" :class="getStatusClass('PENDING')" @click="setFilter('PENDING')">
        <div class="stat-number">{{ pendingCount }}</div>
        <div class="stat-label">На проверке</div>
      </div>
      <div class="stat-card" :class="getStatusClass('APPROVED')" @click="setFilter('APPROVED')">
        <div class="stat-number">{{ approvedCount }}</div>
        <div class="stat-label">Принято</div>
      </div>
      <div class="stat-card" :class="getStatusClass('REJECTED')" @click="setFilter('REJECTED')">
        <div class="stat-number">{{ rejectedCount }}</div>
        <div class="stat-label">На доработку</div>
      </div>
    </div>

    <!-- Панель фильтров и поиска -->
    <div class="filters-panel">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по ученику или уроку..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="ALL">Все статусы</option>
          <option value="PENDING">На проверке</option>
          <option value="APPROVED">Принято</option>
          <option value="REJECTED">На доработку</option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
        
        <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '🔄' : '🔄 Обновить' }}
        </button>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загружаем домашние задания...</p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="loadHomeworks" class="retry-btn">Повторить попытку</button>
    </div>

    <!-- Состояние когда нет ДЗ -->
    <div v-else-if="filteredHomeworks.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>Нет домашних заданий</h3>
      <p v-if="searchQuery || statusFilter !== 'ALL'">
        Попробуйте изменить параметры поиска или фильтрации
      </p>
      <p v-else>Все домашние задания проверены! 🎉</p>
    </div>

    <!-- Список домашних заданий -->
    <div v-else class="homeworks-list">
      <div class="homeworks-count">
        Найдено: {{ filteredHomeworks.length }} домашних заданий
      </div>
      
      <div class="homework-cards">
        <div
          v-for="homework in filteredHomeworks"
          :key="homework.id"
          class="homework-card"
          :class="`status-${homework.status.toLowerCase()}`"
        >
          <!-- Заголовок карточки -->
          <div class="homework-header">
            <div class="homework-meta">
              <h3 class="lesson-title">{{ getHomeworkLessonTitle(homework) }}</h3>
              <p class="course-name">{{ getHomeworkCourseTitle(homework) }}</p>
            </div>
            <div class="homework-status">
              <span class="status-badge" :class="`status-${homework.status.toLowerCase()}`">
                {{ getStatusText(homework.status) }}
              </span>
            </div>
          </div>

          <!-- Информация о студенте -->
          <div class="student-info">
            <div class="student-avatar">
              {{ getStudentInitial(homework) }}
            </div>
            <div class="student-details">
              <p class="student-name">{{ getHomeworkUserName(homework) }}</p>
              <p class="submission-date">
                📅 {{ formatDate(homework.created_at) }}
              </p>
            </div>
          </div>

          <!-- Комментарий студента -->
          <div v-if="homework.comment" class="student-comment">
            <strong>Комментарий студента:</strong>
            <p class="comment-text">{{ homework.comment }}</p>
          </div>

          <!-- Файлы -->
          <div v-if="homework.files && homework.files.length > 0" class="homework-files">
            <strong>Прикрепленные файлы ({{ homework.files.length }}):</strong>
            <div class="files-list">
              <div 
                v-for="file in homework.files" 
                :key="file.id"
                class="file-item"
                @click="openFile(getFileUrl(file.file))"
              >
                <div class="file-icon">📎</div>
                <div class="file-info">
                  <div class="file-name">{{ getFileName(file.file) }}</div>
                  <div class="file-date">{{ formatDate(file.uploaded_at) }}</div>
                </div>
                <button class="download-btn" @click.stop="downloadFile(getFileUrl(file.file))">
                  📥
                </button>
              </div>
            </div>
          </div>

          <!-- Действия -->
          <div class="homework-actions">
            <button
              @click="goToReview(homework.id)"
              class="action-btn primary"
              :class="{ 'urgent': homework.status === 'PENDING' }"
            >
              {{ homework.status === 'PENDING' ? '🔍 Проверить' : '👀 Просмотреть' }}
            </button>
            
            <button
              v-if="homework.status !== 'PENDING'"
              @click="goToReview(homework.id)"
              class="action-btn secondary"
            >
              📋 Детали
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInstructorStore } from '../../stores/instructorStore'
import { useCoursesStore } from '../../stores/courses'
import type { Homework, HomeworkStatus } from '@/types/api'

const router = useRouter()
const instructorStore = useInstructorStore()
const coursesStore = useCoursesStore()

// Реактивные данные
const searchQuery = ref('')
const statusFilter = ref<HomeworkStatus | 'ALL'>('ALL')
const sortBy = ref<'newest' | 'oldest'>('newest')

// Computed свойства
const isLoading = computed(() => instructorStore.isLoading)
const error = computed(() => instructorStore.error)
const allHomeworks = computed(() => instructorStore.allHomeworks)

// Статистика
const totalHomeworks = computed(() => allHomeworks.value.length)
const pendingCount = computed(() => 
  allHomeworks.value.filter(hw => hw.status === 'PENDING').length
)
const approvedCount = computed(() => 
  allHomeworks.value.filter(hw => hw.status === 'APPROVED').length
)
const rejectedCount = computed(() => 
  allHomeworks.value.filter(hw => hw.status === 'REJECTED').length
)

// Фильтрация и поиск
const filteredHomeworks = computed(() => {
  let filtered = [...allHomeworks.value]

  // Фильтрация по статусу
  if (statusFilter.value !== 'ALL') {
    filtered = filtered.filter(hw => hw.status === statusFilter.value)
  }

  // Поиск
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(hw => {
      const userName = getHomeworkUserName(hw).toLowerCase()
      const lessonTitle = getHomeworkLessonTitle(hw).toLowerCase()
      const courseTitle = getHomeworkCourseTitle(hw).toLowerCase()
      
      return userName.includes(query) || 
             lessonTitle.includes(query) || 
             courseTitle.includes(query)
    })
  }

  // Сортировка
  filtered.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortBy.value === 'newest' ? dateB - dateA : dateA - dateB
  })

  return filtered
})

// Методы для работы с файлами
const openFile = (fileUrl: string) => {
  console.log('🔗 Открываем файл:', fileUrl)
  if (fileUrl) {
    window.open(fileUrl, '_blank')
  }
}

const downloadFile = (fileUrl: string) => {
  console.log('📥 Скачиваем файл:', fileUrl)
  if (fileUrl) {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = getFileName(fileUrl)
    link.click()
  }
}

// Методы
const loadHomeworks = async () => {
  try {
    await instructorStore.loadAllHomeworks()
    await coursesStore.fetchUserCourses()
    console.log('✅ Домашние задания загружены')
  } catch (err: any) {
    console.error('❌ Ошибка загрузки ДЗ:', err)
  }
}

const refreshData = () => {
  loadHomeworks()
}

const goToReview = (homeworkId: number) => {
  router.push(`/instructor/homeworks/${homeworkId}`)
}

const setFilter = (status: HomeworkStatus | 'ALL') => {
  statusFilter.value = status
}

// Вспомогательные методы
const getStatusText = (status: HomeworkStatus): string => {
  const statusMap = {
    PENDING: 'На проверке',
    APPROVED: 'Принято',
    REJECTED: 'На доработку'
  }
  return statusMap[status]
}

const getStatusClass = (status: string) => {
  return {
    active: statusFilter.value === status,
    'status-pending': status === 'PENDING',
    'status-approved': status === 'APPROVED',
    'status-rejected': status === 'REJECTED'
  }
}

const getHomeworkUserName = (homework: Homework): string => {
  console.log('👤 Homework user structure:', homework.user)
  
  // Если user undefined или null, возвращаем заглушку
  if (!homework.user) {
    return 'Студент #' + (homework.id || '?')
  }
  
  if (typeof homework.user === 'object') {
    return (homework.user.first_name) + " " + (homework.user.last_name) || `Студент ${homework.user.id}`
  }
  
  return 'Неизвестный студент'
}

const getHomeworkLessonTitle = (homework: Homework): string => {
  console.log('📚 Homework lesson structure:', homework.lesson)
  
  // Если lesson - это объект с названием
  if (typeof homework.lesson === 'object' && homework.lesson !== null) {
    return homework.lesson.title || `Урок ${homework.lesson.id}`
  }
  
  // Если lesson - это просто ID
  return `Урок ${homework.lesson}`
}

const getHomeworkCourseTitle = (homework: Homework): string => {
  console.log('🎓 Homework course structure:', homework)

  if (homework.course_title) {
    console.log('✅ Найден course_title:', homework.course_title)
    return homework.course_title
  }
  
  console.log('❌ Курс не найден в данных')
  return 'Курс не указан'
}

const getStudentInitial = (homework: Homework): string => {
  const userName = getHomeworkUserName(homework)
  return userName.charAt(0).toUpperCase()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getFileName = (filePath: string): string => {
  console.log('📎 File path:', filePath)
  
  if (!filePath) return 'Файл'
  
  // Обрабатываем разные форматы путей
  const fileName = filePath.split('/').pop() || 'Файл'
  console.log('📎 Extracted file name:', fileName)
  return fileName
}

// Функция для получения полного URL файла
const getFileUrl = (filePath: string): string => {
  if (!filePath) return ''
  
  // Если это уже полный URL
  if (filePath.startsWith('http')) {
    return filePath
  }
  
  // Если это относительный путь, добавляем базовый URL
  const baseUrl = 'http://localhost:8000'
  
  // Убираем лишние слеши
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`
  
  return `${baseUrl}${cleanPath}`
}

const testFileAccess = async (file: any) => {
  console.log('🧪 Тестируем доступ к файлу:', file)
  
  try {
    // Пробуем разные варианты URL
    const possibleUrls = [
      file.file,
      file.url,
      `/media/${file.file}`,
      `http://localhost:8000${file.file}`,
      `http://localhost:8000/media/${file.file}`
    ]
    
    for (const url of possibleUrls) {
      if (!url) continue
      
      console.log(`🔗 Пробуем URL: ${url}`)
      const response = await fetch(url, { method: 'HEAD' })
      if (response.ok) {
        console.log(`✅ Файл доступен по URL: ${url}`)
        window.open(url, '_blank')
        return
      }
    }
    
    console.log('❌ Ни один URL не сработал')
  } catch (error) {
    console.error('❌ Ошибка доступа к файлу:', error)
  }
}

// Загрузка данных при монтировании
onMounted(() => {
  loadHomeworks()
})

// Наблюдатели
watch([searchQuery, statusFilter, sortBy], () => {
  console.log('🔍 Параметры фильтрации изменены:', {
    search: searchQuery.value,
    status: statusFilter.value,
    sort: sortBy.value
  })
})
</script>

<style scoped>
.instructor-homeworks {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
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

/* Карточки статистики */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-card.active {
  border-color: #8C4CC3;
}

.stat-card.status-pending.active {
  border-color: #FFA726;
}

.stat-card.status-approved.active {
  border-color: #4CAF50;
}

.stat-card.status-rejected.active {
  border-color: #FF6B6B;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-card:first-child .stat-number { color: #8C4CC3; }
.stat-card.status-pending .stat-number { color: #FFA726; }
.stat-card.status-approved .stat-number { color: #4CAF50; }
.stat-card.status-rejected .stat-number { color: #FF6B6B; }

.stat-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* Панель фильтров */
.filters-panel {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #8C4CC3;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.refresh-btn {
  padding: 12px 20px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #7b3fb3;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Состояния */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
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

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Список ДЗ */
.homeworks-count {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.homework-cards {
  display: grid;
  gap: 20px;
}

.homework-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #8C4CC3;
  transition: all 0.3s ease;
}

.homework-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.homework-card.status-pending {
  border-left-color: #FFA726;
}

.homework-card.status-approved {
  border-left-color: #4CAF50;
}

.homework-card.status-rejected {
  border-left-color: #FF6B6B;
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.lesson-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.course-name {
  color: #666;
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #FFF3E0;
  color: #FFA726;
}

.status-badge.status-approved {
  background: #E8F5E8;
  color: #4CAF50;
}

.status-badge.status-rejected {
  background: #FFEBEE;
  color: #FF6B6B;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  background: #8C4CC3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.student-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.submission-date {
  color: #666;
  font-size: 12px;
}

.student-comment,
.homework-files {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.comment-text {
  margin-top: 8px;
  color: #555;
  line-height: 1.4;
}

.files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.file-tag {
  padding: 4px 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.homework-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #8C4CC3;
  color: white;
}

.action-btn.primary:hover {
  background: #7b3fb3;
}

.action-btn.primary.urgent {
  background: #FFA726;
}

.action-btn.primary.urgent:hover {
  background: #ff9800;
}

.action-btn.secondary {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.secondary:hover {
  background: #f5f5f5;
}

/* Адаптивность */
@media (max-width: 768px) {
  .instructor-homeworks {
    padding: 16px;
  }
  
  .filters-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .homework-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .homework-actions {
    flex-direction: column;
  }
}
</style>