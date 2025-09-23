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

  // Получить детали курса
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
  }
};