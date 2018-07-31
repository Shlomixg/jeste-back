import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Todos from '@/components/Todos'
import Chat from '@/components/Chat'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/todos',
      name: 'Todos',
      component: Todos
    },
    
     {
      path: '*',
      name: 'Other',
      component: Hello
    }
  ]
})
