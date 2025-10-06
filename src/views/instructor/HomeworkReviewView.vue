<template>
  <div class="homework-review">
    <!-- Хедер страницы -->
    <div class="page-header">
      <div class="header-content">
        <button @click="$router.back()" class="back-button">← Назад</button>
        <h1>Проверка домашнего задания</h1>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <p>Загрузка домашнего задания...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error-state">
      <p>Ошибка: {{ error }}</p>
      <button @click="loadHomework" class="retry-button">Попробовать снова</button>
    </div>

    <!-- Основной контент -->
    <div v-else-if="homework" class="review-content">
      <!-- Информация о ДЗ -->
      <div class="homework-info-card">
        <div class="info-section">
          <h2>{{ homework.lesson.title }}</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Студент:</strong>
              <span>{{ homework.user.username }}</span>
            </div>
            <div class="info-item">
              <strong>Курс:</strong>
              <span>{{ homework.lesson.course.title }}</span>
            </div>
            <div class="info-item">
              <strong>Отправлено:</strong>
              <span>{{ formatDate(homework.created_at) }}</span>
            </div>
            <div class="info-item">
              <strong>Статус:</strong>
              <span class="status-badge" :class="homework.status.toLowerCase()">
                {{ getStatusDisplay(homework.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Комментарий студента -->
        <div class="student-comment" v-if="homework.comment">
          <h3>Комментарий студента:</h3>
          <div class="comment-text">{{ homework.comment }}</div>
        </div>
      </div>

      <!-- Файлы ДЗ -->
      <div class="files-section" v-if="homework.files.length > 0">
        <h3>Прикрепленные файлы ({{ homework.files.length }})</h3>
        <div class="files-grid">
          <div 
            v-for="file in homework.files" 
            :key="file.id"
            class="file-card"
            @click="openFile(file.file)"
          >
            <div class="file-icon">📎</div>
            <div class="file-info">
              <div class="file-name">{{ getFileName(file.file) }}</div>
              <div class="file-date">{{ formatDate(file.uploaded_at) }}</div>
            </div>
            <button class="download-btn" @click.stop="downloadFile(file.file)">
              📥
            </button>
          </div>
        </div>
      </div>

      <!-- Форма проверки -->
      <div class="review-form">
        <h3>Результат проверки</h3>
        
        <div class="form-group">
          <label>Статус проверки:</label>
          <div class="status-options">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="reviewData.status" 
                value="APPROVED"
              >
              <span class="radio-label approved">✅ Принять работу</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="reviewData.status" 
                value="REJECTED"
              >
              <span class="radio-label rejected">❌ Отправить на доработку</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="instructor_comment">Комментарий преподавателя:</label>
          <textarea 
            id="instructor_comment"
            v-model="reviewData.instructor_comment"
            placeholder="Напишите комментарий к работе... Укажите что понравилось, что можно улучшить, какие ошибки были допущены."
            rows="6"
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            @click="submitReview" 
            :disabled="isSubmitting"
            class="submit-button"
          >
            {{ isSubmitting ? 'Сохранение...' : 'Сохранить результат' }}
          </button>
          <button 
            @click="$router.back()" 
            class="cancel-button"
          >
            Отмена
          </button>
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

const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const homework = ref<Homework | null>(null)

const reviewData = ref<HomeworkReviewData>({
  status: 'APPROVED',
  instructor_comment: ''
})

// Получаем ID домашнего задания из URL
const homeworkId = computed(() => parseInt(route.params.id as string))

// Загружаем данные ДЗ
const loadHomework = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Загружаем все ДЗ и находим нужное
    await instructorStore.loadAllHomeworks()
    const foundHomework = instructorStore.allHomeworks.find(hw => hw.id === homeworkId.value)
    
    if (foundHomework) {
      homework.value = foundHomework
      // Заполняем форму текущими данными
      reviewData.value.instructor_comment = foundHomework.instructor_comment || ''
      if (foundHomework.status !== 'PENDING') {
        reviewData.value.status = foundHomework.status as 'APPROVED' | 'REJECTED'
      }
    } else {
      error.value = 'Домашнее задание не найдено'
    }
  } catch (err: any) {
    error.value = err.message || 'Не удалось загрузить домашнее задание'
    console.error('❌ Ошибка загрузки ДЗ:', err)
  } finally {
    isLoading.value = false
  }
}

// Отправляем результат проверки
const submitReview = async () => {
  try {
    isSubmitting.value = true
    error.value = null
    
    if (!reviewData.value.instructor_comment.trim()) {
      error.value = 'Пожалуйста, напишите комментарий к работе'
      return
    }
    
    await instructorStore.reviewHomework(homeworkId.value, reviewData.value)
    
    // Показываем уведомление об успехе
    alert('Результат проверки сохранен!')
    
    // Возвращаемся к списку ДЗ
    router.push('/instructor/homeworks')
    
  } catch (err: any) {
    error.value = err.message || 'Не удалось сохранить результат проверки'
    console.error('❌ Ошибка сохранения проверки:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

// Загружаем данные при монтировании
onMounted(() => {
  loadHomework()
})
</script>

<style scoped>
.homework-review {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  background: #5a6268;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.homework-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.info-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item strong {
  font-size: 14px;
  color: #666;
}

.info-item span {
  font-size: 16px;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #FFF3CD;
  color: #856404;
}

.status-badge.approved {
  background: #D4EDDA;
  color: #155724;
}

.status-badge.rejected {
  background: #F8D7DA;
  color: #721C24;
}

.student-comment {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.student-comment h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.comment-text {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #8C4CC3;
  line-height: 1.5;
  color: #333;
}

.files-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.files-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.files-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  gap: 12px;
}

.file-card:hover {
  background: #e9ecef;
}

.file-icon {
  font-size: 20px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.file-date {
  font-size: 12px;
  color: #666;
}

.download-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #dee2e6;
}

.review-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.review-form h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #8C4CC3;
}

.radio-option input[type="radio"] {
  margin: 0;
}

.radio-label {
  font-weight: 600;
}

.radio-label.approved {
  color: #155724;
}

.radio-label.rejected {
  color: #721C24;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #8C4CC3;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.submit-button {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #7b3fb3;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-button:hover {
  background: #5a6268;
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
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .status-options {
    gap: 8px;
  }
}
</style>