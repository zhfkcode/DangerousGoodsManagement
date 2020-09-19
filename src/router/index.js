import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    children:[
      {
        path:'/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../views/alarmRecord.vue')
      },
      {
        path:'/alarm',
        name: 'alarm',
        component: () => import(/* webpackChunkName: "about" */ '../views/detection.vue')
      },
      {
        path:'/hisData',
        name: 'hisData',
        component: () => import(/* webpackChunkName: "about" */ '../views/historyData.vue')
      },
      {
        path:'/setting',
        name: 'setting',
        component: () => import(/* webpackChunkName: "about" */ '../views/setting.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
