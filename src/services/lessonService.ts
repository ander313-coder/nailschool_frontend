import apiClient from '@/api/client';
import type { Lesson } from '@/types/api';

export const lessonService = {
  // Получить детали урока
  async getLesson(id: number): Promise<Lesson> {
    try {
      const response = await apiClient.get(`/lessons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);
      throw error;
    }
  },

  // Отметить урок как завершенный
  async completeLesson(lessonId: number): Promise<void> {
    try {
      await apiClient.post(`/lessons/${lessonId}/complete/`);
    } catch (error) {
      console.error(`Error completing lesson ${lessonId}:`, error);
      throw error;
    }
  }
};