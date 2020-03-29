import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'game',
    component: () => import(/* webpackChunkName: "game" */ '../views/Game/index.vue')
  },
  {
    path: '/host',
    name: 'host',
    component: () => import(/* webpackChunkName: "game" */ '../views/Host/index.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
