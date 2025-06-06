import { createRouter, createWebHistory } from 'vue-router'
import GroupPage from '../pages/GroupPage.vue'
import GroupDetailPage from '../pages/GroupDetailPage.vue'
import SongPage from '../pages/SongPage.vue'
import TourPage from '../pages/TourPage.vue'
import AnalyticsPage from '../pages/AnalyticsPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import { isAuthenticated } from '../services/auth'
import AdminUsersPage from '../pages/AdminUsersPage.vue';

const routes = [
  { path: '/', redirect: '/groups' },

  { path: '/auth', component: LoginPage },

  { path: '/users', component: AdminUsersPage },

  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },

  { path: '/groups', component: GroupPage },

  {
    path: '/groups/:id',
    name: 'GroupDetail',
    component: GroupDetailPage,
    props: true
  },

  { path: '/songs', name: 'Songs', component: SongPage },
  
  {
    path: '/tours',
    name: 'TourPage',
    component: TourPage
  },
  
  {
    path: '/analytics',
    name: 'Analytics',
    component: AnalyticsPage
  }
  
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/auth'); // если неавторизован — редирект на логин
  } else {
    next(); // иначе пропускаем
  }
});

export default router;
