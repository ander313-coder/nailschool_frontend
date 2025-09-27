export const demoStats = {
  overview: {
    completedCourses: 2,
    activeCourses: 3,
    totalLessons: 24,
    completedLessons: 15,
    averageScore: 87,
    learningStreak: 7
  },
  recentActivity: [
    { course: 'Базовый маникюр', lesson: 'Техника безопасности', date: '2024-01-15', type: 'completed' },
    { course: 'Пилочный маникюр', lesson: 'Работа с пилкой', date: '2024-01-14', type: 'started' },
    { course: 'Базовый маникюр', lesson: 'Тест: Инструменты', date: '2024-01-13', type: 'test', score: 92 }
  ],
  progressByCourse: [
    { name: 'Базовый маникюр', progress: 85, totalLessons: 12, completed: 10 },
    { name: 'Пилочный маникюр', progress: 40, totalLessons: 8, completed: 3 },
    { name: 'Гель-лак', progress: 15, totalLessons: 15, completed: 2 }
  ]
};