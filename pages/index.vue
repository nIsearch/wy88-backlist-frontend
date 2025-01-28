<template>
  <div class="flex space-x-1 text-white">
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector1.png)] bg-cover bg-no-repeat pl-2 pr-[40px]"
    >
      SearchUser
    </p>

    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector2.png)] bg-contain bg-no-repeat pl-5 pr-[25px]"
    >
      <span class="text-[#990002]">Home </span> > Search
    </p>
  </div>

  <div class="">
    <!-- Popup Error -->
    <div
      v-if="showError"
      class="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 text-xl rounded shadow-lg flex items-center space-x-2"
    >
      <i class="ph-duotone ph-x-circle text-4xl"></i>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <!-- Search Bar -->
      <div
        class="flex items-center space-x-2 mb-6 bg-[url(/images/Hud.png)] bg-cover lg:bg-contain bg-no-repeat pt-7 lg:pt-7 py-5"
      >
        <div class="flex-grow">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full px-6 bg-transparent text-white"
              v-model="searchTerm"
            />
          </div>
        </div>
      </div>

      <!-- Contacts List -->
      <div
        v-if="paginatedContacts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-black bg-opacity-40 z-50"
      >
        <div
          v-for="contact in paginatedContacts"
          :key="contact.id"
          class="bg-transparent overflow-hidden"
        >
          <div
            :class="{
              'bg-[url(/images/cd.png)] bg-contain bg-center bg-no-repeat bg-transparent text-white rounded-md':
                contact.status_name === 'ติดแบน',
              'bg-[url(/images/cd1.png)] bg-contain bg-center bg-no-repeat bg-transparent text-white rounded-md':
                contact.status_name === 'ปลดแบน',
            }"
          >
            <h3
              :class="{
                ' text-center text-xl text-white font-semibold py-2 rounded-t-md pt-3 md:pt-11 lg:pt-1 ':
                  contact.status_name === 'ติดแบน',
                'text-center text-xl text-white font-semibold py-2 rounded-t-md pt-3 md:pt-11 lg:pt-1':
                  contact.status_name === 'ปลดแบน',
              }"
            >
              User : {{ contact.username }}
            </h3>
            <p class="text-l text-gray-300 mt-4 pl-8 lg:pl-16">
              Detail: {{ contact.detail }}
            </p>
            <p class="text-l text-gray-300 pl-8 lg:pl-16">
              Date : {{ contact.date }}
            </p>
            <p class="text-l text-gray-300 pl-8 lg:pl-16 pb-20">
              Status :
              <span
                :class="{
                  'bg-red-600 text-white px-2 py-1 rounded-full':
                    contact.status_name === 'ติดแบน',
                  'bg-[#009C12] text-white px-2 py-1 rounded-full':
                    contact.status_name === 'ปลดแบน',
                }"
              >
                {{ contact.status_name }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-600">
        <p>ไม่พบข้อมูลในตาราง</p>
      </div>
      <!-- Pagination -->
      <div
        class="bg-gradient-to-r from-black via-[#3a3a3a] to-black shadow-xl backdrop-blur-md w-full px-4 py-3"
      >
        <!-- Pagination -->
        <div class="flex justify-center items-center gap-1 flex-wrap">
          <!-- ปุ่มหน้าแรก -->
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="py-1 px-3 rounded border-white hover:bg-[#616161] text-xs sm:text-sm"
            :class="{ 'cursor-not-allowed  opacity-50': currentPage === 1 }"
          >
            <i class="fas fa-caret-left text-3xl p-0 text-[#CA000A]"></i>
          </button>

          <!-- Pagination -->
          <button
            v-for="(page, index) in visiblePages"
            :key="index"
            @click="goToPage(page)"
            class="py-2 pb-3 md:pb-2 lg:pb-2 px-4 rounded bg-[url(/images/G10.png)] bg-cover lg:bg-cover bg-no-repeat text-xs sm:text-sm"
            :class="{
              'bg-[url(/images/G10.png)] bg-cover lg:bg-cover bg-no-repeat text-white':
                currentPage === page,
            }"
            v-if="page !== '...'"
          >
            {{ page }}
          </button>
          <span v-else class="py-2 px-3 text-gray-900 text-xs sm:text-sm"
            >...</span
          >

          <!-- ปุ่มหน้าสุดท้าย -->
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="py-1 px-3 rounded text-white hover:bg-[#616161] text-xs sm:text-sm"
            :class="{
              'cursor-not-allowed opacity-50': currentPage === totalPages,
            }"
          >
            <i class="fas fa-caret-right text-3xl p-0 text-[#CA000A]"></i>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

axios.interceptors.response.use(
  (response) => response, // หากไม่มีปัญหา
  (error) => {
    // ตรวจสอบข้อความข้อผิดพลาด
    if (
      error.message.includes("setRequestHeader") ||
      error.response?.status === 401
    ) {
      console.error(
        "Redirecting to login due to invalid token or 401 Unauthorized."
      );
      // ลบ Token และเวลาหมดอายุ
      //localStorage.removeItem('access_token');
      //localStorage.removeItem('token_expiry');
      localStorage.clear();
      // รีไดเรกต์ไปหน้าเข้าสู่ระบบ
      window.location.href = "/login-page/login";
    }
    return Promise.reject(error);
  }
);

export default {
  data() {
    return {
      page: 1, // กำหนดตัวแปร page
    };
  },
  setup() {
    useHead({
      title: "SearchUser",
      meta: [
        { name: "robots", content: "noindex, nofollow" },
        { name: "keywords", content: "" },
        { name: "description", content: "SearchUser" },
      ],
    });
    const searchTerm = ref(""); // เก็บค่าจากช่องค้นหา
    const users = ref([]); // ข้อมูลผู้ใช้ทั้งหมด
    const currentPage = ref(1); // หน้าปัจจุบัน
    const itemsPerPage = ref(12); // จำนวนรายการต่อหน้า
    const showError = ref(false); // สถานะข้อผิดพลาด
    const errorMessage = ref(""); // ข้อความแสดงข้อผิดพลาด

    // ดึงข้อมูลผู้ใช้จาก API
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const projectName =
          localStorage.getItem("project_name")?.replace(/"/g, "") || "all";

        const verifyAdmin = (() => {
          let fullName = localStorage.getItem("full_name") || "unknown";
          if (fullName.startsWith('"') && fullName.endsWith('"')) {
            fullName = fullName.slice(1, -1);
          }
          return fullName;
        })();

        if (!accessToken) {
          errorMessage.value = "Token not found. Please log in.";
          showError.value = true;
          return (window.location.href = "/login-page/login");
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/black-list-user/back-end/user-list",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
              verify_admin: verifyAdmin,
            },
            params: { project_name: projectName },
          }
        );

        users.value = response.data.result_data.data || [];
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message ||
          "ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้ง";
        showError.value = true;
      }
    };

    // กรองข้อมูลตาม searchTerm
    const filteredContacts = computed(() => {
      if (!searchTerm.value) {
        return users.value; // หากไม่มีคำค้นหา แสดงข้อมูลทั้งหมด
      }
      return users.value.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.value.toLowerCase()) // ค้นหาจากชื่อผู้ใช้
      );
    });

    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = computed(() =>
      Math.ceil(filteredContacts.value.length / itemsPerPage.value)
    );

    // จัดการข้อมูลสำหรับหน้าปัจจุบัน
    const paginatedContacts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredContacts.value.slice(start, end); // กรองข้อมูลตามหน้า
    });

    // สร้างหน้า Pagination
    const visiblePages = computed(() => {
      const totalToShow = 5;
      const boundaryPages = 2;
      let pages = [];

      if (totalPages.value <= totalToShow + boundaryPages * 2) {
        pages = Array.from({ length: totalPages.value }, (_, i) => i + 1);
      } else {
        const startRange = Array.from(
          { length: boundaryPages },
          (_, i) => i + 1
        );
        const endRange = Array.from(
          { length: boundaryPages },
          (_, i) => totalPages.value - boundaryPages + i + 1
        );

        const middleRange = [];
        const middleStart = Math.max(
          currentPage.value - Math.floor(totalToShow / 2),
          boundaryPages + 1
        );
        const middleEnd = Math.min(
          currentPage.value + Math.floor(totalToShow / 2),
          totalPages.value - boundaryPages
        );

        for (let i = middleStart; i <= middleEnd; i++) {
          middleRange.push(i);
        }

        pages = [...startRange];
        if (middleRange[0] > boundaryPages + 1) pages.push("...");
        pages = [...pages, ...middleRange];
        if (
          middleRange[middleRange.length - 1] <
          totalPages.value - boundaryPages
        )
          pages.push("...");
        pages = [...pages, ...endRange];
      }

      return pages;
    });

    // เปลี่ยนหน้า
    const goToPage = (page) => {
      if (typeof page === "number" && page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      searchTerm,
      users,
      currentPage,
      itemsPerPage,
      showError,
      errorMessage,
      paginatedContacts,
      totalPages,
      visiblePages,
      goToPage,
    };
  },
};
</script>

<style scoped>
.text-red-800 {
  font-weight: bold;
}
.text-green-800 {
  font-weight: bold;
}
input::placeholder {
  color: white;
}
</style>
