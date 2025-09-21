<template>
  <div class="test-view">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-link">Дашборд</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link :to="`/courses/${courseId}`" class="breadcrumb-link">Курс</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link :to="`/lessons/${lessonId}`" class="breadcrumb-link">Урок</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Тест</span>
    </nav>

    <div class="test-container">
      <!-- Заголовок теста -->
      <div class="test-header">
        <h1>{{ test?.title }}</h1>
        <p class="test-description">{{ test?.description }}</p>
        
        <div class="test-meta">
          <div class="meta-item">
            <span class="meta-label">Вопросов:</span>
            <span class="meta-value">{{ questions.length }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Проходной балл:</span>
            <span class="meta-value">{{ test?.pass_score }}%</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Текущий вопрос:</span>
            <span class="meta-value">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          </div>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">Прогресс: {{ progress }}%</div>
      </div>

      <!-- Вопрос -->
      <div class="question-container" v-if="currentQuestion">
        <div class="question-header">
          <h2>Вопрос {{ currentQuestionIndex + 1 }}</h2>
          <div class="question-points">{{ currentQuestion.points }} баллов</div>
        </div>

        <div class="question-content">
          <p class="question-text">{{ currentQuestion.text }}</p>

          <!-- Варианты ответов -->
          <div class="answers-container">
            <!-- Одиночный выбор -->
            <div 
              v-if="currentQuestion.type === 'SINGLE'"
              class="answers-single"
            >
              <label 
                v-for="answer in currentQuestion.answers" 
                :key="answer.id"
                class="answer-radio"
                :class="{ 'selected': selectedAnswers.includes(answer.id) }"
              >
                <input
                  type="radio"
                  :name="'answer-' + currentQuestion.id"
                  :value="answer.id"
                  v-model="selectedAnswers"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span class="answer-text">{{ answer.text }}</span>
              </label>
            </div>

            <!-- Множественный выбор -->
            <div 
              v-if="currentQuestion.type === 'MULTIPLE'"
              class="answers-multiple"
            >
              <label 
                v-for="answer in currentQuestion.answers" 
                :key="answer.id"
                class="answer-checkbox"
                :class="{ 'selected': selectedAnswers.includes(answer.id) }"
              >
                <input
                  type="checkbox"
                  :value="answer.id"
                  v-model="selectedAnswers"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="answer-text">{{ answer.text }}</span>
              </label>
            </div>

            <!-- Текстовый ответ -->
            <div 
              v-if="currentQuestion.type === 'TEXT'"
              class="answers-text"
            >
              <textarea
                v-model="textAnswer"
                placeholder="Введите ваш ответ здесь..."
                class="text-input"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Навигация между вопросами -->
      <div class="test-navigation">
        <button 
          class="nav-btn prev-btn"
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          ← Назад
        </button>

        <button 
          v-if="currentQuestionIndex < questions.length - 1"
          class="nav-btn next-btn"
          @click="nextQuestion"
          :disabled="!canProceed"
        >
          Далее →
        </button>

        <button 
          v-else
          class="nav-btn submit-btn"
          @click="submitTest"
          :disabled="!canProceed"
        >
          Завершить тест
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const test = ref<any>(null);
const questions = ref<any[]>([]);
const currentQuestionIndex = ref(0);
const selectedAnswers = ref<(number | string)[]>([]);
const textAnswer = ref('');
const userAnswers = ref<Record<number, any>>({});

// Заглушки данных
onMounted(() => {
  loadTestData();
});

const loadTestData = () => {
  setTimeout(() => {
    test.value = {
      id: route.params.id,
      title: 'Тест по основам маникюра',
      description: 'Проверьте свои знания основных принципов и техник маникюра',
      pass_score: 70
    };

    questions.value = [
      {
        id: 1,
        text: 'Какой инструмент используется для удаления кутикулы?',
        type: 'SINGLE',
        points: 10,
        answers: [
          { id: 1, text: 'Пушер', is_correct: true },
          { id: 2, text: 'Ножницы', is_correct: false },
          { id: 3, text: 'Пилка', is_correct: false },
          { id: 4, text: 'Кисть', is_correct: false }
        ]
      },
      {
        id: 2,
        text: 'Какие этапы включает подготовка ногтей к маникюру?',
        type: 'MULTIPLE',
        points: 15,
        answers: [
          { id: 5, text: 'Обезжиривание', is_correct: true },
          { id: 6, text: 'Шлифовка', is_correct: true },
          { id: 7, text: 'Покраска', is_correct: false },
          { id: 8, text: 'Удаление кутикулы', is_correct: true }
        ]
      },
      {
        id: 3,
        text: 'Опишите правильную технику нанесения базового покрытия',
        type: 'TEXT',
        points: 20,
        answers: []
      }
    ];

    // Инициализируем ответы пользователя
    questions.value.forEach((q) => {
    userAnswers.value[q.id] = q.type === 'TEXT' ? '' : [];
    });
  }, 500);
};

// Вычисляемые свойства
const courseId = computed(() => route.params.courseId || '1');
const lessonId = computed(() => route.params.lessonId || '1');

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});

const progress = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100);
});

const canProceed = computed(() => {
  const question = currentQuestion.value;
  if (!question) return false;

  if (question.type === 'TEXT') {
    return textAnswer.value.trim().length > 0;
  } else {
    return selectedAnswers.value.length > 0;
  }
});

// Методы
const saveAnswer = () => {
  const questionId = currentQuestion.value.id;
  if (currentQuestion.value.type === 'TEXT') {
    userAnswers.value[questionId] = textAnswer.value;
  } else {
    userAnswers.value[questionId] = [...selectedAnswers.value];
  }
};

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

const resetAnswerUI = () => {
  const questionId = currentQuestion.value.id;
  const savedAnswer = userAnswers.value[questionId];
  
  if (currentQuestion.value.type === 'TEXT') {
    textAnswer.value = savedAnswer || '';
  } else {
    selectedAnswers.value = savedAnswer ? [...savedAnswer] : [];
  }
};

const submitTest = () => {
  saveAnswer();
  
  // Здесь будет логика отправки теста на сервер
  console.log('Ответы пользователя:', userAnswers.value);
  
  // Переход на страницу результатов
  router.push({
    name: 'test-results',
    params: { id: test.value.id },
    query: { 
      score: 85, // Заглушка
      total: questions.value.reduce((sum, q) => sum + q.points, 0)
    }
  });
};
</script>

<style scoped>
.test-view {
  max-width: 800px;
  margin: 80px auto 40px;
  padding: 0 20px;
}

/* Хлебные крошки */
.breadcrumbs {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary);
}

.breadcrumb-separator {
  opacity: 0.6;
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* Заголовок теста */
.test-header {
  text-align: center;
  margin-bottom: 2rem;
}

.test-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.test-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.test-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
}

/* Прогресс-бар */
.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Вопрос */
.question-container {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.question-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.question-points {
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

/* Ответы */
.answers-container {
  margin-top: 1.5rem;
}

.answer-radio, .answer-checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.answer-radio:hover, .answer-checkbox:hover {
  border-color: var(--primary);
  background: var(--gray-50);
}

.answer-radio.selected, .answer-checkbox.selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.radio-input, .checkbox-input {
  display: none;
}

.radio-custom, .checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.answer-radio.selected .radio-custom {
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: inset 0 0 0 3px white;
}

.checkbox-custom {
  border-radius: 4px;
}

.answer-checkbox.selected .checkbox-custom {
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: inset 0 0 0 2px white;
}

.answer-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.4;
}

/* Текстовый ответ */
.answers-text {
  margin-top: 1rem;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary);
}

/* Навигация */
.test-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  background: white;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.prev-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.next-btn {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.next-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.submit-btn {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
}

/* Адаптивность */
@media (max-width: 768px) {
  .test-view {
    margin: 60px auto 20px;
    padding: 0 16px;
  }
  
  .test-header h1 {
    font-size: 1.5rem;
  }
  
  .test-meta {
    gap: 1rem;
  }
  
  .question-container {
    padding: 1.5rem;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .test-navigation {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .answer-radio, .answer-checkbox {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .answer-text {
    font-size: 0.9rem;
  }
}
</style>