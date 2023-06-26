import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "front",
      component: () => import("@/components/Front.vue"),
      children: [
        {
          path: "",
          alias: ["l", "login"],
          name: "login",
          component: () => import("@/views/Login.vue")
        },
        {
          path: "register",
          alias: "reg",
          name: "register",
          component: () => import("@/views/Register.vue")
        },
      ]
    },
    {
      path: "/backend",
      name: "backend",
      redirect: "/backend/schedule",
      component: () => import("@/components/Backend.vue"),
      children: [
        {
          path: "schedule",
          name: "schedule",
          component: () => import("@/views/Schedule.vue")
        }
      ]
    }
  ]
});

export default router;
