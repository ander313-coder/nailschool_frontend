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

  // Отметить урок как завершенный
  const markLessonCompleted = async (lessonId: number) => {
    try {
      await lessonService.completeLesson(lessonId)

      // Обновляем локальное состояние БЕЗ перезагрузки
      const lessonIndex = lessons.value.findIndex((l) => l.id === lessonId)
      if (lessonIndex !== -1) {
        lessons.value[lessonIndex].completed = true
      }

      // Обновляем текущий урок если он активен
      if (currentLesson.value && currentLesson.value.id === lessonId) {
        currentLesson.value = {
          ...currentLesson.value,
          is_completed: true,
        }
      }

      updateProgress(lessons.value)
    } catch (err) {
      console.error('Error marking lesson completed:', err)
      throw err
    }
  }

  const markLessonIncomplete = async (lessonId: number) => {
    try {
      await lessonService.uncompleteLesson(lessonId)

      // Обновляем локальное состояние БЕЗ перезагрузки
      const lessonIndex = lessons.value.findIndex((l) => l.id === lessonId)
      if (lessonIndex !== -1) {
        lessons.value[lessonIndex].completed = false
      }

      // Обновляем текущий урок если он активен
      if (currentLesson.value && currentLesson.value.id === lessonId) {
        currentLesson.value = {
          ...currentLesson.value,
          is_completed: false,
        }
      }

      updateProgress(lessons.value)
    } catch (err) {
      console.error('Error marking lesson incomplete:', err)
      throw err
    }
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
  // Метод для принудительного обновления прогресса
  const refreshCourseProgress = async (courseId: number) => {
    try {
      console.log('🔄 Принудительное обновление прогресса курса')

      // Перезагружаем уроки курса чтобы получить актуальные данные
      const lessonsResponse = await lessonService.getCourseLessons(courseId)
      const lessonsData = lessonsResponse.lessons || []

      // Обновляем уроки и прогресс
      lessons.value = lessonsData
      updateProgress(lessonsData)

      console.log('✅ Прогресс курса обновлен:', {
        lessons: lessonsData.length,
        completed: progress.value.completed_lessons,
        progress: progress.value.progress_percent + '%',
      })
    } catch (err: any) {
      console.error('❌ Ошибка при обновлении прогресса курса:', err)
    }
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
    refreshCourseProgress,
    reset,
  }
})
