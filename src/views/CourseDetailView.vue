<template>
  <div class="course-detail">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-link">Дашборд</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link to="/my-courses" class="breadcrumb-link">Мои курсы</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ course?.title || 'Загрузка...' }}</span>
    </nav>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка курса...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error-state">
      <h3>Ошибка загрузки</h3>
      <p>{{ error }}</p>
      <button @click="loadCourseData" class="retry-button">Попробовать снова</button>
      <router-link to="/my-courses" class="back-link">← Вернуться к курсам</router-link>
    </div>

    <!-- Основной контент (показываем только если course существует) -->
    <div v-else-if="course">
      <!-- Заголовок курса -->
      <div class="course-header">
        <div class="course-hero">
          <div class="course-cover" v-if="course.cover_image">
            <img :src="course.cover_image" :alt="course.title" />
          </div>
          <div class="course-info">
            <h1>{{ course.title }}</h1>
            <p class="course-description">{{ course.description }}</p>
            
            <div class="course-meta">
              <div class="meta-item">
                <span class="meta-icon">📚</span>
                <span>{{ lessons.length }} уроков</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">⏱️</span>
                <span>{{ totalDuration }} минут</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🎯</span>
                <span class="course-level">{{ courseLevel }}</span>
              </div>
            </div>

            <!-- Прогресс курса -->
            <div class="progress-container">
              <div class="progress-header">
                <span>Прогресс курса</span>
                <span>{{ progress.progress_percent }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress.progress_percent + '%' }"></div>
              </div>
              <div class="progress-stats">
                {{ progress.completed_lessons }}/{{ progress.total_lessons }} уроков завершено
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Содержание курса -->
      <div class="course-content">
        <div class="content-header">
          <h2>Содержание курса</h2>
          <div class="content-stats">
            <span>{{ progress.completed_lessons }}/{{ progress.total_lessons }} уроков завершено</span>
          </div>
        </div>

        <div class="lessons-list">
          <div 
            v-for="lesson in sortedLessons" 
            :key="lesson.id" 
            class="lesson-item"
            :class="{
              'completed': lesson.is_completed,
              'current': !lesson.is_completed && lesson.is_unlocked,
              'locked': !lesson.is_unlocked
            }"
          >
            <div class="lesson-info">
              <div class="lesson-number">Урок {{ lesson.order }}</div>
              <h3 class="lesson-title">{{ lesson.title }}</h3>
              <p class="lesson-description">{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span class="lesson-duration">{{ lesson.duration_minutes }} минут</span>
                <span v-if="lesson.has_test" class="lesson-test">📝 Тест</span>
              </div>
            </div>
            
            <div class="lesson-actions">
              <span v-if="lesson.is_completed" class="lesson-status completed">✅ Завершено</span>
              <span v-else-if="!lesson.is_unlocked" class="lesson-status locked">🔒 Заблокировано</span>
              <span v-else-if="lesson.has_test" class="lesson-status test">📝 Тест</span>
              <span v-else class="lesson-status pending">⏳ Ожидает</span>
              
              <router-link 
                v-if="lesson.is_unlocked"
                :to="`/lessons/${lesson.id}`"
                class="lesson-button"
                :class="lesson.is_completed ? 'review' : 'start'"
              >
                {{ lesson.is_completed ? 'Повторить' : 'Начать' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия с курсом -->
      <div class="course-actions">
        <button 
          class="action-btn primary" 
          @click="continueLearning"
          :disabled="!nextLesson"
        >
          {{ continueButtonText }}
        </button>
        <router-link to="/my-courses" class="action-btn secondary">
          ← Назад к курсам
        </router-link>
      </div>
    </div>

    <!-- Состояние когда курс не найден -->
    <div v-else class="not-found-state">
      <h3>Курс не найден</h3>
      <p>Запрошенный курс не существует или у вас нет к нему доступа.</p>
      <router-link to="/my-courses" class="back-link">← Вернуться к курсам</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseDetailStore } from '@/stores/courseDetail';

const route = useRoute();
const router = useRouter();
const courseDetailStore = useCourseDetailStore();

// Используем storeToRefs для правильной реактивности
import { storeToRefs } from 'pinia';

const { course, lessons, progress, isLoading, error } = storeToRefs(courseDetailStore);

// Загрузка данных
onMounted(() => {
  loadCourseData();
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCourseData();
    }
  }
);

const loadCourseData = () => {
  const courseId = parseInt(route.params.id as string);
  if (courseId) {
    courseDetailStore.fetchCourseDetail(courseId);
  }
};

// ВЫЧИСЛЯЕМЫЕ СВОЙСТВА С БЕЗОПАСНЫМ ДОСТУПОМ

const courseLevel = computed(() => {
  // Безопасный доступ к course.value
  const currentCourse = course.value;
  if (!currentCourse) return 'Начальный';
  
  const levels: Record<string, string> = {
    'BASIC': 'Начальный',
    'ADVANCED': 'Продвинутый',
    'ALL': 'Все уровни'
  };
  
  return levels[currentCourse.access_level] || 'Начальный';
});

const totalDuration = computed(() => {
  const lessonList = lessons.value;
  if (!lessonList || lessonList.length === 0) return 0;
  
  return lessonList.reduce((total, lesson) => {
    return total + (lesson.duration_minutes || 0);
  }, 0);
});

const sortedLessons = computed(() => {
  const lessonList = lessons.value;
  if (!lessonList || lessonList.length === 0) return [];
  
  return [...lessonList].sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });
});

const nextLesson = computed(() => {
  const lessonList = sortedLessons.value;
  if (!lessonList || lessonList.length === 0) return null;
  
  return lessonList.find(lesson => {
    return !lesson.is_completed && lesson.is_unlocked !== false;
  }) || null;
});

const continueButtonText = computed(() => {
  const lesson = nextLesson.value;
  if (!lesson) return 'Курс завершен 🎉';
  return `Продолжить: ${lesson.title || 'Следующий урок'}`;
});

// Методы
const continueLearning = () => {
  const lesson = nextLesson.value;
  if (lesson?.id) {
    router.push(`/lessons/${lesson.id}`);
  }
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
  opacity: 0.6;
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* Состояния загрузки и ошибки */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-left: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--error-light);
  border-radius: 12px;
  color: var(--error);
}

.error-state h3 {
  margin-bottom: 1rem;
}

.retry-button {
  background: var(--error);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  margin: 1rem 0.5rem;
  cursor: pointer;
}

.back-link {
  color: var(--error);
  text-decoration: none;
  margin: 1rem 0.5rem;
  display: inline-block;
}

/* Заголовок курса */
.course-hero {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.course-cover img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.course-info h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.course-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
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

.progress-stats {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
}

/* Содержание курса */
.course-content {
  margin-top: 3rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.content-stats {
  color: var(--text-secondary);
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
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lesson-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.lesson-item.completed {
  border-left-color: #2e7d32;
  background: #f8f9fa;
}

.lesson-item.locked {
  border-left-color: var(--gray-400);
  background: var(--gray-50);
  opacity: 0.7;
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
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.lesson-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
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

.lesson-status.locked {
  background: var(--gray-200);
  color: var(--text-secondary);
}

.lesson-status.test {
  background: #e3f2fd;
  color: #1976d2;
}

.lesson-status.pending {
  background: #fff3cd;
  color: #856404;
}

.lesson-button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.lesson-button.start {
  background: var(--primary);
  color: white;
}

.lesson-button.start:hover {
  background: var(--primary-dark);
}

.lesson-button.review {
  background: var(--gray-200);
  color: var(--text-secondary);
}

.lesson-button.review:hover {
  background: var(--gray-300);
}

/* Действия с курсом */
.course-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.action-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: white;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.action-btn.secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

/* Добавляем стиль для состояния "не найден" */
.not-found-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.not-found-state h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .course-hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .course-cover img {
    height: 150px;
  }
  
  .course-info h1 {
    font-size: 2rem;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
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
</style>