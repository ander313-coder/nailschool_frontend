import apiClient from '@/api/client';
import type { Test, TestSubmission, TestResult } from '@/types/api';

export const testService = {
  // Получить тест по ID
  async getTest(testId: number): Promise<Test> {
    try {
      console.log('🚀 Fetching test from API, ID:', testId);
      const response = await apiClient.get(`/tests/${testId}/`);
      console.log('✅ Test API response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching test ${testId}:`, error);
      throw error;
    }
  },

  // Отправить ответы на тест
  async submitTest(submission: TestSubmission): Promise<TestResult> {
    try {
      console.log('🚀 Submitting test:', submission);
      const response = await apiClient.post(`/tests/${submission.test_id}/submit/`, submission);
      console.log('✅ Test submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error submitting test ${submission.test_id}:`, error);
      throw error;
    }
  }
};