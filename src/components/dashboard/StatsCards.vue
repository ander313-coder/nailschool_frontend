<template>
  <div class="stats-cards">
    <!-- Карточка активных курсов -->
    <div class="stat-card">
      <div class="stat-icon">📚</div>
      <div class="stat-content">
        <h3>Активные курсы</h3>
        <p class="stat-number">{{ activeCoursesCount }}</p>
        <p class="stat-label">в процессе обучения</p>
      </div>
    </div>

    <!-- Карточка пройденных уроков -->
    <div class="stat-card">
      <div class="stat-icon">🎯</div>
      <div class="stat-content">
        <h3>Пройдено уроков</h3>
        <p class="stat-number">{{ completedLessonsCount }}</p>
        <p class="stat-label">успешно завершено</p>
      </div>
    </div>

    <!-- Карточка среднего прогресса -->
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <h3>Общий прогресс</h3>
        <p class="stat-number">{{ averageProgress }}%</p>
        <p class="stat-label">по всем курсам</p>
      </div>
    </div>

    <!-- Карточка следующий тест -->
    <div class="stat-card">
      <div class="stat-icon">🧪</div>
      <div class="stat-content">
        <h3>Следующий тест</h3>
        <p class="stat-number">{{ upcomingTests }}</p>
        <p class="stat-label">ожидает прохождения</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '../../stores/courses';
import { useProgressStore } from '../../stores/progress';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const coursesStore = useCoursesStore();
const progressStore = useProgressStore();

const { courses } = storeToRefs(coursesStore);
const { totalCompletedLessons } = storeToRefs(progressStore);

// Демо-данные для статистики
const demoStats = {
  completedLessons: 8,
  upcomingTests: 1,
  averageProgress: 65,
};

// Вычисляем общую статистику
const activeCoursesCount = computed(() => {
  return courses.value.length || 2;
});

const completedLessonsCount = computed(() => {
  return totalCompletedLessons.value || demoStats.completedLessons;
});

const averageProgress = computed(() => {
  return demoStats.averageProgress;
});

const upcomingTests = computed(() => {
  return demoStats.upcomingTests;
});
</script>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: #f8f9fa;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>