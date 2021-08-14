import Vue from 'vue'
import Router from 'vue-router'
import BlogDetail from '../views/BlogDetail.vue'
import BlogEdit from '../views/BlogEdit.vue'
import Blogs from '../views/Blogs.vue'
import Login from '../views/Login.vue'

Vue.use(Router)

/*其中，带有meta：requireAuth: true说明是需要登录字后才能访问的受限资源，后面我们路由权限拦截时候会用到。*/
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect:{name:"Blogs"}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/blogs',
      name: 'Blogs',
      // 懒加载
      component: () => import('../views/Blogs.vue')
    },
    {
      path: '/blog/add',
      name: 'BlogAdd',
      component: BlogEdit,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/blog/:blogId',
      name: 'BlogDetail',
      component: BlogDetail
    },
    {
      path: '/blog/:blogId/edit',
      name: 'BlogEdit',
      component: BlogEdit,
      meta:{
        requireAuth:true
      }
    },
  ]
})
