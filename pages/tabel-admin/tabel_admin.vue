<template>
  <div class="flex space-x-1 text-white">
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector1.png)] bg-cover bg-no-repeat pl-2 pr-[40px]"
    >
      TabelAddmin
    </p>
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector2.png)] bg-contain bg-no-repeat pl-5 pr-[25px]"
    >
      <span class="text-[#990002]">Home </span> > Admin
    </p>
  </div>
  <div class="container mx-auto p-4 text-white">
    <div class="content">
      <div class="py-4 px-4 rounded-lg">
        <div class="p-4">
          <h1 class="text-center text-white">Tabel Manage Admin</h1>

          <span class="text-lg">
            Tabel Manage
            <span class="text-lg text-[#ED9200]">Admin</span>
          </span>
        </div>
        <div class="flex items-center mb-4">
          <main class="w-full">
            <!-- Search Bar -->
            <div
              class="flex items-center mb-3 bg-[url(/images/Hud.png)] bg-cover lg:bg-contain bg-no-repeat pt-7 lg:pt-7 py-5"
            >
              <div class="flex-grow">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    class="w-full px-6 bg-transparent text-white"
                    v-model="search"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse">
            <thead
              class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] text-white text-lg"
            >
              <tr>
                <th class="px-4 py-3 text-center">UserName</th>
                <th class="px-4 py-3 text-center">Password</th>
                <th class="px-4 py-3 text-center">UserRole</th>
                <th class="px-4 py-3 text-center">ProjectName</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="px-4 py-2 text-center bg-blue-100">
                  Loading...
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td
                  colspan="5"
                  class="px-4 py-2 text-center text-gray-500 bg-yellow-100"
                >
                  ไม่พบข้อมูลในตารางที่ส่งมา
                </td>
              </tr>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td class="px-4 py-2 text-center border">
                  {{ user.username }}
                </td>
                <td class="px-4 py-2 text-center border">{{ user.pwd }}</td>
                <td class="px-4 py-2 text-center border">
                  {{ user.full_name }}
                </td>
                <td class="px-4 py-2 text-center border">
                  {{ user.project_name }}
                </td>
                <td class="border px-6 py-2 text-center">
                  <div class="flex justify-center items-center">
                    <button
                      class="py-2 px-10 lg:px-4 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded hover:bg-yellow-700 flex items-center"
                      @click="openEditPopup(user)"
                    >
                      <img
                        src="assets\images\edit 1.png"
                        alt="Avatar"
                        class="w-6 h-5 mr-1"
                      />
                      <span>Edit</span>
                    </button>
                    <EditStaffPopup
                      v-if="isEditPopupVisible && selectedStaffId"
                      :isVisible="isEditPopupVisible"
                      :staffId="selectedStaffId"
                      :staffData="selectedStaffData"
                      @close="handleCloseEditPopup"
                      @save="handleSaveEdit"
                    />

                    <button
                      class="py-2 px-10 lg:px-4 bg-[#BA0101] text-white rounded hover:bg-red-700 ml-2 flex items-center"
                      @click="openDeletePopup(user.id, user.username)"
                    >
                      <img
                        src="assets\images\bin 3.png"
                        alt="Avatar"
                        class="w-6 h-5 mr-2"
                      />
                      Delete
                    </button>
                    <DeleteConfirmationPopup
                      :isVisible="isDeletePopupVisible"
                      :userId="selectedUserId"
                      :username="selectedUsername"
                      @confirm="handleConfirmDelete"
                      @cancel="handleCancelDelete"
                      @close="handleClosePopup"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button
            @click="isPopupVisible = true"
            class="px-12 py-1 bg-[url(/images/BGBT.png)] bg-cover bg-no-repeat text-lg text-white hover:bg-[#166820] flex items-center justify-center gap-2"
          >
            <img
              src="assets\images\user 1.png"
              alt="Avatar"
              class="w-8 h-8 rounded"
            />
            <span class="text-xl">AddAdmin</span>
          </button>
          <AddStaffPopup
            :isVisible="isPopupVisible"
            @close="isPopupVisible = false"
            @save="handleSave"
          />
        </div>
      </div>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-black via-[#3a3a3a] to-black shadow-xl backdrop-blur-md w-full px-4 py-3">
    <div class="flex justify-center items-center gap-1 flex-wrap">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="py-1 px-3 rounded border-white hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50 ': currentPage === 1,
        }"
      >
      <i class="fas fa-caret-left text-3xl p-0 text-[#CA000A]"></i>
      </button>
      <button
        v-for="(page, index) in paginationRange"
        :key="index"
        @click="goToPage(page)"
        class="py-2 pb-3 md:pb-2 lg:pb-2 px-4 rounded  bg-[url(/images/G10.png)] bg-cover lg:bg-cover bg-no-repeat  text-xs sm:text-sm"
        :class="{
          'bg-[url(/images/G10.png)] bg-cover lg:bg-cover bg-no-repeat text-white':
            currentPage === page,
        }"
      >
        {{ page }}
      </button>
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="py-1 px-3 rounded  text-white  hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50': currentPage === totalPages,
        }"
      >
      <i class="fas fa-caret-right text-3xl p-0 text-[#CA000A]"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import AddStaffPopup from "@/components/AddStaffPopup.vue";
import DeleteConfirmationPopup from "@/components/DeleteConfirmationPopup.vue"; // ตรวจสอบเส้นทางให้ถูกต้อง
import EditStaffPopup from "@/components/EditStaffPopup.vue";

useHead({
  title: "Manage Admin",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "keywords", content: "" },
    { name: "description", content: "Manage Admin" },
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
  const total = totalPages.value; // จำนวนหน้าทั้งหมด
  const current = currentPage.value; // หน้าปัจจุบัน
  const maxButtons = 6; // จำนวนปุ่มที่จะแสดง (รวม currentPage)

  // คำนวณช่วงของหน้า
  let startPage = Math.max(current - Math.floor(maxButtons / 2), 1);
  let endPage = Math.min(startPage + maxButtons - 1, total);

  // ปรับช่วงถ้าถึงขอบ
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  // สร้างช่วงของปุ่ม
  const range = [];
  for (let i = startPage; i <= endPage; i++) {
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

    const response = await axios.get(
      "https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/back-end/staff-list",
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

    users.value = response.data.result_data.data || [];
  } catch (error) {
    if (error.response && error.response.status === 403) {
      errorMessage.value =
        "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้ โปรดตรวจสอบ Token หรือสิทธิ์ของคุณ";
    } else if (error.response && error.response.status === 401) {
      errorMessage.value = "Unauthorized: กรุณาตรวจสอบ Token ของคุณ";
    } else {
      errorMessage.value = "เกิดข้อผิดพลาด โปรดลองอีกครั้ง";
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

const selectedLevel = ref(""); // ตัวแปรเก็บสถานะที่เลือก

// Watcher สำหรับรีเซ็ตหน้าเป็น 1 เมื่อมีการค้นหาหรือเปลี่ยนตัวกรอง
watch([search, selectedLevel], () => {
  currentPage.value = 1;
});

const isPopupVisible = ref(false);

const handleSave = async (newStaff) => {
  try {
    const { username, password: pwd, role: project_name } = newStaff;
    const accessToken = localStorage.getItem("access_token");
    let verifyAdmin = localStorage.getItem("full_name");

    if (
      verifyAdmin &&
      verifyAdmin.startsWith('"') &&
      verifyAdmin.endsWith('"')
    ) {
      verifyAdmin = verifyAdmin.slice(1, -1);
    }

    if (!accessToken || !verifyAdmin) {
      alert("Token หรือข้อมูลผู้ดูแลไม่ถูกต้อง");
      return;
    }

    const response = await fetch(
      "https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/back-end/add-backend-user",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          verify_admin: verifyAdmin,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd, project_name }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("เพิ่มพนักงานสำเร็จ:", result);
      // ไม่มีการปิด Popup ที่นี่ เพราะ Popup จะจัดการเอง
    } else {
      const error = await response.json();
      alert(`เกิดข้อผิดพลาด : ${error.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
  }
};

// ฟังก์ชั่น ลบ ข้อมูล

const isDeletePopupVisible = ref(false);
const selectedUserId = ref(0);
const selectedUsername = ref(""); // ตัวแปรเก็บ username

// เปิด Popup ยืนยันการลบ
const openDeletePopup = (id, username) => {
  selectedUserId.value = id;
  selectedUsername.value = username; // เก็บ username
  isDeletePopupVisible.value = true;
};

// ยกเลิกการลบ
const handleCancelDelete = () => {
  isDeletePopupVisible.value = false;
};

// ปิด Popup
const handleClosePopup = () => {
  isDeletePopupVisible.value = false;
};

// ดำเนินการลบเมื่อยืนยัน
const handleConfirmDelete = async () => {
  const accessToken = localStorage.getItem("access_token");
  let verifyAdmin = localStorage.getItem("full_name");

  if (verifyAdmin && verifyAdmin.startsWith('"') && verifyAdmin.endsWith('"')) {
    verifyAdmin = verifyAdmin.slice(1, -1);
  }

  if (!accessToken || !verifyAdmin) {
    alert("Access Token หรือข้อมูล verify_admin ไม่พบ");
    return;
  }

  try {
    const response = await fetch(
      `https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/back-end/delete-staff?id=${selectedUserId.value}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          verify_admin: verifyAdmin,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      // อัปเดตข้อมูลตาราง (ตัวอย่าง: ลบข้อมูลออกจาก paginatedUsers)
      paginatedUsers.value = paginatedUsers.value.filter(
        (user) => user.id !== selectedUserId.value
      );
    } else {
      const error = await response.json();
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการส่งคำขอลบ");
  }
};

// ฟังก์ชั่น แก้ไข

const isEditPopupVisible = ref(false); // ควบคุมการแสดง Popup
const selectedStaffId = ref(0); // ID ของพนักงานที่เลือก
const selectedStaffData = ref({}); // ข้อมูลพนักงานที่เลือก

// เปิด Popup แก้ไข
const openEditPopup = (user) => {
  selectedStaffId.value = user.id;
  selectedStaffData.value = {
    username: user.username,
    pwd: user.pwd,
    project_name: user.project_name,
  };
  isEditPopupVisible.value = true;
};

// ปิด Popup แก้ไข
const handleCloseEditPopup = () => {
  isEditPopupVisible.value = false;
};

// บันทึกข้อมูลที่แก้ไข
const handleSaveEdit = (updatedStaff) => {
  console.log("บันทึกข้อมูลที่แก้ไข:", updatedStaff);
  // ค้นหาและอัปเดตข้อมูลใน `paginatedUsers`
  const index = paginatedUsers.value.findIndex(
    (user) => user.id === updatedStaff.id
  );
  if (index !== -1) {
    paginatedUsers.value[index] = {
      ...paginatedUsers.value[index],
      ...updatedStaff,
    };
  }
  isEditPopupVisible.value = false; // ปิด Popup
};
</script>
<style scoped>
input::placeholder {
  color: white;
}
</style>
