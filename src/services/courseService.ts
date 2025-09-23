import apiClient from '@/api/client';
import type { Course, Lesson } from '@/types/api';

export const courseService = {
  // Получить все курсы
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get('/courses/');
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Получить детали курса по ID
  async getCourse(id: number): Promise<Course> {
    try {
      const response = await apiClient.get(`/courses/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  // Получить уроки курса
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons/`);
      return response.data.results || response.data;
    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      throw error;
    }
  },

  // Получить прогресс по курсу
  // Улучшенный метод получения прогресса
  async getCourseProgress(courseId: number, totalLessons: number = 0): Promise<any> {
    try {
      // Пробуем получить прогресс с сервера
      const response = await apiClient.get(`/courses/${courseId}/progress/`);
      return response.data;
    } catch (error: any) {
      // Если endpoint не существует, вычисляем прогресс на клиенте
      if (error.response?.status === 404) {
        console.log(`📊 Progress endpoint not found, calculating locally for course ${courseId}`);
        
        // Здесь можно добавить логику расчета прогресса на клиенте
        // Пока возвращаем базовый прогресс
        return {
          completed_lessons: 0,
          total_lessons: totalLessons,
          progress_percent: 0
        };
      }
      throw error;
    }
  }
};
