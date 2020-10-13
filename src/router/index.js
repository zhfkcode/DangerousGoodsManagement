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
        path:'/probeDetail',
        name: 'probeDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/probeDetail.vue')
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
      },
      {
        path: '/locationSetting',
        name: 'locationSetting',
        component: () => import(/* webpackChunkName: "about" */ '../views/hiddenSet.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let isLogin = sessionStorage.getItem('hasLogin')
  if(to.path=='/login'|| isLogin){
    next()
  }else {
    next('/login')
  }
})
export default router
