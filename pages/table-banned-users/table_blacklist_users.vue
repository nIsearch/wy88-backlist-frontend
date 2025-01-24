<template>
  <div class="bg-[#2b2b2b] shadow py-4">
    <div class="container">
      <div class="mb-6 rounded-md">
        <h2 class="text-2xl font-bold text-white">ตารางข้อมูลผู้ใช้</h2>
        <p class="text-[#ED9200] text-lg">หน้าแรก</p>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-4">
    <div class="content">
      <div class="text-white py-4 px-4 rounded-lg">
        <div class="p-4">
          <h3 class="text-center text-white">
            จัดการข้อมูลผู้ใช้ที่โดนแบล็คลีส
          </h3>
          <div class="flex justify-end mt-4">
            <button
              onclick="window.location.href='/add-user-backlist/add_user_backlist'"
              class="px-6 py-1 bg-[#009C12] text-white rounded-lg shadow hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <img
                src="assets\images\user 1.png"
                alt="Avatar"
                class="w-8 h-8 rounded"
              />
              <span class="text-lg">เพิ่มผู้ใช้</span>
            </button>
          </div>
          <span class="text-lg"
            >จัดการข้อมูล
            <code class="text-lg text-[#ED9200]">ผู้ใช้</code>
            ที่โดนแบล็คลีส</span
          >
        </div>
        <div
          class="flex flex-col md:flex-row justify-between items-center mb-5 gap-3 relative"
        >
          <!-- ค้นหาผู้ใช้ -->
          <div class="relative w-full md:flex-1">
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหา"
              class="w-full px-4 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#8A8A8A]"
            />
            <span class="absolute right-2 top-2 text-white mr-2">
              <img
                src="assets\images\icon _input search.png"
                alt="Search Icon"
                class="w-6 h-6"
              />
            </span>
          </div>

          <!-- ตัวกรองระดับผู้ใช้ -->
          <div class="w-full md:w-auto">
            <select
              v-model="selectedLevel"
              class="w-full p-2 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-[#8A8A8A] bg-[#009C12]"
            >
              <option value="">เลือกสถานะ</option>
              <option value="ติดแบน">ติดแบน</option>
              <option value="ปลดแบน">ปลดแบน</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse rounded">
            <thead
              class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] text-white text-lg"
            >
              <tr>
                <!--<th class="px-4 py-4 text-center border">ID</th>-->
                <th class="px-4 py-3 text-center rounded-t">ชื่อผู้ใช้</th>
                <th class="px-4 py-3 text-center">รายละเอียด</th>
                <th class="px-4 py-3 text-center">ชื่อโปรเจค</th>
                <th class="px-4 py-3 text-center">สถานะ</th>
                <th class="px-4 py-3 text-center rounded-t">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="6" class="px-4 py-2 text-center bg-blue-100">
                  Loading...
                </td>
              </tr>
              <tr v-else-if="users && users.length === 0">
                <td
                  colspan="6"
                  class="px-4 py-2 text-center text-gray-500 bg-yellow-100"
                >
                  No data available
                </td>
              </tr>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <!--<td class="px-4 py-4 text-center border">{{ user.id }}</td>-->
                <td class="px-4 py-2 text-center border">
                  {{ user.username }}
                </td>
                <td class="px-4 py-2 text-center border">{{ user.detail }}</td>
                <td class="px-4 py-2 text-center border">
                  {{ user.project_name }}
                </td>
                <td class="px-4 py-2 text-center border font-bold">
                  <span
                    :class="{
                      'text-red-800 font-bold': user.status_name === 'ติดแบน',
                      'text-[#009C12] font-bold ':
                        user.status_name === 'ปลดแบน',
                    }"
                  >
                    {{ user.status_name }}
                  </span>
                </td>
                <td class="border px-6 py-2 text-center">
                  <div class="flex justify-center items-center">
                    <button
                      class="py-2 px-10 lg:px-4 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded hover:bg-yellow-700 flex items-center"
                      @click="openEditPopup(user.id)"
                    >
                      <img
                        src="assets\images\edit 1.png"
                        alt="Avatar"
                        class="w-6 h-5 rounded mr-1"
                      />
                      <span>แก้ไข</span>
                    </button>
                    <PopupEditUserBlacklist
                      v-if="showEditPopup"
                      :userId="selectedUserId"
                      :userData="
                        users.find((user) => user.id === selectedUserId) || {}
                      "
                      @close="closeEditPopup"
                    />

                    <button
                      class="py-2 px-10 lg:px-4 bg-[#BA0101] text-white rounded hover:bg-red-700 ml-2 flex items-center"
                      @click="openDeletePopup(user)"
                    >
                      <img
                        src="assets\images\bin 3.png"
                        alt="Avatar"
                        class="w-6 h-5 rounded mr-2"
                      />
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <div
        v-if="showDeletePopup"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
        @click.self="cancelDelete"
      >
        <div class="text-center w-[360px] mx-auto bg-[#252525] py-10 rounded-[15px]">
          <template v-if="deleteState === 'confirm'">
            <!-- แสดง Popup ยืนยันการลบ -->
            <h2 class="text-white font-bold mb-4">ยืนยันการลบ</h2>
            <p class="mb-6 text-white">
              คุณต้องการลบผู้ใช้
              <span class="font-semibold text-red-600">{{
                userToDelete.username
              }}</span>
              ใช่หรือไม่?
            </p>
            <div class="flex justify-center items-center mb-4">
              <img
                src="assets\images\bin 1.png"
                alt=""
                class="w-20 h-20 mb-4"
              />
            </div>
            <div class="flex justify-center gap-3">
              <button
                class="px-10 py-2 bg-[#8a8a8a] text-white rounded-[10px] hover:bg-gray-600"
                @click="cancelDelete"
              >
                ยกเลิก
              </button>
              <button
                class="px-10 py-2 bg-[#BA0101] text-white rounded-[10px] hover:bg-[#771a1a]"
                @click="confirmDeleteUser"
              >
                ยืนยัน
              </button>
            </div>
          </template>

          <template v-else-if="deleteState === 'success'">
            <!-- แสดงข้อความสำเร็จ -->
            <h2 class="text-white font-bold mb-4">ลบข้อมูลผู้ใช้สำเร็จ</h2>
            <p class="mb-6 text-white">
              ลบผู้ใช้
              <span class="text-red-600">{{ deleteSuccessMessage }}</span
              >สำเร็จ
            </p>
            <div class="flex justify-center items-center mb-4">
              <img
                src="assets\images\Bin_Success_Icon.png"
                alt=""
                class="w-20 h-20 mb-4"
              />
            </div>
            <div class="flex justify-center mb-4">
              <button
                class="px-10 py-2 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded-[8px] hover:bg-blue-700"
                @click="cancelDelete"
              >
                ตกลง
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] py-2">
    <div class="flex justify-center items-center gap-2">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="py-1 px-3 rounded border text-white border-white bg-[#8A8A8A] hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50': currentPage === 1,
        }"
      >
        &lt;&lt;
      </button>
      <button
        v-for="(page, index) in paginationRange"
        :key="index"
        @click="goToPage(page)"
        class="py-1 px-3 rounded border border-white bg-white hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white':
            currentPage === page,
        }"
      >
        {{ page }}
      </button>
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="py-1 px-3 rounded border text-white border-white bg-[#8A8A8A] hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50':
            currentPage === totalPages,
        }"
      >
        &gt;&gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

import PopupEditUserBlacklist from "./components/PopupEditUserBlacklist.vue";

useHead({
    title: "ตารางจัดการผู้ใช้ที่โดนแบล็คลีส",
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "keywords", content: "" },
      { name: "description", content: "จัดการผู้ใช้ที่โดนแบล็คลีส" },
    ],
  });

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
definePageMeta({
  middleware: "auth",
});

const showEditPopup = ref(false);
const selectedUserId = ref(null);

const openEditPopup = (id) => {
  selectedUserId.value = id; // กำหนด ID ที่ต้องการแก้ไข
  showEditPopup.value = true; // เปิด Popup
};

const closeEditPopup = () => {
  showEditPopup.value = false; // ปิด Popup
};

// ตัวแปรสถานะและข้อมูล
const users = ref([]); // ค่าเริ่มต้นเป็นอาร์เรย์ว่าง
const isLoading = ref(true);
const errorMessage = ref("");

// Pagination
const currentPage = ref(1); // หน้าเริ่มต้น
const itemsPerPage = 10; // จำนวนรายการต่อหน้า
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);
const paginationRange = computed(() => {
  const range = [];
  for (let i = 1; i <= totalPages.value; i++) {
    range.push(i);
  }
  return range;
});

// ฟังก์ชันสำหรับเปลี่ยนหน้า
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// ตัวแปรสำหรับ Client-Side
const projectName = ref("all");
const accessToken = ref(null);

if (typeof window !== "undefined") {
  let projectNameValue = localStorage.getItem("project_name") || "all";

  if (projectNameValue.startsWith('"') && projectNameValue.endsWith('"')) {
    projectNameValue = projectNameValue.slice(1, -1); // ตัด " ออก
  }
  projectName.value = projectNameValue;
  accessToken.value = localStorage.getItem("access_token");
}

// ฟังก์ชันดึงข้อมูลจาก API
const fetchUsers = async () => {
  try {
    if (!accessToken.value) {
      errorMessage.value = "Token not found. Please log in.";
      return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    const verifyAdmin = (() => {
      let fullName = localStorage.getItem("full_name") || "unknown";
      if (fullName.startsWith('"') && fullName.endsWith('"')) {
        fullName = fullName.slice(1, -1);
      }
      return fullName;
    })();

    // เรียก API พร้อมส่ง Token
    const response = await axios.get(
      "http://127.0.0.1:8000/black-list-user/back-end/user-list",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken.value}`,
          verify_admin: verifyAdmin,
        },
        params: {
          project_name: projectName.value,
        },
      }
    );

    // อัปเดตข้อมูล
    users.value = response.data.result_data.data || [];
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Unauthorized: กรุณาตรวจสอบ Token ของคุณ";
    } else {
      errorMessage.value = "ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้ง";
    }
  } finally {
    isLoading.value = false;
  }
};

// เรียกใช้ฟังก์ชันเมื่อคอมโพเนนต์ถูกโหลด
onMounted(() => {
  fetchUsers();
});

const search = ref(""); // ตัวแปรสำหรับเก็บคำค้นหา
const selectedLevel = ref(""); // ตัวแปรเก็บสถานะที่เลือก

// ฟังก์ชันกรองข้อมูลผู้ใช้ตามคำค้นหา
const filteredUsers = computed(() => {
  let filtered = users.value;

  // กรองตามคำค้นหา
  if (search.value) {
    filtered = filtered.filter((user) =>
      user.username.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  // กรองตามสถานะ (selectedLevel)
  if (selectedLevel.value) {
    filtered = filtered.filter(
      (user) => user.status_name === selectedLevel.value
    );
  }

  return filtered;
});

// ปรับให้การแบ่งหน้าใช้ `filteredUsers` แทน `users`
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Watcher สำหรับรีเซ็ตหน้าเป็น 1 เมื่อมีการค้นหาหรือเปลี่ยนตัวกรอง
watch([search, selectedLevel], () => {
  currentPage.value = 1;
});

const showDeletePopup = ref(false); // ควบคุมการแสดงผล Popup
const userToDelete = ref(null); // เก็บข้อมูลผู้ใช้ที่ต้องการลบ

// ฟังก์ชันเปิด Popup
const openDeletePopup = (user) => {
  userToDelete.value = user; // กำหนดผู้ใช้ที่ต้องการลบ
  showDeletePopup.value = true; // เปิด Popup
};

// ฟังก์ชันยืนยันการลบ
const deleteState = ref("confirm"); // 'confirm' หรือ 'success'
const deleteSuccessMessage = ref(""); // เก็บข้อความสำเร็จ

const confirmDeleteUser = async () => {
  try {
    isLoading.value = true; // แสดงสถานะ Loading

    const verifyAdmin = (() => {
      let fullName = localStorage.getItem("full_name") || "unknown";
      if (fullName.startsWith('"') && fullName.endsWith('"')) {
        fullName = fullName.slice(1, -1);
      }
      return fullName;
    })();

    // ส่งคำขอ DELETE ไปยัง API
    const response = await axios.delete(
      `http://127.0.0.1:8000/black-list-user/back-end/delete-user-list`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken.value}`,
          verify_admin: verifyAdmin,
        },
        params: {
          id: userToDelete.value.id, // ใช้ ID ของผู้ใช้ที่ต้องการลบ
        },
      }
    );

    // ตรวจสอบการลบ
    if (response.data?.result_data?.massage === "Data deleted successfully") {
      deleteSuccessMessage.value = ` "${userToDelete.value.username}" `; // ตั้งข้อความสำเร็จ
      users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
      deleteState.value = "success"; // เปลี่ยนสถานะ Popup เป็นสำเร็จ
    } else {
      alert("ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่"
    );
  } finally {
    isLoading.value = false; // ปิดสถานะ Loading
  }
};

// ฟังก์ชันยกเลิกการลบ หรือปิด Popup
const cancelDelete = () => {
  deleteState.value = "confirm"; // รีเซ็ตสถานะ Popup
  showDeletePopup.value = false; // ปิด Popup
};
</script>
<style scoped>
input::placeholder {
  color: white;
}
</style>
