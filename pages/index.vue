<template>
  <div class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] ">
    <!-- Popup Error -->
    <div
      v-if="showError"
      class="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 text-xl rounded shadow-lg flex items-center space-x-2"
    >
      <i class="ph-duotone ph-x-circle text-4xl"></i>
      <span>{{ errorMessage }}</span>
    </div>

    <div class="bg-[#2b2b2b] shadow py-4">
      <!-- Header -->
      <div class="">
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold text-white">ค้นหาผู้ใช้ที่ถูกแบน</h1>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <nav class="pl-8">
        <div class=" mx-auto">
          <ol class="flex space-x-2 text-sm text-white">
            <li class="text-[#ED9200] text-lg">หน้าแรก</li>
            <li class="text-lg">&gt;</li>
            <li class="text-lg">ค้นหาผู้ใช้ที่ถูกแบน</li>
          </ol>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <!-- Search Bar -->
      <div class="flex items-center space-x-2 mb-6">
        <div class="flex-grow">
          <div class="relative">
            <input
              type="text"
              placeholder="ค้นหา"
              class="w-full px-4 py-2 bg-[#8A8a8A] border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchTerm"
            />
            <span class="absolute right-2 top-2 text-white">
              <img
                src="assets\images\icon _input search.png"
                alt="Home Icon"
                class="w-6 h-6 mr-2"
              />
            </span>
          </div>
        </div>
      </div>

      <!-- Contacts List -->
      <div
        v-if="paginatedContacts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8"
      >
        <div
          v-for="contact in paginatedContacts"
          :key="contact.id"
          class="bg-white shadow-md rounded-lg overflow-hidden "
        >
          <div
            :class="{
              'border-2 border-red-600 bg-black text-white rounded-md':
                contact.status_name === 'ติดแบน',
              'border-2 border-[#009C12] bg-black text-white rounded-md':
                contact.status_name === 'ปลดแบน',
            }"
          >
            <h3
              :class="{
                'bg-red-600 text-center text-xl text-white font-semibold py-2 rounded-t-md':
                  contact.status_name === 'ติดแบน',
                'bg-[#009C12] text-center text-xl text-white font-semibold py-2 rounded-t-md':
                  contact.status_name === 'ปลดแบน',
              }"
            >
              ชื่อผู้ใช้ : {{ contact.username }}
            </h3>
            <p class="text-l text-gray-300 mt-6 px-8">
              รายละเอียด : {{ contact.detail }}
            </p>
            <p class="text-l text-gray-300 px-8">
              ข้อมูลเมื่อ : {{ contact.date }}
            </p>
            <p class="text-l text-gray-300 px-8 pb-6">
              สถานะปัจจุบัน :
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
    </main>
    <!-- Pagination -->
    <div class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] px-4 py-2 ">
      <!-- Pagination -->
      <div class="flex justify-center items-center gap-1 flex-wrap ">
        <!-- ปุ่มหน้าแรก -->
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="py-1 px-3 rounded border text-white border-white bg-[#8A8A8A] hover:bg-[#616161] text-xs sm:text-sm"
          :class="{ 'cursor-not-allowed  opacity-50': currentPage === 1 }"
        >
          &lt;&lt;
        </button>

        <!-- Pagination -->
        <button
          v-for="(page, index) in visiblePages"
          :key="index"
          @click="goToPage(page)"
          class="py-1 px-3 rounded border border-white bg-white hover:bg-[#616161] text-xs sm:text-sm"
          :class="{
            'bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white':
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
          class="py-1 px-3 rounded border text-white border-white bg-[#8A8A8A] hover:bg-[#616161] text-xs sm:text-sm"
          :class="{
            'cursor-not-allowed opacity-50': currentPage === totalPages,
          }"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
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
      title: "ค้นหาผู้ใช้ที่โดนแบล็คลีส",
      meta: [
        { name: "robots", content: "noindex, nofollow" },
        { name: "keywords", content: "" },
        { name: "description", content: "ค้นหาผู้ใช้ที่โดนแบล็คลีส" },
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
