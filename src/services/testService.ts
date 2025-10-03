import apiClient from '@/api/client'
import type { Test, TestSubmission, TestResult } from '@/types/api'

export const testService = {
  // Получить тест по ID
  async getTest(testId: number): Promise<Test> {
    try {
      console.log('🚀 Fetching test from API, ID:', testId)
      const response = await apiClient.get(`/tests/${testId}/`)
      console.log('✅ Test API response:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ Error fetching test ${testId}:`, error)
      throw error
    }
  },

  // Отправить ответы на тест
  async submitTest(submission: TestSubmission): Promise<TestResult> {
    console.log('🚀 Submitting test data:', JSON.stringify(submission, null, 2))

    try {
      const response = await apiClient.post(`/tests/${submission.test_id}/submit/`, submission)
      console.log('✅ Test submission response:', response.data)
      console.log('📊 Response structure:', {
        score: response.data.score,
        passed: response.data.passed,
        correct_answers: response.data.correct_answers,
        total_questions: response.data.total_questions,
      })
      return response.data
    } catch (error: any) {
      console.error('❌ Error details:', error.response?.data)
      throw error
    }
  },
}
