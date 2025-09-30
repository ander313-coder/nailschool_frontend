import { defineStore } from 'pinia';
import { ref } from 'vue';
import { homeworkService } from '@/services/homeworkService';
import type { Homework, HomeworkSubmission } from '@/types/api';

export const useHomeworkStore = defineStore('homework', () => {
  const currentHomework = ref<Homework | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Получить ДЗ для урока
  const fetchHomeworkForLesson = async (lessonId: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      currentHomework.value = await homeworkService.getHomeworkForLesson(lessonId);
    } catch (err) {
      error.value = 'Ошибка при загрузке домашнего задания';
      console.error('Error fetching homework:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Отправить ДЗ
  const submitHomework = async (submission: HomeworkSubmission): Promise<Homework> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const homework = await homeworkService.submitHomework(submission);
      currentHomework.value = homework;
      return homework;
    } catch (err) {
      error.value = 'Ошибка при отправке домашнего задания';
      console.error('Error submitting homework:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const createOrUpdateHomework = async (submission: HomeworkSubmission): Promise<Homework> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const homework = await homeworkService.createOrUpdateHomework(submission);
      currentHomework.value = homework;
      return homework;
    } catch (err) {
      error.value = 'Ошибка при отправке домашнего задания';
      console.error('Error creating/updating homework:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  // Сбросить состояние
  const reset = () => {
    currentHomework.value = null;
    error.value = null;
  };

  return {
    currentHomework,
    isLoading,
    error,
    fetchHomeworkForLesson,
    submitHomework,
    createOrUpdateHomework,
    reset
  };
});