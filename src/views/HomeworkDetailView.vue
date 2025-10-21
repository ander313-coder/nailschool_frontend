<template>
  <div class="homework-detail">
    <!-- Заголовок -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">← Назад</button>
      <h2>{{ homeworkData?.lesson_title || 'Загрузка...' }}</h2>
      <span v-if="homeworkData" class="status" :class="homeworkData.status">{{ statusText }}</span>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading">
      <p>Загрузка...</p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadHomework">Повторить</button>
    </div>

    <!-- Основной контент -->
    <div v-else-if="homeworkData" class="content">
      <!-- Файлы студента -->
      <div class="files-section">
        <h3>Работа студента</h3>
        <div v-if="homeworkData.files.length === 0" class="no-files">
          <p>Файлы не прикреплены</p>
        </div>
        <div v-else>
          <div v-for="file in homeworkData.files" :key="file.id" class="file-item">
            <a :href="file.file" target="_blank" class="file-link">
              📎 {{ fileName(file.file) }}
            </a>
          </div>
        </div>
      </div>

      <!-- Комментарий студента -->
      <div v-if="homeworkData.comment" class="student-comment">
        <h3>Комментарий студента</h3>
        <p>{{ homeworkData.comment }}</p>
      </div>

      <!-- Комментарий преподавателя -->
      <div v-if="homeworkData.instructor_comment" class="instructor-feedback">
        <h3>Комментарий преподавателя</h3>
        <p>{{ homeworkData.instructor_comment }}</p>
      </div>
      <!-- Форма доработки -->
      <div v-if="homeworkData.status === 'REJECTED'" class="resubmit-form">
        <h3>Отправить доработанную работу</h3>
        <textarea 
          v-model="comment" 
          placeholder="Комментарий к доработке (необязательно)"
          rows="3"
        ></textarea>
        <input 
          type="file" 
          multiple 
          @change="handleFiles" 
          ref="fileInput"
          class="file-input"
        >
        <button 
          @click="submitRevision" 
          :disabled="!hasFiles || isSubmitting"
          class="submit-btn"
        >
          {{ isSubmitting ? 'Отправка...' : 'Отправить на проверку' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHomeworkStore } from '@/stores/homeworkStore'
import type { Homework, HomeworkSubmission } from '@/types/api'

const route = useRoute()
const homeworkStore = useHomeworkStore()
const fileInput = ref<HTMLInputElement>()
const comment = ref('')
const files = ref<File[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const homeworkData = ref<Homework | null>(null)

const homeworkId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : 0
})

// Загрузка данных
const loadHomework = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await homeworkStore.fetchHomeworkById(homeworkId.value)
    homeworkData.value = data
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки домашнего задания'
    console.error('Ошибка загрузки ДЗ:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHomework()
})

const statusText = computed(() => {
  if (!homeworkData.value) return ''
  const statusMap: Record<string, string> = {
    'PENDING': 'На проверке',
    'APPROVED': 'Принято', 
    'REJECTED': 'На доработку'
  }
  return statusMap[homeworkData.value.status] || homeworkData.value.status
})

const hasFiles = computed(() => files.value.length > 0)

const handleFiles = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

const submitRevision = async () => {
  if (!homeworkData.value || !hasFiles.value) return

  isSubmitting.value = true
  try {
    const submission: HomeworkSubmission = {
      lesson_id: typeof homeworkData.value.lesson === 'number' 
        ? homeworkData.value.lesson 
        : homeworkData.value.lesson.id,
      comment: comment.value,
      files: files.value
    }
    
    await homeworkStore.createOrUpdateHomework(submission)
    
    // Очищаем форму и обновляем данные
    comment.value = ''
    files.value = []
    if (fileInput.value) fileInput.value.value = ''
    
    // Перезагружаем данные
    await loadHomework()
  } catch (err: any) {
    error.value = err.message || 'Ошибка при отправке'
    console.error('Ошибка при отправке:', err)
  } finally {
    isSubmitting.value = false
  }
}

const fileName = (path: string) => {
  try {
    return decodeURIComponent(path.split('/').pop() || 'Файл')
  } catch {
    return path.split('/').pop() || 'Файл'
  }
}
</script>

<style scoped>
.homework-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #8C4CC3;
  padding: 8px 0;
}

.back-btn:hover {
  color: #7a3aaf;
}

.header h1 {
  margin: 0;
  color: #333;
  flex: 1;
  min-width: 200px;
}

.status {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.status.PENDING { 
  background: #fff3cd; 
  color: #856404; 
}

.status.APPROVED { 
  background: #d1edff; 
  color: #0c5460; 
}

.status.REJECTED { 
  background: #f8d7da; 
  color: #721c24; 
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.error button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.content > div {
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.content h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.file-item {
  margin: 8px 0;
}

.file-link {
  color: #8C4CC3;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.no-files {
  color: #666;
  font-style: italic;
}

.student-comment {
  background: #f8f9fa;
}

.instructor-feedback {
  background: #e7f3ff;
  border-left: 4px solid #8C4CC3;
}

.resubmit-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 16px;
}

.file-input {
  width: 100%;
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-btn {
  padding: 12px 24px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #7a3aaf;
}
</style>