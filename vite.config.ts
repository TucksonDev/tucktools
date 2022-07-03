import { defineConfig, splitVendorChunkPlugin  } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [vue(), splitVendorChunkPlugin()],

    // CSS Preprocessors
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "assets/scss/custom_bootstrap.scss"; @import "bootstrap/scss/bootstrap.scss"; @import "bootstrap-icons/font/bootstrap-icons.scss";`
        },
      }
    },

    // Build
    build: {
      chunkSizeWarningLimit: 1000,
    }
  };

  return config;
});
