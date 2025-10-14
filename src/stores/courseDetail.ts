import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course, Lesson, LessonDetail } from '@/types/api'
import { courseService } from '@/services/courseService'
import { lessonService } from '@/services/lessonService'

// Интерфейс для прогресса
interface CourseProgress {
  completed_lessons: number
  total_lessons: number
  progress_percent: number
}

export const useCourseDetailStore = defineStore('courseDetail', () => {
  const course = ref<Course | null>(null)
  const lessons = ref<Lesson[]>([])
  const currentLesson = ref<LessonDetail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref<CourseProgress>({
    completed_lessons: 0,
    total_lessons: 0,
    progress_percent: 0,
  })

  // Загрузка деталей курса и уроков
  const fetchCourseDetail = async (courseId: number) => {
    isLoading.value = true
    error.value = null

    try {
      console.log(`🔄 Loading course details for ID: ${courseId}`)

      // Загружаем курс и уроки параллельно
      const [courseData, lessonsResponse] = await Promise.all([
        courseService.getCourse(courseId),
        lessonService.getCourseLessons(courseId),
      ])

      course.value = courseData

      // ИСПРАВЛЯЕМ: извлекаем lessons из ответа
      const lessonsData = lessonsResponse.lessons || []
      lessons.value = lessonsData

      // ДОБАВЛЯЕМ ОТЛАДОЧНЫЙ ВЫВОД
      console.log(
        '📊 Уроки загружены:',
        lessonsData.map((l) => ({
          id: l.id,
          title: l.title,
          completed: l.completed,
          is_unlocked: l.is_unlocked,
        })),
      )

      // Вычисляем прогресс на основе новых данных
      updateProgress(lessonsData)

      console.log(`✅ Course details loaded:`, {
        course: courseData?.title,
        lessons: lessonsData.length,
        progress: progress.value.progress_percent,
      })
    } catch (err: any) {
      error.value = err.response?.data?.detail || `Не удалось загрузить данные курса ${courseId}`
      console.error(`❌ Error loading course ${courseId}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка деталей конкретного урока
  const fetchLessonDetail = async (lessonId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const lessonData = await lessonService.getLessonDetail(lessonId)
      currentLesson.value = lessonData

      console.log('📥 Загружены детали урока, is_completed:', lessonData.is_completed)
    } catch (err: any) {
      error.value = 'Ошибка при загрузке урока'
      console.error('❌ Error loading lesson detail:', err)
    } finally {
      isLoading.value = false
    }
  }

  // ОСНОВНОЕ ИСПРАВЛЕНИЕ: Единый метод для обновления статуса урока
  const updateLessonStatus = async (lessonId: number, completed: boolean) => {
    try {
      // Отправляем запрос к API
      if (completed) {
        await lessonService.completeLesson(lessonId)
      } else {
        await lessonService.uncompleteLesson(lessonId)
      }

      // ОБНОВЛЯЕМ ВСЕ СОСТОЯНИЯ СИНХРОННО:

      // 1. Обновляем в списке уроков
      const lessonIndex = lessons.value.findIndex((l) => l.id === lessonId)
      if (lessonIndex !== -1) {
        lessons.value[lessonIndex].completed = completed
      }

      // 2. Обновляем текущий урок если он активен
      if (currentLesson.value && currentLesson.value.id === lessonId) {
        currentLesson.value = {
          ...currentLesson.value,
          is_completed: completed,
        }
      }

      // 3. Пересчитываем прогресс курса
      updateProgress(lessons.value)

      console.log(`✅ Статус урока ${lessonId} обновлен:`, completed ? 'завершен' : 'не завершен')
    } catch (err) {
      console.error('❌ Error updating lesson status:', err)
      throw err
    }
  }

  // Упрощенные методы для обратной совместимости
  const markLessonCompleted = async (lessonId: number) => {
    return updateLessonStatus(lessonId, true)
  }

  const markLessonIncomplete = async (lessonId: number) => {
    return updateLessonStatus(lessonId, false)
  }

  // Вспомогательная функция для обновления прогресса
  const updateProgress = (lessonsData: Lesson[]) => {
    const completedLessons = lessonsData.filter((lesson) => lesson.completed).length
    const totalLessons = lessonsData.length

    progress.value = {
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      progress_percent: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
    }

    // ДОБАВЛЯЕМ ОТЛАДОЧНЫЙ ВЫВОД
    console.log('🧮 Расчет прогресса:', {
      completed: completedLessons,
      total: totalLessons,
      percent: progress.value.progress_percent + '%',
      lessons: lessonsData.map((l) => ({ id: l.id, completed: l.completed })),
    })
  }

  // Метод для полного обновления данных курса
  const refreshCourseData = async (courseId: number) => {
    try {
      console.log('🔄 Полное обновление данных курса')
      await fetchCourseDetail(courseId)
    } catch (err) {
      console.error('❌ Ошибка при обновлении данных курса:', err)
    }
  }

  // Сброс состояния
  const reset = () => {
    course.value = null
    lessons.value = []
    currentLesson.value = null
    progress.value = {
      completed_lessons: 0,
      total_lessons: 0,
      progress_percent: 0,
    }
    error.value = null
  }

  return {
    course,
    lessons,
    currentLesson,
    progress,
    isLoading,
    error,
    fetchCourseDetail,
    fetchLessonDetail,
    markLessonCompleted,
    markLessonIncomplete,
    updateLessonStatus,
    refreshCourseData,
    reset,
  }
})
