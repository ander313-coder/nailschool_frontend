<template>
  <div class="homework-review">
    <!-- Минималистичный хедер -->
    <div class="page-header">
      <button @click="$router.back()" class="back-button">← Назад</button>
      <h1>Проверка ДЗ</h1>
    </div>

    <!-- Состояния -->
    <div v-if="isLoading" class="state-message">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="state-message error">
      <p>{{ error }}</p>
      <button @click="loadHomework" class="text-button">Повторить</button>
    </div>

    <div v-else-if="!homework" class="state-message">
      <p>ДЗ не найдено</p>
      <button @click="$router.back()" class="text-button">Назад</button>
    </div>

    <!-- Основной контент -->
    <div v-else class="review-content">
      <!-- Краткая информация -->
      <div class="homework-meta">
        <h2>{{ getLessonTitle(homework) }}</h2>
        <div class="meta-grid">
          <span class="meta-item">👤 {{ getUserName(homework) }}</span>
          <span class="meta-item">📚 {{ getCourseTitle(homework) }}</span>
          <span class="meta-item">📅 {{ formatDate(homework.created_at) }}</span>
          <span class="meta-item status" :class="homework.status.toLowerCase()">
            {{ getStatusDisplay(homework.status) }}
          </span>
        </div>
      </div>

      <!-- Комментарий студента -->
      <div v-if="homework.comment" class="comment-block">
        <h3>Комментарий студента</h3>
        <p>{{ homework.comment }}</p>
      </div>

      <!-- Файлы -->
      <div v-if="homework.files?.length" class="files-block">
        <h3>Файлы ({{ homework.files.length }})</h3>
        <div class="files-list">
          <div 
            v-for="file in homework.files" 
            :key="file.id"
            class="file-item"
            @click="openFile(file.file)"
          >
            <span class="file-name">{{ getFileName(file.file) }}</span>
            <button @click.stop="downloadFile(file.file)" class="icon-button">📥</button>
          </div>
        </div>
      </div>

      <!-- Форма проверки -->
      <div class="review-form">
        <h3>Результат проверки</h3>
        
        <div class="status-options">
          <button
            @click="reviewData.status = 'APPROVED'"
            :class="['status-btn', { active: reviewData.status === 'APPROVED' }]"
          >
            ✅ Принять
          </button>
          <button
            @click="reviewData.status = 'REJECTED'"
            :class="['status-btn', { active: reviewData.status === 'REJECTED' }]"
          >
            ❌ На доработку
          </button>
        </div>

        <div class="comment-field">
          <textarea 
            v-model="reviewData.instructor_comment"
            placeholder="Комментарий для студента..."
            rows="4"
          ></textarea>
        </div>

        <div class="actions">
          <button 
            @click="submitReview" 
            :disabled="isSubmitting || !reviewData.instructor_comment.trim()"
            class="primary-btn"
          >
            {{ isSubmitting ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <button @click="$router.back()" class="secondary-btn">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInstructorStore } from '../../stores/instructorStore'
import type { Homework, HomeworkReviewData } from '../../types/api'

const route = useRoute()
const router = useRouter()
const instructorStore = useInstructorStore()

// Состояния
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const homework = ref<Homework | null>(null)

// Данные формы
const reviewData = ref<HomeworkReviewData>({
  status: 'APPROVED',
  instructor_comment: ''
})

// Получаем ID ДЗ
const homeworkId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : Array.isArray(id) ? parseInt(id[0]) : id
})

// Вспомогательные функции
const getUserName = (hw: Homework): string => {
  return hw.user && typeof hw.user === 'object' ? hw.user.username : 'Неизвестный студент'
}

const getLessonTitle = (hw: Homework): string => {
  return hw.lesson && typeof hw.lesson === 'object' ? hw.lesson.title : `Урок #${hw.lesson}`
}

const getCourseTitle = (hw: Homework): string => {
  return hw.lesson && typeof hw.lesson === 'object' && hw.lesson.course 
    ? hw.lesson.course.title 
    : 'Без курса'
}

// Загрузка данных
const loadHomework = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    await instructorStore.loadAllHomeworks()
    const foundHomework = instructorStore.allHomeworks.find(hw => hw.id === homeworkId.value)
    
    if (foundHomework) {
      homework.value = foundHomework
      reviewData.value.instructor_comment = foundHomework.instructor_comment || ''
      if (foundHomework.status !== 'PENDING') {
        reviewData.value.status = foundHomework.status as 'APPROVED' | 'REJECTED'
      }
    } else {
      error.value = `ДЗ с ID ${homeworkId.value} не найдено`
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки'
  } finally {
    isLoading.value = false
  }
}

// Отправка проверки
const submitReview = async () => {
  if (!homework.value || !reviewData.value.instructor_comment.trim()) return
  
  try {
    isSubmitting.value = true
    await instructorStore.reviewHomework(homework.value.id, reviewData.value)
    router.push('/instructor/homeworks')
  } catch (err: any) {
    error.value = err.message || 'Ошибка сохранения'
  } finally {
    isSubmitting.value = false
  }
}

// Утилиты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getStatusDisplay = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'На проверке',
    'APPROVED': 'Принято', 
    'REJECTED': 'На доработку'
  }
  return statusMap[status] || status
}

const getFileName = (filePath: string) => {
  return filePath.split('/').pop() || 'Файл'
}

const openFile = (filePath: string) => {
  window.open(filePath, '_blank')
}

const downloadFile = (filePath: string) => {
  const link = document.createElement('a')
  link.href = filePath
  link.download = getFileName(filePath)
  link.click()
}

// Инициализация
onMounted(() => {
  loadHomework()
})
</script>

<style scoped>
.homework-review {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Хедер */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-button {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

/* Состояния */
.state-message {
  text-align: center;
  padding: 60px 20px;
}

.state-message.error {
  color: #e74c3c;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #8C4CC3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.text-button {
  background: none;
  border: none;
  color: #8C4CC3;
  cursor: pointer;
  margin-top: 8px;
}

/* Основной контент */
.review-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Мета-информация */
.homework-meta h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.meta-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.meta-item.status {
  font-weight: 600;
}

.status.pending { color: #f39c12; background: #fef5e6; }
.status.approved { color: #27ae60; background: #e8f6f3; }
.status.rejected { color: #e74c3c; background: #fdedec; }

/* Блоки контента */
.comment-block,
.files-block,
.review-form,
.homework-meta {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.comment-block h3,
.files-block h3,
.review-form h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

/* Файлы */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.file-item:hover {
  background: #e9ecef;
}

.file-name {
  flex: 1;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.icon-button:hover {
  background: #dee2e6;
}

/* Форма проверки */
.status-options {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.status-btn {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn.active {
  border-color: #8C4CC3;
  background: #f3f0ff;
}

.comment-field textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 20px;
}

.comment-field textarea:focus {
  outline: none;
  border-color: #8C4CC3;
}

/* Кнопки действий */
.actions {
  display: flex;
  gap: 12px;
}

.primary-btn {
  flex: 1;
  padding: 12px 24px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.primary-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.secondary-btn {
  padding: 12px 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

/* Адаптивность */
@media (max-width: 768px) {
  .homework-review {
    padding: 16px;
  }
  
  .meta-grid {
    grid-template-columns: 1fr;
  }
  
  .status-options {
    flex-direction: column;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>