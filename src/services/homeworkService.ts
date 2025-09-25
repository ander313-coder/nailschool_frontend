import apiClient from '@/api/client';
import type { Homework, HomeworkSubmission } from '@/types/api';

export const homeworkService = {
  // Получить ДЗ для урока
  async getHomeworkForLesson(lessonId: number): Promise<Homework | null> {
    try {
      const response = await apiClient.get(`/homework/?lesson=${lessonId}`);
      return response.data.results?.[0] || null;
    } catch (error) {
      console.error(`Error fetching homework for lesson ${lessonId}:`, error);
      return null;
    }
  },

  // Отправить ДЗ
  async submitHomework(submission: HomeworkSubmission): Promise<Homework> {
    const formData = new FormData();
    
    formData.append('lesson', submission.lesson_id.toString());
    formData.append('comment', submission.comment);
    
    submission.files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.post('/homework/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Загрузить дополнительные файлы к существующему ДЗ
  async addFilesToHomework(homeworkId: number, files: File[]): Promise<Homework> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.patch(`/homework/${homeworkId}/add_files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};