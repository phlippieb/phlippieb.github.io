import { defineConfig } from 'astro/config';
// import lightTheme from './xcode-default-light-theme.json';


// https://astro.build/config
export default defineConfig({
  site: 'https://phlippieb.dev',
  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true,
    },
  },
});
