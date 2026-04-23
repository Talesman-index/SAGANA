import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        'ia-article': resolve(__dirname, 'blog/ia-automatisation-business.html'),
        'design-article': resolve(__dirname, 'blog/design-thinking-strategie.html'),
        'seo-article': resolve(__dirname, 'blog/optimisation-seo-2026.html'),
      },
    },
  },
});
