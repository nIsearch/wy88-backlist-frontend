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
      '/','/table-banned-users/table_blacklist_users', // หน้าแรก
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
