// Типы для пользователя
export interface User {
  id: number
  username: string
  email: string
  role: 'TRAINEE' | 'MASTER' | 'INSTRUCTOR'
  first_name: string | null
  last_name: string | null
  phone?: string
  bio?: string
  avatar?: string
  progress?: number
  next_role_display?: string | null
  // Старые поля для обратной совместимости
  name?: string
  level?: string
}

// Типы для курсов
export interface Course {
  id: number
  title: string
  description: string
  access_level: string
  course_type: string
  cover_image?: string
  lesson_count?: number
  instructors?: string[]
  created_at?: string
  updated_at?: string
}

export interface CourseLessonsResponse {
  course_id: number
  title: string
  lessons: Lesson[]
}

// Типы для уроков
export interface Lesson {
  id: number
  title: string
  order: number
  duration_minutes: number
  has_test: boolean
  has_homework: boolean
  completed: boolean
  is_unlocked: boolean
  test_id?: number | null
}

export interface LessonService {
  getCourseLessons(courseId: number): Promise<CourseLessonsResponse>
  getLessonDetail(lessonId: number): Promise<LessonDetail>
  completeLesson(lessonId: number): Promise<void>
  uncompleteLesson(lessonId: number): Promise<void>
}

export interface LessonDetail {
  id: number
  course_id: number
  course_title: string
  title: string
  description: string
  video_url: string | null
  duration_minutes: number
  has_homework: boolean
  is_unlocked: boolean
  is_completed: boolean
  materials: LessonMaterial[]
}

export interface LessonMaterial {
  id: number
  name: string
  file: string
  uploaded_at: string
  url?: string
  title?: string
  description?: string
}

// Типы для прогресса
export interface ProgressSummary {
  id: number
  title: string
  total_lessons: number
  completed_lessons: number
}

export interface ProgressResponse {
  summary: ProgressSummary[]
  detailed: any[]
}

// Типы для тестов
export interface Test {
  id: number
  title: string
  description: string
  pass_score: number
  questions: Question[]
}

export interface Question {
  id: number
  text: string
  type: 'SINGLE' | 'MULTIPLE' | 'TEXT'
  points: number
  answers: Answer[] | null
}

export interface Answer {
  id: number
  text: string
  is_correct: boolean
}

// Типы для отправки тестов
export interface TestSubmission {
  test_id: number
  answers: {
    question_id: number
    answer_ids?: number[]
    text_answer?: string
  }[]
}

export interface TestResult {
  score: number
  passed: boolean
  correct_answers?: number
  correctAnswers?: number
  total_questions?: number
  totalQuestions?: number
  wrong_answers?: number
  details?: any
}
// Типы для домашних заданий
export type HomeworkStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface HomeworkFile {
  id: number
  file: string
  uploaded_at: string
  url?: string
}

export interface Homework {
  id: number
  user?: {
    id: number
    username: string
    email: string
    first_name?: string
    last_name?: string
  }
  lesson:
    | number
    | {
        id: number
        title: string
        course?: {
          id: number
          title: string
        }
      }
  lesson_title?: string
  course_title?: string
  comment: string
  instructor_comment: string
  status: HomeworkStatus
  files: HomeworkFile[]
  created_at: string
  updated_at: string
}

// Добавляем хелперы для работы с данными
export const getHomeworkUserName = (homework: Homework): string => {
  if (typeof homework.user === 'object' && homework.user !== null) {
    return homework.user.username || 'Неизвестно'
  }
  return 'Неизвестно'
}

export const getHomeworkLessonTitle = (homework: Homework): string => {
  if (typeof homework.lesson === 'object' && homework.lesson !== null) {
    return homework.lesson.title || 'Без названия'
  }
  return 'Без названия'
}

export const getHomeworkCourseTitle = (homework: Homework): string => {
  if (typeof homework.lesson === 'object' && homework.lesson !== null && homework.lesson.course) {
    return homework.lesson.course.title || 'Без курса'
  }
  return 'Без курса'
}

export const getHomeworkCourseId = (homework: Homework): number | null => {
  if (typeof homework.lesson === 'object' && homework.lesson !== null && homework.lesson.course) {
    return homework.lesson.course.id
  }
  return null
}

export type HomeworkReviewStatus = 'APPROVED' | 'REJECTED'

export interface HomeworkReviewData {
  status: HomeworkReviewStatus
  instructor_comment: string
}

export interface TextAnswer {
  id: number
  user: {
    id: number
    username: string
    email: string
  }
  question: {
    id: number
    text: string
    type: string
    points: number
  }
  test: {
    id: number
    title: string
    lesson_title: string
  }
  answer_text: string
  created_at: string
  requires_review: boolean
  is_approved?: boolean
  score?: number
  feedback?: string
  reviewed_at?: string
}

export interface TextAnswerReviewData {
  is_approved: boolean
  score: number
  feedback: string
}

export interface HomeworkFilters {
  status?: string
  course_id?: number
}

export interface HomeworkSubmission {
  lesson_id: number
  comment: string
  files: File[]
}

export interface PaginatedResponse<T> {
  count: number
  results: T[]
  next?: string
  previous?: string
}
