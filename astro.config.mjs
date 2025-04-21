// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

import svelte from '@astrojs/svelte';

import path from 'node:path';
import { remarkReadingTime } from './src/remark-reading-time.mjs';
import { loadEnv } from 'vite';

// const {PORT} = loadEnv(process.env.NODE_ENV, process.cwd(), '');
// console.log(PORT)
// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      ALGOLIA_APP_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      PORT: envField.number({
        context: 'server',
        access: 'public',
        default: 4321,
      }),
      ALGOLIA_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
  image: {
    domains: ['astro.build'],
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    plugins: [tailwindcss()],
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, 'src'),
    //   },
    // },
    server: {
      port: 3000,
    },
  },

  site: 'https://deploy-astro-app.netlify.app',
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    vue({
      devtools: true,
    }),
    svelte({
      extensions: ['.svelte'],
    }),
  ],
  server: ({ command }) => ({
    port: command === 'preview' ? 1234 : 4321,
  }),
});
