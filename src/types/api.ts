// Типы для пользователя
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'TRAINEE' | 'MASTER' | 'INSTRUCTOR';
  first_name: string | null;    
  last_name: string | null;    
  phone?: string;
  bio?: string;
  avatar?: string;
  progress?: number;
  next_role_display?: string | null;
  // Старые поля для обратной совместимости
  name?: string;          
  level?: string;         
}

// Типы для курсов
export interface Course {
  id: number;
  title: string;
  description: string;
  access_level: string;
  course_type: string;
  cover_image?: string;
  lesson_count?: number;
}

export interface CourseLessonsResponse {
  course_id: number;
  title: string;
  lessons: Lesson[];
}

// Типы для уроков
export interface Lesson {
  id: number;
  title: string;
  order: number;
  duration_minutes: number;
  has_test: boolean;
  has_homework: boolean; 
  completed: boolean;
  is_unlocked: boolean; 
  test_id?: number | null; 
}

export interface LessonService {
  getCourseLessons(courseId: number): Promise<CourseLessonsResponse>;
  getLessonDetail(lessonId: number): Promise<LessonDetail>;
  completeLesson(lessonId: number): Promise<void>;
  uncompleteLesson(lessonId: number): Promise<void>;
}

export interface LessonDetail {
  id: number;
  course_id: number;
  course_title: string;
  title: string;
  description: string;
  video_url: string | null;
  duration_minutes: number;
  has_homework: boolean; 
  is_unlocked: boolean;
  is_completed: boolean;
  materials: LessonMaterial[];
}

export interface LessonMaterial {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
  url?: string;        
  title?: string;      
  description?: string; 
}

// Типы для прогресса
export interface ProgressSummary {
  id: number;
  title: string;
  total_lessons: number;
  completed_lessons: number;
}

export interface ProgressResponse {
  summary: ProgressSummary[];
  detailed: any[];
}

// Типы для тестов 
export interface Test {
  id: number;
  title: string;
  description: string;
  pass_score: number;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: 'SINGLE' | 'MULTIPLE' | 'TEXT';
  points: number;
  answers: Answer[] | null; 
}

export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

// Типы для отправки тестов
export interface TestSubmission {
  test_id: number;
  answers: {
    question_id: number;
    answer_ids?: number[];
    text_answer?: string;
  }[];
}

export interface TestResult {
  score: number;
  passed: boolean;
}
// Типы для домашних заданий
export type HomeworkStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface HomeworkFile {
  id: number;
  file: string;
  uploaded_at: string;
}

export interface Homework {
  id: number;
  lesson: number;
  comment: string;
  status: HomeworkStatus;
  files: HomeworkFile[];
  created_at: string;
}

export interface HomeworkSubmission {
  lesson_id: number;
  comment: string;
  files: File[];
}
