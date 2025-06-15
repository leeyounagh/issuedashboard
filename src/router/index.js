import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/issues',
  },
  {
    path: '/issues',
    name: 'IssueList',
    component: () => import('../pages/IssueList.vue'),
  },
  {
    path: '/issues/new',
    name: 'IssueCreate',
    component: () => import('../pages/IssueForm.vue'),
  },
  {
    path: '/issues/:id',
    name: 'IssueEdit',
    component: () => import('../pages/IssueForm.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
