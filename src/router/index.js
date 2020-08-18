import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home'

import Chapter from '@/components/home/Chapter'
import HomeCenter from '@/components/home/HomeCenter'
import HomeFooter from '@/components/home/HomeFooter'
import HomeHeader from '@/components/home/HomeHeader'
import LoginRegister from '@/components/home/LoginRegister'
import Novel from '@/components/home/Novel'
import NovelDisplay from '@/components/home/NovelDisplay'
import NovelManagement from '@/components/home/NovelManagement'
import User from '@/components/home/User'

import UserInformation from '@/components/home/homeHeader/UserInformation'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'chapter',
        component: Chapter
      },
      {
        path: 'homeCenter',
        component: HomeCenter
      },
      {
        path: 'homeFooter',
        component: HomeFooter
      },
      {
        path: 'homeHeader',
        component: HomeHeader,
        children: [
          {
            path: 'userInformation',
            component: UserInformation
          }
        ]
      },
      {
        path: 'loginRegister',
        component: LoginRegister
      },
      {
        path: 'novel',
        component: Novel
      },
      {
        path: 'novelDisplay',
        component: NovelDisplay
      },
      {
        path: 'novelManagement',
        component: NovelManagement
      },
      {
        path: 'user',
        component: User
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
