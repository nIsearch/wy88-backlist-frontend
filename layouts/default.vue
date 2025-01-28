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
            src="assets\images\Logo 1.png"
            alt="logo"
            class="w-20 h-auto mb-4 rounded-md"
          />
          <p class="text-xl text-white font-semibold whitespace-nowrap">
            Manage Blacklist
          </p>
        </NuxtLink>
      </div>

      <!-- Navigation Menu -->
      <!-- Navigation Menu 2 (สำหรับ administrator) -->
      <div v-if="userRole === 'administrator'" class="nav-master2">
        <label
          class="pc-item pc-caption text-white font-semibold pl-5 text-center"
        >
          <span>Navigation</span>
        </label>
        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2 bg-black">
          <!-- Dashboard Link -->
          <NuxtLink
            to="/"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/')
                ? 'bg-[url(/images/home.png)]'
                : 'bg-[url(/images/homeh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Dashboard</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Navigation Menu 1 (สำหรับ staff) -->
      <div v-if="userRole === 'staff'" class="nav-master1">
        <div class="flex justify-center items-center">
          <label class="text-white font-semibold">
            <span class="text-center">Navigation</span>
          </label>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2 bg-black">
          <!-- Dashboard Link -->
          <NuxtLink
            to="/"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/')
                ? 'bg-[url(/images/home.png)]'
                : 'bg-[url(/images/homeh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/add-user-backlist/add_user_backlist"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/add-user-backlist/add_user_backlist')
                ? 'bg-[url(/images/adduser.png)]'
                : 'bg-[url(/images/adduserh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Add User</span>
          </NuxtLink>

          <NuxtLink
            to="/tabel-project/tabel-project-name"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/tabel-project/tabel-project-name')
                ? 'bg-[url(/images/Project.png)]'
                : 'bg-[url(/images/Projectsh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Manage Projects</span>
          </NuxtLink>

          <NuxtLink
            to="/tabel-banned-users/tabel_blacklist_users"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/tabel-banned-users/tabel_blacklist_users')
                ? 'bg-[url(/images/User.png)]'
                : 'bg-[url(/images/Userh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Manage User</span>
          </NuxtLink>

          <NuxtLink
            to="/tabel-admin/tabel_admin"
            class="px-4 py-8 text-[#fff] rounded flex items-center bg-center bg-no-repeat justify-center space-x-4 transition duration-200"
            :class="[
              isActive('/tabel-admin/tabel_admin')
                ? 'bg-[url(/images/Admin.png)]'
                : 'bg-[url(/images/Adminh.png)]',
            ]"
            @click="sidebarOpen = false"
          >
            <span class="text-center w-full pl-14">Manage Admin</span>
          </NuxtLink>

        </nav>
      </div>

      <!-- Logout/Settings -->
      <div class="bg-[url(/images/Name.png)] bg-center bg-no-repeat pt-[45px] p-2 mt-auto rounded">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              src="assets\images\Frame 1.png"
              alt="user"
              class="w-auto h-17 pl-1 pb-1"
            />
          </div>
          <div class="flex-grow pl-4">
            <h6 class="text-lg m-0 text-white font-semibold">{{ username }}</h6>
            <small class="text-lg m-0 text-white">{{ fullName }}</small>
          </div>
          <div class="relative"></div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 p-0 overflow-y-auto transition-all duration-200"
      :class="{ 'lg:ml-100': !screenIsSmall || sidebarOpen }"
    >
      <header
        class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] shadow-md bg-cover bg-center"
        style="
          background-image: url('/images/Nav1.png');
          background-size: auto;
          background-position: center;
        "
      >
        <div class="flex justify-between items-center px-4 py-3">
          <!-- Mobile Media Block Start -->
          <div class="flex space-x-4">
            <!-- Sidebar Toggle Icon -->
            <img
            src="assets\images\Logo 1.png"
            alt="logo"
            class="w-20 h-auto sm:hidden"
          />
          </div>
          <!-- Mobile Media Block End -->

          <!-- Right Side Options -->
          <div class="flex items-center space-x-4 py-1">
            <!-- User Profile Dropdown -->
            <div class="relative">
              <button
                @click.stop="toggleProfile"
                class="flex items-center space-x-2 text-white hover:text-white"
              >
                <img
                  src="assets\images\Frame 1.png"
                  alt="Avatar"
                  class="w-12 h-12 rounded-full"
                />
              </button>
              <div
                v-if="isProfileOpen"
                class="absolute right-0 bg-gray-400 shadow-lg rounded-md mt-2 p-4 w-60 z-50"
              >
                <h5 class="font-semibold text-gray-800 mb-2 border-b">
                  Profile
                </h5>
                <ul>
                  <li class="flex items-center space-x-2 mb-2 border-b">
                    <img
                      src="assets\images\Frame 1.png"
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
                      <span>Logout</span>
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

      <div
        class="overflow-x-hidden bg-[url(/images/bgn.png)] bg-cover bg-center bg-no-repeat bg-transparent min-h-screen"
      >
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
const isActive = (route) => {
  return route === useRoute().path; // ตรวจสอบว่าเส้นทางปัจจุบันตรงกับ route
};

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

svg.h-6.w-6 {
    color: red;
}

/* Smooth transition for Sidebar */
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}
.sidebar-open {
  transform: translateX(0);
}

.nuxt-link-hover:hover {
  background-image: url("/images/Home2.png");
  background-size: auto;
  background-position: center;
  color: white;
}
</style>
