import ssg from './vite-plugin-ssg.js'
// import { defineConfig } from 'vite'
import { resolvePackageData } from 'vite'
const qMarkdown = async ({ app }) => {
  const Plugin = (await import('@quasar/quasar-ui-qmarkdown')).default
  app.use(Plugin)
}

const qMediaplayer = async ({ app }) => {
  const Plugin = (await import('@stefanvh/quasar-ui-qmediaplayer')).default

  app.use(Plugin)
}
export default function ({ mode, command }) {
  return {
    vitrify: {
      sass: {
        additionalData: [
          `@import '@quasar/quasar-ui-qmarkdown/src/QMarkdown.sass'`,
          `@import '@stefanvh/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'`
        ]
      },
      hooks: {
        onBoot: [qMarkdown, qMediaplayer]
      }
    },
    plugins: [
      ssg(),
      {
        name: 'resolve',
        config: (config) => {
          return {
            resolve: {
              alias: [
                {
                  find: new RegExp('^@quasar/quasar-ui-qmarkdown'),
                  replacement: resolvePackageData(
                    '@quasar/quasar-ui-qmarkdown',
                    config.vitrify.urls.app.pathname
                  ).dir
                }
              ]
            }
          }
        }
      }
    ],
    quasar: {
      extras: ['material-icons', 'fontawesome-v5'],
      framework: {
        plugins: ['AppFullscreen', 'Meta']
      }
    }
  }
}
