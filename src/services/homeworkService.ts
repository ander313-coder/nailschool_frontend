import apiClient from '@/api/client'
import type { Homework, HomeworkSubmission } from '@/types/api'

export const homeworkService = {
  // Получить ДЗ для урока
  async getHomeworkForLesson(lessonId: number): Promise<Homework | null> {
    try {
      const response = await apiClient.get(`/homework/lesson/${lessonId}/`)
      return response.data || null
    } catch (error) {
      console.error(`Error fetching homework for lesson ${lessonId}:`, error)
      return null
    }
  },

  // Отправить ДЗ
  async submitHomework(submission: HomeworkSubmission): Promise<Homework> {
    const formData = new FormData()

    formData.append('lesson', submission.lesson_id.toString())
    formData.append('comment', submission.comment)

    submission.files.forEach((file) => {
      formData.append(`files`, file)
    })

    console.log('📤 Отправка ДЗ с файлами:', submission.files.length)

    const response = await apiClient.post('/homework/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('✅ Ответ от сервера:', response.data)
    return response.data
  },

  // Загрузить дополнительные файлы к существующему ДЗ
  async addFilesToHomework(homeworkId: number, files: File[]): Promise<Homework> {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append(`files`, file)
    })

    const response = await apiClient.patch(`/homework/${homeworkId}/add_files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  // Создать или обновить ДЗ
  async createOrUpdateHomework(submission: HomeworkSubmission): Promise<Homework> {
    try {
      // ВСЕГДА СОЗДАЕМ НОВОЕ ДЗ (не проверяем существование)
      return await this.submitHomework(submission)
    } catch (error) {
      console.error('Error in createOrUpdateHomework:', error)
      throw error
    }
  },
}
