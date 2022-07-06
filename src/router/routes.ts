import ssg from 'virtual:ssg:yaml'
import { QNoSsr } from 'quasar'
import { h } from 'vue'
import { Layout } from 'virtual:ssg:template'
import { defineAsyncComponent } from 'vue'
const noSsrComponent = {
  name: 'NoSSRWrapper',
  render() {
    const component = defineAsyncComponent(this.component)
    return h(QNoSsr, null, {
      default: (props) => h(component, this.page)
    })
  },
  props: ['page', 'component']
}

const children = ssg.value.pages.map((page) => {
  page = { ...page, pages: ssg.value.pages }
  const vuePage = () =>
    import('virtual:ssg:template').then((module) => {
      return page.page ? module[page.page] : module.Page
    })
  // const vuePage = page.page ? () => import('virtual:ssg:template')[page.page] : () => import('virtual:ssg:template').Page
  return {
    path: page.id === 'home' ? '' : page.id,
    component: page.noSsr ? noSsrComponent : vuePage,
    props: page.noSsr ? { page, component: vuePage } : page,
    alias: page.id === 'home' ? ['home'] : []
  }
})

const routes = [
  {
    path: '/',
    component: Layout,
    props: {
      pages: ssg.value.pages,
      groups: ssg.value.groups,
      title: ssg.value.title,
      favicon: ssg.value.favicon
    },
    children
  }
]

export default routes
