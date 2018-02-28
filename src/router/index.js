import Vue from 'vue'
import Router from 'vue-router'

import OverView from '@/components/OverView'
import RecordList from '@/components/RecordList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'OverView',
      component: OverView
    },
    {
      path: '/OverView',
      name: 'OverView',
      component: OverView
    },
    {
      path: '/RecordList',
      name: 'RecordList',
      component: RecordList
    }
  ]
})