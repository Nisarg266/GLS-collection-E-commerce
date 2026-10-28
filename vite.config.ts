import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          collections: path.resolve(__dirname, 'collections.html'),
          collection: path.resolve(__dirname, 'collection.html'),
          product: path.resolve(__dirname, 'product.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          search: path.resolve(__dirname, 'search.html'),
          cart: path.resolve(__dirname, 'cart.html'),
          wishlist: path.resolve(__dirname, 'wishlist.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          policies: path.resolve(__dirname, 'policies.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
