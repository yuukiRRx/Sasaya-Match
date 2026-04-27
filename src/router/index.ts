import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/MenuView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/diagnosis',
    name: 'Diagnosis',
    component: () => import('../views/DiagnosisView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/diagnosis-result',
    name: 'DiagnosisResult',
    component: () => import('../views/DiagnosisResultView.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/recommendations',
    name: 'Recommendations',
    component: () => import('../views/RecommendationView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('../views/ExploreView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/RankingView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/DetailView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/summary',
    name: 'Summary',
    component: () => import('../views/SummaryView.vue'),
    meta: { transition: 'slide' }
  },
  {
    path: '/plan',
    name: 'Plan',
    component: () => import('../views/PlanView.vue'),
    meta: { transition: 'slide' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to, from) => {
  // 戻る遷移の判定
  const backPairs: Record<string, string[]> = {
    'Home': ['Login', 'Menu'],
    'Menu': ['Diagnosis', 'Explore', 'Favorites', 'Ranking', 'Plan'],
    'Diagnosis': ['DiagnosisResult'],
    'Recommendations': ['Detail']
  }

  let isBack = false
  for (const [target, sources] of Object.entries(backPairs)) {
    if (to.name === target && sources.includes(from.name as string)) {
      isBack = true
      break
    }
  }

  to.meta.transition = isBack ? 'slide-back' : 'slide'
})

export default router
