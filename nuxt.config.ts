import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],

  // Sử dụng plugin router để thay đổi tiêu đề trang
  plugins: ['~/plugins/router.js'],
});
