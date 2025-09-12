// Типы для пользователя
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'TRAINEE' | 'MASTER' | 'INSTRUCTOR';
  first_name?: string;    
  last_name?: string;     
  phone?: string;
  bio?: string;
  avatar?: string;
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

// Типы для уроков
export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  is_completed: boolean;
  has_test: boolean;
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