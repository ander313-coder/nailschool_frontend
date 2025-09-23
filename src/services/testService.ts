import apiClient from '@/api/client';
import type { Test, TestSubmission, TestResult } from '@/types/api';

export const testService = {
  // Получить тест по ID
  async getTest(testId: number): Promise<Test> {
    try {
      const response = await apiClient.get(`/tests/${testId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching test ${testId}:`, error);
      throw error;
    }
  },

  // Отправить ответы на тест
  async submitTest(submission: TestSubmission): Promise<TestResult> {
    try {
      const response = await apiClient.post(`/tests/${submission.test_id}/submit/`, submission);
      return response.data;
    } catch (error) {
      console.error(`Error submitting test ${submission.test_id}:`, error);
      throw error;
    }
  }
};