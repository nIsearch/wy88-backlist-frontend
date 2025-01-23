<template>
  <div class="flex overflow-hidden h-screen">
    <div
      v-if="sidebarOpen && screenIsSmall"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <div
      class="lg:relative fixed top-0 left-0 h-full w-64 bg-black text-white shadow-md z-50 flex flex-col transform transition-transform duration-200"
      :class="{
        '-translate-x-full': !sidebarOpen && screenIsSmall,
        'translate-x-0': sidebarOpen || !screenIsSmall,
      }"
    >
      <!-- Header Logo -->
      <div class="m-header flex justify-center items-center h-20">
        <NuxtLink to="/" class="b-brand flex justify-center items-center gap-2">
          <img
            src="assets\images\Blacklist_Logo.png"
            alt="logo"
            class="w-14 h-auto mb-4 rounded-md"
          />
          <p class="text-xl text-white font-semibold whitespace-nowrap">
            จัดการผู้ใช้แบล็คลีส
          </p>
        </NuxtLink>
      </div>

      <!-- Navigation Menu -->
      <!-- Navigation Menu 2 (สำหรับ administrator) -->
      <div v-if="userRole === 'administrator'" class="nav-master2">
        <label class="pc-item pc-caption text-white font-semibold pl-5">
          <span>เมนูการนำทาง</span>
        </label>
        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2 bg-black">
          <!-- Dashboard Link -->
          <NuxtLink
            to="/"
            class=" px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{ 'bg-[#2a2a2a] text-[#fff]': isActive('/') }"
            @click="sidebarOpen = false"
          >
            <img
              src="/assets\images\journal page.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>หน้าแรก</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Navigation Menu 1 (สำหรับ staff) -->
      <div v-if="userRole === 'staff'" class="nav-master1">
        <label class="pc-item pc-caption text-white font-semibold pl-5">
          <span>เมนูการนำทาง</span>
        </label>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2 bg-black">
          <!-- Dashboard Link -->
          <NuxtLink
            to="/"
            class=" px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{ 'bg-[#2a2a2a] text-[#fff]': isActive('/') }"
            @click="sidebarOpen = false"
          >
            <img
              src="/assets\images\journal page.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>หน้าแรก</span>
          </NuxtLink>

          <NuxtLink
            to="/add-user-backlist/add_user_backlist"
            class=" px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{
              'bg-[#2a2a2a] text-[#fff]': isActive(
                '/add-user-backlist/add_user_backlist'
              ),
            }"
            @click="sidebarOpen = false"
          >
            <img
              src="assets\images\profile circled.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>เพิ่มข้อมูลผู้ใช้</span>
          </NuxtLink>
          <NuxtLink
            to="/tabel-project/tabel-project-name"
            class=" px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{
              'bg-[#2a2a2a] text-[#fff]': isActive(
                '/tabel-project/tabel-project-name'
              ),
            }"
            @click="sidebarOpen = false"
          >
            <img
              src="assets\images\table 2 columns1.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>ตารางจัดการโปรเจค</span>
          </NuxtLink>
          <NuxtLink
            to="/table-banned-users/table_blacklist_users"
            class=" px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{
              'bg-[#2a2a2a] text-[#fff]': isActive(
                '/table-banned-users/table_blacklist_users'
              ),
            }"
            @click="sidebarOpen = false"
          >
            <img
              src="assets\images\icon _table12.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>ตารางข้อมูลผู้ใช้</span>
          </NuxtLink>
          <NuxtLink
            to="/table-admin/tabel_admin"
            class="px-4 py-4 text-[#fff] rounded flex items-center space-x-4 hover:bg-[#383838] hover:text-white transition duration-200"
            :class="{
              'bg-[#2a2a2a] text-[#fff]': isActive('/table-admin/tabel_admin'),
            }"
            @click="sidebarOpen = false"
          >
            <img
              src="assets\images\icon _table rows.png"
              alt="Home Icon"
              class="w-6 h-6"
            />
            <span>ตารางแอดมิน</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Logout/Settings -->
      <div class="bg-[#4e4e4e] p-2 mt-auto rounded">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              src="assets\images\Group 3.png"
              alt="user"
              class="w-12 h-12 rounded-full"
            />
          </div>
          <div class="flex-grow pl-4">
            <h6 class="text-lg m-0 text-white font-semibold">{{ username }}</h6>
            <small class="text-lg m-0 text-white">{{ fullName }}</small>
          </div>
          <div class="relative">
            <!-- Dropdown Button 
            <button
              class="btn btn-icon bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
              @click="toggleDropdown"
            >
              <i class="ph-duotone ph-windows-logo text-3xl"></i>
            </button>-->

            <!-- Dropdown Content 
            <ul
              v-if="dropdownVisible"
              class="absolute right-0 bottom-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-max grid grid-cols-2 gap-2 p-2 z-50"
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
            </ul>-->
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 p-0 overflow-y-auto transition-all duration-200"
      :class="{ 'lg:ml-100': !screenIsSmall || sidebarOpen }"
    >
      <header class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] shadow-md">
        <div class="flex justify-between items-center px-4 py-3">
          <!-- Mobile Media Block Start -->
          <div class="flex space-x-4">
            <!-- Sidebar Toggle Icon -->

            <!-- Search Dropdown for Mobile 
            <div class="relative md:hidden">
              
              <button
                class="text-gray-600 hover:text-gray-800"
                @click.stop="toggleSearch"
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
            </div>-->

            <!-- Search for Desktop -->
            <!-- Search for Desktop 
            <form class="hidden md:flex items-center space-x-2 relative">
              <div class="relative w-96">
                <i
                  class="ph-duotone ph-magnifying-glass text-gray-600 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"
                ></i>
                <input
                  type="text"
                  class="border border-gray-300 rounded-lg px-10 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหา..."
                />
              </div>
              <button
                type="button"
                class="bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600"
              >
                <kbd>Ctrl+K</kbd>
              </button>
            </form>-->
          </div>
          <!-- Mobile Media Block End -->

          <!-- Right Side Options -->
          <div class="flex items-center space-x-4 py-3">
            <!-- Notification Dropdown 
            <div class="relative">
              <button
                @click.stop="toggleNotifications"
                class="relative text-gray-600 hover:text-gray-800"
              >
                <i class="ph-duotone ph-bell-simple-ringing text-5xl"></i>
                <span
                  class="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  1
                </span>
              </button>
              <div
                v-if="isNotificationsOpen"
                class="absolute right-0 pl-5 bg-white shadow-lg rounded-md mt-2 p-2 w-80 z-50"
              >
                <h5 class="font-semibold text-gray-800 mb-4 pl-10">
                  การแจ้งเตือน
                </h5>
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
            </div>-->

            <!-- User Profile Dropdown -->
            <div class="relative">
              <button
                @click.stop="toggleProfile"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <img
                  src="assets\images\Group 3.png"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full"
                />
              </button>
              <div
                v-if="isProfileOpen"
                class="absolute right-0 bg-white shadow-lg rounded-md mt-2 p-4 w-60 z-50"
              >
                <h5 class="font-semibold text-gray-800 mb-2 border-b">โปรไฟล์</h5>
                <ul>
                  <li class="flex items-center space-x-2 mb-2 border-b">
                    <img
                      src="assets\images\Group 3.png"
                      alt="Avatar"
                      class="w-10 h-10 rounded-full mb-4"
                    />
                    <div>
                      <h6 class="text-sm font-semibold text-gray-800">
                        {{ username }}
                      </h6>
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

            <button
              v-if="screenIsSmall"
              @click="sidebarOpen = !sidebarOpen"
              class="text-gray-600 focus:outline-none"
              :aria-expanded="sidebarOpen ? 'true' : 'false'"
              aria-label="Toggle Sidebar"
            >
              <!-- Icon for menu button -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Content Slot -->

      <div class="overflow-x-hidden bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] min-h-screen">
        <NuxtPage />
      </div>
      <!--<Footer />-->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const userRole = ref(""); // เก็บสถานะผู้ใช้

onMounted(() => {
  // ดึงค่าจาก localStorage
  let storedFullName = localStorage.getItem("full_name");

  // ลบเครื่องหมาย " ที่เกินออกไป หากมี
  try {
    storedFullName = JSON.parse(storedFullName);
  } catch (error) {
    // หาก JSON.parse ไม่สำเร็จ ให้ใช้ค่าดั้งเดิม
    storedFullName = storedFullName.replace(/^"|"$/g, "");
  }

  // ตรวจสอบค่า full_name และกำหนดค่า role
  if (storedFullName === "administrator") {
    userRole.value = "staff"; // สลับค่า
  } else if (storedFullName === "staff") {
    userRole.value = "administrator"; // สลับค่า
  } else {
    userRole.value = "unknown"; // ค่า default
  }

  console.log("Full Name:", storedFullName); // Debugging
  console.log("User Role:", userRole.value); // Debugging
});

const route = useRoute();
const sidebarOpen = ref(false); // Track sidebar visibility on mobile and iPad
const screenIsSmall = ref(false); // Track screen size
const dropdownVisible = ref(false); // Track dropdown visibility

const isSearchOpen = ref(false);
const isNotificationsOpen = ref(false);
const isProfileOpen = ref(false);

const fullName = ref("John Smith"); // Default full name
const username = ref("Administrator"); // Default username

// Function to check if the current route matches the menu link
const isActive = (path) => route.path === path;

// Detect screen size and update `screenIsSmall` accordingly
const handleResize = () => {
  screenIsSmall.value = window.innerWidth < 1024;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector(".relative"); // Dropdown container class
  if (dropdown && !dropdown.contains(event.target)) {
    closeAllDropdowns();
  }
};

// Close all dropdowns
const closeAllDropdowns = () => {
  dropdownVisible.value = false;
  isSearchOpen.value = false;
  isNotificationsOpen.value = false;
  isProfileOpen.value = false;
};

// Toggle dropdown visibility
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};
const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value;
};

// Logout function placeholder
function logout() {
  // Clear all data from localStorage
  localStorage.clear();

  // Optional: Redirect user to login page or another page
  window.location.href = "/login-page/login";

  console.log("All localStorage data has been cleared.");
}

// Load user data from localStorage
onMounted(() => {
  const storedFullName = localStorage.getItem("full_name");
  const storedUsername = localStorage.getItem("username");

  if (storedFullName) {
    fullName.value = storedFullName;
  }
  if (storedUsername) {
    username.value = storedUsername;
  }
});

// Setup event listeners for resize and outside click
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener("click", handleClickOutside);
});

// Cleanup event listeners
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Prevent horizontal scrolling */
body {
  overflow-x: hidden;
}

/* Smooth transition for Sidebar */
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}
.sidebar-open {
  transform: translateX(0);
}
</style>
