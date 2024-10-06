import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

import xwtsI18n from '@xirelogy/rollup-plugin-xwts-i18n';

const i18n = xwtsI18n({
  output: {
    type: 'file',
    fileName: 'locales.es.js',
    cjsFileName: 'locales.umd.js',
    dtsFilename: 'locales.d.ts',
  },
  roots: {
    'locales': [ 'vany', '@xirelogy' ],
  },
  include: 'locales/**'
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    i18n,
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VanyComponentLibrary',
      fileName: 'vany',
    },
    rollupOptions: {
      external: [
        'vue',
        '@xirelogy/xwts',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@xirelogy/xwts': 'Xwts',
        },
      },
    },
  },
});
