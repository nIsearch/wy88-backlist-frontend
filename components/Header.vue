<template>
<header class="bg-white shadow-md">
    <div class="flex justify-between items-center px-4 py-3">
        <!-- Mobile Media Block Start -->
        <div class="flex space-x-4">
          <!-- Sidebar Toggle Icon -->
          <button  id="sidebar-hide" class="text-gray-600 hover:text-gray-800">
            <i class="ti ti-menu-2 text-xl"></i>
          </button>
  
          <!-- Search Dropdown for Mobile -->
          <div class="relative md:hidden">
            <button
              class="text-gray-600 hover:text-gray-800"
              @click="toggleSearch"
            >
              <i class="ph-duotone ph-magnifying-glass text-xl"></i>
            </button>
            <div
              v-if="isSearchOpen"
              class="absolute bg-white shadow-lg rounded-md mt-2 p-4 z-50 w-80"
            >
              <form>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    class="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    placeholder="ค้นหา..."
                  />
                  <button
                    type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    ค้นหา
                  </button>
                </div>
              </form>
            </div>
          </div>
  
          <!-- Search for Desktop -->
          <form class="hidden md:flex items-center space-x-2">
            <i class="ph-duotone ph-magnifying-glass text-gray-600 text-lg"></i>
            <input
              type="text"
              class="border border-gray-300 rounded-lg px-3 py-2 w-96"
              placeholder="ค้นหา..."
            />
            <button
              type="button"
              class="bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600"
            >
              <kbd>Ctrl+K</kbd>
            </button>
          </form>
        </div>
        <!-- Mobile Media Block End -->
  
        <!-- Right Side Options -->
        <div class="flex items-center space-x-4">
          <!-- Notification Dropdown -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="relative text-gray-600 hover:text-gray-800"
            >
              <i class="ph-duotone ph-bell-simple-ringing text-4xl"></i>
              <span
                class="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                1
              </span>
            </button>
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 bg-white shadow-lg rounded-md mt-2 p-4 w-80 z-50"
            >
              <h5 class="font-semibold text-gray-800 mb-4">การแจ้งเตือน</h5>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <img
                    src="assets\images\user\avatar-1.jpg"
                    alt="Avatar"
                    class="w-10 h-10 rounded-full"
                  />
                  <div class="ml-4">
                    <h6 class="text-sm font-semibold text-gray-800">
                      ออกจากระบบทุกครั้งเมื่อไม่ได้ใช้งาน
                    </h6>
                    <p class="text-gray-600 text-sm">
                      คำแนะนำจากระบบจัดการ Tiktok
                    </p>
                    <div class="flex space-x-2 mt-2">
                      <span
                        class="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs"
                        >เว็บดีไซต์</span
                      >
                      <span
                        class="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg text-xs"
                        >หน้าแรก</span
                      >
                      <button
                        @click="logout"
                        class="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- User Profile Dropdown -->
          <div class="relative">
            <button
              @click="toggleProfile"
              class="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <img
                src="assets\images\user\avatar-1.jpg"
                alt="Avatar"
                class="w-10 h-10 rounded-full"
              />
            </button>
            <div
              v-if="isProfileOpen"
              class="absolute right-0 bg-white shadow-lg rounded-md mt-2 p-4 w-60 z-50"
            >
              <h5 class="font-semibold text-gray-800 mb-4">โปรไฟล์</h5>
              <ul>
                <li class="flex items-center space-x-2 mb-4">
                  <img
                    src="assets\images\user\avatar-1.jpg"
                    alt="Avatar"
                    class="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h6 class="text-sm font-semibold text-gray-800">{{ username }}</h6>
                    <p class="text-sm text-gray-600">{{ fullName }}</p>
                  </div>
                </li>
                <li>
                  <button
                    @click="logout"
                    class="flex items-center space-x-2 text-red-500 hover:text-red-600 w-full"
                  >
                    <i class="ph-duotone ph-power text-lg"></i>
                    <span>ออกจากระบบ</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from "vue";
 

  const dropdownVisible = ref(false);
  
  function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
  }
  
  // State for dropdowns
  const isSearchOpen = ref(false);
  const isNotificationsOpen = ref(false);
  const isProfileOpen = ref(false);
  
  // Mock data
  const username = "User123";
  const fullName = "Carson Darrin";
  
  // Methods
  const toggleSearch = () => (isSearchOpen.value = !isSearchOpen.value);
  const toggleNotifications = () =>
    (isNotificationsOpen.value = !isNotificationsOpen.value);
  const toggleProfile = () => (isProfileOpen.value = !isProfileOpen.value);
  const logout = () => {
    console.log("Logged out");
  };
  </script>
  
  <style>
  /* Add custom styles here if needed */
  </style>
  