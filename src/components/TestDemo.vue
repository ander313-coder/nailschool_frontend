<template>
  <div class="test-demo">
    <div class="test-header">
      <h2>Тест: Дезинфекция и стерилизация</h2>
      <button class="close-btn" @click="closeTest">×</button>
    </div>

    <div class="test-info">
      <div class="info-item">
        <strong>Вопросов:</strong> 3
      </div>
      <div class="info-item">
        <strong>Проходной балл:</strong> 80%
      </div>
    </div>

    <div class="questions-container">
      <div v-for="(question, index) in demoQuestions" 
           :key="index" 
           class="question-card"
           :class="{ active: currentQuestion === index }">
        
        <div class="question-header">
          <span class="question-number">Вопрос {{ index + 1 }} из 3</span>
        </div>
        
        <p class="question-text">{{ question.text }}</p>
        
        <div class="answers">
          <div v-for="(answer, ansIndex) in question.answers" 
               :key="ansIndex" 
               class="answer-option"
               :class="{ 
                 selected: isAnswerSelected(index, ansIndex),
                 correct: showResults && question.correct.includes(ansIndex),
                 incorrect: showResults && isAnswerSelected(index, ansIndex) && !question.correct.includes(ansIndex)
               }"
               @click="selectAnswer(index, ansIndex)">
            <span class="answer-checkbox">
              <span v-if="isAnswerSelected(index, ansIndex)" class="checkmark">✓</span>
            </span>
            <span class="answer-text">{{ answer }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="test-controls">
      <div class="progress">
        <div class="progress-text">
          Прогресс: {{ Object.keys(selectedAnswers).length }}/3 вопросов
        </div>
      </div>
      
      <button class="submit-btn" 
              @click="submitTest" 
              :disabled="Object.keys(selectedAnswers).length < 3">
        Завершить тест
      </button>
    </div>

    <div v-if="showResults" class="test-results">
      <div class="results-card" :class="passed ? 'passed' : 'failed'">
        <div class="results-icon">{{ passed ? '✅' : '❌' }}</div>
        <h3>{{ passed ? 'Тест пройден!' : 'Тест не пройден' }}</h3>
        <p class="results-score">Результат: {{ score }}%</p>
        <p class="results-message">
          {{ passed ? 'Правильных ответов: ' + correctCount + ' из 3' : 'Нужно набрать минимум 80%' }}
        </p>
        <div class="results-actions">
          <button v-if="!passed" class="retry-btn" @click="resetTest">
            Попробовать снова
          </button>
          <button v-else class="dashboard-btn" @click="goToDashboard">
            Перейти в дашборд
          </button>
          <button class="close-results-btn" @click="closeTest">
            Вернуться к уроку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits<{
  close: [];
}>();

const demoQuestions = [
  {
    text: 'Что такое дезинфекция в маникюрном кабинете?',
    answers: [
      'Уничтожение всех микроорганизмов на инструментах',
      'Уменьшение количества микроорганизмов до безопасного уровня',
      'Обработка инструментов ультрафиолетом',
      'Мытье инструментов с мылом'
    ],
    correct: [1]
  },
  {
    text: 'Какие инструменты подлежат стерилизации?',
    answers: [
      'Все металлические инструменты',
      'Только инструменты, контактирующие с кровью',
      'Пилочки и апельсиновые палочки',
      'Дезинфицирующие растворы'
    ],
    correct: [1]
  },
  {
    text: 'Какой раствор используется для дезинфекции инструментов?',
    answers: [
      'Спирт 70%',
      'Хлоргексидин 0.05%',
      'Перекись водорода 3%',
      'Все перечисленные варианты'
    ],
    correct: [3]
  }
];

const selectedAnswers = ref<{[key: number]: number[]}>({});
const showResults = ref(false);
const score = ref(0);
const passed = ref(false);
const correctCount = ref(0);
const currentQuestion = ref(0);

const isAnswerSelected = (questionIndex: number, answerIndex: number) => {
  return selectedAnswers.value[questionIndex]?.includes(answerIndex) || false;
};

const selectAnswer = (questionIndex: number, answerIndex: number) => {
  if (!selectedAnswers.value[questionIndex]) {
    selectedAnswers.value[questionIndex] = [];
  }
  
  const answers = selectedAnswers.value[questionIndex];
  const index = answers.indexOf(answerIndex);
  
  if (index > -1) {
    answers.splice(index, 1);
  } else {
    answers.push(answerIndex);
  }
};

const submitTest = () => {
  let correct = 0;
  
  demoQuestions.forEach((question, index) => {
    const userAnswers = selectedAnswers.value[index] || [];
    const isCorrect = userAnswers.length === question.correct.length &&
                     userAnswers.every(ans => question.correct.includes(ans));
    if (isCorrect) {
      correct++;
    }
  });
  
  correctCount.value = correct;
  score.value = Math.round((correct / demoQuestions.length) * 100);
  passed.value = score.value >= 80;
  showResults.value = true;
};

const resetTest = () => {
  selectedAnswers.value = {};
  showResults.value = false;
  score.value = 0;
  passed.value = false;
  correctCount.value = 0;
};

const closeTest = () => {
  emit('close');
};

const goToDashboard = () => {
  router.push('/dashboard');
  closeTest();
};
</script>

<style scoped>
.test-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.test-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
  background: #f0f0f0;
  border-radius: 50%;
}

.test-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.info-item {
  color: #666;
}

.questions-container {
  margin-bottom: 2rem;
}

.question-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
}

.question-header {
  margin-bottom: 1rem;
}

.question-number {
  font-size: 0.9rem;
  color: #666;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  color: #333;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.answer-option:hover {
  border-color: #8C4CC3;
}

.answer-option.selected {
  background: #f0f0f0;
  border-color: #8C4CC3;
}

.answer-option.correct {
  background: #d4edda;
  border-color: #28a745;
}

.answer-option.incorrect {
  background: #f8d7da;
  border-color: #dc3545;
}

.answer-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.answer-option.selected .answer-checkbox {
  background: #8C4CC3;
  border-color: #8C4CC3;
  color: white;
}

.checkmark {
  font-size: 0.8rem;
  font-weight: bold;
}

.answer-text {
  line-height: 1.4;
}

.test-controls {
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.progress-text {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #7a3cb0;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.test-results {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.results-card {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: white;
}

.results-card.passed {
  border: 1px solid #28a745;
}

.results-card.failed {
  border: 1px solid #dc3545;
}

.results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.results-score {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #333;
}

.results-message {
  color: #666;
  margin-bottom: 2rem;
}

.results-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashboard-btn, .retry-btn, .close-results-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.dashboard-btn {
  background: #4ECDC4;
  color: white;
}

.retry-btn {
  background: #FF6B6B;
  color: white;
}

.close-results-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .test-demo {
    padding: 0;
  }
  
  .test-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .test-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>