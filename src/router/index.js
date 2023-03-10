import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'front',
    redirect: 'login',
    component: () => import('@/views/FrontView.vue'),
    children: [
      {
        path: 'login',
        name: 'loginPage',
        component: () => import('@/views/front/LoginView.vue')
      },
      {
        path: 'register',
        name: 'registerPage',
        component: () => import('@/views/front/RegisterView.vue')
      }
    ]
  },
  {
    path: '/backend',
    name: 'backend',
    redirect: '/backend/schedule',
    component: () => import('@/views/BackendView.vue'),
    children: [
      {
        path: 'schedule',
        name: 'schedulePage',
        component: () => import('@/views/backend/ScheduleView.vue')
      },
      {
        path: 'fileUpload',
        name: 'fileUploadPage',
        component: () => import('@/views/backend/FileUploadView.vue')
      }
    ]
  },
  {
    path: '/404',
    name: 'notFount',
    component: () => import('@/views/NotFoundView.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

export default router
