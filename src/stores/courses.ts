import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Course } from '@/types/api';
import apiClient from '@/api/client';

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Загрузка курсов пользователя
  const fetchUserCourses = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get('/courses/');
      courses.value = response.data.results || response.data;
      
      console.log('✅ User courses loaded:', courses.value);
    } catch (err) {
      error.value = 'Не удалось загрузить курсы';
      console.error('❌ Failed to fetch courses:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const activeCoursesCount = computed(() => courses.value.length);
  
  const completedLessonsCount = computed(() => {
    return Math.floor(courses.value.length * 5);
  });
  
  const averageProgress = computed(() => {
    if (courses.value.length === 0) return 0;
    return 65;
  });

  return {
    courses,
    isLoading,
    error,
    activeCoursesCount,
    completedLessonsCount,
    averageProgress,
    fetchUserCourses
  };
});