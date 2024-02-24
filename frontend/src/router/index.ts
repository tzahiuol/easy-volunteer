import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

import { useAuthStore } from '../stores/auth-store'
import { useQuestionsStore } from '../stores/questions-store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'filter' },
  },
  {
    name: 'panel',
    path: '/panel/',
    component: AppLayout,
    redirect: { name: 'filter' },
    children: [
      {
        'name': 'filter',
        path: 'filter',
        component : () => import('../pages/filter/Filter.vue'),
      },
      {
        'name': 'questions',
        path: 'questions',
        component : () => import('../pages/questions/Questions.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

// This is a global guard that checks if the user is logged in.
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const questionsStore = useQuestionsStore();
  if (!to.path.includes('/auth/')) {
    if (authStore.isLoggedIn === null) {
      await authStore.getMe()
    }
    if (authStore.isLoggedIn === false) {
      return next({ name: 'login' })
    }
  } else {
    // Reset questions store when navigating to auth pages to avoid bugs when signing out.
    questionsStore.reset()
  }
  if (to.path.includes('/panel/')){
    if (questionsStore.shouldAnswerQuestions === null) {
      await questionsStore.checkShouldAnswerQuestions()
    }
    if (!to.path.includes('/panel/questions') && questionsStore.shouldAnswerQuestions === true) {
      return next({ name: 'questions' })
    }
  }
  next()
})

export default router
