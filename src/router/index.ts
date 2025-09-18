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
      path: '/lessons',
      name: 'lessons',
      component: () => import('@/views/HomeView.vue') 
    },
    {
      path: '/tests',
      name: 'tests',
      component: () => import('@/views/HomeView.vue') 
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
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/dashboard/ProfileSettingsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

export default router