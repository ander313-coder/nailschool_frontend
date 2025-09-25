import apiClient from '@/api/client';
import type { Test, TestSubmission, TestResult } from '@/types/api';

export const testService = {
  // Добавляем недостающий метод
  async getTest(testId: number): Promise<Test> {
    try {
      console.log('🚀 Fetching test from API, ID:', testId);
      const response = await apiClient.get(`/tests/${testId}/`);
      console.log('✅ Test API response structure:');
      console.log('- ID:', response.data.id);
      console.log('- Title:', response.data.title);
      console.log('- Questions count:', response.data.questions?.length);
      console.log('- Questions:', response.data.questions);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching test ${testId}:`, error);
      throw error;
    }
  },

  async submitTest(submission: TestSubmission): Promise<TestResult> {
    try {
      console.log('🚀 SUBMITTING TEST - FULL DEBUG');
      console.log('📤 Submission object:', JSON.stringify(submission, null, 2));
      console.log('🔗 URL:', `/tests/${submission.test_id}/submit/`);
      
      const response = await apiClient.post(`/tests/${submission.test_id}/submit/`, submission);
      
      console.log('✅ Response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Full error details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error config:', error.config);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
};