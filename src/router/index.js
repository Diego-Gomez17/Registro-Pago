import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth } from '../Firebase/init'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/records',
      name: 'records',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RecordView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/edits',
      name: 'edits',
      component: () => import('../views/EditView.vue'),
      meta: {requiresAuth: true},
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    const user = auth.currentUser;
    if(!user){
      next({path: '/'})
    }else{
      next()
    }
  } else {
    next()
  }
})

export default router
