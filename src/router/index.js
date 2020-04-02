import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store}) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to,from, next) => {
    to.matched.some( route =>{
      let dsg = localStorage.getItem('Designation')

      if(route.meta.requiresAuth){
        if(dsg == null){
          next(
          )
        } else {
          next (
            { path: '/'}
          )
        }
      }
  
      if(route.meta.isAdmin){
        if(dsg == 'e3afed0047b08059d0fada10f400c1e5'){
          next()
        } else {
          next (
            { path: '/'}
          )
        }
      }
  
      if(route.meta.isCollector){
        if(dsg == '8fc330d76e990ab6964af08ea1e47d2e'){
          next()
        } else {
          next (
            { path: '/'}
          )
        }
      }

      if(route.meta.isMember){
        if(dsg == '858ba4765e53c712ef672a9570474b1d'){
          next()
        } else {
          console.log('Member')
          next (
            { path: '/'}
            )
        }
      }

      next()
    })
  })
  return Router
}