import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import eslintPlugin from 'vite-plugin-eslint'
import { MyMdueIconResolver } from './vite.config.mdue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: '/godfather-elements-vue3/', //project name req for ghPages
  server: { open: true },
  plugins: [
    VueRouter({ 
      dts: 'src/auto-router.d.ts' 
    }),
    vue(),
    viteSingleFile(),
    Components({ 
      resolvers: [HeadlessUiResolver(),MyMdueIconResolver],
      dts: 'src/auto-components.d.ts'
    }),
    AutoImport({
      imports: ['vue', '@vueuse/head', VueRouterAutoImports],
      dts: 'src/auto-imports.d.ts'
    }),
    eslintPlugin()
  ],
})
