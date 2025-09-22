import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Course, Lesson } from '@/types/api';

export const useProgressStore = defineStore('progress', () => {
  const completedLessons = ref<Set<number>>(new Set());
  const completedTests = ref<Set<number>>(new Set());
  const lessonProgress = ref<Record<number, number>>({}); // Прогресс просмотра урока в %

  // Завершить урок
  const completeLesson = (lessonId: number) => {
    completedLessons.value.add(lessonId);
    lessonProgress.value[lessonId] = 100;
    saveToLocalStorage();
  };

  // Завершить тест
  const completeTest = (testId: number) => {
    completedTests.value.add(testId);
    saveToLocalStorage();
  };

  // Обновить прогресс просмотра урока
  const updateLessonProgress = (lessonId: number, progress: number) => {
    lessonProgress.value[lessonId] = Math.min(100, Math.max(0, progress));
    saveToLocalStorage();
  };

  // Проверить завершен ли урок
  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.value.has(lessonId);
  };

  // Проверить завершен ли тест
  const isTestCompleted = (testId: number) => {
    return completedTests.value.has(testId);
  };

  // Получить прогресс урока
  const getLessonProgress = (lessonId: number) => {
    return lessonProgress.value[lessonId] || 0;
  };

  // Вычисляемые свойства для статистики
  const totalCompletedLessons = computed(() => completedLessons.value.size);
  const totalCompletedTests = computed(() => completedTests.value.size);

  // Сохранение в localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('progress_completed_lessons', JSON.stringify(Array.from(completedLessons.value)));
    localStorage.setItem('progress_completed_tests', JSON.stringify(Array.from(completedTests.value)));
    localStorage.setItem('progress_lesson_progress', JSON.stringify(lessonProgress.value));
  };

  // Загрузка из localStorage
  const loadFromLocalStorage = () => {
    const lessons = localStorage.getItem('progress_completed_lessons');
    const tests = localStorage.getItem('progress_completed_tests');
    const progress = localStorage.getItem('progress_lesson_progress');

    if (lessons) completedLessons.value = new Set(JSON.parse(lessons));
    if (tests) completedTests.value = new Set(JSON.parse(tests));
    if (progress) lessonProgress.value = JSON.parse(progress);
  };

  // Инициализация
  loadFromLocalStorage();

  return {
    completedLessons,
    completedTests,
    lessonProgress,
    completeLesson,
    completeTest,
    updateLessonProgress,
    isLessonCompleted,
    isTestCompleted,
    getLessonProgress,
    totalCompletedLessons,
    totalCompletedTests,
    saveToLocalStorage,
    loadFromLocalStorage
  };
});