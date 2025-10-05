<template>
  <div class="user-courses">
    <h2>Мои курсы для преподавания</h2>
    
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
      <p>У вас пока нет курсов для преподавания</p>
      <router-link to="/courses" class="browse-button">
        Создать курс
      </router-link>
    </div>

    <!-- Список курсов преподавателя -->
    <div v-else class="courses-list">
      <div v-for="course in courses" :key="course.id" class="course-card instructor-course">
        <div class="course-info">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-meta">
            <span class="students-count">
              👥 {{ getStudentsCount(course.id) }} студентов
            </span>
            <span class="pending-homeworks">
              📝 {{ getPendingHomeworksCount(course.id) }} ДЗ на проверку
            </span>
            <span class="course-level" :class="course.access_level?.toLowerCase()">
              {{ getLevelDisplayName(course.access_level) }}
            </span>
          </div>
        </div>

        <div class="course-actions">
          <router-link :to="`/instructor/courses/${course.id}`" class="manage-button">
            Управление
          </router-link>
          <router-link :to="`/instructor/homeworks/pending?course=${course.id}`" 
                     class="review-button"
                     v-if="getPendingHomeworksCount(course.id) > 0">
            Проверить ДЗ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '@/stores/courses';
import { useInstructorStore } from '@/stores/instructorStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const coursesStore = useCoursesStore();
const instructorStore = useInstructorStore();
const { courses, isLoading, error } = storeToRefs(coursesStore);
const { fetchUserCourses } = coursesStore;

// Для преподавателя показываем все курсы, где он инструктор
const instructorCourses = computed(() => {
  // Здесь можно добавить фильтрацию курсов, где пользователь является инструктором
  return courses.value;
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

// Демо-функции (можно заменить на реальные данные из API)
const getStudentsCount = (courseId: number) => {
  // В реальности нужно получать количество студентов на курсе
  return Math.floor(Math.random() * 50) + 5;
};

const getPendingHomeworksCount = (courseId: number) => {
  // Считаем ДЗ на проверку для конкретного курса
  return instructorStore.pendingHomeworks.filter(
    hw => hw.lesson.course.id === courseId
  ).length;
};
</script>

<style scoped>
.user-courses {
  margin-bottom: 40px;
}

.user-courses h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.retry-button, .browse-button {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 16px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
}

.retry-button:hover, .browse-button:hover {
  background: #7b3fb3;
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
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.instructor-course {
  border-left-color: #8C4CC3;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.course-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.students-count, .pending-homeworks {
  font-size: 14px;
  color: #666;
}

.course-level {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
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
  color: #388e3c;
}

.course-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.manage-button, .review-button {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.manage-button {
  background: #8C4CC3;
  color: white;
}

.review-button {
  background: #FF6B6B;
  color: white;
}

.manage-button:hover {
  background: #7b3fb3;
}

.review-button:hover {
  background: #e55a5a;
}

/* Адаптивность */
@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .course-actions {
    flex-direction: row;
    width: 100%;
    min-width: auto;
  }
  
  .manage-button, .review-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .course-card {
    padding: 20px;
  }
  
  .course-actions {
    flex-direction: column;
  }
}
</style>