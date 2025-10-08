<template>
  <div class="text-answers">
    <!-- Хедер -->
    <div class="page-header">
      <button @click="$router.back()" class="back-button">← Назад</button>
      <div>
        <h1>Текстовые ответы</h1>
        <p>Ответы студентов, требующие проверки</p>
      </div>
    </div>

    <!-- Панель фильтров -->
    <div class="filters-panel">
      <div class="filter-group">
        <label>Тип просмотра:</label>
        <select v-model="viewMode" class="filter-select">
          <option value="pending">На проверку</option>
          <option value="all">Все ответы</option>
          <option value="student">По студенту</option>
        </select>
      </div>

      <!-- Фильтр по студенту -->
      <div v-if="viewMode === 'student'" class="filter-group">
        <label>Студент:</label>
        <select v-model="selectedStudentId" class="filter-select" @change="onStudentChange">
          <option value="">Все студенты</option>
          <option v-for="student in uniqueStudents" :key="student.id" :value="student.id">
            {{ student.username }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Сортировка:</label>
        <select v-model="sortBy" class="filter-select">
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
      </div>
    </div>

    <!-- Состояния -->
    <div v-if="isLoading" class="state-message">
      <div class="spinner"></div>
      <p>Загрузка ответов...</p>
    </div>

    <div v-else-if="error" class="state-message error">
      <p>{{ error }}</p>
      <button @click="loadData" class="text-button">Повторить</button>
    </div>

    <div v-else-if="filteredAnswers.length === 0" class="state-message">
      <template v-if="viewMode === 'pending'">
        <p>🎉 Все ответы проверены!</p>
        <p class="subtext">Новых ответов на проверку нет</p>
      </template>
      <template v-else-if="viewMode === 'student' && selectedStudentId">
        <p>📝 У студента нет текстовых ответов</p>
      </template>
      <template v-else>
        <p>📝 Ответы не найдены</p>
      </template>
    </div>

    <!-- Статистика -->
    <div v-if="!isLoading && filteredAnswers.length > 0" class="stats-bar">
      <div class="stats">
        <span class="stat total">Всего: {{ filteredAnswers.length }}</span>
        <span v-if="viewMode !== 'pending'" class="stat pending">
          На проверке: {{ pendingCount }}
        </span>
        <span v-if="viewMode !== 'pending'" class="stat approved">
          Принято: {{ approvedCount }}
        </span>
        <span v-if="viewMode !== 'pending'" class="stat rejected">
          Отклонено: {{ rejectedCount }}
        </span>
      </div>
      
      <div v-if="selectedStudent" class="student-info">
        <strong>Студент:</strong> {{ selectedStudent.username }}
      </div>
    </div>

    <!-- Список ответов -->
    <div v-else-if="filteredAnswers.length > 0" class="answers-content">
      <div class="answers-list">
        <div
          v-for="answer in sortedAnswers"
          :key="answer.id"
          class="answer-card"
          :class="{ 
            'requires-review': answer.requires_review,
            'approved': !answer.requires_review && isAnswerApproved(answer),
            'rejected': !answer.requires_review && !isAnswerApproved(answer)
          }"
          @click="openReview(answer)"
        >
          <div class="answer-header">
            <h3>{{ answer.test.lesson_title }}</h3>
            <span class="test-title">{{ answer.test.title }}</span>
            <span class="status-badge" :class="getStatusClass(answer)">
              {{ getStatusText(answer) }}
            </span>
          </div>

          <div class="answer-preview">
            <p class="question">{{ answer.question.text }}</p>
            <p class="answer-text">{{ truncateText(answer.answer_text, 120) }}</p>
          </div>

          <div class="answer-meta">
            <span class="student">👤 {{ answer.user.username }}</span>
            <span class="date">📅 {{ formatDate(answer.created_at) }}</span>
            <span class="points">⭐ {{ answer.question.points }} баллов</span>
            <span v-if="!answer.requires_review" class="score">
              Оценка: {{ getAnswerScore(answer) }}/{{ answer.question.points }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно проверки (остается без изменений) -->
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInstructorStore } from '../../stores/instructorStore'
import type { TextAnswer, TextAnswerReviewData } from '../../types/api'

const router = useRouter()
const instructorStore = useInstructorStore()

// Состояния
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const sortBy = ref<'newest' | 'oldest'>('newest')
const selectedAnswer = ref<TextAnswer | null>(null)
const viewMode = ref<'pending' | 'all' | 'student'>('pending')
const selectedStudentId = ref<number | ''>('')

// Данные формы (остается без изменений)
const reviewData = ref<TextAnswerReviewData>({
  is_approved: true,
  score: 0,
  feedback: ''
})

// Computed свойства
const answers = computed(() => {
  switch (viewMode.value) {
    case 'pending':
      return instructorStore.pendingTextAnswers
    case 'all':
      return instructorStore.allTextAnswers || []
    case 'student':
      return instructorStore.studentTextAnswers || []
    default:
      return []
  }
})

// Уникальные студенты для фильтра
const uniqueStudents = computed(() => {
  const students = new Map()
  const allAnswers = instructorStore.allTextAnswers || []
  
  allAnswers.forEach(answer => {
    if (answer.user && !students.has(answer.user.id)) {
      students.set(answer.user.id, answer.user)
    }
  })
  
  return Array.from(students.values())
})

// Выбранный студент
const selectedStudent = computed(() => {
  if (!selectedStudentId.value) return null
  return uniqueStudents.value.find(student => student.id === selectedStudentId.value)
})

// Фильтрованные ответы
const filteredAnswers = computed(() => {
  let filtered = [...answers.value]
  
  // Если выбран конкретный студент в режиме "all"
  if (viewMode.value === 'all' && selectedStudentId.value) {
    filtered = filtered.filter(answer => answer.user.id === selectedStudentId.value)
  }
  
  return filtered
})

// Сортированные ответы
const sortedAnswers = computed(() => {
  const sorted = [...filteredAnswers.value]
  return sorted.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortBy.value === 'newest' ? dateB - dateA : dateA - dateB
  })
})

// Статистика
const pendingCount = computed(() => 
  filteredAnswers.value.filter(answer => answer.requires_review).length
)

const approvedCount = computed(() => 
  filteredAnswers.value.filter(answer => !answer.requires_review && isAnswerApproved(answer)).length
)

const rejectedCount = computed(() => 
  filteredAnswers.value.filter(answer => !answer.requires_review && !isAnswerApproved(answer)).length
)

// Загрузка данных
const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    switch (viewMode.value) {
      case 'pending':
        await instructorStore.loadPendingTextAnswers()
        break
      case 'all':
        await instructorStore.loadAllTextAnswers()
        break
      case 'student':
        if (selectedStudentId.value) {
          await instructorStore.loadStudentTextAnswers(selectedStudentId.value)
        }
        break
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки ответов'
  } finally {
    isLoading.value = false
  }
}

// Обработчик изменения студента
const onStudentChange = () => {
  if (viewMode.value === 'student' && selectedStudentId.value) {
    loadData()
  }
}

// Открытие модального окна (без изменений)
const openReview = (answer: TextAnswer) => {
  selectedAnswer.value = answer
  reviewData.value = {
    is_approved: true,
    score: answer.question.points,
    feedback: ''
  }
}

// Закрытие модального окна (без изменений)
const closeModal = () => {
  selectedAnswer.value = null
  reviewData.value = {
    is_approved: true,
    score: 0,
    feedback: ''
  }
}

// Отправка оценки (без изменений)
const submitReview = async () => {
  if (!selectedAnswer.value) return

  try {
    isSubmitting.value = true
    await instructorStore.reviewTextAnswer(selectedAnswer.value.id, reviewData.value)
    closeModal()
    await loadData() // Перезагружаем данные после проверки
  } catch (err: any) {
    error.value = err.message || 'Ошибка сохранения оценки'
  } finally {
    isSubmitting.value = false
  }
}

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const isAnswerApproved = (answer: any): boolean => {
  // Предполагаем, что у ответа есть поле is_approved после проверки
  return answer.is_approved === true
}

const getAnswerScore = (answer: any): number => {
  // Предполагаем, что у ответа есть поле score после проверки
  return answer.score || 0
}

const getStatusText = (answer: TextAnswer): string => {
  if (answer.requires_review) return 'На проверке'
  return isAnswerApproved(answer) ? 'Принято' : 'Отклонено'
}

const getStatusClass = (answer: TextAnswer): string => {
  if (answer.requires_review) return 'pending'
  return isAnswerApproved(answer) ? 'approved' : 'rejected'
}

// Наблюдатели
watch(viewMode, (newMode) => {
  selectedStudentId.value = '' // Сбрасываем выбор студента при смене режима
  loadData()
})

watch([sortBy], () => {
  // Просто обновляем сортировку, не перезагружая данные
})

// Инициализация
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Существующие стили остаются */

/* Панель фильтров */
.filters-panel {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  min-width: 150px;
}

/* Статистика */
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 16px;
}

.stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.stat.total { background: #e3f2fd; color: #1976d2; }
.stat.pending { background: #fff3e0; color: #f57c00; }
.stat.approved { background: #e8f5e8; color: #2e7d32; }
.stat.rejected { background: #ffebee; color: #c62828; }

.student-info {
  font-size: 14px;
  color: #666;
}

/* Статус-баджи в карточках */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.approved {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.rejected {
  background: #ffebee;
  color: #c62828;
}

/* Стили карточек по статусу */
.answer-card.requires-review {
  border-left: 4px solid #ffa726;
}

.answer-card.approved {
  border-left: 4px solid #4caf50;
}

.answer-card.rejected {
  border-left: 4px solid #f44336;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.answer-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.test-title {
  color: #666;
  font-size: 14px;
}

.answer-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
}

.score {
  font-weight: 600;
  color: #8C4CC3;
}

/* Адаптивность */
@media (max-width: 768px) {
  .filters-panel {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .answer-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .answer-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>