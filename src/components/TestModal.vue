<template>
  <div class="test-modal-container">
    <!-- Заголовок теста -->
    <div class="test-header" v-if="!showResults">
      <div class="test-title-section">
        <h1>{{ test?.title }}</h1>
        <p class="test-description">{{ test?.description }}</p>
      </div>

      <!-- Прогресс и информация -->
      <div class="test-info">
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">
            Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
          </div>
        </div>

        <div class="test-meta">
          <div class="meta-badge">
            <span class="meta-icon">🎯</span>
            Проходной балл: {{ test?.pass_score }}%
          </div>
          <div class="meta-badge">
            <span class="meta-icon">⏱️</span>
            Вопросов: {{ questions.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Контент теста или результатов -->
    <div class="test-content">
      <!-- Вопросы теста -->
      <div v-if="!showResults && currentQuestion" class="question-section">
        <div class="question-card">
          <div class="question-header">
            <h2>Вопрос {{ currentQuestionIndex + 1 }}</h2>
            <div class="question-points">
              <span class="points-badge">{{ currentQuestion.points }} баллов</span>
            </div>
          </div>

          <div class="question-text">
            {{ currentQuestion.text }}
          </div>

          <!-- Варианты ответов -->
          <div class="answers-section">
            <!-- Одиночный выбор -->
            <div v-if="currentQuestion.type === 'SINGLE'" class="answers-single">
              <div
                v-for="answer in currentQuestion.answers"
                :key="answer.id"
                class="answer-option"
                :class="{ 'selected': isSelected(answer.id) }"
                @click="handleSingleSelect(answer.id)"
              >
                <div class="answer-radio">
                  <div class="radio-dot"></div>
                </div>
                <span class="answer-text">{{ answer.text }}</span>
              </div>
            </div>

            <!-- Множественный выбор -->
            <div v-if="currentQuestion.type === 'MULTIPLE'" class="answers-multiple">
              <div
                v-for="answer in currentQuestion.answers"
                :key="answer.id"
                class="answer-option"
                :class="{ 'selected': isSelected(answer.id) }"
                @click="handleMultipleSelect(answer.id)"
              >
                <div class="answer-checkbox">
                  <div class="checkbox-mark">✓</div>
                </div>
                <span class="answer-text">{{ answer.text }}</span>
              </div>
            </div>

            <!-- Текстовый ответ -->
            <div v-if="currentQuestion.type === 'TEXT'" class="answers-text">
              <textarea
                v-model="textAnswer"
                placeholder="Введите ваш ответ здесь..."
                class="text-answer-input"
                rows="5"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Навигация -->
        <div class="navigation-buttons">
          <button
            class="nav-button prev-button"
            @click="prevQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            ← Назад
          </button>

          <button
            v-if="currentQuestionIndex < questions.length - 1"
            class="nav-button next-button"
            @click="nextQuestion"
            :disabled="!canProceed"
          >
            Далее →
          </button>

          <button
            v-else
            class="nav-button submit-button"
            @click="submitTest"
            :disabled="!canProceed"
          >
            Завершить тест 🎉
          </button>
        </div>
      </div>

      <!-- Результаты теста -->
      <div v-if="showResults" class="results-section">
        <div class="results-card" :class="resultClass">
          <div class="result-icon">
            {{ testResult.passed ? '🎉' : '😔' }}
          </div>
          <h2>{{ testResult.passed ? 'Поздравляем!' : 'Попробуйте еще раз' }}</h2>
          <div class="result-score">
            Ваш результат: <span class="score-value">{{ testResult.score }}%</span>
          </div>
          <p class="result-message">
            {{ testResult.passed 
              ? `Вы успешно прошли тест! Набрано ${testResult.correctAnswers} из ${testResult.totalQuestions} правильных ответов.`
              : `Для прохождения теста необходимо набрать ${test?.pass_score}%. Попробуйте еще раз!`
            }}
          </p>
          <div class="result-actions">
            <button class="action-button primary" @click="$emit('closed')">
              Вернуться к уроку
            </button>
            <button v-if="!testResult.passed" class="action-button secondary" @click="retryTest">
              Пройти заново
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Загрузка теста...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTestStore } from '@/stores/testStore';
import type { TestSubmission } from '@/types/api';

interface TestResult {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
}

const props = defineProps<{
  testId: number;
  lessonId: number;
}>();

const emit = defineEmits<{
  completed: [result: TestResult];
  closed: [];
}>();

const testStore = useTestStore();

// Состояние теста
const currentQuestionIndex = ref(0);
const textAnswer = ref('');
const selectedAnswers = ref<(number | string)[]>([]);
const userAnswers = ref<Record<number, any>>({});
const showResults = ref(false);
const testResult = ref<TestResult>({
  score: 0,
  passed: false,
  correctAnswers: 0,
  totalQuestions: 0
});

// Загрузка теста
onMounted(async () => {
  await testStore.fetchTest(props.testId);
  initializeAnswers();
});

// Вычисляемые свойства
const test = computed(() => testStore.currentTest);
const questions = computed(() => testStore.currentTest?.questions || []);
const isLoading = computed(() => testStore.isLoading);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const progress = computed(() => {
  return questions.value.length 
    ? Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100) 
    : 0;
});

const canProceed = computed(() => {
  if (!currentQuestion.value) return false;
  
  if (currentQuestion.value.type === 'TEXT') {
    return textAnswer.value.trim().length > 0;
  } else {
    return selectedAnswers.value.length > 0;
  }
});

const resultClass = computed(() => 
  testResult.value.passed ? 'passed' : 'failed'
);

// Методы
const initializeAnswers = () => {
  if (test.value) {
    test.value.questions.forEach((q) => {
      userAnswers.value[q.id] = q.type === 'TEXT' ? '' : [];
    });
  }
};

const saveAnswer = () => {
  if (!currentQuestion.value) return;
  
  const questionId = currentQuestion.value.id;
  if (currentQuestion.value.type === 'TEXT') {
    userAnswers.value[questionId] = textAnswer.value;
  } else {
    userAnswers.value[questionId] = [...selectedAnswers.value];
  }
};

const resetAnswerUI = () => {
  if (!currentQuestion.value) return;
  
  const questionId = currentQuestion.value.id;
  const savedAnswer = userAnswers.value[questionId];
  
  if (currentQuestion.value.type === 'TEXT') {
    textAnswer.value = savedAnswer || '';
  } else {
    selectedAnswers.value = savedAnswer ? [...savedAnswer] : [];
  }
};

// Навигация
const nextQuestion = () => {
  saveAnswer();
  currentQuestionIndex.value++;
  resetAnswerUI();
};

const prevQuestion = () => {
  saveAnswer();
  currentQuestionIndex.value--;
  resetAnswerUI();
};

// Выбор ответов
const handleSingleSelect = (answerId: number) => {
  selectedAnswers.value = [answerId];
};

const handleMultipleSelect = (answerId: number) => {
  const index = selectedAnswers.value.indexOf(answerId);
  if (index === -1) {
    selectedAnswers.value.push(answerId);
  } else {
    selectedAnswers.value.splice(index, 1);
  }
};

const isSelected = (answerId: number) => {
  return selectedAnswers.value.includes(answerId);
};

// Отправка теста
const submitTest = async () => {
  if (!test.value) return;
  
  saveAnswer();

  const submission: TestSubmission = {
    test_id: test.value.id,
    answers: Object.entries(userAnswers.value).map(([questionId, answer]) => {
      const question = questions.value.find(q => q.id === parseInt(questionId));
      if (!question) return null;

      if (question.type === 'TEXT') {
        return {
          question_id: parseInt(questionId),
          text_answer: answer as string
        };
      } else {
        return {
          question_id: parseInt(questionId),
          answer_ids: answer as number[]
        };
      }
    }).filter(Boolean) as any
  };

  try {
    const result = await testStore.submitTest(submission);
    
    testResult.value = {
      score: result.score,
      passed: result.passed,
      correctAnswers: result.correct_answers || 0,
      totalQuestions: result.total_questions || questions.value.length
    };
    
    showResults.value = true;
    emit('completed', testResult.value);
    
  } catch (error) {
    console.error('Ошибка при отправке теста:', error);
  }
};

const retryTest = () => {
  showResults.value = false;
  currentQuestionIndex.value = 0;
  selectedAnswers.value = [];
  textAnswer.value = '';
  userAnswers.value = {};
  initializeAnswers();
};
</script>

<style scoped>
.test-modal-container {
  padding: 0;
  font-family: 'Inter', sans-serif;
}

/* Заголовок теста */
.test-header {
  background: linear-gradient(135deg, #f8f5ff 0%, #fff 100%);
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.test-title-section h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.8rem;
}

.test-description {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.test-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  gap: 2rem;
}

.progress-section {
  flex: 1;
  max-width: 300px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8C4CC3, #4ECDC4);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.test-meta {
  display: flex;
  gap: 1rem;
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #555;
}

.meta-icon {
  font-size: 1.1rem;
}

/* Вопросы */
.question-section {
  padding: 2rem;
}

.question-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.question-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.points-badge {
  background: #8C4CC3;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 2rem;
}

/* Варианты ответов */
.answers-section {
  space-y: 1rem;
}

.answer-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
}

.answer-option:hover {
  border-color: #8C4CC3;
  background: #f8f5ff;
}

.answer-option.selected {
  border-color: #8C4CC3;
  background: #f8f5ff;
}

.answer-radio, .answer-checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #adb5bd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}

.answer-option.selected .answer-radio {
  border-color: #8C4CC3;
  background: #8C4CC3;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.answer-option.selected .radio-dot {
  opacity: 1;
}

.answer-checkbox {
  border-radius: 4px;
}

.answer-option.selected .answer-checkbox {
  border-color: #8C4CC3;
  background: #8C4CC3;
}

.checkbox-mark {
  color: white;
  font-size: 12px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s;
}

.answer-option.selected .checkbox-mark {
  opacity: 1;
}

.answer-text {
  flex: 1;
  line-height: 1.5;
  color: #333;
}

.text-answer-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.text-answer-input:focus {
  outline: none;
  border-color: #8C4CC3;
}

/* Навигация */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-button {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
}

.prev-button:not(:disabled):hover {
  background: #e9ecef;
}

.next-button, .submit-button {
  background: linear-gradient(135deg, #8C4CC3, #6a3093);
  color: white;
}

.next-button:not(:disabled):hover, 
.submit-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(140, 76, 195, 0.3);
}

/* Результаты */
.results-section {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.results-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.results-card.passed {
  border: 2px solid #4ECDC4;
}

.results-card.failed {
  border: 2px solid #FF6B6B;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.results-card h2 {
  margin: 0 0 1rem 0;
  color: #333;
}

.result-score {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.score-value {
  font-weight: bold;
  font-size: 1.4rem;
}

.results-card.passed .score-value {
  color: #4ECDC4;
}

.results-card.failed .score-value {
  color: #FF6B6B;
}

.result-message {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.primary {
  background: #8C4CC3;
  color: white;
}

.action-button.primary:hover {
  background: #6a3093;
  transform: translateY(-1px);
}

.action-button.secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
}

.action-button.secondary:hover {
  background: #e9ecef;
}

/* Загрузка */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #8C4CC3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .test-info {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .progress-section {
    max-width: none;
  }
  
  .test-meta {
    justify-content: center;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-button {
    width: 100%;
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>