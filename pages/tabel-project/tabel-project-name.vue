<template>
  <div class="flex space-x-1 text-white">
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector1.png)] bg-cover bg-no-repeat pl-2 pr-[40px]"
    >
      TableProjact
    </p>
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector2.png)] bg-contain bg-no-repeat pl-5 pr-[25px]"
    >
      <span class="text-[#990002]">Home </span> > Project
    </p>
  </div>
  <div class="container mx-auto p-4">
    <div class="content">
      <div class="py-4 px-4 rounded-lg text-white">
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
              class="bg-gradient-to-b from-[#2b2b2b] to-[#0e0e0e] text-white text-lg rounded-full"
            >
              <tr>
                <!--<th class="px-4 py-4 text-center border">id</th>-->
                <th class="px-4 py-3 text-center">Project Name</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td
                  colspan="5"
                  class="px-4 py-2 text-center bg-blue-100 border border-[#8A8A8A]"
                >
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
                <!-- <td class="px-4 py-4 text-center border">
                    {{ user.id }}
                  </td>-->

                <td class="px-4 py-2 text-center border">
                  {{ user.name }}
                </td>
                <td class="border px-6 py-2 text-center">
                  <div class="flex justify-center items-center">
                    <button
                      @click="openEditPopup(user)"
                      class="py-2 px-10 lg:px-4 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded hover:bg-yellow-700 flex items-center"
                    >
                      <img
                        src="assets\images\edit 1.png"
                        alt="Avatar"
                        class="w-6 h-5 mr-1"
                      />
                      <span class="">Edit</span>
                    </button>
                    <EditProjectName
                      v-if="isPopupVisible"
                      :project="projectToEdit"
                      @close="isPopupVisible = false"
                    />
                    <button
                      @click="openDeletePopup(user)"
                      class="py-2 px-10 lg:px-4 bg-[#BA0101] text-white rounded hover:bg-red-700 ml-2 flex items-center"
                    >
                      <img
                        src="assets\images\bin 3.png"
                        alt="Avatar"
                        class="w-6 h-5 mr-2"
                      />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button
            @click="openAddPopup"
            class="px-12 py-1 bg-[url(/images/BGBT.png)] bg-cover bg-no-repeat text-lg text-white hover:bg-[#166820] flex items-center justify-center gap-2"
          >
            <img
              src="assets\images\image-gallery 1.png"
              alt="Avatar"
              class="w-8 h-8 rounded"
            />
            <span>Add Project</span>
          </button>
          <AddProjectName
            v-if="isAddPopupVisible"
            :isVisible="isAddPopupVisible"
            @close="closeAddPopup"
            @project-added="fetchUsers"
          />
        </div>
      </div>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <!-- Popup ยืนยันการลบ -->
      <div
        v-if="showDeletePopup"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        @click.self="cancelDelete"
      >
        <!-- Popup ยืนยันการลบ -->
        <div
          v-if="deleteState === 'confirm'"
          class="text-center px-[56px] py-[71px] bg-[url(/images/bgpop.png)] bg-cover bg-no-repeat"
          style="width: auto; height: auto"
        >
          <h2 class="text-4xl font-bold mb-2 text-white">Confirm delete</h2>
          <p class="mb-6 text-white">
            delete the project
            <span class="font-semibold text-red-600">{{
              projectToDelete.name
            }}</span
            >?
          </p>
          <div class="flex justify-center items-center mb-4">
            <img src="assets\images\bin 1.png" alt="" class="w-20 h-20 mb-4" />
          </div>
          <div class="flex justify-center gap-2">
            <button
              class="py-2 px-[61px] bg-[url(/images/C.png)] bg-cover bg-no-repeat text-white  hover:bg-red-900"
              @click="cancelDelete"
            >
              Cancel
            </button>
            <button
              class="py-2 px-[56px] bg-[url(/images/d.png)] bg-cover bg-no-repeat text-white  hover:bg-red-900"
              @click="confirmDelete"
            >
              Confirm
            </button>
          </div>
        </div>

        <!-- Popup แสดงข้อความสำเร็จ -->
        <div
          v-if="deleteState === 'success'"
          class="text-center px-[87px] py-[40px] p-6 bg-[url(/images/bgpop.png)] bg-cover bg-no-repeat"
          style="width: auto; height: auto"
        >
          <h2 class="text-4xl font-bold text-white mb-4">Delete Success</h2>
          <p class="mb-6 text-white">
            Delete Project
            <span class="text-red-600">{{ deleteSuccessMessage }}</span>
            Success
          </p>
          <div class="flex justify-center items-center mb-4">
            <img
              src="assets\images\bin 1.png"
              alt=""
              class="w-20 h-20 mb-4"
            />
          </div>
          <button
            class="py-2 px-[71px] bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white  hover:bg-red-900"
            @click="cancelDelete"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-gradient-to-r from-black via-[#3a3a3a] to-black shadow-xl backdrop-blur-md w-full px-4 py-3"
  >
    <div class="flex justify-center items-center gap-1 flex-wrap">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="py-1 px-3 rounded border-white hover:bg-[#616161] text-xs sm:text-sm"
        :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
      >
        <i class="fas fa-caret-left text-3xl p-0 text-[#CA000A]"></i>
      </button>
      <button
        v-for="(page, index) in paginationRange"
        :key="index"
        @click="goToPage(page)"
        class="py-2 pb-3 md:pb-2 lg:pb-2 px-4 rounded bg-[url(/images/G10.png)] bg-cover lg:bg-cover bg-no-repeat text-xs sm:text-sm"
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
        class="py-1 px-3 rounded text-white hover:bg-[#616161] text-xs sm:text-sm"
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
import EditProjectName from "@/components/EditProjectName.vue";
import AddProjectName from "@/components/AddProjectName.vue";

useHead({
  title: "Manage Projects",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "keywords", content: "" },
    { name: "description", content: "Manage Projects" },
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
      user.name.toLowerCase().includes(search.value.toLowerCase())
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

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/black-list-user/back-end/project-list",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    users.value = response.data.result_data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

// ฟังชั่นแก้ไข

const isPopupVisible = ref(false); // สถานะแสดง Popup
const projectToEdit = ref(null); // เก็บข้อมูลโปรเจคที่ต้องการแก้ไข

const openEditPopup = (project) => {
  projectToEdit.value = project; // เก็บข้อมูลโปรเจคที่เลือก
  isPopupVisible.value = true; // เปิด Popup
};

// ลบ

const showDeletePopup = ref(false); // สถานะแสดง Popup
const deleteState = ref("confirm"); // สถานะ Popup ('confirm' หรือ 'success')
const projectToDelete = ref(null); // เก็บข้อมูลโปรเจคที่ต้องการลบ
const deleteSuccessMessage = ref(""); // ข้อความสำเร็จ

// เปิด Popup การลบ
const openDeletePopup = (project) => {
  projectToDelete.value = project;
  showDeletePopup.value = true;
  deleteState.value = "confirm"; // เริ่มต้นที่สถานะยืนยัน
};

// ยืนยันการลบ
const confirmDelete = async () => {
  try {
    const verifyAdmin = localStorage
      .getItem("full_name")
      ?.replace(/^"|"$/g, ""); // ลบเครื่องหมายคำพูด
    const accessToken = localStorage.getItem("access_token");

    if (!verifyAdmin || !accessToken) {
      alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลการตรวจสอบในระบบ");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/black-list-user/back-end/delete-project-list?id=${projectToDelete.value.id}`,
      {
        method: "DELETE",
        headers: {
          verify_admin: verifyAdmin,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      deleteSuccessMessage.value = projectToDelete.value.name; // บันทึกชื่อโปรเจคที่ลบสำเร็จ
      deleteState.value = "success"; // เปลี่ยนสถานะ Popup เป็นสำเร็จ
      // อัปเดตตาราง
      users.value = users.value.filter(
        (user) => user.id !== projectToDelete.value.id
      );
    } else {
      const errorResult = await response.json();
      alert(`เกิดข้อผิดพลาด: ${JSON.stringify(errorResult)}`);
      showDeletePopup.value = false;
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
    showDeletePopup.value = false;
  }
};

// ปิด Popup
const cancelDelete = () => {
  showDeletePopup.value = false;
  projectToDelete.value = null;
};

// popup add projact

// ตัวแปรสถานะ Popup
const isAddPopupVisible = ref(false);

const openAddPopup = () => {
  isAddPopupVisible.value = true;
};

const closeAddPopup = () => {
  isAddPopupVisible.value = false;
};

const handleProjectAdded = (projectName) => {
  console.log("โปรเจคที่เพิ่ม:", projectName);
  closeAddPopup();
};
</script>
<style scoped>
input::placeholder {
  color: white;
}
</style>
