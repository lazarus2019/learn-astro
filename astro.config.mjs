// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

import svelte from '@astrojs/svelte';

import path from 'node:path';
import { remarkReadingTime } from './src/remark-reading-time.mjs';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // image: {
  //   domains: []
  // },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
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
    mdx(),
  ],
  server: ({ command }) => ({
    port: command === 'preview' ? 1234 : 4321,
  }),
});
