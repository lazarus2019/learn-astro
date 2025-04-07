// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

console.log('envField', envField);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      ALGOLIA_APP_ID: envField.string({
        context: 'client',
        access: 'public',
      }),
      ALGOLIA_API_KEY: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
  },
});
