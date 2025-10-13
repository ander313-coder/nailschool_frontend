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
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const dashboardStore = useDashboardStore();
const { dashboardData } = storeToRefs(dashboardStore);

// Загружаем данные при монтировании компонента
onMounted(async () => {
  await dashboardStore.fetchDashboardData();
});

// Вычисляем реальную статистику из данных API
const activeCoursesCount = computed(() => {
  return dashboardData.value?.active_courses?.length || 0;
});

const completedLessonsCount = computed(() => {
  return dashboardData.value?.completed_lessons_count || 0;
});

const averageProgress = computed(() => {
  if (!dashboardData.value?.active_courses?.length) return 0;
  
  const totalProgress = dashboardData.value.active_courses.reduce((sum: number, course: any) => {
    const completed = course.completed_lessons || 0;
    const total = course.total_lessons || 1; // избегаем деления на 0
    return sum + (completed / total) * 100;
  }, 0);
  
  return Math.round(totalProgress / dashboardData.value.active_courses.length);
});

const upcomingTests = computed(() => {
  return dashboardData.value?.pending_tests?.length || 0;
});
</script>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8C4CC3, #FF6B6B);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
}
</style>