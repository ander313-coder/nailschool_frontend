<template>
  <div class="stats-cards">
    <!-- Карточка активных курсов -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/school.svg" alt="Активные курсы"></div>
      <div class="stat-content">
        <h3>Активные курсы</h3>
        <p class="stat-number">{{ activeCoursesCount }}</p> 
        <p class="stat-label">в процессе обучения</p>
      </div>
    </div>

    <!-- Карточка пройденных уроков -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/structure.svg" alt="Пройдено уроков"></div>
      <div class="stat-content">
        <h3>Пройдено уроков</h3>
        <p class="stat-number">{{ completedLessonsCount }}</p>
        <p class="stat-label">успешно завершено</p>
      </div>
    </div>

    <!-- Карточка среднего прогресса -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/practise.svg" alt="Общий прогресс"></div>
      <div class="stat-content">
        <h3>Общий прогресс</h3>
        <p class="stat-number">{{ user?.progress || 0 }}%</p>
        <p class="stat-label">по всем курсам</p>
      </div>
    </div>

    <!-- Карточка следующий тест -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/test.svg" alt="Следующий тест"></div>
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
import { useProgressStore } from '@/stores/progress';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const coursesStore = useCoursesStore();
const progressStore = useProgressStore();
const authStore = useAuthStore();

const { courses } = storeToRefs(coursesStore);
const { totalCompletedLessons, totalCompletedTests } = storeToRefs(progressStore);
const { user } = storeToRefs(authStore);

// Вычисляем общую статистику
const activeCoursesCount = computed(() => courses.value.length);

const completedLessonsCount = computed(() => {
  return totalCompletedLessons.value;
});

const averageProgress = computed(() => {
  if (courses.value.length === 0) return 0;
  
  // Вычисляем средний прогресс по всем курсам
  const totalProgress = courses.value.reduce((sum, course) => {
    // Здесь можно добавить логику расчета прогресса по курсу
    return sum + 65; // Заглушка
  }, 0);
  
  return Math.round(totalProgress / courses.value.length);
});

// Считаем предстоящие тесты (заглушка)
const upcomingTests = computed(() => {
  return Math.max(0, 3 - totalCompletedTests.value); // Заглушка
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
  background: #8C4CC3;
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