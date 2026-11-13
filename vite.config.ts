/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Preloads the self-hosted fonts the homepage paints first (src/styles/fonts.css),
 * so they arrive with the CSS instead of after the first layout.
 */
const PRELOAD_FONTS = /^assets\/(bebasneue-normal-400|barlowcondensed-normal-700|barlow-normal-400|barlow-normal-600)-[\w-]+\.woff2$/;
function preloadFonts(): Plugin {
  let base = '/';
  return {
    name: 'rwtw-preload-fonts',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((f) => PRELOAD_FONTS.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${f}`, crossorigin: '' },
            injectTo: 'head-prepend' as const,
          }));
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      preloadFonts(),
    ],
    test: {
      include: ['src/**/*.test.ts'],
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    base: mode === 'production' ? '/ride-with-the-warriors/' : '/',
  };
});
