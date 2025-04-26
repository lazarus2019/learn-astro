// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

import svelte from '@astrojs/svelte';

import path from 'node:path';
import { remarkReadingTime } from './src/remark-reading-time.mjs';

import mdx from '@astrojs/mdx';

import remarkToc from 'remark-toc';

import rehypePresetMinify from 'rehype-preset-minify';

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
    mdx({
      // mdx will be extends the markdown configuration as default
      // use this config for ignore extendMarkdownConfig: false
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'dracula' },
      remarkPlugins: [remarkToc],
      rehypePlugins: [rehypePresetMinify],
      remarkRehype: { footnoteLabel: 'Footnotes' },
      gfm: false,
      // extendMarkdownConfig: false,
      // optimize: true,
      // recmaPlugins: [], // define output etree (@seemore: https://github.com/estree/estree)
      // smartypants: false // smartypants (https://daringfireball.net/projects/smartypants/)
    }),
  ],
  server: ({ command }) => ({
    port: command === 'preview' ? 1234 : 4321,
  }),
});
