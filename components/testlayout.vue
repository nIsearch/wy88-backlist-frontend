<template>
    <div class="flex overflow-hidden h-screen">
      <!-- Sidebar -->
      <div 
        class="lg:relative fixed top-0 left-0 h-full w-64 bg-white text-black shadow-md z-50 flex flex-col transform transition-transform duration-200"
        :class="{ '-translate-x-full': !sidebarOpen && screenIsSmall, 'translate-x-0': sidebarOpen || !screenIsSmall }"
      >
        <!-- Logo or App Name -->
        <div class="p-4 text-lg font-bold text-center border-b border-r bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
          โปรแกรมจัดการโปรโมชั่น
        </div>
  
        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2">
          <!---->
          <NuxtLink
            to="/"
            class=" block px-4 py-4 rounded hover:bg-gradient-to-r from-pink-500 to-blue-600 hover:text-black transition duration-200"
            :class="{ 'bg-gray-500 text-black': isActive('/') }"
            @click="sidebarOpen = false" 
          >
            Dashboard
          </NuxtLink>
  
          <NuxtLink
            to=""
            class="block px-4 py-4 rounded hover:bg-gradient-to-r from-pink-500 to-blue-600 hover:text-black transition duration-200"
            :class="{ 'bg-gradient-to-r from-pink-500 to-blue-600 text-black': isActive('') }"
            @click="sidebarOpen = false" 
          >
          เพิ่มผู้ใช้
          </NuxtLink>
          

        </nav>
  
        <!-- Logout/Settings -->
        <div class="p-4 border-t bg-white">
          <NuxtLink to="/login-page/login" class="block px-4 py-2 rounded hover:bg-gradient-to-r from-blue-500 to-pink-500 hover:text-black transition duration-200" @click="sidebarOpen = false">
            Login 
          </NuxtLink>
        </div>
      </div>
  
      <!-- Main Content Area -->
      <div 
        class="flex-1 p-0 overflow-y-auto transition-all duration-200" 
        :class="{ 'lg:ml-100': !screenIsSmall || sidebarOpen }"
      >
        <!-- Mobile and iPad Menu Toggle -->
        <div class="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 p-4 flex justify-between items-center lg:hidden">
          <span class="text-lg font-bold text-white">My Domain</span>
          <button 
            @click="sidebarOpen = !sidebarOpen" 
            class="text-white focus:outline-none"
          >
            <!-- Icon for menu button -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <Sidebar />
        <Header />
  
        <!-- Content Slot -->

        <div class=" overflow-x-hidden bg-gray-100 min-h-screen">
          
            <NuxtPage />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const sidebarOpen = ref(false); // Track sidebar visibility on mobile and iPad
  const screenIsSmall = ref(false); // Track screen size
  
  // Function to check if the current route matches the menu link
  const isActive = (path) => {
    return route.path === path;
  };
  
  // Detect screen size and update `screenIsSmall` accordingly
  const handleResize = () => {
    screenIsSmall.value = window.innerWidth < 1024;
  };
  
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });
  </script>
  
  <style scoped>
  /* Prevent horizontal scrolling */
  body {
    overflow-x: hidden;
  }
  </style>
  