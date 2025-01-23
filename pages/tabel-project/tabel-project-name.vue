<template>
  <div class="bg-[#252525] shadow py-4">
    <div class="container">
      <div class="mb-6 rounded-md">
        <h2 class="text-2xl font-bold text-white">ตารางโปรเจค</h2>
        <p class="text-[#ED9200]">หน้าแรก</p>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-4">
    <div class="content">
      <div class="py-4 px-4 rounded-lg text-white">
        <div class="p-4">
          <h3 class="text-center text-white">ตารางจัดการข้อมูลโปรเจค</h3>
          <div class="flex justify-end mt-4">
            <button
              @click="openAddPopup"
              class="px-4 py-1 bg-[#009C12] text-white rounded-[10px] shadow hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <img
                src="assets\images\image-gallery 1.png"
                alt="Avatar"
                class="w-8 h-8 rounded"
              />
              <span>เพิ่มโปรเจค</span>
            </button>
            <AddProjectName
              v-if="isAddPopupVisible"
              :isVisible="isAddPopupVisible"
              @close="closeAddPopup"
              @project-added="fetchUsers"
            />
          </div>
          <span class="text-lg">
            จัดการข้อมูล
            <span class="text-lg text-[#ED9200]">โปรเจค</span> ของพนักงาน
          </span>
        </div>

        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-grow">
            <div class="relative">
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้"
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
        <div class="overflow-x-auto rounded">
          <table class="table-auto w-full border-collapse">
            <thead
              class="bg-gradient-to-b from-gray-700 to-black text-white text-lg rounded-full"
            >
              <tr>
                <!--<th class="px-4 py-4 text-center border">id</th>-->
                <th class="px-4 py-3 text-center rounded">เชื่อโปรเจค</th>
                <th class="px-4 py-3 text-center rounded">เพิ่มเติม</th>
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
                      <span>แก้ไข</span>
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

      <!-- Popup ยืนยันการลบ -->
      <div
        v-if="showDeletePopup"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
        @click.self="cancelDelete"
      >
        <div
          class="text-center w-[350px] mx-auto bg-[#252525] p-6 rounded-[15px]"
        >
          <template v-if="deleteState === 'confirm'">
            <!-- แสดง Popup ยืนยันการลบ -->
            <h2 class="text-4xl font-bold mb-2 text-white">ยืนยันการลบ</h2>
            <p class="mb-6 text-white">
              คุณต้องการลบโปรเจค
              <span class="font-semibold text-red-600">{{
                projectToDelete.name
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
            <div class="flex justify-center gap-4 pb-4">
              <button
                class="py-2 px-10 bg-[#8D8D8D] text-white rounded-[8px] hover:bg-gray-600"
                @click="cancelDelete"
              >
                ยกเลิก
              </button>
              <button
                class="py-2 px-10 bg-[#BA0101] text-white rounded-[8px] hover:bg-red-700"
                @click="confirmDelete"
              >
                ยืนยัน
              </button>
            </div>
          </template>

          <template v-else-if="deleteState === 'success'">
            <!-- แสดงข้อความสำเร็จ -->
            <h2 class="text-4xl font-bold text-white mb-4">ลบโปรเจคสำเร็จ</h2>

            <p class="mb-6 text-white">
              ลบข้อมูลโปรเจค
              <span class="text-red-600">{{ deleteSuccessMessage }}</span>
              สำเร็จ!!
            </p>
            <div class="flex justify-center items-center mb-4">
              <img
                src="assets\images\Bin_Success_Icon.png"
                alt=""
                class="w-20 h-20 mb-4"
              />
            </div>
            <div class="flex justify-center mb-6">
              <button
                class="py-2 px-10 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded-[8px] hover:bg-blue-700"
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
  <div class="bg-gradient-to-b from-gray-700 to-black px-4 my-3">
    <div class="flex justify-center items-center mt-5 gap-2 py-3">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="py-2 px-4 rounded border border-gray-300 bg-[#8A8a8A] hover:bg-purple-100"
        :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
      >
        &lt;&lt;
      </button>
      <button
        v-for="(page, index) in paginationRange"
        :key="index"
        @click="goToPage(page)"
        class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
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
        class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
        :class="{
          'cursor-not-allowed opacity-50': currentPage === totalPages,
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
import EditProjectName from "@/components/EditProjectName.vue";
import AddProjectName from "@/components/AddProjectName.vue";

useHead({
    title: "ตารางจัดการโปรเจค",
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "keywords", content: "" },
      { name: "description", content: "ตารางจัดการโปรเจค" },
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
