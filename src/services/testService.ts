import apiClient from '@/api/client';

export const testService = {
  // Получить тест
  async getTest(id: number) {
    try {
      const response = await apiClient.get(`/tests/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching test ${id}:`, error);
      throw error;
    }
  },

  // Отправить ответы на тест
  async submitTest(testId: number, answers: any) {
    try {
      const response = await apiClient.post(`/tests/${testId}/submit/`, {
        answers
      });
      return response.data;
    } catch (error) {
      console.error(`Error submitting test ${testId}:`, error);
      throw error;
    }
  }
};