import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import SignupView from '../views/SignupView.vue';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';
import MenuView from '../views/MenuView.vue';
import ItemView from '../views/ItemView.vue';
import ErrorView from '../views/ErrorView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
  {
    path: '/menu/:locationId',
    name: 'menu',
    component: MenuView,
  },
  {
    path: '/itemview/:locationId/:catId',
    name: 'view item',
    component: ItemView,
  },
  {
    path: '/:catchAll(.*)',
    name: 'error',
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.name.charAt(0).toUpperCase()}${to.name.slice(1)} Page`;
  next();
});

export default router;
