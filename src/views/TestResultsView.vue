<template>
  <div class="test-results">
    <div class="results-container">
      <div class="results-header">
        <h1>Результаты теста</h1>
        <div class="score-circle" :class="scoreClass">
          {{ score }}%
        </div>
      </div>

      <div class="results-body">
        <div class="result-message">
          <h2 v-if="isPassed">🎉 Поздравляем!</h2>
          <h2 v-else>😔 Попробуйте еще раз</h2>
          <p>{{ resultMessage }}</p>
        </div>

        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-label">Правильных ответов:</span>
            <span class="stat-value">{{ correctAnswers }}/{{ totalQuestions }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Набрано баллов:</span>
            <span class="stat-value">{{ earnedPoints }}/{{ totalPoints }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Проходной балл:</span>
            <span class="stat-value">{{ passScore }}%</span>
          </div>
        </div>

        <div class="results-actions">
          <router-link :to="`/lessons/${lessonId}`" class="action-btn">
            ← Вернуться к уроку
          </router-link>
          <router-link to="/dashboard" class="action-btn primary">
            На дашборд
          </router-link>
          <button v-if="!isPassed" class="action-btn" @click="retryTest">
            🔄 Повторить тест
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Заглушки данных - потом заменим на реальные
const score = computed(() => parseInt(route.query.score as string) || 85);
const totalQuestions = computed(() => 5);
const correctAnswers = computed(() => 4);
const earnedPoints = computed(() => 45);
const totalPoints = computed(() => 50);
const passScore = computed(() => 70);
const lessonId = computed(() => '1');

const isPassed = computed(() => score.value >= passScore.value);

const scoreClass = computed(() => {
  if (score.value >= 90) return 'excellent';
  if (score.value >= 70) return 'good';
  return 'poor';
});

const resultMessage = computed(() => {
  if (score.value >= 90) return 'Отличный результат! Вы прекрасно усвоили материал.';
  if (score.value >= 70) return 'Хороший результат! Вы хорошо поняли материал.';
  return 'Вам нужно повторить материал и попробовать еще раз.';
});

const retryTest = () => {
  // Логика повторения теста
  window.location.reload();
};
</script>

<style scoped>
.test-results {
  max-width: 600px;
  margin: 80px auto;
  padding: 0 20px;
}

.results-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.results-header {
  margin-bottom: 2rem;
}

.results-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto;
  border: 4px solid;
}

.score-circle.excellent {
  background: #e8f5e8;
  color: #2e7d32;
  border-color: #2e7d32;
}

.score-circle.good {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #1976d2;
}

.score-circle.poor {
  background: #ffebee;
  color: #d32f2f;
  border-color: #d32f2f;
}

.results-body {
  margin-top: 2rem;
}

.result-message {
  margin-bottom: 2rem;
}

.result-message h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.result-message p {
  color: var(--text-secondary);
  line-height: 1.5;
}

.results-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--text-primary);
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 2px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  cursor: pointer;
}

.action-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.action-btn.primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.action-btn.primary:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

/* Адаптивность */
@media (max-width: 768px) {
  .results-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>