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
}

// Типы для курсов
export interface Course {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  access_level: 'BASIC' | 'ADVANCED' | 'ALL';
  course_type: 'VIDEO' | 'TEXT' | 'MIXED';
  cover_image?: string;
  lesson_count?: number;
  duration_minutes?: number;
  instructors?: User[];
  created_at?: string;
  updated_at?: string;
}

// Типы для уроков
export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description: string;
  short_description?: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  is_completed?: boolean;
  has_test?: boolean;
  is_unlocked?: boolean;
  created_at?: string;
  files?: LessonFile[];
}

export interface LessonFile {
  id: number;
  title: string;
  description: string;
  file: string;
  file_type: string;
  order: number;
}

// Типы для тестов
export interface Test {
  id: number;
  lesson_id: number;
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
  answers?: Answer[];
}

export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

// Тип для ответа API с пагинацией
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}