<template>
    <div class="pc-content font-sukhumvit">
    <!-- [ breadcrumb ] start -->
    <div class="page-header">
      <div class="page-block">
        <div class="row align-items-center">
          <div class="col-md-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">หน้าบ้าน</a></li>
              <li class="breadcrumb-item" aria-current="page">ตารางผู้ใช้งาน</li>
            </ul>
          </div>
          <div class="col-md-12">
            <div class="page-header-title">
              <h2 class="mb-0">ตารางข้อมูลผู้ใช้</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- [ breadcrumb ] end -->


    <!-- [ Main Content ] start -->
    <div class="row">
      <!-- [ sample-page ] start -->
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            




            
            <div class="max-w-full lg:max-w-10xl mx-auto my-5 p-4 bg-gray-100 rounded-lg ">
  <h1 class="text-center text-3xl md:text-3xl font-bold py-3">ตารางข้อมูลผู้ใช้งาน</h1>

  <!-- ค้นหาและตัวกรอง shadow-lg
  <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-3">
    
    <input
      v-model="search"
      type="text"
      placeholder="ค้นหาผู้ใช้"
      class="w-full md:flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    
    <div class="w-full md:w-auto">
      <select
        v-model="selectedLevel"
        class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">กรองตามระดับผู้ใช้</option>
        <option v-for="level in uniqueLevels" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
    </div>
  </div>-->

  <div class="flex justify-center items-center pb-2">
    <!-- Button with Icon and Text Centered -->
    <button
      @click="openAddUserPopup"
      class="flex items-center gap-2 py-3 px-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
    >
      <i class="ph-duotone ph-first-aid text-3xl"></i>
      <span>เพิ่มผู้ใช้งาน</span>
    </button>
  </div>

  <!-- ตารางข้อมูล -->
  <div class="overflow-x-auto">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
      <svg
        class="animate-spin h-8 w-8 text-blue-500 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p class="text-gray-500 text-lg">กำลังโหลดข้อมูลกรุณารอสักครู่...</p>
    </div>

    <table v-else class="table-auto w-full border-collapse border border-gray-300 rounded-lg">
      <thead class="bg-gray-200">
        <tr>
           <!-- <th class="border border-gray-300 px-6 py-4 text-center">ลำดับที่</th>-->
            <th class="border border-gray-300 px-6 py-4 text-center">ชื่อผู้ใช้งาน</th>
    <!----><th class="border border-gray-300 px-6 py-4 text-center">บทบาท</th>
            <th class="border border-gray-300 px-6 py-4 text-center">รหัสผ่าน</th>
    <!--<th class="border border-gray-300 px-6 py-4 text-center">access_token</th>-->
    <!--<th class="border border-gray-300 px-6 py-4 text-center">disabled</th>-->
    <!--<th class="border border-gray-300 px-6 py-4 text-center">created_at</th>-->
    <!--<th class="border border-gray-300 px-6 py-4 text-center">updated_at</th>-->
           <th class="border border-gray-300 px-6 py-4 text-center">เพิ่มเติม</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)" :key="item.id">

          <!--<td class="border border-gray-300 px-6 py-4 text-center">
  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
</td>-->
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.username }}</td>
     <!----><td class="border border-gray-300 px-6 py-4 text-center">{{ item.full_name }}</td>
     <td class="border border-gray-300 px-6 py-4 text-center">
      <span v-if="!visiblePasswords[item.id]">xxxxx</span>
      <span v-else>{{ item.pwd }}</span>
      <button
        @click="togglePasswordVisibility(item.id)"
        class="ml-2 text-blue-500 underline hover:text-blue-700"
      >
        {{ visiblePasswords[item.id] ? 'ซ่อน' : 'ดู' }}
      </button>
    </td>
     <!--<td class="border border-gray-300 px-6 py-4 text-center">{{ item.access_token }}</td>-->
     <!--<td class="border border-gray-300 px-6 py-4 text-center">{{ item.disabled }}</td>-->
     <!--<td class="border border-gray-300 px-6 py-4 text-center">{{ item.created_at }}</td>-->
     <!--<td class="border border-gray-300 px-6 py-4 text-center">{{ item.updated_at }}</td>-->
            <td class="border border-gray-300 px-6 py-4 text-center">
              <div class="flex justify-center items-center pb-2">
                <button 
                @click="openEditPopup(item.id, item.username, item.pwd)"
                class="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-700 flex items-center">
                <i class="ph-duotone ph-pencil-line text-3xl"></i>แก้ไข</button>
                
                <button
                @click="confirmDelete(item.id, item.username)"
                 class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 ml-2 flex items-center">
                 <i class="ph-duotone ph-trash text-3xl"></i>ลบ</button>
              </div>
            </td>
        </tr>
      </tbody>
    </table>




  </div>


  <div class="flex justify-center items-center mt-5 gap-2">
<!-- ปุ่มไปหน้าแรก -->
<button
  @click="goToPage(1)"
  :disabled="currentPage === 1"
  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
  :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
><
  &lt;
</button>

<!-- แสดงช่วงหน้า -->
<button
  v-for="(page, index) in paginationRange"
  :key="index"
  @click="goToPage(page)"
  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100 "
  :class="{ 'bg-purple-500 text-red-500 ': currentPage === page }"
>
  {{ page }}
</button>

<!-- ปุ่มไปหน้าสุดท้าย -->
<button
  @click="goToPage(totalPages)"
  :disabled="currentPage === totalPages"
  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
  :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
>>
  &gt;
</button>
</div>

</div>



<!-- Popup แสดงภาพ -->
<div 
    v-if="showPopup" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closePopup" 
  >
    <div class="bg-white rounded-lg shadow-lg p-4 max-w-lg relative">
      <img :src="popupImage" alt="Popup Image" class="max-w-full max-h-98 object-contain mx-auto" />
      <button 
        class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
        @click="closePopup"
      >
        ✖
      </button>
    </div>
  </div>


<!-- Popup ลบข้อมูล -->
<div 
  v-if="showDeletePopup" 
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  @click.self="closeDeletePopup" 
>
  <div class="bg-white rounded shadow-lg p-6 w-96 text-center space-y-4">
    <p class="mb-4 text-lg text-gray-800">{{ deleteMessage }}</p>
    <div v-if="deleteMessage === `ลบข้อมูล : ${deleteUsername} สำเร็จ!`">
      <button
        @click="closeDeletePopup"
        class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700"
      >
        ตกลง
      </button>
    </div>
    <div v-else>
      <button
        @click="deleteData"
        :disabled="isDeleting"
        class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
      >
        ตกลง
      </button>
      <button
        @click="closeDeletePopup"
        :disabled="isDeleting"
        class="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400 ml-4"
      >
        ยกเลิก
      </button>
    </div>
  </div>
</div>


<!-- เรียก popupedituser -->
<popupedituser
      v-if="isEditPopupVisible"
      :isVisible="isEditPopupVisible"
      :id="selectedId"
      :username="selectedUsername"
      :pwd="selectedPwd"
      @close="closeEditPopup"
      @save="updateUser"
    />

        <!-- Popup Add User -->
        <Adduser v-if="isAddUserPopupVisible" @close="closeAddUserPopup" />

          </div>
          <div class="card-body">
          </div>
        </div>
      </div>
      <!-- [ sample-page ] end -->
    </div>
    <!-- [ Main Content ] end -->
  </div>
</template>

<script setup>

useHead({
    title: "ตารางข้อมูลผู้ใช้งาน",
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "keywords", content: "" },
      { name: "description", content: " เพิ่ม ลบ แก้ไข ผู้ใช้ได้ที่นี่ " },
    ],
  });

definePageMeta({
  middleware: 'auth'
});

import { ref, computed, onMounted } from "vue";
import axios from "axios";
import popupedituser from "./components/popupedituser.vue"; // import component
import Adduser from "./components/Adduser.vue"; // นำเข้า Adduser.vue

axios.interceptors.response.use(
  (response) => response, // หากไม่มีปัญหา
  (error) => {
    // ตรวจสอบข้อความข้อผิดพลาด
    if (error.message.includes('setRequestHeader') || error.response?.status === 401) {
      console.error('Redirecting to login due to invalid token or 401 Unauthorized.');
      // ลบ Token และเวลาหมดอายุ
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiry');
      // รีไดเรกต์ไปหน้าเข้าสู่ระบบ
      window.location.href = '/login-page/login';
    }
    return Promise.reject(error);
  }
);


const visiblePasswords = ref({}); // เก็บสถานะการแสดงผลรหัสผ่าน

function togglePasswordVisibility(id) {
  // สลับสถานะการแสดงผลรหัสผ่าน
  visiblePasswords.value[id] = !visiblePasswords.value[id];
}

const isAddUserPopupVisible = ref(false); // ตัวแปรควบคุมการแสดง popup

function openAddUserPopup() {
  isAddUserPopupVisible.value = true;
}

function closeAddUserPopup() {
  isAddUserPopupVisible.value = false;
}

const data = ref([
  { id: 1, username: "user1", pwd: "pass1" },
  { id: 2, username: "user2", pwd: "pass2" },
  { id: 3, username: "user3", pwd: "pass3" },
]);

const isEditPopupVisible = ref(false);
const selectedId = ref(null);
const selectedUsername = ref("");
const selectedPwd = ref("");

// เปิด Popup พร้อมส่งข้อมูล
function openEditPopup(id, username, pwd) {
  selectedId.value = id;
  selectedUsername.value = username;
  selectedPwd.value = pwd;
  isEditPopupVisible.value = true;
}

// ปิด Popup
function closeEditPopup() {
  isEditPopupVisible.value = false;
}

// อัปเดตข้อมูลในตาราง
function updateUser(updatedData) {
  const index = data.value.findIndex((item) => item.id === updatedData.id);
  if (index !== -1) {
    data.value[index].username = updatedData.username;
    data.value[index].pwd = updatedData.password;
  }
  closeEditPopup();
}

const maxVisiblePages = ref(5);



const search = ref("");
const selectedLevel = ref("");
const isLoading = ref(false);

const token = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalItems = ref(0); // จำนวนรายการทั้งหมด


const showPopup = ref(false);
const popupImage = ref("");

function openImage(imageUrl) {
popupImage.value = imageUrl; // ตั้งค่าภาพที่ต้องการแสดง
showPopup.value = true; // เปิด Popup
}

function closePopup() {
showPopup.value = false; // ปิด Popup
popupImage.value = ""; // ล้าง URL ของภาพ
}

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));
const paginationRange = computed(() => {
const total = totalPages.value;
const current = currentPage.value;
const maxPages = maxVisiblePages.value;
const range = [];

const half = Math.floor(maxPages / 2);

let start = Math.max(current - half, 1);
let end = Math.min(current + half, total);

// ปรับช่วงให้ครบ maxVisiblePages
if (end - start + 1 < maxPages) {
  if (start === 1) {
    end = Math.min(start + maxPages - 1, total);
  } else if (end === total) {
    start = Math.max(end - maxPages + 1, 1);
  }
}

for (let i = start; i <= end; i++) {
  range.push(i);
}

return range;
});

const filteredData = computed(() => {
  return data.value.filter(item => {
    const matchesSearch = item.username.toLowerCase().includes(search.value.toLowerCase()) || item.full_name.toLowerCase().includes(search.value.toLowerCase());
    return matchesSearch;
  });
});





async function fetchData() {
isLoading.value = true;
try {
  if (typeof window !== "undefined") {
    token.value = localStorage.getItem("access_token");
  }

  const response = await axios.get(
    "https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/admin-list",
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับ
  data.value = response.data; // เนื่องจาก response เป็น array โดยตรง // ตรวจสอบโครงสร้าง "data"
} catch (error) {
  console.error("Error fetching data:", error);
} finally {
  isLoading.value = false;
}
}


function goToPage(page) {
if (page >= 1 && page <= totalPages.value) {
  currentPage.value = page;
}
}

onMounted(() => {
fetchData();
});


const showDeletePopup = ref(false); // ควบคุมการแสดงผล Popup
const deleteId = ref(null); // เก็บ ID ที่ต้องการลบ
const deleteUsername = ref(""); // เก็บ Username ที่ต้องการลบ
const deleteMessage = ref(""); // ข้อความใน Popup
const isDeleting = ref(false); // สถานะการลบข้อมูล

function confirmDelete(id, username) {
  deleteId.value = id;
  deleteUsername.value = username;
  deleteMessage.value = `คุณต้องการลบรายการที่มี : ${username} ใช่หรือไม่?`;
  showDeletePopup.value = true;
}

async function deleteData() {
  isDeleting.value = true;
  deleteMessage.value = "กำลังลบข้อมูล...";

  try {
    // หน่วงเวลา 1 วินาที
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // เรียก API ลบข้อมูล
    await axios.delete(`https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/delete-admin/${deleteId.value}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    data.value = data.value.filter((item) => item.id !== deleteId.value);

    // เมื่อสำเร็จ
    deleteMessage.value = `ลบข้อมูล : ${deleteUsername.value} สำเร็จ!`;
  } catch (error) {
    console.error("Error deleting data:", error);
    deleteMessage.value = `ลบข้อมูล : ${deleteUsername.value} ล้มเหลว!`;
  } finally {
    isDeleting.value = false;
  }
}

function closeDeletePopup() {
  showDeletePopup.value = false; // ปิด Popup
  deleteId.value = null; // รีเซ็ต ID
  deleteUsername.value = ""; // รีเซ็ต Username
  deleteMessage.value = ""; // เคลียร์ข้อความ
 
}




</script>
