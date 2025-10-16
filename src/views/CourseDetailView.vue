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

    <!-- Основной контент -->
    <div v-else-if="course">
      <!-- ОБНОВЛЕННЫЙ ЗАГОЛОВОК КУРСА -->
      <div class="course-header">
        <!-- Картинка курса -->
        <div class="course-media" v-if="course.cover_image">
          <img :src="course.cover_image" :alt="course.title" class="course-image" />
        </div>
        <div v-else class="course-media-placeholder">
          <div class="placeholder-icon">📚</div>
        </div>

        <!-- Информация о курсе -->
        <div class="course-info">
          <div class="course-badge">{{ courseLevel }}</div>
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-description">{{ course.description }}</p>
          
          <!-- Статистика курса -->
          <div class="course-stats">
            <div class="stat">
              <span class="stat-icon">📚</span>
              <div class="stat-info">
                <span class="stat-value">{{ lessons.length }}</span>
                <span class="stat-label">уроков</span>
              </div>
            </div>
            <div class="stat">
              <span class="stat-icon">⏱️</span>
              <div class="stat-info">
                <span class="stat-value">{{ totalDuration }}</span>
                <span class="stat-label">минут</span>
              </div>
            </div>
          </div>

          <!-- Прогресс -->
          <div class="course-progress">
            <div class="progress-info">
              <span class="progress-label">Ваш прогресс</span>
              <span class="progress-percent">{{ progress.progress_percent }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress.progress_percent + '%' }"></div>
            </div>
            <div class="progress-details">
              {{ progress.completed_lessons }}/{{ progress.total_lessons }} уроков завершено
            </div>
          </div>

          <!-- Кнопка продолжить -->
          <button 
            class="continue-button" 
            @click="continueLearning"
            :disabled="!nextLesson"
          >
            {{ continueButtonText }}
          </button>
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
              'completed': lesson.completed,
              'current': !lesson.completed && isLessonAccessible(lesson),
              'locked': !isLessonAccessible(lesson)
            }"
          >
            <div class="lesson-info">
              <div class="lesson-number">Урок {{ lesson.order }}</div>
              <h3 class="lesson-title">{{ lesson.title }}</h3>
              <div class="lesson-meta">
                <span class="lesson-duration">{{ lesson.duration_minutes }} минут</span>
                <span v-if="lesson.has_test" class="lesson-test">📝 Тест</span>
              </div>
            </div>
            <div class="lesson-actions">
              <!-- Простой статус -->
              <span class="lesson-status" :class="lesson.completed ? 'completed' : 'pending'">
                {{ lesson.completed ? '✅ Завершено' : '⏳ Ожидает' }}
              </span>
              
              <router-link 
                v-if="isLessonAccessible(lesson)"
                :to="`/courses/${courseId}/lesson/${lesson.id}`"
                class="lesson-button"
              >
                {{ lesson.completed ? 'Повторить' : 'Начать' }}
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
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const courseDetailStore = useCourseDetailStore();

const { course, lessons, progress, isLoading, error } = storeToRefs(courseDetailStore);

// Добавляем вычисление courseId
const courseId = computed(() => {
  const id = route.params.id;
  return id ? parseInt(id as string) : 0;
});

// НОВЫЙ МЕТОД: проверяем является ли урок первым в курсе
const isFirstLesson = (lesson: any) => {
  const sorted = [...lessons.value].sort((a, b) => a.order - b.order);
  return sorted.length > 0 && lesson.id === sorted[0].id;
};

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
  if (courseId.value) {
    courseDetailStore.fetchCourseDetail(courseId.value);
  }
};

// ВЫЧИСЛЯЕМЫЕ СВОЙСТВА 
const courseLevel = computed(() => {
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
  let next = lessonList.find(lesson => {
    return !lesson.completed && lesson.is_unlocked !== false;
  });
  if (!next) {
    next = lessonList.find(lesson => !lesson.completed);
  }
  if (!next) {
    return null;
  }
  return next;
});

const continueButtonText = computed(() => {
  const lesson = nextLesson.value;
  if (!lesson) return 'Курс завершен 🎉';
  if (lesson.is_unlocked === false) {
    return 'Продолжить обучение';
  }
  return `Продолжить: ${lesson.title || 'Следующий урок'}`;
});

// Методы 
const continueLearning = () => {
  const lesson = nextLesson.value;
  if (lesson?.id && courseId.value) {
    router.push(`/courses/${courseId.value}/lesson/${lesson.id}`);
  }
};

// Проверка доступности урока
const isLessonAccessible = (lessonItem: any) => {
  // Первый урок всегда доступен
  if (isFirstLesson(lessonItem)) {
    return true;
  }
  // Завершенные уроки доступны
  if (lessonItem.completed) {
    return true;
  }
  
  // Находим индекс текущего и целевого урока
  const sorted = sortedLessons.value;
  const currentIndex = sorted.findIndex(l => !l.completed);
  const targetIndex = sorted.findIndex(l => l.id === lessonItem.id);
  
  // Если целевой урок раньше текущего незавершенного - доступен
  if (targetIndex < currentIndex) {
    return true;
  }
  
  // Если целевой урок следующий после последнего завершенного - доступен
  if (targetIndex === currentIndex) {
    return true;
  }
  
  // Все остальные уроки недоступны
  return false;
};
</script>

<style scoped>
.course-detail {
  max-width: 1200px;
  margin: 40px auto 40px;
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

/* ОБНОВЛЕННЫЕ СТИЛИ ДЛЯ ЗАГОЛОВКА КУРСА */
.course-header {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  align-items: start;
}

.course-media {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.course-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.course-media-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #8C4CC3 0%, #6a3093 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.placeholder-icon {
  font-size: 4rem;
  color: white;
  opacity: 0.8;
}

.course-info {
  padding: 1rem 0;
}

.course-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.course-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Статистика курса */
.course-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

/* Прогресс */
.course-progress {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-label {
  font-weight: 600;
  color: var(--text-primary);
}

.progress-percent {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.2rem;
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
  background: linear-gradient(90deg, var(--primary), #a56dd1);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-details {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Кнопка продолжить */
.continue-button {
  width: 100%;
  padding: 1rem 2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.continue-button:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  opacity: 0.7;
  background: var(--primary);
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
  opacity: 1; /* Явно указываем нормальную прозрачность */
}

.lesson-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Завершенные уроки */
.lesson-item.completed {
  border-left-color: blue;
  background: #f8f9fa;
}

/* Текущий доступный урок */
.lesson-item.current {
  border-left-color: gray;
  background: white;
}

/* Заблокированные уроки (только те, которые не завершены и не текущие) */
.lesson-item.locked:not(.completed):not(.current) {
  opacity: 0.6;
  background: var(--gray-50);
  border-left-color: gray;
  cursor: not-allowed;
}

.lesson-item.locked:not(.completed):not(.current):hover {
  transform: none;
  box-shadow: var(--shadow-sm);
}

.lesson-item.locked:not(.completed):not(.current) .lesson-title {
  color: var(--text-secondary);
}

/* Кнопки действий */
.lesson-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* Заблокированная кнопка */
.lesson-button.locked {
  background: var(--gray-300) !important;
  color: var(--text-secondary) !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Подсказка для заблокированных уроков */
.locked-hint {
  font-size: 0.7rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 0.5rem;
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
@media (max-width: 968px) {
  .course-header {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }
  
  .course-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
    .course-header {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .course-media,
  .course-media-placeholder {
    height: 200px;
  }
  
  .course-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .course-title {
    font-size: 1.8rem;
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
.course-title {
    font-size: 1.6rem;
  }
  
  .course-description {
    font-size: 1rem;
  }
  
  .stat {
    gap: 0.8rem;
  }
  
  .stat-icon {
    font-size: 1.2rem;
    width: 35px;
    height: 35px;
  }
  
  .stat-value {
    font-size: 1.3rem;
  }
}
</style>