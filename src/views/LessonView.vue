<template>
  <div class="lesson-view">
    <!-- Минималистичные хлебные крошки -->
    <nav class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-link">Дашборд</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link :to="`/courses/${courseId}`" class="breadcrumb-link">Курс</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Урок {{ lesson?.order }}</span>
    </nav>

    <div class="lesson-container">
      <!-- Основной контент -->
      <div class="lesson-content">
        <!-- Видео плеер -->
        <div class="video-player">
          <div class="video-container">
            <video 
              v-if="lesson?.video_url"
              ref="videoElement"
              :src="lesson.video_url"
              controls
              class="video-element"
              @ended="markAsCompleted"
            >
              Ваш браузер не поддерживает видео.
            </video>
            <div v-else class="video-placeholder">
              <div class="placeholder-icon">🎬</div>
              <p>Видео будет доступно скоро</p>
            </div>
          </div>
        </div>

        <!-- Информация об уроке  -->
        <div class="lesson-info">
          <div class="lesson-header">
            <h1>{{ lesson?.title }}</h1>
            <div class="lesson-meta">
              <span class="meta-item">Урок {{ lesson?.order }}</span>
              <span class="meta-item">{{ lesson?.duration_minutes }} мин</span>
              <span v-if="lesson?.is_completed" class="status-badge completed">Завершено</span>
              <span v-else class="status-badge pending">В процессе</span>
            </div>
          </div>

          <div class="lesson-description">
            <p>{{ lesson?.description || 'Описание будет добавлено позже.' }}</p>
          </div>
        </div>

        <!-- Навигация между уроками  -->
        <div class="lesson-navigation">
          <button 
            class="nav-btn prev-btn"
            :disabled="!prevLesson"
            @click="navigateToPrevLesson"
          >
            ← Назад
          </button>

          <button 
            class="nav-btn test-btn"
            @click="startTest"
          >
            📝 Пройти тест
          </button>

          <button 
            v-if="!lesson?.is_completed"
            class="nav-btn complete-btn"
            @click="markAsCompleted"
          >
            Завершить урок
          </button>
          <button 
            v-else
            class="nav-btn next-btn"
            :disabled="!nextLesson"
            @click="navigateToNextLesson"
          >
            Далее →
          </button>
        </div>
      </div>

      <!-- Боковая панель  -->
      <div class="lesson-sidebar">
        <div class="sidebar-header">
          <h3>Уроки курса</h3>
          <span>{{ completedLessons }}/{{ totalLessons }}</span>
        </div>

        <div class="lessons-navigation">
          <div 
            v-for="lessonItem in courseLessons" 
            :key="lessonItem.id"
            class="lesson-nav-item"
            :class="{
              'current': lessonItem.id === lesson?.id,
              'completed': lessonItem.is_completed,
              'locked': !lessonItem.is_unlocked
            }"
            @click="navigateToLesson(lessonItem)"
          >
            <div class="lesson-nav-number">
              {{ lessonItem.order }}
            </div>
            <div class="lesson-nav-title">{{ lessonItem.title }}</div>
            <div class="lesson-nav-status">
              <span v-if="lessonItem.is_completed">✓</span>
              <span v-else-if="!lessonItem.is_unlocked">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProgressStore } from '@/stores/progress';

const route = useRoute();
const router = useRouter();
const progressStore = useProgressStore();

const lesson = ref<any>(null);
const courseLessons = ref<any[]>([]);
const isPlaying = ref(false);

// Добавляем отслеживание прогресса видео
const videoProgress = ref(0);
const videoElement = ref<HTMLVideoElement | null>(null);

const setupVideoProgress = () => {
  if (videoElement.value && lesson.value?.video_url) {
    videoElement.value.addEventListener('timeupdate', () => {
      if (videoElement.value) {
        const progress = (videoElement.value.currentTime / videoElement.value.duration) * 100;
        videoProgress.value = progress;
        progressStore.updateLessonProgress(lesson.value.id, progress);
      }
    });
  }
};

// Отмечаем урок как завершенный
const markAsCompleted = () => {
  if (lesson.value) {
    progressStore.completeLesson(lesson.value.id);
    lesson.value.is_completed = true;
  }
};

// Проверяем статус урока при загрузке
onMounted(() => {
  loadLessonData();
  setTimeout(() => {
    setupVideoProgress();
  }, 600);
});

const loadLessonData = () => {
  setTimeout(() => {
    lesson.value = {
      id: route.params.id,
      order: 3,
      title: 'Подготовка ногтей к маникюру',
      description: 'Изучите правильную технику подготовки ногтевой пластины. Важный этап для качественного маникюра.',
      duration_minutes: 25,
      video_url: '',
      is_completed: false,
      is_unlocked: true
    };

    // Проверяем статус урока после загрузки данных
    const isCompleted = progressStore.isLessonCompleted(lesson.value.id);
    if (isCompleted) {
      lesson.value.is_completed = true;
    }

    courseLessons.value = [
      { id: 1, order: 1, title: 'Введение в маникюр', duration_minutes: 15, is_completed: true, is_unlocked: true },
      { id: 2, order: 2, title: 'Инструменты и материалы', duration_minutes: 20, is_completed: true, is_unlocked: true },
      { id: 3, order: 3, title: 'Подготовка ногтей', duration_minutes: 25, is_completed: false, is_unlocked: true },
      { id: 4, order: 4, title: 'Основы покрытия', duration_minutes: 30, is_completed: false, is_unlocked: false },
      { id: 5, order: 5, title: 'Дизайн ногтей', duration_minutes: 35, is_completed: false, is_unlocked: false }
    ];
  }, 500);
};

// Вычисляемые свойства
const courseId = computed(() => route.params.courseId || '1');
const totalLessons = computed(() => courseLessons.value.length);
const completedLessons = computed(() => courseLessons.value.filter(l => l.is_completed).length);

const prevLesson = computed(() => {
  return courseLessons.value.find(l => l.order === (lesson.value?.order || 0) - 1);
});

const nextLesson = computed(() => {
  return courseLessons.value.find(l => l.order === (lesson.value?.order || 0) + 1);
});

// Методы
const navigateToLesson = (lessonItem: any) => {
  if (lessonItem.is_unlocked) {
    router.push(`/lessons/${lessonItem.id}`);
  }
};

const navigateToPrevLesson = () => {
  if (prevLesson.value) {
    router.push(`/lessons/${prevLesson.value.id}`);
  }
};

const navigateToNextLesson = () => {
  if (nextLesson.value) {
    router.push(`/lessons/${nextLesson.value.id}`);
  }
};

const startTest = () => {
  router.push(`/tests/1`);
};
</script>

<style scoped>
.lesson-view {
  max-width: 1200px;
  margin: 80px auto 40px;
  padding: 0 20px;
}

/* Хлебные крошки - минималистичные */
.breadcrumbs {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
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

/* Основной контейнер */
.lesson-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* Видео плеер - упрощенный */
.video-player {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: white;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

/* Информация об уроке */
.lesson-info {
  margin-bottom: 2rem;
}

.lesson-header {
  margin-bottom: 1rem;
}

.lesson-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.status-badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
}

.status-badge.completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.lesson-description {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Навигация между уроками */
.lesson-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.nav-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  color: var(--text-secondary);
}

.prev-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.complete-btn {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.complete-btn:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.next-btn {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.next-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

/* Боковая панель */
.lesson-sidebar {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.sidebar-header span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.lessons-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lesson-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.lesson-nav-item:hover {
  background: var(--gray-50);
}

.lesson-nav-item.current {
  background: var(--primary);
  color: white;
}

.lesson-nav-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lesson-nav-item.completed {
  background: var(--gray-50);
}

.lesson-nav-number {
  width: 24px;
  height: 24px;
  background: var(--gray-200);
  color: var(--text-secondary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.8rem;
}

.lesson-nav-item.current .lesson-nav-number {
  background: white;
  color: var(--primary);
}

.lesson-nav-item.completed .lesson-nav-number {
  background: #2e7d32;
  color: white;
}

.lesson-nav-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.3;
}

.lesson-nav-item.current .lesson-nav-title {
  color: white;
}

.lesson-nav-status {
  font-size: 0.8rem;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .lesson-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .lesson-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .lesson-view {
    margin: 60px auto 20px;
    padding: 0 16px;
  }
  
  .lesson-header h1 {
    font-size: 1.5rem;
  }
  
  .lesson-meta {
    gap: 0.5rem;
  }
  
  .lesson-navigation {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-btn {
    width: 100%;
  }
  
  .sidebar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .breadcrumbs {
    font-size: 0.8rem;
  }
  
  .lesson-nav-item {
    padding: 0.5rem;
  }
  
  .lesson-nav-title {
    font-size: 0.8rem;
  }
}
</style>