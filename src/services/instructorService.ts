import apiClient from '@/api/client'
import type {
  Homework,
  HomeworkReviewData,
  TextAnswer,
  TextAnswerReviewData,
  HomeworkFilters,
} from '@/types/api'

export const instructorService = {
  /**
   * Получить ДЗ на проверку
   */
  async getPendingHomeworks(): Promise<Homework[]> {
    console.log('📥 Запрос ДЗ на проверку...')
    const response = await apiClient.get('/homework/pending-review/')
    console.log('✅ Получены ДЗ на проверку:', response.data.results)
    return response.data.results
  },

  /**
   * Получить все ДЗ (с фильтрацией)
   */
  async getAllHomeworks(filters?: HomeworkFilters): Promise<Homework[]> {
    console.log('📥 Запрос всех ДЗ...', filters)

    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.course_id) params.append('course_id', filters.course_id.toString())

    const url = params.toString() ? `/homework/?${params}` : '/homework/'
    const response = await apiClient.get(url)

    console.log('✅ Получены все ДЗ:', response.data)
    return response.data
  },

  /**
   * Получить текстовые ответы на проверку
   */
  async getPendingTextAnswers(): Promise<TextAnswer[]> {
    console.log('📥 Запрос текстовых ответов на проверку...')
    const response = await apiClient.get('/instructor/text-answers/pending/')
    console.log('✅ Получены текстовые ответы:', response.data.results)
    return response.data.results
  },

  /**
   * Проверить домашнее задание
   */
  async reviewHomework(homeworkId: number, reviewData: HomeworkReviewData): Promise<Homework> {
    console.log(`📝 Проверяем ДЗ ${homeworkId}:`, reviewData)

    const response = await apiClient.patch(`/homework/${homeworkId}/`, reviewData)
    console.log('✅ ДЗ проверено:', response.data)
    return response.data
  },

  /**
   * Проверить текстовый ответ
   */
  async reviewTextAnswer(answerId: number, reviewData: TextAnswerReviewData): Promise<void> {
    console.log(`📝 Проверяем текстовый ответ ${answerId}:`, reviewData)

    await apiClient.patch(`/instructor/text-answers/${answerId}/review/`, reviewData)
    console.log('✅ Текстовый ответ проверен')
  },
}

export default instructorService
