<template>
  <div class="lesson-view" v-if="!isLoading && !error">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs" v-if="lessonDetail">
      <router-link to="/my-courses">Мои курсы</router-link>
      <span class="separator">/</span>
      <router-link :to="`/courses/${lessonDetail.course_id}`">
        {{ lessonDetail.course_title }}
      </router-link>
      <span class="separator">/</span>
      <span class="current">{{ lessonDetail.title }}</span>
    </nav>

    <!-- Заголовок урока -->
    <div class="lesson-header">
      <h1>{{ lessonDetail?.title }}</h1>
      <div class="lesson-meta">
        <span class="duration">Длительность: {{ lessonDetail?.duration_minutes }} мин.</span>
        <span v-if="lesson?.completed" class="completed-badge">✓ Завершено</span>
      </div>
    </div>

    <!-- Видео плеер -->
    <div class="video-section" v-if="hasVideo">
      <video 
        ref="videoPlayer"
        :src="getVideoSource(lessonDetail!.video_url)!" 
        controls
        class="video-player"
        @ended="handleVideoEnd"
        @timeupdate="handleTimeUpdate"
      >
        Ваш браузер не поддерживает видео.
      </video>
    </div>

    <!-- Сообщение если видео нет -->
    <div v-else-if="lessonDetail" class="no-video">
      <div class="no-video-content">
        <div class="no-video-icon">🎬</div>
        <h3>Видео материал готовится</h3>
        <p>Видео для этого урока будет доступно в ближайшее время.</p>
        <div class="lesson-content-placeholder">
          <p>Содержание урока: {{ lessonDetail.description || 'Информация будет добавлена' }}</p>
        </div>
      </div>
    </div>

    <!-- Описание урока -->
    <div class="lesson-description" v-if="lessonDetail?.description">
      <h3>Описание урока</h3>
      <p>{{ lessonDetail.description }}</p>
    </div>

    <!-- Материалы для скачивания -->
    <div class="materials-section" v-if="lessonDetail?.materials?.length">
      <h3>Материалы для скачивания</h3>
      <ul class="materials-list">
        <li v-for="material in lessonDetail.materials" :key="material.id" class="material-item">
          <a :href="material.file" download class="material-link">
            📎 {{ material.name }}
          </a>
          <span class="material-date">{{ formatDate(material.uploaded_at) }}</span>
        </li>
      </ul>
    </div>

    <!-- Навигация между уроками -->
    <div class="lesson-navigation">
      <button 
        v-if="hasPreviousLesson" 
        @click="goToPreviousLesson"
        class="nav-button prev"
      >
        ← Предыдущий урок
      </button>
      
      <button 
        v-if="lesson?.has_test" 
        @click="goToTest"
        class="nav-button test"
      >
        Пройти тест →
      </button>
      
      <button 
        v-else-if="hasNextLesson" 
        @click="goToNextLesson"
        class="nav-button next"
      >
        Следующий урок →
      </button>

      <button 
        v-else 
        @click="goToCourse"
        class="nav-button course"
      >
        Вернуться к курсу
      </button>
    </div>
  </div>

  <!-- Состояния загрузки и ошибок -->
  <div v-if="isLoading" class="loading-state">
    <p>Загрузка урока...</p>
  </div>

  <div v-if="error" class="error-state">
    <p>{{ error }}</p>
    <button @click="retryLoading" class="retry-button">Попробовать снова</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseDetailStore } from '@/stores/courseDetail';

const route = useRoute();
const router = useRouter();
const courseDetailStore = useCourseDetailStore();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const lessonId = computed(() => Number(route.params.lessonId));
const courseId = computed(() => Number(route.params.courseId));

const lessonDetail = computed(() => courseDetailStore.currentLesson);
const lessons = computed(() => courseDetailStore.lessons);
const isLoading = computed(() => courseDetailStore.isLoading);
const error = computed(() => courseDetailStore.error);

const currentLessonIndex = computed(() => 
  lessons.value.findIndex(lesson => lesson.id === lessonId.value)
);

const hasPreviousLesson = computed(() => currentLessonIndex.value > 0);
const hasNextLesson = computed(() => currentLessonIndex.value < lessons.value.length - 1);

const previousLessonId = computed(() => 
  hasPreviousLesson.value ? lessons.value[currentLessonIndex.value - 1].id : null
);

const nextLessonId = computed(() => 
  hasNextLesson.value ? lessons.value[currentLessonIndex.value + 1].id : null
);

const lesson = computed(() => 
  lessons.value.find(l => l.id === lessonId.value)
);

// Временный метод для тестирования видео
const getVideoSource = (videoUrl: string | null): string | null => {
  // Если есть настоящее видео - используем его
  if (videoUrl) {
    return videoUrl;
  }
  
  // Для демонстрации всегда возвращаем тестовое видео
  // Закомментируйте следующую строку чтобы показывать заглушку
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  // Или возвращаем null чтобы показать заглушку
  // return null;
};

// Проверяем есть ли видео для отображения
const hasVideo = computed(() => {
  return lessonDetail.value && getVideoSource(lessonDetail.value.video_url) !== null;
});

// Загрузка данных урока
const loadLessonData = async () => {
  await courseDetailStore.fetchLessonDetail(lessonId.value);
};

onMounted(() => {
  loadLessonData();
});

watch(lessonId, loadLessonData);

// Обработчики видео
const handleVideoEnd = async () => {
  if (lesson.value && !lesson.value.completed) {
    await courseDetailStore.markLessonCompleted(lessonId.value);
  }
};

const handleTimeUpdate = () => {
  if (videoPlayer.value) {
    const progress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100;
    if (progress > 90 && lesson.value && !lesson.value.completed) {
      courseDetailStore.markLessonCompleted(lessonId.value);
    }
  }
};

// Навигация
const goToLesson = (lessonId: number) => {
  router.push(`/course/${courseId.value}/lesson/${lessonId}`);
};

const goToPreviousLesson = () => {
  if (previousLessonId.value !== null) {
    goToLesson(previousLessonId.value);
  }
};

const goToNextLesson = () => {
  if (nextLessonId.value !== null) {
    goToLesson(nextLessonId.value);
  }
};

const goToTest = () => {
  if (lesson.value?.has_test) {
    router.push(`/course/${courseId.value}/lesson/${lessonId.value}/test`);
  }
};

const goToCourse = () => {
  router.push(`/courses/${courseId.value}`);
};

const retryLoading = () => {
  loadLessonData();
};

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};
</script>

<style scoped>
.lesson-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumbs {
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumbs a {
  color: #8C4CC3;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 8px;
  color: #666;
}

.lesson-header {
  margin-bottom: 30px;
}

.lesson-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.lesson-meta {
  display: flex;
  gap: 20px;
  color: #666;
}

.completed-badge {
  color: #4ECDC4;
  font-weight: bold;
}

.video-section {
  margin-bottom: 30px;
}

.video-player {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 8px;
}

.no-video {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.no-video-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-video-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-video h3 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-video p {
  color: #6c757d;
  line-height: 1.5;
}

.lesson-content-placeholder {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  border-left: 4px solid #8C4CC3;
}

.lesson-description {
  margin-bottom: 30px;
}

.lesson-description h3 {
  color: #333;
  margin-bottom: 10px;
}

.materials-section {
  margin-bottom: 40px;
}

.materials-section h3 {
  color: #333;
  margin-bottom: 15px;
}

.materials-list {
  list-style: none;
  padding: 0;
}

.material-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.material-link {
  color: #8C4CC3;
  text-decoration: none;
  flex-grow: 1;
}

.material-link:hover {
  text-decoration: underline;
}

.material-date {
  color: #666;
  font-size: 12px;
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 40px;
}

.nav-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.nav-button.prev {
  background: #f0f0f0;
  color: #333;
}

.nav-button.next,
.nav-button.test {
  background: #8C4CC3;
  color: white;
}

.nav-button.course {
  background: #4ECDC4;
  color: white;
}

.nav-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-state {
  color: #FF6B6B;
}

.retry-button {
  margin-top: 15px;
  padding: 10px 20px;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .lesson-view {
    padding: 15px;
  }
  
  .lesson-navigation {
    flex-direction: column;
  }
  
  .nav-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>