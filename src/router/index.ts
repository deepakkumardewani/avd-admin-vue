import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/darshan' },
  {
    path: '/darshan',
    component: () => import('@/views/DarshanView.vue'),
    meta: { section: 'darshan', title: 'Daily Darshan' },
  },
  {
    path: '/audio',
    component: () => import('@/views/AudioView.vue'),
    meta: { section: 'audio', title: 'Daily Audio' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/darshan' },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'Admin')} · Anand Vrindavan Dham`
})
