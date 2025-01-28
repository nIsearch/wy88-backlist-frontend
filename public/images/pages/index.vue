<template>
      <div class="pc-content font-sukhumvit">
      <!-- [ breadcrumb ] start -->
      <div class="page-header">
        <div class="page-block">
          <div class="row align-items-center">
            <div class="col-md-12">
              <ul class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">หน้าบ้าน</a></li>

              </ul>
            </div>
            <div class="col-md-12">
              <div class="page-header-title">
                <h2 class="mb-0">หน้าแรก</h2>
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
    <h1 class="text-center text-2xl md:text-3xl font-bold py-3">ตารางข้อมูลที่บันทึกแล้ว</h1>

    <!-- ค้นหาและตัวกรอง shadow-lg-->
    <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-3">
      <!-- ค้นหาผู้ใช้ -->
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาจากชื่อผู้ใช้"
        class="w-full md:flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <!-- ตัวกรองระดับผู้ใช้ -->
      <div class="w-full md:w-auto">
        <select
          v-model="selectedLevel"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">กรองตามอีเมล์</option>

          <option v-for="owner in uniqueOwners" :key="owner" :value="owner">
            {{ owner }}
          </option>
        </select>
      </div>
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
           <!-- <th class="border border-gray-300 px-6 py-4 text-center">ID</th>-->
            <th class="border border-gray-300 px-6 py-4 text-center">เจ้าของ</th>
            <th class="border border-gray-300 px-6 py-4 text-center">หัวข้อ</th>
            <th class="border border-gray-300 px-6 py-4 text-center">ชื่อผู้ใช้</th>
            <!--<th class="border border-gray-300 px-6 py-4 text-center">ชื่อผู้ใช้ URL</th>-->
            <th class="border border-gray-300 px-6 py-4 text-center">ลิงค์วีดีโอ</th>
            <th class="border border-gray-300 px-6 py-4 text-center">โพสต์เมื่อ</th>
            <th class="border border-gray-300 px-6 py-4 text-center" @click="sortByField('like')" >ถูกใจ
              <span v-if="sortField === 'like' && sortOrder === 'desc'" class="text-sm">▼</span>
              <span v-if="sortField === 'like' && sortOrder === 'asc'" class="text-sm">▲</span>
            </th>
            <th class="border border-gray-300 px-6 py-4 text-center" @click="sortByField('comment')" >คอมเม้น 
              <span v-if="sortField === 'comment' && sortOrder === 'desc'" class="text-sm">▼</span>
              <span v-if="sortField === 'comment' && sortOrder === 'asc'" class="text-sm">▲</span>
            </th>
            <th class="border border-gray-300 px-6 py-4 text-center" @click="sortByField('bookmark')" >บันทึก
              <span v-if="sortField === 'bookmark' && sortOrder === 'desc'" class="text-sm">▼</span>
              <span v-if="sortField === 'bookmark' && sortOrder === 'asc'" class="text-sm">▲</span>
            </th>
            <th class="border border-gray-300 px-6 py-4 text-center" @click="sortByField('shared')" >แชร์
              <span v-if="sortField === 'shared' && sortOrder === 'desc'" class="text-sm">▼</span>
              <span v-if="sortField === 'shared' && sortOrder === 'asc'" class="text-sm">▲</span>
            </th>
            <th class="border border-gray-300 px-6 py-4 text-center">วันที่ดึง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredData.length === 0">
            <td colspan="12" class="text-center py-4">ไม่พบข้อมูลที่ส่งมา</td>
          </tr>
          <tr v-else v-for="item in filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)" :key="item.id">
            <!--<td class="border border-gray-300 px-6 py-4">{{ item.id }}</td>-->
            <td class="border border-gray-300 px-6 py-4">{{ item.owner }}</td>
            <td class="border border-gray-300 px-6 py-4">{{ item.title }}</td>

           <!--<td class="border border-gray-300 px-6 py-4 text-center">
              <div v-if="!expandedTitleRows.includes(item.id)">
                
                {{ item.title.slice(0, 20) }}...
                <button 
                  class="text-blue-500 underline ml-2"
                  @click="toggleTitleExpansion(item.id)"
                >
                  เพิ่มเติม
                </button>
              </div>
              <div v-else>
                
                {{ item.title }}
                <button 
                  class="text-red-500 underline ml-2"
                  @click="toggleTitleExpansion(item.id)"
                >
                  ย่อ
                </button>
              </div>
            </td>--> 

            <td class="border border-gray-300 px-6 py-4 text-center">
              <a 
                v-if="item.account_url" 
                :href="item.account_url" 
                target="_blank" 
                class="text-blue-500 underline hover:text-blue-700 transition duration-200"
              >
                {{ item.account }}
              </a>
              <span v-else class="text-gray-500">{{ item.account }}</span>
            </td>
          <!--  <td class="border border-gray-300 px-6 py-4 text-center">{{ item.account_url }}</td>-->
            <td class="border border-gray-300 px-6 py-4 text-center">
              <a 
                v-if="item.video_url" 
                :href="item.video_url" 
                target="_blank" 
                class=""
              >
                ดูวีดีโอ
              </a>
              <span v-else class="text-gray-500">ไม่มีลิงก์</span>
            </td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.post_at }}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.like }}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.comment }}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.bookmark }}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.shared }}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">{{ item.pull_at }}</td>
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
  >
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
  >
    &gt;
  </button>
</div>

  </div>



            </div>
            <div class="card-body">
              <div class="flex justify-center items-center pb-2">
                <!-- Button with Icon and Text Centered -->
                <button
                  @click="openDeleteConfirmation"
                  class="flex items-center gap-2 py-3 px-8 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                  <i class="ph-duotone ph-trash text-3xl"></i>
                  <span>ลบข้อมูลทั้งหมด</span>
                </button>
              </div>
            </div>

    <!-- Popup ยืนยันการลบ -->
    <div
      v-if="showDeletePopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDeletePopup"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">คุณแน่ใจที่จะลบข้อมูลทั้งหมดหรือไม่?</h2>
        <p class="text-sm text-gray-500 mb-6">ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้</p>
        <div class="flex justify-end gap-4">
          <!-- ปุ่มยกเลิก -->
          <button
            @click="closeDeletePopup"
            class="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
          >
            ยกเลิก
          </button>
          <!-- ปุ่มตกลง -->
          <button
            @click="confirmDelete"
            class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>

    <!-- Popup แสดงข้อความสำเร็จ -->
    <div
      v-if="showSuccessPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeSuccessPopup"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">ลบข้อมูลสำเร็จ!</h2>
        <button
          @click="closeSuccessPopup"
          class="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          ตกลง
        </button>
      </div>
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
    title: "ตารางข้อมูลที่กรองแล้ว",
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "keywords", content: "" },
      { name: "description", content: "" },
    ],
  });

  definePageMeta({
  middleware: 'auth'
});

import { ref, computed, onMounted } from "vue";
import axios from "axios";

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


const maxVisiblePages = ref(5);



const search = ref("");
const selectedLevel = ref("");
const isLoading = ref(false);
const data = ref([]);
const token = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);




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

const sortField = ref("like"); // ฟิลด์ที่ใช้เรียงข้อมูลเริ่มต้น
const sortOrder = ref("desc"); // การเรียงเริ่มต้น
// ฟังก์ชันกรอง
const filteredData = computed(() => {
  // กรองข้อมูลตามคำค้นหา
  let result = data.value.filter((item) => {
    const matchesSearch = item.account.toLowerCase().includes(search.value.toLowerCase()); // กรองตามชื่อผู้ใช้
    const matchesLevel = selectedLevel.value ? item.owner === selectedLevel.value : true; // กรองตามระดับ (ถ้ามี)
    return matchesSearch && matchesLevel;
  });

  // เรียงข้อมูลตามฟิลด์ที่กำหนด (like, comment, bookmark, shared)
  result.sort((a, b) => {
    const valueA = parseInt(a[sortField.value].replace(/,/g, ""), 10) || 0; // แปลงเป็นตัวเลข
    const valueB = parseInt(b[sortField.value].replace(/,/g, ""), 10) || 0; // แปลงเป็นตัวเลข

    if (sortOrder.value === "desc") {
      return valueB - valueA; // เรียงจากมากไปน้อย
    } else {
      return valueA - valueB; // เรียงจากน้อยไปมาก
    }
  });

  return result;
});




function sortByField(field) {
  if (sortField.value === field) {
    // สลับการเรียงหากคลิกที่ฟิลด์เดิม
    sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
  } else {
    // เปลี่ยนฟิลด์ที่ใช้เรียง
    sortField.value = field;
    sortOrder.value = "desc"; // การเรียงเริ่มต้นเป็น desc
  }
}



function toggleSortOrder() {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc"; // สลับค่าการเรียง
}


// กำจัด owner ซ้ำ
const uniqueOwners = computed(() => {
  const owners = data.value.map(item => item.owner);
  const unique = [...new Set(owners)];

  return unique;
});



onMounted(() => {
  fetchData().then(() => {
 // ดูข้อมูลที่โหลดมา
  });
});



async function fetchData() {
  isLoading.value = true;
  try {
    if (typeof window !== "undefined") {
      token.value = localStorage.getItem("access_token");
    }

    const response = await axios.get(
      "https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/trend-list",
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );

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



// เก็บ ID ของแถวที่มีการขยาย "หัวข้อ"
const expandedTitleRows = ref([]);

// ฟังก์ชันสลับสถานะขยาย/ย่อ
function toggleTitleExpansion(rowId) {
  if (expandedTitleRows.value.includes(rowId)) {
    // หากแถวอยู่ใน expandedTitleRows ให้ลบออก (ย่อ)
    expandedTitleRows.value = expandedTitleRows.value.filter(id => id !== rowId);
  } else {
    // หากแถวไม่อยู่ใน expandedTitleRows ให้เพิ่มเข้าไป (ขยาย)
    expandedTitleRows.value.push(rowId);
  }
}





const showDeletePopup = ref(false); // สถานะ Popup การยืนยันการลบ
const showSuccessPopup = ref(false); // สถานะ Popup การลบสำเร็จ


// ฟังก์ชันเปิด Popup ยืนยันการลบ
function openDeleteConfirmation() {
  showDeletePopup.value = true;
}

// ฟังก์ชันปิด Popup ยืนยันการลบ
function closeDeletePopup() {
  showDeletePopup.value = false;
}

// ฟังก์ชันเปิด Popup สำเร็จ
function openSuccessPopup() {
  showSuccessPopup.value = true;
}

// ฟังก์ชันปิด Popup สำเร็จ
function closeSuccessPopup() {
  showSuccessPopup.value = false;
}

// ฟังก์ชันยืนยันการลบ
async function confirmDelete() {
  try {
    const response = await axios.delete(
      "https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/delete-all-trends/",
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
      }
    );
    closeDeletePopup();
    openSuccessPopup();
    // ใช้ fetchDataAfterDelete สำหรับการอัปเดตข้อมูล
    fetchDataAfterDelete();
  } catch (error) {
    console.error("Error deleting data:", error);
    alert("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
}




async function fetchDataAfterDelete() {
  try {
    isLoading.value = true;
    const response = await axios.get(
      "https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/trend-list",
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
      }
    );
    data.value = response.data; // ตั้งค่าข้อมูลที่ดึงมา
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
}

</script>
  