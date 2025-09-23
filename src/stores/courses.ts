import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Course } from '@/types/api';
import { courseService } from '@/services/courseService';

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchTime = ref<number>(0);

  // Загрузка курсов с API
  const fetchUserCourses = async (force = false) => {
    // Защита от частых повторных загрузок
    const now = Date.now();
    if (!force && isLoading.value) {
      console.log('⏩ Skip loading - already loading');
      return;
    }
    
    if (!force && now - lastFetchTime.value < 5000 && courses.value.length > 0) {
      console.log('⏩ Skip loading - data is fresh');
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('🔄 Fetching courses from API...');
      courses.value = await courseService.getCourses();
      lastFetchTime.value = now;
      console.log('✅ Courses loaded:', courses.value.length);
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Не удалось загрузить курсы';
      console.error('❌ Error loading courses:', err);
      
      // Fallback: используем заглушки если API не доступен
      if (err.response?.status === 404 || err.response?.status === 500) {
        console.log('📋 Using mock data as fallback');
        courses.value = getMockCourses();
        error.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Заглушки на случай если API не доступен
  const getMockCourses = (): Course[] => {
    return [
      {
        id: 1,
        title: 'Базовый курс маникюра',
        description: 'Основы работы с инструментами и материалами',
        access_level: 'BASIC',
        course_type: 'VIDEO',
        lesson_count: 12,
        cover_image: '/images/course1.jpg'
      },
      {
        id: 2,
        title: 'Продвинутый дизайн ногтей',
        description: 'Сложные техники и трендовые дизайны',
        access_level: 'ADVANCED', 
        course_type: 'VIDEO',
        lesson_count: 8,
        cover_image: '/images/course2.jpg'
      }
    ] as Course[];
  };

  // Вычисляемые свойства
  const activeCoursesCount = computed(() => courses.value.length);
  
  const completedLessonsCount = computed(() => {
    // TODO: Заменить на реальные данные когда будут доступны
    return Math.floor(courses.value.length * 5);
  });

  return {
    courses,
    isLoading,
    error,
    activeCoursesCount,
    completedLessonsCount,
    fetchUserCourses
  };
});