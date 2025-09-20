import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Course } from '@/types/api';
import apiClient from '@/api/client';

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchTime = ref<number>(0); 

  // Загрузка курсов пользователя
  const fetchUserCourses = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime.value < 5000 && courses.value.length > 0) {
      console.log('⏩ Skip loading - data is fresh');
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('🔄 Fetching courses from API...');
      const response = await apiClient.get('/courses/');
      console.log('✅ API response:', response.data);
      
      courses.value = response.data.results || response.data;
      lastFetchTime.value = now; 
      
      console.log('✅ User courses loaded:', courses.value.length, 'courses');
    } catch (err: any) {
      error.value = 'Не удалось загрузить курсы';
      console.error('❌ Failed to fetch courses:', err);
      
      if (err.response) {
        console.error('Error response:', err.response.status, err.response.data);
        error.value = `Ошибка ${err.response.status}: ${err.response.data.detail || 'Не удалось загрузить курсы'}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        error.value = 'Нет ответа от сервера';
      } else {
        console.error('Error message:', err.message);
        error.value = err.message;
      }
    } finally {
      isLoading.value = false;
      console.log('📊 Loading state:', isLoading.value);
    }
  };

  // Вычисляемые свойства для статистики
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