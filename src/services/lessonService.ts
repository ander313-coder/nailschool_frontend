import apiClient from '@/api/client';
import type { CourseLessonsResponse, LessonDetail } from '@/types/api';

export const lessonService = {
  // Получить уроки курса
  async getCourseLessons(courseId: number): Promise<CourseLessonsResponse> {
    const response = await apiClient.get(`/courses/${courseId}/lessons/`);
    return response.data;
  },  

  // Получить детальную информацию об уроке 
  async getLessonDetail(lessonId: number): Promise<LessonDetail> {
    try {
      const response = await apiClient.get(`/courses/lessons/${lessonId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId}:`, error);
      throw error;
    }
  },

// Отметить урок как завершенный
  async completeLesson(lessonId: number): Promise<void> {
    try {
      await apiClient.post('/courses/progress/', {
        lesson: lessonId,
        is_completed: true
      });
    } catch (error) {
      console.error(`Error completing lesson ${lessonId}:`, error);
      throw error;
    }
  },

  // Отменить завершение урока
  async uncompleteLesson(lessonId: number): Promise<void> {
    try {
      await apiClient.post('/courses/progress/', {
        lesson: lessonId,
        is_completed: false
      });
    } catch (error) {
      console.error(`Error uncompleting lesson ${lessonId}:`, error);
      throw error;
    }
  },

  // Обновить прогресс просмотра видео
  async updateVideoProgress(lessonId: number, progress: number): Promise<void> {
    try {
      await apiClient.post('/progress/', {
        lesson: lessonId,
        video_progress: progress
      });
    } catch (error) {
      console.error(`Error updating video progress for lesson ${lessonId}:`, error);
      throw error;
    }
  }
};