import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/views/CoursesView.vue')
    },
    {
      path: '/courses/:id',
      name: 'course-detail',
      component: () => import('@/views/CourseDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/:courseId/lesson/:lessonId',
      name: 'lesson-detail',
      component: () => import('@/views/LessonView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/:courseId/lesson/:lessonId/test',
      name: 'lesson-test',
      component: () => import('@/views/TestView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/:courseId/lesson/:lessonId/test/results',
      name: 'test-results',
      component: () => import('@/views/TestResultsView.vue'),
      meta: { requiresAuth: true }
    },
    
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('@/views/dashboard/UserCoursesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/dashboard/ProgressView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/dashboard/ProfileSettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/dashboard/SettingsView.vue'), 
      meta: { requiresAuth: true }
    },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => import('@/views/DesignSystemView.vue')
    },
    {
    path: '/test/:testId', 
    name: 'Test',
    component: () => import('@/components/TestComponent.vue'),
    meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router