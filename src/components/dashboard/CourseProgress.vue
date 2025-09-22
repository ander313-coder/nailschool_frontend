<template>
  <div class="course-progress">
    <h3>Прогресс по курсам</h3>
    
    <div class="progress-list">
      <div v-for="course in courses" :key="course.id" class="course-progress-item">
        <div class="course-info">
          <h4>{{ course.title }}</h4>
          <span class="course-lessons">{{ course.lesson_count }} уроков</span>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: getCourseProgress(course.id) + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ getCourseProgress(course.id) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '@/stores/courses';
import { useProgressStore } from '@/stores/progress';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const coursesStore = useCoursesStore();
const progressStore = useProgressStore();

const { courses } = storeToRefs(coursesStore);
const { completedLessons } = storeToRefs(progressStore);

// Заглушка для расчета прогресса курса
const getCourseProgress = (courseId: number) => {
  // Здесь будет реальная логика расчета прогресса
  // Пока возвращаем случайное значение для демонстрации
  return Math.floor(Math.random() * 100);
};
</script>

<style scoped>
.course-progress {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.course-progress h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.course-info {
  flex: 1;
}

.course-info h4 {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.course-lessons {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 120px;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 30px;
  text-align: right;
}

@media (max-width: 768px) {
  .course-progress-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .progress-container {
    justify-content: space-between;
  }
}
</style>