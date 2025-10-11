import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { instructorService } from '@/services/instructorService'
import type {
  Homework,
  HomeworkReviewData,
  TextAnswer,
  TextAnswerReviewData,
  HomeworkFilters,
} from '@/types/api'

/**
 * Хранилище для функционала преподавателя
 */
export const useInstructorStore = defineStore('instructor', () => {
  const pendingHomeworks = ref<Homework[]>([])
  const allHomeworks = ref<Homework[]>([])
  const pendingTextAnswers = ref<TextAnswer[]>([])
  const allTextAnswers = ref<TextAnswer[]>([])
  const studentTextAnswers = ref<TextAnswer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /** Количество ДЗ на проверку */
  const pendingHomeworksCount = computed(() => pendingHomeworks.value.length)

  /** Количество текстовых ответов на проверку */
  const pendingTextAnswersCount = computed(() => pendingTextAnswers.value.length)

  /** ДЗ сгруппированные по статусу */
  const homeworksByStatus = computed(() => {
    const grouped = {
      PENDING: [] as Homework[],
      APPROVED: [] as Homework[],
      REJECTED: [] as Homework[],
    }

    allHomeworks.value.forEach((homework) => {
      if (homework.status in grouped) {
        grouped[homework.status as keyof typeof grouped].push(homework)
      }
    })

    return grouped
  })

  /**
   * Загрузить ДЗ на проверку
   */
  const loadPendingHomeworks = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log('🔄 Загружаем ДЗ на проверку...')

      const homeworks = await instructorService.getPendingHomeworks()
      // Убедимся, что это массив
      pendingHomeworks.value = Array.isArray(homeworks) ? homeworks : []

      console.log(`✅ Загружено ${pendingHomeworks.value.length} ДЗ на проверку`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке ДЗ на проверку'
      console.error('❌ Ошибка загрузки ДЗ на проверку:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить все ДЗ (для преподавателя)
   */
  const loadAllHomeworks = async (filters?: HomeworkFilters): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log('🔄 Загружаем все ДЗ...')

      const homeworks = await instructorService.getAllHomeworks(filters)
      allHomeworks.value = Array.isArray(homeworks) ? homeworks : []

      console.log(`✅ Загружено ${allHomeworks.value.length} ДЗ`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке ДЗ'
      console.error('❌ Ошибка загрузки ДЗ:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  /** Загрузить текстовые ответы на проверку
   */
  const loadPendingTextAnswers = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log('🔄 Загружаем текстовые ответы на проверку...')

      const answers = await instructorService.getPendingTextAnswers()
      // Убедимся, что это массив
      pendingTextAnswers.value = Array.isArray(answers) ? answers : []

      console.log(`✅ Загружено ${pendingTextAnswers.value.length} текстовых ответов`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке текстовых ответов'
      console.error('❌ Ошибка загрузки текстовых ответов:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Загрузить все текстовые ответы (для преподавателя)
  const loadAllTextAnswers = async (filters?: { user_id?: number }): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log('🔄 Загружаем все текстовые ответы...')

      const answers = await instructorService.getAllTextAnswers(filters)
      allTextAnswers.value = Array.isArray(answers) ? answers : []

      console.log(`✅ Загружено ${allTextAnswers.value.length} текстовых ответов`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке текстовых ответов'
      console.error('❌ Ошибка загрузки текстовых ответов:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  // Загрузить текстовые ответы конкретного студента
  const loadStudentTextAnswers = async (userId: number): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log(`🔄 Загружаем текстовые ответы студента ${userId}...`)

      const answers = await instructorService.getStudentTextAnswers(userId)
      studentTextAnswers.value = Array.isArray(answers) ? answers : []

      console.log(`✅ Загружено ${studentTextAnswers.value.length} ответов студента`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке ответов студента'
      console.error('❌ Ошибка загрузки ответов студента:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Проверить домашнее задание
   */
  const reviewHomework = async (
    homeworkId: number,
    reviewData: HomeworkReviewData,
  ): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log(`🔄 Проверяем ДЗ ${homeworkId}...`)

      const updatedHomework = await instructorService.reviewHomework(homeworkId, reviewData)

      // Обновляем данные во всех домашних заданиях
      const allIndex = allHomeworks.value.findIndex((hw) => hw.id === homeworkId)
      if (allIndex !== -1) {
        allHomeworks.value[allIndex] = updatedHomework
      }

      // Убираем из списка на проверку (так как статус больше не PENDING)
      const pendingIndex = pendingHomeworks.value.findIndex((hw) => hw.id === homeworkId)
      if (pendingIndex !== -1) {
        pendingHomeworks.value.splice(pendingIndex, 1)
        console.log(`📋 ДЗ ${homeworkId} удалено из списка на проверку`)
      }

      // Если статус APPROVED, можно добавить в соответствующий список (опционально)
      if (reviewData.status === 'APPROVED') {
        console.log(`🎉 ДЗ ${homeworkId} принято!`)
      } else if (reviewData.status === 'REJECTED') {
        console.log(`⚠️ ДЗ ${homeworkId} отправлено на доработку`)
      }
    } catch (err: any) {
      error.value = err.message || 'Ошибка при проверке ДЗ'
      console.error('❌ Ошибка проверки ДЗ:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Проверить текстовый ответ
   */
  const reviewTextAnswer = async (
    answerId: number,
    reviewData: TextAnswerReviewData,
  ): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      console.log(`🔄 Проверяем текстовый ответ ${answerId}...`)

      const updatedAnswer = await instructorService.reviewTextAnswer(answerId, reviewData)

      // Обновляем ответ во всех списках
      updateAnswerInLists(answerId, updatedAnswer)

      console.log(`✅ Текстовый ответ ${answerId} проверен`)
    } catch (err: any) {
      error.value = err.message || 'Ошибка при проверке текстового ответа'
      console.error('❌ Ошибка проверки текстового ответа:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Вспомогательная функция для обновления ответа во всех списках
   */
  const updateAnswerInLists = (answerId: number, updatedAnswer: any): void => {
    // Обновляем в pendingTextAnswers
    const pendingIndex = pendingTextAnswers.value.findIndex((answer) => answer.id === answerId)
    if (pendingIndex !== -1) {
      pendingTextAnswers.value.splice(pendingIndex, 1)
    }

    // Обновляем в allTextAnswers
    const allIndex = allTextAnswers.value.findIndex((answer) => answer.id === answerId)
    if (allIndex !== -1) {
      allTextAnswers.value[allIndex] = { ...allTextAnswers.value[allIndex], ...updatedAnswer }
    }

    // Обновляем в studentTextAnswers
    const studentIndex = studentTextAnswers.value.findIndex((answer) => answer.id === answerId)
    if (studentIndex !== -1) {
      studentTextAnswers.value[studentIndex] = {
        ...studentTextAnswers.value[studentIndex],
        ...updatedAnswer,
      }
    }
  }

  /**
   * Очистить ошибки
   */
  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    pendingHomeworks,
    allHomeworks,
    pendingTextAnswers,
    isLoading,
    error,
    allTextAnswers,
    studentTextAnswers,

    // Getters
    pendingHomeworksCount,
    pendingTextAnswersCount,
    homeworksByStatus,

    // Actions
    loadPendingHomeworks,
    loadAllHomeworks,
    loadPendingTextAnswers,
    reviewHomework,
    reviewTextAnswer,
    clearError,
    loadStudentTextAnswers,
    loadAllTextAnswers,
  }
})
