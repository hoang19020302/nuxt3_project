import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false, // Tắt SSR để sử dụng Nuxt như một SPA
  app: {
    baseURL: '/', // hoặc '/ten-thu-muc/' nếu deploy dưới subpath
  },
  nitro: {
    preset: 'static'
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],

  // Sử dụng plugin router để thay đổi tiêu đề trang
  plugins: ['~/plugins/router.js'],
});
