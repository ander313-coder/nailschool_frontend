<template>
  <div class="course-detail">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-link">Дашборд</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link to="/my-courses" class="breadcrumb-link">Мои курсы</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ course?.title }}</span>
    </nav>

    <!-- Заголовок курса -->
    <div class="course-header">
      <div class="course-hero">
        <h1>{{ course?.title }}</h1>
        <p class="course-description">{{ course?.description }}</p>
        
        <div class="course-meta">
          <div class="meta-item">
            <span class="meta-icon">📚</span>
            <span>{{ course?.lesson_count || 0 }} уроков</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">⏱️</span>
            <span>~{{ totalDuration }} минут</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">🎯</span>
            <span class="course-level">{{ courseLevel }}</span>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-header">
            <span>Прогресс курса</span>
            <span>{{ courseProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: courseProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Содержание курса -->
    <div class="course-content">
      <div class="content-header">
        <h2>Содержание курса</h2>
        <div class="content-stats">
          <span>{{ completedLessons }}/{{ totalLessons }} уроков завершено</span>
        </div>
      </div>

      <div class="lessons-list">
        <div v-for="lesson in lessons" :key="lesson.id" class="lesson-item">
          <div class="lesson-info">
            <div class="lesson-number">Урок {{ lesson.order }}</div>
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-duration">{{ lesson.duration_minutes }} минут</p>
          </div>
          
          <div class="lesson-actions">
            <span v-if="lesson.is_completed" class="lesson-status completed">✅ Завершено</span>
            <span v-else-if="lesson.has_test" class="lesson-status test">📝 Тест</span>
            <span v-else class="lesson-status pending">⏳ Ожидает</span>
            
            <router-link 
              v-if="!lesson.is_completed"
              :to="`/lessons/${lesson.id}`"
              class="start-button"
            >
              Начать
            </router-link>
            <router-link 
              v-else
              :to="`/lessons/${lesson.id}`"
              class="review-button"
            >
              Повторить
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Действия с курсом -->
    <div class="course-actions">
      <button class="action-btn primary" @click="continueLearning">
        {{ continueButtonText }}
      </button>
      <button class="action-btn secondary" @click="goBack">
        ← Назад к курсам
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const course = ref<any>(null);
const lessons = ref<any[]>([]);
const isLoading = ref(true);

// Заглушки данных - потом заменим на реальные API вызовы
onMounted(() => {
  setTimeout(() => {
    course.value = {
      id: route.params.id,
      title: 'Базовый курс маникюра',
      description: 'Основы работы с инструментами и материалами. Изучите базовые техники и принципы ухода за ногтями.',
      lesson_count: 12,
      access_level: 'BASIC'
    };

    lessons.value = [
      { id: 1, order: 1, title: 'Введение в маникюр', duration_minutes: 15, is_completed: true, has_test: true },
      { id: 2, order: 2, title: 'Инструменты и материалы', duration_minutes: 20, is_completed: true, has_test: true },
      { id: 3, order: 3, title: 'Подготовка ногтей', duration_minutes: 25, is_completed: false, has_test: false },
      { id: 4, order: 4, title: 'Основы покрытия', duration_minutes: 30, is_completed: false, has_test: true },
      { id: 5, order: 5, title: 'Дизайн ногтей', duration_minutes: 35, is_completed: false, has_test: false }
    ];

    isLoading.value = false;
  }, 500);
});

// Вычисляемые свойства
const courseLevel = computed(() => {
  const levels: Record<string, string> = {
    'BASIC': 'Начальный',
    'ADVANCED': 'Продвинутый',
    'ALL': 'Все уровни'
  };
  return levels[course.value?.access_level] || course.value?.access_level;
});

const totalLessons = computed(() => lessons.value.length);
const completedLessons = computed(() => lessons.value.filter(l => l.is_completed).length);
const courseProgress = computed(() => {
  if (totalLessons.value === 0) return 0;
  return Math.round((completedLessons.value / totalLessons.value) * 100);
});

const totalDuration = computed(() => {
  return lessons.value.reduce((total, lesson) => total + lesson.duration_minutes, 0);
});

const continueButtonText = computed(() => {
  const nextLesson = lessons.value.find(lesson => !lesson.is_completed);
  return nextLesson ? `Продолжить: ${nextLesson.title}` : 'Курс завершен';
});

// Методы
const continueLearning = () => {
  const nextLesson = lessons.value.find(lesson => !lesson.is_completed);
  if (nextLesson) {
    router.push(`/lessons/${nextLesson.id}`);
  }
};

const goBack = () => {
  router.push('/my-courses');
};
</script>

<style scoped>
.course-detail {
  max-width: 1000px;
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
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: var(--primary);
}

.breadcrumb-separator {
  color: var(--text-secondary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* Заголовок курса */
.course-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.course-hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.course-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.course-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.meta-icon {
  font-size: 1.2rem;
}

.course-level {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Прогресс */
.progress-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: var(--gray-100);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Содержание курса */
.course-content {
  margin-bottom: 2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.content-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.content-stats {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Список уроков */
.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary);
}

.lesson-info {
  flex: 1;
}

.lesson-number {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.lesson-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.lesson-duration {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.lesson-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-status {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
}

.lesson-status.completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.lesson-status.test {
  background: #e3f2fd;
  color: #1976d2;
}

.lesson-status.pending {
  background: #fff3cd;
  color: #856404;
}

.start-button, .review-button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.start-button {
  background: var(--primary);
  color: white;
}

.start-button:hover {
  background: var(--primary-dark);
}

.review-button {
  background: var(--gray-100);
  color: var(--text-secondary);
}

.review-button:hover {
  background: var(--gray-200);
}

/* Действия с курсом */
.course-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: var(--gray-100);
  color: var(--text-secondary);
}

.action-btn.secondary:hover {
  background: var(--gray-200);
}

/* Адаптивность */
@media (max-width: 768px) {
  .course-hero h1 {
    font-size: 2rem;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .lesson-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .lesson-actions {
    justify-content: space-between;
  }
  
  .course-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .course-header {
    padding: 1.5rem;
  }
  
  .course-hero h1 {
    font-size: 1.75rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>