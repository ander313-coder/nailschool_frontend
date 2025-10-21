import { defineStore } from 'pinia'
import { ref } from 'vue'
import { homeworkService } from '@/services/homeworkService'
import type { Homework, HomeworkFilters, HomeworkSubmission } from '@/types/api'
import apiClient from '@/api/client'

export const useHomeworkStore = defineStore('homework', () => {
  const currentHomework = ref<Homework | null>(null)
  const homeworkList = ref<Homework[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Получить ДЗ для урока
  const fetchHomeworkForLesson = async (lessonId: number) => {
    isLoading.value = true
    error.value = null

    try {
      currentHomework.value = await homeworkService.getHomeworkForLesson(lessonId)
    } catch (err) {
      error.value = 'Ошибка при загрузке домашнего задания'
      console.error('Error fetching homework:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Отправить ДЗ
  const submitHomework = async (submission: HomeworkSubmission): Promise<Homework> => {
    isLoading.value = true
    error.value = null

    try {
      const homework = await homeworkService.submitHomework(submission)
      currentHomework.value = homework
      return homework
    } catch (err) {
      error.value = 'Ошибка при отправке домашнего задания'
      console.error('Error submitting homework:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  const createOrUpdateHomework = async (submission: HomeworkSubmission): Promise<Homework> => {
    isLoading.value = true
    error.value = null

    try {
      const homework = await homeworkService.createOrUpdateHomework(submission)
      currentHomework.value = homework
      return homework
    } catch (err) {
      error.value = 'Ошибка при отправке домашнего задания'
      console.error('Error creating/updating homework:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserHomeworks = async (filters?: HomeworkFilters) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📤 Запрос ДЗ с фильтрами:', filters)

      const response = await apiClient.get('/homework/', {
        params: filters,
      })

      // СОРТИРОВКА ПО ОБНОВЛЕНИЮ (самые новые сверху)
      homeworkList.value = response.data.sort(
        (a: { updated_at: string | number | Date }, b: { updated_at: string | number | Date }) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )

      console.log('✅ Получено ДЗ:', homeworkList.value.length, '(отсортировано по updated_at)')
      return homeworkList.value
    } catch (err: any) {
      console.error('❌ Ошибка загрузки ДЗ:', err)
      console.error('❌ Ответ сервера:', err.response?.data)
      error.value = 'Ошибка при загрузке домашних заданий'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Получить домашнюю работу по ID (для обновления статуса)
  const fetchHomeworkById = async (homeworkId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.get(`/homework/${homeworkId}/`)
      console.log('📁 Homework by ID response:', response.data) // ДЛЯ ОТЛАДКИ
      console.log('📁 Files in response:', response.data.files) // ДЛЯ ОТЛАДКИ
      return response.data
    } catch (err) {
      error.value = 'Ошибка при загрузке домашнего задания'
      console.error('Error fetching homework by id:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Проверить изменения статуса (для уведомлений)
  const checkStatusChanges = async (): Promise<Homework[]> => {
    try {
      console.log('🔄 Проверка изменений статусов...')

      // Сохраняем текущий список ДЗ
      const currentHomeworks = [...homeworkList.value]

      // Пытаемся загрузить обновленный список
      let updatedHomeworks: Homework[] = []
      try {
        updatedHomeworks = await fetchUserHomeworks()
      } catch (error) {
        console.warn('⚠️ Не удалось загрузить ДЗ для проверки изменений:', error)
        return []
      }

      // Находим домашние работы с измененным статусом
      const changedHomeworks = updatedHomeworks.filter((updated) => {
        const current = currentHomeworks.find((h) => h.id === updated.id)
        return current && current.status !== updated.status
      })

      console.log('🔄 Найдено измененных ДЗ:', changedHomeworks.length)
      return changedHomeworks
    } catch (err) {
      console.error('❌ Ошибка при проверке изменений статусов:', err)
      return []
    }
  }

  // Обновить конкретную домашнюю работу в списке
  const updateHomeworkInList = (updatedHomework: Homework) => {
    const index = homeworkList.value.findIndex((h) => h.id === updatedHomework.id)
    if (index !== -1) {
      homeworkList.value[index] = updatedHomework
    }
  }

  const reset = () => {
    currentHomework.value = null
    homeworkList.value = []
    error.value = null
  }

  return {
    currentHomework,
    homeworkList,
    isLoading,
    error,
    fetchHomeworkForLesson,
    submitHomework,
    createOrUpdateHomework,
    fetchUserHomeworks,
    fetchHomeworkById,
    checkStatusChanges,
    updateHomeworkInList,
    reset,
  }
})
