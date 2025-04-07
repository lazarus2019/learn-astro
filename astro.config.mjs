// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

import svelte from '@astrojs/svelte';

import path from 'node:path';

// https://astro.build/config
export default defineConfig({
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
