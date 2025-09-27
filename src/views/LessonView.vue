<template>
  <div class="lesson-view" v-if="!isLoading && !error">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs" v-if="lessonDetail">
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
    <div class="video-section" v-if="lessonDetail?.video_url">
      <video 
        ref="videoPlayer"
        :src="lessonDetail.video_url" 
        controls
        class="video-player"
        @ended="handleVideoEnd"
        @timeupdate="handleTimeUpdate"
      >
        Ваш браузер не поддерживает видео.
      </video>
    </div>

    <!-- Сообщение если видео нет -->
    <div v-else class="no-video">
      <p>Видео материал для этого урока пока не доступен.</p>
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
    <!-- Чекбокс завершения урока -->
    <div class="completion-checkbox" v-if="!isLoading">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          :checked="localCompleted" 
          @change="toggleCompletion"
          class="checkbox-input"
          :disabled="isLoadingCompletion"
        />
        <span class="checkmark" :class="{ checked: localCompleted }"></span>
        <span class="checkbox-text">
          {{ localCompleted ? 'Урок завершен' : 'Отметить как пройденный' }}
        </span>
      </label>
      
      <div v-if="isLoadingCompletion" class="loading-indicator">
        Сохранение...
      </div>
    </div>
    <HomeworkComponent v-if="lesson?.has_homework":lesson-id="lessonId"/>
    <!-- Модальное окно теста -->
    <div v-if="showTest" class="test-modal">
      <div class="modal-content">
        <button class="close-btn" @click="closeTest">×</button>
        <TestComponent 
          :test-id="getTestIdForLesson()" 
          :lesson-id="lessonId"
          @close="closeTest"
        />
      </div>
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
import HomeworkComponent from '@/components/HomeworkComponent.vue'; 
import TestComponent from '@/components/TestComponent.vue';

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
const showTest = ref(false);

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
  router.push(`/courses/${courseId.value}/lesson/${lessonId}`);
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
  showTest.value = true;
};

const closeTest = () => {
  showTest.value = false;
};

const getTestIdForLesson = () => {
  return lessonId.value * 10; // Простая демо-логика
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

// Локальное состояние для чекбокса
const localCompleted = ref(false);
const isLoadingCompletion = ref(false);
const isInitialized = ref(false);

// Инициализация при загрузке компонента
onMounted(() => {
  initializeCompletionState();
});

// Следим за изменениями данных урока
watch(lessonDetail, (newLesson) => {
  if (newLesson) {
    // Защита от undefined - используем false по умолчанию
    localCompleted.value = newLesson.is_completed === true;
    console.log('📥 Данные урока обновились, is_completed:', newLesson.is_completed, 'установлено:', localCompleted.value);
  }
}, { immediate: true });

// Функция инициализации состояния
const initializeCompletionState = () => {
  if (lessonDetail.value) {
    // Защита от undefined
    localCompleted.value = lessonDetail.value.is_completed === true;
    console.log('🎯 Инициализация чекбокса:', lessonDetail.value.is_completed, 'установлено:', localCompleted.value);
    isInitialized.value = true;
  }
};
// Переключение статуса завершения
const toggleCompletion = async () => {
  if (isLoadingCompletion.value) return;
  
  console.log('🔄 Начало переключения, текущее состояние:', localCompleted.value);
  
  isLoadingCompletion.value = true;
  const previousState = localCompleted.value;
  
  try {
    // Мгновенно меняем состояние для UX
    localCompleted.value = !previousState;
    console.log('🔄 Установлено новое состояние:', localCompleted.value);
    
    if (localCompleted.value) {
      console.log('📤 Отмечаем как завершенный');
      await courseDetailStore.markLessonCompleted(lessonId.value);
    } else {
      console.log('📤 Отмечаем как не завершенный');
      await courseDetailStore.markLessonIncomplete(lessonId.value);
    }
    
    console.log('✅ Статус успешно обновлен');
    
  } catch (error: any) {
    // При ошибке возвращаем предыдущее состояние
    console.error('❌ Ошибка при изменении статуса:', error);
    localCompleted.value = previousState;
    
    // Показываем уведомление об ошибке
    alert('Не удалось сохранить статус урока. Попробуйте снова.');
  } finally {
    isLoadingCompletion.value = false;
    console.log('🔚 Завершение переключения, финальное состояние:', localCompleted.value);
  }
};

</script>

<style scoped>
.completion-checkbox {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid #8C4CC3;
  border-radius: 4px;
  background: white;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkmark {
  background: #8C4CC3;
  border-color: #8C4CC3;
}

.checkbox-input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.checkbox-input:disabled + .checkmark {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-text {
  transition: color 0.2s ease;
}

.checkbox-input:checked ~ .checkbox-text {
  color: #8C4CC3;
  font-weight: 600;
}

.loading-indicator {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

/* Состояния при наведении */
.checkbox-label:hover .checkmark {
  border-color: #6a3093;
  transform: scale(1.05);
}

.checkbox-input:checked:hover + .checkmark {
  background: #6a3093;
  border-color: #6a3093;
}

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

/* СТИЛИ ДЛЯ МОДАЛЬНОГО ОКНА */
.test-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  width: 800px;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

@media (max-width: 768px) {
    .completion-checkbox {
    padding: 1rem;
  }
  
  .checkbox-label {
    font-size: 1rem;
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
  }
  
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
  .modal-content {
    width: 95%;
    padding: 1rem;
  }
}
</style>