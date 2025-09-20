<template>
  <div class="stats-cards">
    <!-- Карточка активных курсов -->
    <div class="stat-card">
      <div class="stat-icon">🎓</div>
      <div class="stat-content">
        <h3>Активные курсы</h3>
        <p class="stat-number">{{ coursesStore.activeCoursesCount }}</p>
        <p class="stat-label">в процессе обучения</p>
      </div>
    </div>

    <!-- Карточка пройденных уроков -->
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <h3>Пройдено уроков</h3>
        <p class="stat-number">{{ coursesStore.completedLessonsCount }}</p>
        <p class="stat-label">успешно завершено</p>
      </div>
    </div>

    <!-- Карточка среднего прогресса -->
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <h3>Общий прогресс</h3>
        <p class="stat-number">{{ authStore.user?.progress || 0 }}%</p>
        <p class="stat-label">по всем курсам</p>
      </div>
    </div>

    <!-- Карточка следующий тест -->
    <div class="stat-card">
      <div class="stat-icon">📝</div>
      <div class="stat-content">
        <h3>Следующий тест</h3>
        <p class="stat-number">{{ upcomingTests }}</p>
        <p class="stat-label">ожидает прохождения</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '@/stores/courses';
import { useAuthStore } from '@/stores/auth';

const coursesStore = useCoursesStore();
const authStore = useAuthStore();

// Пока заглушка для тестов
const upcomingTests = 2;
</script>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid #8C4CC3;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #8C4CC3;
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>