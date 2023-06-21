import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: ["/l", "/login"],
      name: "login",
      component: () => import("@/views/login.vue")
    },
    {
      path: "/register",
      alias: "/reg",
      name: "register",
      component: () => import("@/views/register.vue")
    }
  ]
})

export default router
