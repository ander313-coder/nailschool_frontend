import { defineStore } from 'pinia'
import { ref } from 'vue'
import { testService } from '@/services/testService'
import type { Test, TestSubmission, TestResult } from '@/types/api'

export const useTestStore = defineStore('test', () => {
  const currentTest = ref<Test | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<TestResult | null>(null)
  const allTestResults = ref<TestResult[]>([])

  // Загрузить тест
  const fetchTest = async (testId: number) => {
    isLoading.value = true
    error.value = null

    try {
      currentTest.value = await testService.getTest(testId)
    } catch (err) {
      error.value = 'Ошибка при загрузке теста'
      console.error('Error fetching test:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Загрузить ВСЕ результаты тестов пользователя
  const fetchUserTestResults = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔄 Загружаем все результаты тестов пользователя...')
      allTestResults.value = await testService.getUserTestResults()
      console.log(`✅ Загружено ${allTestResults.value.length} результатов тестов`)
    } catch (err) {
      error.value = 'Ошибка при загрузке результатов тестов'
      console.error('Error fetching test results:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Отправить ответы на тест
  const submitTest = async (submission: TestSubmission) => {
    isLoading.value = true
    error.value = null

    try {
      results.value = await testService.submitTest(submission)

      // После отправки теста обновляем список результатов
      await fetchUserTestResults()

      return results.value
    } catch (err) {
      error.value = 'Ошибка при отправке теста'
      console.error('Error submitting test:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Проверить пройден ли тест урока
  const isTestPassed = (lessonId: number): boolean => {
    const result = allTestResults.value.find((result) => result.lesson?.id === lessonId)
    return result?.is_passed || false
  }

  // Проверить есть ли текстовые ответы на проверке
  const hasPendingTextAnswers = (lessonId: number): boolean => {
    const result = allTestResults.value.find((result) => result.lesson?.id === lessonId)
    return result?.text_answers_pending || false
  }

  // Получить результат теста для урока
  const getTestResultForLesson = (lessonId: number): TestResult | null => {
    return allTestResults.value.find((result) => result.lesson?.id === lessonId) || null
  }

  // Сбросить состояние теста
  const resetTest = () => {
    currentTest.value = null
    results.value = null
    error.value = null
  }

  return {
    currentTest,
    isLoading,
    error,
    results,
    allTestResults,
    fetchTest,
    fetchUserTestResults,
    submitTest,
    resetTest,
    isTestPassed,
    hasPendingTextAnswers,
    getTestResultForLesson,
  }
})
