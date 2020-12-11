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
        component: () => import(/* webpackChunkName: "about" */ '../views/setting/index.vue')
      },
      {
        path: '/locationSetting',
        name: 'locationSetting',
        component: () => import(/* webpackChunkName: "about" */ '../views/setting.vue')
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
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/register.vue')
  },
  {
    path: '/forgetPwd',
    name: 'forgetPwd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/forgetPassword.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue'),
  },
  {
    path: '*',
    redirect: {
      path: '/404'
    }
  }
]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // let isLogin = sessionStorage.getItem('hasLogin')
  const whiteList = ['/register','/login','/forgetPwd']
  const token = localStorage.getItem('token')
  if(!token && !whiteList.includes(to.path)){
    next('/login')
  }else if(token){
    next()
  }else {

  }
  next()
})
export default router
