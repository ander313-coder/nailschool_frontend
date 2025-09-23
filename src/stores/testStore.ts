import { defineStore } from 'pinia';
import { ref } from 'vue';
import { testService } from '@/services/testService';
import type { Test, TestSubmission, TestResult } from '@/types/api';

export const useTestStore = defineStore('test', () => {
  const currentTest = ref<Test | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const results = ref<TestResult | null>(null);

  // Загрузить тест
  const fetchTest = async (testId: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      currentTest.value = await testService.getTest(testId);
    } catch (err) {
      error.value = 'Ошибка при загрузке теста';
      console.error('Error fetching test:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Отправить ответы на тест
  const submitTest = async (submission: TestSubmission) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      results.value = await testService.submitTest(submission);
      return results.value;
    } catch (err) {
      error.value = 'Ошибка при отправке теста';
      console.error('Error submitting test:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Сбросить состояние теста
  const resetTest = () => {
    currentTest.value = null;
    results.value = null;
    error.value = null;
  };

  return {
    currentTest,
    isLoading,
    error,
    results,
    fetchTest,
    submitTest,
    resetTest
  };
});