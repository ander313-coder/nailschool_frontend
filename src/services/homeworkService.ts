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

  // Отправить НОВОЕ ДЗ
  async submitHomework(submission: HomeworkSubmission): Promise<Homework> {
    const formData = new FormData()

    formData.append('lesson', submission.lesson_id.toString())
    formData.append('comment', submission.comment)

    submission.files.forEach((file) => {
      formData.append(`files`, file)
    })

    console.log('📤 Отправка НОВОГО ДЗ с файлами:', submission.files.length)

    const response = await apiClient.post('/homework/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('✅ Создано НОВОЕ ДЗ:', response.data)
    return response.data
  },

  // ОБНОВИТЬ существующее ДЗ (для доработки)
  // В методе updateHomework
  async updateHomework(homeworkId: number, submission: HomeworkSubmission): Promise<Homework> {
    const formData = new FormData()

    formData.append('comment', submission.comment)

    // Добавляем новые файлы
    submission.files.forEach((file) => {
      formData.append(`new_files`, file) // Обрати внимание - new_files
    })

    console.log('🔄 Обновление существующего ДЗ:', homeworkId)
    console.log('📝 Комментарий:', submission.comment)
    console.log('📁 Новых файлов:', submission.files.length)
    console.log('📦 FormData содержимое:')

    // Отладочная информация о FormData
    for (let pair of formData.entries()) {
      console.log('  ', pair[0], pair[1])
    }

    try {
      const response = await apiClient.patch(`/homework/${homeworkId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('✅ ДЗ обновлено:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Ошибка обновления ДЗ:', error)
      console.error('❌ Ответ сервера:', error.response?.data)
      throw error
    }
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

  // Создать или обновить ДЗ (ИСПРАВЛЕННАЯ ЛОГИКА)
  async createOrUpdateHomework(submission: HomeworkSubmission): Promise<Homework> {
    try {
      // 1. Пытаемся найти существующее ДЗ для этого урока
      const existingHomework = await this.getHomeworkForLesson(submission.lesson_id)

      if (existingHomework && existingHomework.id) {
        console.log('🔄 Найдено существующее ДЗ, обновляем:', existingHomework.id)
        console.log('📊 Статус текущего ДЗ:', existingHomework.status)

        // 2. Если есть существующее ДЗ - ОБНОВЛЯЕМ его
        return await this.updateHomework(existingHomework.id, submission)
      } else {
        // 3. Если ДЗ нет - СОЗДАЕМ новое
        console.log('🆕 Существующее ДЗ не найдено, создаем новое')
        return await this.submitHomework(submission)
      }
    } catch (error) {
      console.error('Error in createOrUpdateHomework:', error)
      throw error
    }
  },
}
