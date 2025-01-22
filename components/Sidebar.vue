<template>
    <nav class="pc-sidebar bg-gray-100 h-screen">
      <div class="">
        <!-- Header Logo -->
        <div class="m-header flex justify-center items-center h-20">
          <NuxtLink to="/" class="b-brand flex items-center gap-2">
            <img src="" alt="logo" class="w-10 h-auto" />
            <p class="text-xl text-black font-semibold whitespace-nowrap">จัดการผู้ใช้</p>
          </NuxtLink>
        </div>
  
        <!-- Navigation Menu -->
        <div class="navbar-content px-4">
          <ul class="pc-navbar space-y-4">
            <li class="pc-item pc-caption text-gray-500 font-semibold">
              <label>เมนูการนำทาง</label>
            </li>
            <li class="pc-item pc-hasmenu">
              <NuxtLink to="/" class="pc-link flex items-center gap-2 text-gray-800 hover:text-blue-500">
                <i class="ph-duotone ph-gauge text-lg"></i>
                <span>ตารางข้อมูลที่กรอกแล้ว</span>
              </NuxtLink>
            </li>
            <li class="pc-item pc-hasmenu">
              <NuxtLink to="" class="pc-link flex items-center gap-2 text-gray-800 hover:text-blue-500">
                <i class="ph-duotone ph-layout text-lg"></i>
                <span>ตารางข้อมูลอีเมล์</span>
              </NuxtLink>
            </li>
            <li v-if="fullName !== 'staff'" class="pc-item pc-hasmenu">
              <NuxtLink to="" class="pc-link flex items-center gap-2 text-gray-800 hover:text-blue-500">
                <i class="ph-duotone ph-user-list text-lg"></i>
                <span>ตารางข้อมูลผู้ใช้</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
  
        <!-- User Card -->
        <div class="card pc-user-card bg-white shadow rounded-lg mt-6 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img src="assets\images\user\avatar-1.jpg" alt="user" class="w-12 h-12 rounded-full" />
            </div>
            <div class="flex-grow pl-4">
              <h6 class="text-sm font-semibold">{{ username }}</h6>
              <small class="text-gray-500">{{ fullName }}</small>
            </div>
            <div class="relative">
                <!-- Dropdown Button -->
                <button
                    class="btn btn-icon bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                    @click="toggleDropdown"
                >
                    <i class="ph-duotone ph-windows-logo text-3xl"></i>
                </button>

                <!-- Dropdown Content -->
                <ul
                    v-if="dropdownVisible"
                    class="absolute right-0 bottom-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 grid grid-cols-2 gap-2 p-2 z-50"
                >
                    <li>
                    <a
                        href="#"
                        class="flex flex-col items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
                    >
                        <i class="ph-duotone ph-user text-blue-500 text-xl"></i>
                        <span class="text-sm mt-1">โปรไฟล์</span>
                    </a>
                    </li>
                    <li>
                    <a
                        href="#"
                        class="flex flex-col items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
                    >
                        <i class="ph-duotone ph-gear text-green-500 text-xl"></i>
                        <span class="text-sm mt-1">ตั้งค่า</span>
                    </a>
                    </li>
                    <li>
                    <a
                        href="#"
                        class="flex flex-col items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
                    >
                        <i class="ph-duotone ph-lock-key text-yellow-500 text-xl"></i>
                        <span class="text-sm mt-1">ล็อคหน้าจอ</span>
                    </a>
                    </li>
                    <li>
                    <button
                        @click="logout"
                        class="flex flex-col items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
                    >
                        <i class="ph-duotone ph-power text-red-500 text-xl"></i>
                        <span class="text-sm mt-1">ออกจากระบบ</span>
                    </button>
                    </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const dropdownVisible = ref(false);
  
  function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
  }


  const fullName = ref("Jonh Smith"); // ค่าเริ่มต้นสำหรับชื่อเต็ม
const username = ref("Administrator"); // ค่าเริ่มต้นสำหรับชื่อผู้ใช้

onMounted(() => {
  const storedFullName = localStorage.getItem("full_name");
  const storedUsername = localStorage.getItem("username");
  
  if (storedFullName) {
    fullName.value = storedFullName; // อัปเดตค่า fullName
  }

  if (storedUsername) {
    username.value = storedUsername; // อัปเดตค่า username
  }
});
  
  function logout() {
    // Add logout functionality here
  }
  </script>
  
  <style scoped>
  .pc-sidebar {
    width: 250px;
  }
  </style>
  