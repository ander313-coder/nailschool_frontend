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
            {{ student.username || 'Неизвестный студент' }}
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
    <div v-else class="stats-bar">
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
    <div v-if="!isLoading && !error && filteredAnswers.length > 0" class="answers-content">
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
            <h3>{{ answer.test?.lesson_title || 'Без урока' }}</h3>
            <span class="test-title">{{ answer.test?.title || 'Без теста' }}</span>
            <span class="status-badge" :class="getStatusClass(answer)">
              {{ getStatusText(answer) }}
            </span>
          </div>

          <div class="answer-preview">
            <p class="question">{{ answer.question?.text || 'Без вопроса' }}</p>
            <p class="answer-text">{{ truncateText(answer.answer_text, 120) }}</p>
          </div>

          <div class="answer-meta">
            <span class="student">👤 {{ answer.user?.username || 'Неизвестный студент' }}</span>
            <span class="date">📅 {{ formatDate(answer.created_at) }}</span>
            <span class="points">⭐ {{ answer.question?.points || 0 }} баллов</span>
            <span v-if="!answer.requires_review" class="score">
              Оценка: {{ getAnswerScore(answer) }}/{{ answer.question?.points || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно проверки -->
    <div v-if="selectedAnswer" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Проверка ответа</h2>
          <button @click="closeModal" class="close-button">×</button>
        </div>

        <div class="modal-body">
          <!-- Информация о вопросе -->
          <div class="question-info">
            <h3>Вопрос:</h3>
            <p>{{ selectedAnswer.question?.text || 'Без вопроса' }}</p>
            <div class="question-meta">
              <span>Тест: {{ selectedAnswer.test?.title || 'Без теста' }}</span>
              <span>Урок: {{ selectedAnswer.test?.lesson_title || 'Без урока' }}</span>
              <span>Баллы: {{ selectedAnswer.question?.points || 0 }}</span>
            </div>
          </div>

          <!-- Ответ студента -->
          <div class="student-answer">
            <h3>Ответ студента:</h3>
            <div class="answer-content">
              <p>{{ selectedAnswer.answer_text || 'Нет ответа' }}</p>
            </div>
            <div class="student-info">
              <span>👤 {{ selectedAnswer.user?.username || 'Неизвестный студент' }}</span>
              <span>📅 {{ formatDate(selectedAnswer.created_at) }}</span>
            </div>
          </div>

          <!-- Форма проверки -->
          <div class="review-form">
            <h3>Оценка ответа</h3>
            <!-- ТОЛЬКО ввод баллов -->
            <div class="score-input">
              <label>Баллы (0-{{ selectedAnswer.question?.points || 0 }}):</label>
              <div class="score-controls">
                <input
                  type="number"
                  v-model.number="reviewData.score"
                  :max="selectedAnswer.question?.points || 0"
                  min="0"
                  class="score-field"
                  placeholder="Введите баллы"
                >
                <div class="score-hint">
                  Максимум: {{ selectedAnswer.question?.points || 0 }} баллов
                </div>
              </div>
              
              <!-- Визуальная подсказка о проходном балле -->
              <div v-if="selectedAnswer.question" class="passing-hint">
                <!-- 🔥 РАСЧЕТ ОБЩЕГО ПРОХОДНОГО БАЛЛА -->
                <div v-if="calculatePassingInfo(selectedAnswer).isCalculated">
                  <span v-if="calculatePassingInfo(selectedAnswer).willPass" class="hint-success">
                    ✅ Студент сдаст тест с этой оценкой
                  </span>
                  <span v-else class="hint-warning">
                    ⚠️ Для сдачи теста нужно ещё 
                    {{ calculatePassingInfo(selectedAnswer).neededPoints }} баллов
                  </span>
                </div>
                <span v-else class="hint-info">
                  ℹ️ Система определит результат теста автоматически
                </span>
              </div>
            </div>

            <div class="feedback-section">
              <label>Комментарий для студента (опционально):</label>
              <textarea
                v-model="reviewData.feedback"
                placeholder="Объясните оценку или дайте рекомендации..."
                rows="3"
                class="feedback-field"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            @click="submitReview"
            :disabled="isSubmitting || reviewData.score < 0 || reviewData.score > (selectedAnswer.question?.points || 0)"
            class="primary-btn"
          >
            {{ isSubmitting ? 'Сохранение...' : 'Сохранить оценку' }}
          </button>
          <button @click="closeModal" class="secondary-btn">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useInstructorStore } from '../../stores/instructorStore'
import type { TextAnswer } from '../../types/api'

const instructorStore = useInstructorStore()

// Состояния
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const sortBy = ref<'newest' | 'oldest'>('newest')
const selectedAnswer = ref<TextAnswer | null>(null)
const viewMode = ref<'pending' | 'all' | 'student'>('pending')
const selectedStudentId = ref<number | ''>('')

// Данные формы
const reviewData = ref({
  score: 0,
  feedback: ''
})

// Computed свойства с защитой от undefined
const answers = computed(() => {
  switch (viewMode.value) {
    case 'pending':
      return instructorStore.pendingTextAnswers || []
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

// Фильтрованные ответы с защитой
const filteredAnswers = computed(() => {
  let filtered = [...(answers.value || [])]
  
  // Если выбран конкретный студент в режиме "all"
  if (viewMode.value === 'all' && selectedStudentId.value) {
    filtered = filtered.filter(answer => 
      answer.user && answer.user.id === selectedStudentId.value
    )
  }
  
  return filtered
})

// Сортированные ответы с защитой
const sortedAnswers = computed(() => {
  const sorted = [...(filteredAnswers.value || [])]
  return sorted.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortBy.value === 'newest' ? dateB - dateA : dateA - dateB
  })
})

// Статистика с защитой
const pendingCount = computed(() => 
  (filteredAnswers.value || []).filter(answer => answer.requires_review).length
)

const approvedCount = computed(() => 
  (filteredAnswers.value || []).filter(answer => !answer.requires_review && isAnswerApproved(answer)).length
)

const rejectedCount = computed(() => 
  (filteredAnswers.value || []).filter(answer => !answer.requires_review && !isAnswerApproved(answer)).length
)

// Загрузка данных
const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    console.log(`🔄 Загрузка данных для режима: ${viewMode.value}`)
    
    switch (viewMode.value) {
      case 'pending':
        await instructorStore.loadPendingTextAnswers()
        console.log('✅ Pending answers loaded:', instructorStore.pendingTextAnswers.length)
        break
      case 'all':
        await instructorStore.loadAllTextAnswers()
        console.log('✅ All answers loaded:', instructorStore.allTextAnswers.length)
        break
      case 'student':
        if (selectedStudentId.value) {
          await instructorStore.loadStudentTextAnswers(selectedStudentId.value)
          console.log('✅ Student answers loaded:', instructorStore.studentTextAnswers.length)
        } else {
          // Если студент не выбран, очищаем список
          instructorStore.studentTextAnswers = []
        }
        break
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки ответов'
    console.error('❌ Ошибка загрузки:', err)
  } finally {
    isLoading.value = false
  }
}

// Обработчик изменения студента
const onStudentChange = () => {
  if (viewMode.value === 'student' && selectedStudentId.value) {
    loadData()
  } else if (viewMode.value === 'student' && !selectedStudentId.value) {
    // Если студент сброшен, очищаем список
    instructorStore.studentTextAnswers = []
  }
}

// Открытие модального окна с защитой
const openReview = (answer: TextAnswer) => {
  selectedAnswer.value = answer
  // Автоматически ставим максимальный балл как начальное значение
  reviewData.value = {
    score: answer.question?.points || 0,
    feedback: ''
  }
}

// Закрытие модального окна
const closeModal = () => {
  selectedAnswer.value = null
  reviewData.value = {
    score: 0,
    feedback: ''
  }
}

// Отправка оценки 
const submitReview = async () => {
  if (!selectedAnswer.value) return

  try {
    isSubmitting.value = true
    
    // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: ВСЕГДА ставим is_approved = true
    // Пусть система сама определяет прохождение теста по общему баллу
    const reviewPayload = {
      is_approved: true, // 🔥 ВСЕГДА true - статус определяется системой
      score: reviewData.value.score,
      feedback: reviewData.value.feedback
    }
    
    console.log('📝 Отправка оценки:', reviewPayload)
    await instructorStore.reviewTextAnswer(selectedAnswer.value.id, reviewPayload)
    
    closeModal()
    await loadData() // Перезагружаем список
    
  } catch (err: any) {
    error.value = err.message || 'Ошибка сохранения оценки'
    console.error('❌ Ошибка сохранения:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Вспомогательные функции с защитой
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('ru-RU')
  } catch {
    return 'Неизвестная дата'
  }
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const isAnswerApproved = (answer: TextAnswer): boolean => {
  return answer.is_approved === true
}

const getAnswerScore = (answer: TextAnswer): number => {
  return answer.score || 0
}

// 🔥 НОВЫЙ МЕТОД: Расчет информации о проходном балле
const calculatePassingInfo = (answer: TextAnswer) => {
  if (!answer.test || !answer.question) {
    return { isCalculated: false }
  }

  try {
    const passingThreshold = 80; // Проходной балл теста
    
    // Упрощенный расчет (можно улучшить когда будет доступ к TestResult)
    const maxPointsForThisQuestion = answer.question.points;
    const currentScore = reviewData.value.score;
    
    // Предполагаем, что студент получил максимум за автоматическую часть
    const autoScore = 50; // Максимум за автоматические вопросы
    
    // Расчет общего балла
    const textScorePercent = (currentScore / maxPointsForThisQuestion) * 50; // 50% за текстовую часть
    const totalScore = autoScore + textScorePercent;
    
    const willPass = totalScore >= passingThreshold;
    const neededPoints = willPass ? 0 : Math.ceil((passingThreshold - autoScore) / 50 * maxPointsForThisQuestion);
    
    return {
      isCalculated: true,
      willPass,
      neededPoints,
      totalScore: Math.round(totalScore),
      autoScore,
      textScorePercent: Math.round(textScorePercent)
    }
    
  } catch (error) {
    console.error('Ошибка расчета проходного балла:', error)
    return { isCalculated: false }
  }
}

const getStatusText = (answer: TextAnswer): string => {
  if (answer.requires_review) return 'На проверке'
  
  // Просто показываем оценку, система сама определит прохождение теста
  const maxPoints = answer.question?.points || 0
  const studentScore = answer.score || 0
  return `📝 ${studentScore}/${maxPoints}`
}

const getStatusClass = (answer: TextAnswer): string => {
  if (answer.requires_review) return 'pending'
  return 'reviewed' // Все проверенные ответы одного цвета
}

// Наблюдатели
watch(viewMode, (newMode) => {
  console.log('🔄 Смена режима на:', newMode)
  selectedStudentId.value = ''
  loadData()
})

watch([sortBy], () => {
  // Просто обновляем сортировку, не перезагружая данные
})

// Инициализация - загружаем данные для текущего режима
onMounted(() => {
  console.log('🚀 Инициализация страницы текстовых ответов')
  loadData()
})
</script>

<style scoped>
.text-answers {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Хедер */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
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
  margin: 0 0 4px 0;
}

.page-header p {
  color: #666;
  margin: 0;
}

/* Состояния */
.state-message {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.state-message.error {
  color: #e74c3c;
}

.subtext {
  color: #666;
  margin-top: 8px;
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

/* Список ответов */
.answers-content {
  margin-top: 20px;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #8C4CC3;
}

.answer-card:hover {
  border-color: #8C4CC3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.answer-card.requires-review {
  border-left-color: #ffa726;
}

.answer-card.approved {
  border-left-color: #4caf50;
}

.answer-card.rejected {
  border-left-color: #f44336;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
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

.answer-preview {
  margin: 16px 0;
}

.question {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.answer-text {
  color: #555;
  line-height: 1.4;
  margin: 0;
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

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 24px;
}

/* Блоки в модальном окне */
.question-info,
.student-answer,
.review-form {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.question-info:last-child,
.student-answer:last-child,
.review-form:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.question-info h3,
.student-answer h3,
.review-form h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.question-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.answer-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin: 12px 0;
}

.student-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

/* Форма оценки */
.score-section,
.score-input,
.feedback-section {
  margin-bottom: 20px;
}

/* Стили для формы проверки */
.score-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-field {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 200px;
}

.score-field:focus {
  border-color: #3b82f6;
  outline: none;
}

.score-hint {
  font-size: 12px;
  color: #6b7280;
}

.passing-hint {
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
}

.hint-success {
  color: #059669;
  background: #ecfdf5;
  padding: 4px 8px;
  border-radius: 4px;
}

.hint-warning {
  color: #d97706;
  background: #fffbeb;
  padding: 4px 8px;
  border-radius: 4px;
}

.hint-error {
  color: #dc2626;
  background: #fef2f2;
  padding: 4px 8px;
  border-radius: 4px;
}

.score-field {
  width: 100px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 8px;
}

.feedback-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  margin-top: 8px;
}

.feedback-field:focus {
  outline: none;
  border-color: #8C4CC3;
}

/* Обновляем стили статусов */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.reviewed {
  background: #dbeafe;
  color: #1d4ed8;
}

.hint-info {
  color: #374151;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

/* Кнопки действий */
.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
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
  .text-answers {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 12px;
  }
  
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
  
  .modal-content {
    margin: 0;
    border-radius: 12px 12px 0 0;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>