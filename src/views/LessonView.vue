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

    <!-- Основной контейнер с grid -->
    <div class="lesson-container">
      <!-- Левая колонка - основной контент урока -->
      <div class="lesson-content">
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
              <a :href="material.url" download :title="material.title || material.name" class="material-link">
                📎 {{ material.name || material.title }}
              </a>
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
            Пройти тест
          </button>
          
          <!-- заблокирована пока чекбокс не отмечен -->
          <button 
            v-if="hasNextLesson" 
            @click="goToNextLesson"
            class="nav-button next"
            :disabled="!canProceedToNextLesson"
            :class="{ 'disabled': !canProceedToNextLesson }"
          >
            Следующий урок →
          </button>

          <button 
            v-else 
            @click="goToCourse"
            class="nav-button course"
            :disabled="!canProceedToNextLesson"
            :class="{ 'disabled': !canProceedToNextLesson }"
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
              @change="handleCheckboxChange"
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
        <HomeworkComponent v-if="showHomework" :lesson-id="lessonId"/>
      </div>

      <!-- Правая колонка - боковая панель с уроками -->
      <div class="lessons-sidebar">
        <!-- Заголовок боковой панели -->
        <div class="sidebar-header">
          <h3>Уроки курса</h3>
          <div class="progress-info">
            <span>Прогресс: {{ progress.progress_percent }}%</span>
            <span>({{ progress.completed_lessons }}/{{ progress.total_lessons }})</span>
          </div>
        </div>

        <!-- ОБНОВЛЕННЫЙ список уроков -->
        <div class="lessons-list">
          <div 
            v-for="lessonItem in lessons" 
            :key="lessonItem.id"
            class="lesson-item"
            :class="{
              'current': lessonItem.id === lessonId,
              'completed': lessonItem.completed,
              'locked': !isLessonAccessible(lessonItem)
            }"
            @click="goToLesson(lessonItem.id)"
          >
            <div class="lesson-item-icon">
              <span v-if="lessonItem.completed" class="completed-icon">✓</span>
              <span v-else-if="lessonItem.id === lessonId" class="current-icon">▶</span>
              <span v-else class="default-icon">●</span>
            </div>
            
            <div class="lesson-item-content">
              <div class="lesson-title">{{ lessonItem.title }}</div>
              <div class="lesson-meta">
                <span class="duration">{{ lessonItem.duration_minutes }} мин</span>
                <span v-if="lessonItem.has_test" class="test-badge">📝 Тест</span>
                <span v-if="lessonItem.has_homework" class="homework-badge">ДЗ</span>
                <!-- Показываем подсказку для заблокированных уроков -->
                <span v-if="!isLessonAccessible(lessonItem) && lessonItem.id !== lessonId" class="locked-hint">
                  🔒 Завершите текущий урок
                </span>
              </div>
            </div>
          </div>
        </div>
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

  <!-- Модальное окно теста -->
  <div v-if="showTestModal" class="test-modal-overlay" @click.self="closeTestModal">
    <div class="test-modal">
      <!-- Заголовок модального окна -->
      <div class="test-modal-header">
        <h2>📝 Тестирование</h2>
        <button class="close-btn" @click="closeTestModal">×</button>
      </div>

      <!-- Контент теста -->
      <div class="test-modal-content">
        <TestModal 
          v-if="currentTestId"
          :test-id="currentTestId"
          :lesson-id="lessonId"
          @completed="handleTestCompleted"
          @closed="closeTestModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseDetailStore } from '@/stores/courseDetail';
import HomeworkComponent from '@/components/HomeworkComponent.vue'; 
import TestModal from '@/components/TestModal.vue';

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
const progress = computed(() => courseDetailStore.progress);

// Локальное состояние для чекбокса
const localCompleted = ref(false);
const isLoadingCompletion = ref(false);

// Загрузка данных урока 
const loadLessonData = async () => {
  try {
    await Promise.all([
      courseDetailStore.fetchLessonDetail(lessonId.value),
      courseDetailStore.fetchCourseDetail(courseId.value)
    ]);
    
    // Инициализируем состояние чекбокса после загрузки данных
    if (lessonDetail.value) {
      localCompleted.value = lessonDetail.value.is_completed === true;
      console.log('🎯 Чекбокс инициализирован:', localCompleted.value);
    }
  } catch (error) {
    console.error('Error loading lesson data:', error);
  }
  console.log('🔍 Проверка синхронизации:', {
    localCompleted: localCompleted.value,
    lessonCompleted: lessonDetail.value?.is_completed,
    lessonsCount: lessons.value.length,
    completedLessons: lessons.value.filter(l => l.completed).length
  });
};

// Инициализация при загрузке компонента
onMounted(() => {
  loadLessonData();
});

// Следим за изменениями ID урока
watch(lessonId, loadLessonData);

// Обработчики видео
const handleVideoEnd = async () => {
  // Автоматически ставим галочку только если она еще не стоит
  if (lessonDetail.value && !lessonDetail.value.is_completed) {
    console.log('🎬 Видео завершено, автоматически отмечаем урок');
    await toggleCompletion(true); // true = автоматическое завершение
  }
};

const handleTimeUpdate = () => {
  if (videoPlayer.value && videoPlayer.value.duration) {
    const progress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100;
    // Автоматически отмечаем при 90% просмотра, только если галочка не стоит
    if (progress > 90 && lessonDetail.value && !lessonDetail.value.is_completed) {
      console.log('⏰ Просмотрено 90%, автоматически отмечаем урок');
      courseDetailStore.updateLessonStatus(lessonId.value, true);
      localCompleted.value = true;
    }
  }
};

// УНИВЕРСАЛЬНЫЙ МЕТОД ДЛЯ ПЕРЕКЛЮЧЕНИЯ СТАТУСА
const toggleCompletion = async (isAutoComplete = false) => {
  if (isLoadingCompletion.value) return;
  
  const newCompletedState = !localCompleted.value;
  console.log('🔄 Переключение статуса урока:', {
    текущий: localCompleted.value,
    новый: newCompletedState,
    авто: isAutoComplete
  });
  
  isLoadingCompletion.value = true;

  try {
    // Мгновенно обновляем UI для лучшего UX
    localCompleted.value = newCompletedState;
    
    // Используем единый метод для обновления статуса
    await courseDetailStore.updateLessonStatus(lessonId.value, newCompletedState);
    
    console.log('✅ Статус урока успешно обновлен');
    
  } catch (error: any) {
    // Откатываем изменения при ошибке
    console.error('❌ Ошибка при изменении статуса:', error);
    localCompleted.value = !newCompletedState;
    
    if (!isAutoComplete) {
      alert('Не удалось сохранить статус урока. Попробуйте снова.');
    }
  } finally {
    isLoadingCompletion.value = false;
  }
};

// Обработчик клика по чекбоксу (только ручное переключение)
const handleCheckboxChange = (event: Event) => {
  console.log('✏️ Ручное переключение чекбокса');
  toggleCompletion(false);
};

// Обработчик завершения теста - НЕ АВТОМАТИЧЕСКИ ОТМЕЧАЕМ УРОК
const handleTestCompleted = (result: any) => {
  console.log('📝 Тест завершен, результат:', result);
  
  // Тест НЕ должен автоматически отмечать урок как завершенный
  // Пользователь должен сам поставить галочку
  if (result.passed) {
    console.log('🎉 Тест пройден, но урок не отмечаем автоматически');
    // Можно показать сообщение, но не ставить галочку
  }
  
  closeTestModal();
};

// Остальные методы
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

// Навигация
// Проверка доступности урока для перехода
const isLessonAccessible = (lessonItem: any) => {
  // Текущий урок всегда доступен
  if (lessonItem.id === lessonId.value) {
    return true;
  }
  // Завершенные уроки доступны
  if (lessonItem.completed) {
    return true;
  }
  
  // Находим индекс текущего и целевого урока
  const currentIndex = lessons.value.findIndex(l => l.id === lessonId.value);
  const targetIndex = lessons.value.findIndex(l => l.id === lessonItem.id);
  
  // Если целевой урок раньше текущего - доступен
  if (targetIndex < currentIndex) {
    return true;
  }
  
  // Если целевой урок следующий после текущего - доступен только если текущий завершен
  if (targetIndex === currentIndex + 1) {
    return localCompleted.value === true;
  }
  
  // Все остальные уроки недоступны
  return false;
};

const goToLesson = (lessonItemId: number) => {
  const lessonItem = lessons.value.find(l => l.id === lessonItemId);
  if (!lessonItem || !isLessonAccessible(lessonItem)) {
    console.log('🚫 Урок заблокирован:', lessonItemId);
    return; // Не переходим если урок недоступен
  }
  console.log('✅ Переход к уроку:', lessonItemId);
  router.push(`/courses/${courseId.value}/lesson/${lessonItemId}`);
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

const realTestId = computed(() => {
  const currentLesson = lessons.value.find(l => l.id === lessonId.value);
  return (currentLesson as any)?.test_id || null;
});

const showTestModal = ref(false);
const currentTestId = ref<number | null>(null);

// проверка доступности следующего урока
const canProceedToNextLesson = computed(() => {
  return localCompleted.value === true;
});

const goToTest = () => {
  if (realTestId.value) {
    currentTestId.value = realTestId.value;
    showTestModal.value = true;
  } else {
    alert('Для этого урока тест не предусмотрен');
  }
};

const closeTestModal = () => {
  showTestModal.value = false;
  currentTestId.value = null;
};

const goToCourse = () => {
  router.push(`/courses/${courseId.value}`);
};

const retryLoading = () => {
  loadLessonData();
};

const showHomework = computed(() => {
  return lessonDetail.value?.has_homework || false;
});
</script>

<style scoped>
/* Основной контейнер с grid */
.lesson-container {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2rem;
  align-items: start;
  margin-top: 1rem;
}

/* Основные стили контента */
.lesson-view {
  max-width: 1200px;
  margin: 40px auto 40px;
  padding: 0 20px;
}

.lesson-content {
  min-width: 0;
}

/* Хлебные крошки */
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

/* Заголовок урока */
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

}
.test-badge {
  padding: 2px 6px;
  border-radius: 4px;
  border: solid 1px;

}


/* Видео секция */
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

/* Описание и материалы */
.lesson-description,
.materials-section {
  margin-bottom: 30px;
}

.lesson-description h3,
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

/* Боковая панель с уроками */
.lessons-sidebar {
  position: sticky;
  top: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 1.5rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.progress-info span:first-child {
  font-weight: 500;
  color: #8C4CC3;
}

/* Список уроков */
.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lesson-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.lesson-item:hover {
  background: white;
  border-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.lesson-item.current {
  background: #8C4CC3;
  border-color: #8C4CC3;
  color: white;
}

.lesson-item.completed:not(.current) {
  background: #f0f9ff;
  border-color: #e6f3ff;
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

.lesson-item.locked {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f8f9fa !important;
  border-color: #e9ecef !important;
}

.lesson-item.locked:hover {
  transform: none !important;
  box-shadow: none !important;
  background: #f8f9fa !important;
}

.lesson-item.locked .lesson-title {
  color: #666;
}

.lesson-item.locked .lesson-meta {
  color: #999;
}

/* Иконки и статусы */
.lesson-item-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.completed-icon {
  color: #4ECDC4;
  font-weight: bold;
}

.completed-badge {
  color: #4ECDC4;
  font-weight: bold;
}

/* Чекбокс завершения */
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

/* Кнопки навигации */
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

/* Стили для заблокированных кнопок */
.nav-button:disabled,
.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.nav-button:disabled:hover,
.nav-button.disabled:hover {
  opacity: 0.5;
  transform: none !important;
  box-shadow: none !important;
}

/* Стили для модального окна */
.test-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.test-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.test-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #8C4CC3 0%, #6a3093 100%);
  color: white;
}

.test-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.test-modal-content {
  max-height: calc(90vh - 80px);
  overflow-y: auto;
}

/* Состояния загрузки и ошибок */
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

/* Адаптивность */
@media (max-width: 768px) {
  .lesson-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .lessons-sidebar {
    position: static;
    max-height: none;
    order: 2;
  }
  
  .lesson-content {
    order: 1;
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