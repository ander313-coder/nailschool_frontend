<template>
  <div class="dashboard-status">
    <div class="status-container">
      <div class="welcome-column">
        <h1>{{ userName }}, добрый день!</h1>
        <p class="welcome-text">Сегодня отличный день, чтобы узнать новое или закрепить знания на практике.</p>
      </div>
      <div class="progress-column">
        <div class="progress-card">
          <div class="status-row">
            <h2>Ваш статус:</h2>
            <div class="current-status">
              <h1>{{ currentRole }}</h1>
            </div>
          </div>

          <div class="status-row" v-if="nextRole">
            <span class="status-label">Следующий статус:</span>
            <strong class="status-value">{{ nextRole }}</strong>
          </div>
          <div class="status-row" v-else>
            <span class="status-label">Поздравляем!</span>
            <span>Вы достигли максимального уровня</span>
          </div>
          <!-- Прогресс-бар -->
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: userProgress + '%' }"
              ></div>
            </div>
            <span class="progress-text">Выполнено {{ userProgress }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { computed } from 'vue'; 

const authStore = useAuthStore();
const { user } = storeToRefs(authStore); 

const userName = computed(() => {
  if (!user.value) return 'Пользователь';
  return user.value.first_name || user.value.username || 'Пользователь';
});

const userProgress = computed(() => {
  return 78;
});

const nextRole = computed(() => {
  return user.value?.next_role_display || null;
});

const currentRole = computed(() => {
  if (!user.value) return '';
  const roleMap: Record<string, string> = {
    'TRAINEE': 'Стажер',
    'MASTER': 'Мастер', 
    'INSTRUCTOR': 'Инструктор'
  };
  return user.value.level || roleMap[user.value.role] || user.value.role;
});
</script>

<style scoped>
.dashboard-status {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.status-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.welcome-column {
  flex: 1;
}

.welcome-column h1 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.welcome-text {
  color: #666;
  line-height: 1.5;
  margin: 0;
  max-width: 300px;
}

.progress-column {
  flex: 1;
  max-width: 400px;
}

.progress-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #8C4CC3; 
}

.status-row {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.status-row h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex-shrink: 0; 
}

.current-status h1 {
  font-size: 36px; 
  font-weight: 600;
  margin: 0;
  text-align: right;
}

.status-label {
  font-size: 14px;
  flex-shrink: 0;
}

.status-value {
  font-size: 16px;
  font-weight: 600;
  text-align: right;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8f0eff, #c788ff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 200;
  min-width: 80px;
  text-align: right;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .status-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .progress-column {
    max-width: 100%;
  }
  
  .status-row {
    flex-direction: column; 
    align-items: flex-start;
    gap: 8px;
  }
  
  .current-status h1 {
    text-align: left; 
  }
  
  .status-value {
    text-align: left;
  }
  
  .progress-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .progress-text {
    text-align: left;
  }
}
</style>