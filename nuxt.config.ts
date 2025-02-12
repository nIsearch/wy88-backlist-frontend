// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
 

 
  css: [  
    '/assets/css/main.css',
    '/assets/css/style.css',
    '/assets/css/style-preset.css',
    '/assets/fonts/tabler-icons.min.css',
    '/assets/fonts/feather.css',
    '/assets/fonts/fontawesome.css',
    '/assets/fonts/material.css',
    '/assets/css/fonts.css',

  ],

  ssr:true,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
 
  generate: {
    routes: [
      '/', // หน้าแรก
      '/tabel-banned-users/tabel_blacklist_users',
      '/tabel-admin/tabel_admin',
      '/tabel-project/tabel-project-name',
      '/login-page/login',
      '/add-user-backlist/add_user_backlist',
    ],
    
  },

  app: {
    head: {
      titleTemplate: "%s",
      meta: [
        { charset: "utf-8" },
        { name: "keywords", content: "%s" },
        { name: "description", content: "%s" },
      ],
    },
  },

 
})
