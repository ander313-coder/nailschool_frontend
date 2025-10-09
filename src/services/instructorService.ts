import apiClient from '@/api/client'
import type {
  Homework,
  HomeworkReviewData,
  TextAnswer,
  TextAnswerReviewData,
  HomeworkFilters,
} from '@/types/api'

// Тип для пагинированного ответа
interface PaginatedResponse<T> {
  count: number
  results: T[]
}

/**
 * Сервис для работы с функционалом преподавателя
 */
export const instructorService = {
  /**
   * Получить ДЗ на проверку
   */
  async getPendingHomeworks(): Promise<Homework[]> {
    const response = await apiClient.get('/instructor/homeworks/pending/')
    return response.data
  },

  /**
   * Получить все ДЗ (с фильтрами)
   */
  async getAllHomeworks(filters?: HomeworkFilters): Promise<Homework[]> {
    const response = await apiClient.get('/instructor/homeworks/', {
      params: filters,
    })
    return response.data
  },

  /**
   * Получить текстовые ответы на проверку
   */
  async getPendingTextAnswers(): Promise<TextAnswer[]> {
    console.log('📥 Запрос текстовых ответов на проверку...')
    const response = await apiClient.get<PaginatedResponse<TextAnswer>>(
      '/instructor/text-answers/pending/',
    )
    console.log('📋 Ответ от API (pending):', response.data)

    // Извлекаем данные из поля results
    const answers = response.data.results || []
    console.log(`✅ Извлечено ${answers.length} ответов на проверку`)
    return answers
  },

  /**
   * Получить все текстовые ответы (с фильтрами)
   */
  async getAllTextAnswers(filters?: { user_id?: number }): Promise<TextAnswer[]> {
    console.log('🔍 Запрос всех текстовых ответов с фильтрами:', filters)
    console.log('🌐 BaseURL:', apiClient.defaults.baseURL)

    const response = await apiClient.get<PaginatedResponse<TextAnswer>>(
      '/instructor/text-answers/',
      {
        params: filters,
      },
    )

    console.log('📋 Ответ от API (all):', response.data)

    // Извлекаем данные из поля results
    const answers = response.data.results || []
    console.log(`✅ Извлечено ${answers.length} всех ответов`)
    return answers
  },

  /**
   * Получить текстовые ответы конкретного студента
   */
  async getStudentTextAnswers(userId: number): Promise<TextAnswer[]> {
    console.log(`📥 Запрос текстовых ответов студента ${userId}...`)
    const response = await apiClient.get<PaginatedResponse<TextAnswer>>(
      `/instructor/text-answers/student/${userId}/`,
    )
    console.log('📋 Ответ от API (student):', response.data)

    // Извлекаем данные из поля results
    const answers = response.data.results || []
    console.log(`✅ Извлечено ${answers.length} ответов студента`)
    return answers
  },

  /**
   * Проверить домашнее задание
   */
  async reviewHomework(homeworkId: number, reviewData: HomeworkReviewData): Promise<Homework> {
    const response = await apiClient.patch(`/instructor/homeworks/${homeworkId}/`, reviewData)
    return response.data
  },

  /**
   * Проверить текстовый ответ
   */
  async reviewTextAnswer(answerId: number, reviewData: TextAnswerReviewData): Promise<void> {
    const response = await apiClient.patch(
      `/instructor/text-answers/${answerId}/review/`,
      reviewData,
    )
    return response.data
  },
}
