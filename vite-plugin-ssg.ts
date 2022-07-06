import type { Plugin } from 'vite'
import yamlPlugin from '@rollup/plugin-yaml'
import jsyaml from 'js-yaml'
// import * as imr from 'import-meta-resolve'
// const { resolve } = imr
import { readFileSync, existsSync } from 'fs'
import type { VitrifyConfig } from 'vitrify'

let yamlPath: string
let parsedYaml: Record<string, any>

export const SsgPlugin = (): Plugin[] => {
  let template = ''
  return [
    yamlPlugin(),
    {
      name: 'ssg-plugin',
      config: async (config: VitrifyConfig, env) => {
        yamlPath = new URL('ssg.yaml', config.vitrify?.urls?.cwd).pathname
        parsedYaml = yamlPath
          ? (jsyaml.load(readFileSync(yamlPath, 'utf8')) as Record<string, any>)
          : {}
        template = parsedYaml.template

        return {
          vitrify: {
            productName: parsedYaml.title,
            sass: {
              variables: parsedYaml.sassVariables,
              global: [
                '@quasar/quasar-ui-qmarkdown/src/QMarkdown.sass',
                '@stefanvh/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'
              ]
            }
          },

          optimizeDeps: {
            exclude: ['@simsustech/simple-site-generator-templates']
          },
          resolve: {
            alias: [
              { find: 'ssg.yaml', replacement: yamlPath || 'cwd/ssg.yaml' }
            ]
          }
        }
      },
      resolveId(id) {
        if (id === 'virtual:ssg:yaml') {
          return '\0virtual:ssg:yaml'
        }
        if (id === 'virtual:ssg:template') {
          return '\0virtual:ssg:template'
        }
      },
      load(id) {
        if (id === '\0virtual:ssg:yaml') {
          return `import ssg from 'cwd/ssg.yaml'; import { ref } from 'vue'; export default ref(ssg || {})`
        }
        if (id === '\0virtual:ssg:template') {
          return `
          import * as template from '@simsustech/simple-site-generator-templates/templates/${template}';
          export * from '@simsustech/simple-site-generator-templates/templates/${template}';
          export default template;`
        }
      }
    }
  ]
}

export default SsgPlugin
