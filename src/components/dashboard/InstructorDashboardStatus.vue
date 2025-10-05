<template>
  <div class="dashboard-status">
    <div class="status-container">
      <div class="welcome-column">
        <h1>{{ userName }}, добрый день!</h1>
        <p class="welcome-text">У вас {{ pendingHomeworksCount }} работ ожидают проверки и {{ pendingTextAnswersCount }} ответов в тестах.</p>
      </div>
      <div class="progress-column">
        <div class="progress-card">
          <div class="status-row">
            <h2>Ваш статус:</h2>
            <div class="current-status">
              <h1>Инструктор</h1>
            </div>
          </div>

          <div class="status-row">
            <span class="status-label">Проверено сегодня:</span>
            <strong class="status-value">{{ reviewedTodayCount }} работ</strong>
          </div>
          
          <div class="status-row">
            <span class="status-label">Среднее время проверки:</span>
            <strong class="status-value">{{ averageReviewTime }}</strong>
          </div>

          <!-- Прогресс-бар активности -->
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: dailyActivity + '%' }"
              ></div>
            </div>
            <span class="progress-text">Активность за день {{ dailyActivity }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useInstructorStore } from '@/stores/instructorStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue'; 

const authStore = useAuthStore();
const instructorStore = useInstructorStore();
const { user } = storeToRefs(authStore);

const userName = computed(() => {
  if (!user.value) return 'Инструктор';
  return user.value.first_name || user.value.username || 'Инструктор';
});

const pendingHomeworksCount = computed(() => instructorStore.pendingHomeworksCount);
const pendingTextAnswersCount = computed(() => instructorStore.pendingTextAnswersCount);

// Демо-данные (можно заменить на реальные из API)
const reviewedTodayCount = computed(() => 8);
const averageReviewTime = computed(() => '15 мин');
const dailyActivity = computed(() => 65);
</script>
<style scoped>
.dashboard-status {
  margin-bottom: 32px;
}

.status-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

.welcome-column h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.welcome-text {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.progress-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status-row h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.current-status h1 {
  font-size: 24px;
  font-weight: 700;
  color: #8C4CC3;
  margin: 0;
}

.status-label {
  font-size: 14px;
  color: #666;
}

.status-value {
  font-size: 14px;
  color: #333;
}

.progress-container {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8C4CC3, #FF6B6B);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  display: block;
}

/* Адаптивность */
@media (max-width: 768px) {
  .status-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .welcome-column h1 {
    font-size: 28px;
  }
  
  .progress-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .welcome-column h1 {
    font-size: 24px;
  }
  
  .current-status h1 {
    font-size: 20px;
  }
  
  .status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>