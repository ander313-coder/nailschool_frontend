import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Course, Lesson } from '@/types/api';
import { courseService } from '@/services/courseService';

// Интерфейс для прогресса
interface CourseProgress {
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
}

export const useCourseDetailStore = defineStore('courseDetail', () => {
  const course = ref<Course | null>(null);
  const lessons = ref<Lesson[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const progress = ref<CourseProgress>({
    completed_lessons: 0,
    total_lessons: 0,
    progress_percent: 0
  });

  // Загрузка деталей курса
  const fetchCourseDetail = async (courseId: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`🔄 Loading course details for ID: ${courseId}`);
      
      // Загружаем только курс и уроки
      const [courseData, lessonsData] = await Promise.all([
        courseService.getCourse(courseId),
        courseService.getCourseLessons(courseId)
      ]);

      course.value = courseData;
      lessons.value = lessonsData || [];

      // Вычисляем прогресс на клиенте
      progress.value = {
        completed_lessons: lessonsData?.filter(lesson => lesson.is_completed).length || 0,
        total_lessons: lessonsData?.length || 0,
        progress_percent: lessonsData?.length ? 
          Math.round((lessonsData.filter(lesson => lesson.is_completed).length / lessonsData.length) * 100) : 0
      };

      console.log(`✅ Course details loaded:`, {
        course: courseData?.title || 'Unknown',
        lessons: lessonsData?.length || 0,
        progress: progress.value.progress_percent
      });

    } catch (err: any) {
      error.value = err.response?.data?.detail || `Не удалось загрузить данные курса ${courseId}`;
      console.error(`❌ Error loading course ${courseId}:`, err);
      
      useMockData(courseId);
      error.value = null;
    } finally {
      isLoading.value = false;
    }
  };


  // Заглушки для демонстрации
  const useMockData = (courseId: number) => {
  console.log('📋 Using mock data for course details');
  
  course.value = {
    id: courseId,
    title: 'Базовый курс маникюра',
    description: 'Основы работы с инструментами и материалами. Изучите базовые техники и принципы ухода за ногтями.',
    access_level: 'BASIC',
    course_type: 'VIDEO',
    lesson_count: 12,
    duration_minutes: 240,
    cover_image: '/images/course1.jpg'
  } as Course; // Явное указание типа

  lessons.value = [
    {
      id: 1,
      course_id: courseId,
      title: 'Введение в маникюр',
      description: 'Знакомство с профессией и основными понятиями',
      duration_minutes: 15,
      order: 1,
      is_completed: true,
      has_test: true,
      is_unlocked: true
    }
  ] as Lesson[];

  progress.value = {
    completed_lessons: 2,
    total_lessons: lessons.value.length,
    progress_percent: Math.round((2 / lessons.value.length) * 100)
  };
};

  // Сброс состояния
  const reset = () => {
    course.value = null;
    lessons.value = [];
    progress.value = {
      completed_lessons: 0,
      total_lessons: 0,
      progress_percent: 0
    };
    error.value = null;
  };

  return {
    course,
    lessons,
    progress,
    isLoading,
    error,
    fetchCourseDetail,
    reset
  };
});