<template>
  <div class="bg-[#2b2b2b] shadow py-4">
    <div class="container">
      <div class="mb-6 rounded-md">
        <h2 class="text-2xl font-bold text-white">
          ตารางข้อมูลผู้ใช้ (พนักงาน)
        </h2>
        <ol class="flex space-x-2 text-sm text-white p-0">
          <li class="text-[#ED9200] text-lg">หน้าแรก</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-4 text-white">
    <div class="content">
      <div class="py-4 px-4 rounded-lg">
        <div class="p-4">
          <h2 class="text-center text-white">ตารางจัดการพนักงาน</h2>
          <div class="flex justify-end mt-4">
            <button
              @click="isPopupVisible = true"
              class="px-4 py-1 bg-[#009C12] text-white rounded-lg shadow hover:bg-[#1c6e26] flex items-center justify-center gap-2"
            >
              <img
                src="assets\images\user 1.png"
                alt="Avatar"
                class="w-8 h-8 rounded"
              />
              <span class="text-xl">เพิ่มพนักงาน</span>
            </button>
            <AddStaffPopup
              :isVisible="isPopupVisible"
              @close="isPopupVisible = false"
              @save="handleSave"
            />
          </div>

          <span class="text-lg">
            จัดการข้อมูล
            <span class="text-lg text-[#ED9200]">พนักงาน</span>
          </span>
        </div>
        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-grow">
            <div class="relative">
              <input
                type="text"
                placeholder="ค้นหาจากชื่อผู้ใช้"
                class="w-full px-4 py-2 bg-[#8A8a8A] border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="search"
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
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse">
            <thead
              class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] text-white text-lg rounded-full"
            >
              <tr>
                <th class="px-4 py-3 text-center rounded">ชื่อผู้ใช้</th>
                <th class="px-4 py-3 text-center">รหัสผ่าน</th>
                <th class="px-4 py-3 text-center">บทบาท</th>
                <th class="px-4 py-3 text-center">ชื่อโปรเจค</th>
                <th class="px-4 py-3 text-center rounded">เพิ่มเติม</th>
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
                      <span>แก้ไข</span>
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
                      ลบ
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
      </div>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] px-4 py-2">
    <div class="flex justify-center items-center  gap-2">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="py-1 px-3 rounded border text-white border-white bg-[#8A8A8A] hover:bg-[#616161] text-xs sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50 ': currentPage === 1,
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import AddStaffPopup from "@/components/AddStaffPopup.vue";
import DeleteConfirmationPopup from "@/components/DeleteConfirmationPopup.vue"; // ตรวจสอบเส้นทางให้ถูกต้อง
import EditStaffPopup from "@/components/EditStaffPopup.vue";

useHead({
    title: "ตารางจัดการแอดมิน",
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "keywords", content: "" },
      { name: "description", content: "ตารางจัดการแอดมิน" },
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

    const response = await axios.get(
      "http://127.0.0.1:8000/black-list-user/back-end/staff-list",
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
      "http://127.0.0.1:8000/black-list-user/back-end/add-backend-user",
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
      `http://127.0.0.1:8000/black-list-user/back-end/delete-staff?id=${selectedUserId.value}`,
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
