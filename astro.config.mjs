import { defineConfig } from 'astro/config';
// import lightTheme from './xcode-default-light-theme.json';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://phlippieb.dev',
  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true
    }
  },
  integrations: [sitemap()]
});