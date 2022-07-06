import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routes'

export default function createRouter() {
  return _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR
      ? createMemoryHistory(__BASE_URL__)
      : createWebHistory(__BASE_URL__),
    routes,
    scrollBehavior: function (to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth' }
      } else {
        console.log('moving to top of the page')
        window.scrollTo(0, 0)
      }
    }
  })
}
