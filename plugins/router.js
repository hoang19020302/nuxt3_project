export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.beforeEach((to, from, next) => {
    if (process.client && to.meta && to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  });
});
