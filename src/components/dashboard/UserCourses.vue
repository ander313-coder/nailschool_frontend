<template>
  <div class="user-courses">
    <!-- Заголовок показываем только если не на странице /my-courses -->
    <h2 v-if="!isStandalonePage">Мои курсы</h2>
    
    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading">
      <p>Загрузка курсов...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchCourses" class="retry-button">Попробовать снова</button>
    </div>

    <!-- Состояние когда курсов нет -->
    <div v-else-if="courses.length === 0" class="empty-state">
      <p>У вас пока нет активных курсов</p>
      <router-link to="/courses" class="browse-button">
        Посмотреть все курсы
      </router-link>
    </div>

    <!-- Список курсов -->
    <div v-else class="courses-list">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="course-info">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-meta">
            <span class="lessons-count">
              {{ course.lesson_count || 0 }} уроков
            </span>
            <span class="course-level" :class="course.access_level?.toLowerCase()">
              {{ getLevelDisplayName(course.access_level) }}
            </span>
          </div>
        </div>

        <div class="course-actions">
          <router-link :to="`/courses/${course.id}`" class="continue-button">
            Продолжить
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '@/stores/courses';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const coursesStore = useCoursesStore();
const { courses, isLoading, error } = storeToRefs(coursesStore);
const { fetchUserCourses } = coursesStore;

// Определяем, находится ли компонент на отдельной странице
const isStandalonePage = computed(() => {
  return route.path === '/my-courses';
});

const fetchCourses = () => {
  fetchUserCourses();
};

const getLevelDisplayName = (level: string | undefined) => {
  const levelMap: Record<string, string> = {
    'BASIC': 'Начальный',
    'ADVANCED': 'Продвинутый',
    'ALL': 'Все уровни'
  };
  return level ? levelMap[level] || level : 'Все уровни';
};
</script>

<style scoped>
.user-courses {
  margin-top: 32px;
}

.user-courses h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #8C4CC3;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.course-description {
  color: #666;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.lessons-count {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-level {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-level.basic {
  background: #e3f2fd;
  color: #1976d2;
}

.course-level.advanced {
  background: #f3e5f5;
  color: #7b1fa2;
}

.course-level.all {
  background: #e8f5e8;
  color: #2e7d32;
}

/* Кнопки */
.course-actions {
  margin-left: 16px;
}

.continue-button {
  background: #8C4CC3;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.continue-button:hover {
  background: #7b3fb3;
}

/* Состояния */
.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.retry-button {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  margin-top: 12px;
  cursor: pointer;
}

.browse-button {
  background: #8C4CC3;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  margin-top: 12px;
  display: inline-block;
}

/* Адаптивность */
@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .course-actions {
    margin-left: 0;
    align-self: stretch;
  }
  
  .continue-button {
    display: block;
    text-align: center;
  }
}
</style>