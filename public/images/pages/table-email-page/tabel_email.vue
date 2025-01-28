<template>
  <div class="pc-content font-sukhumvit">
    <!-- [ breadcrumb ] start -->
    <div class="page-header">
      <div class="page-block">
        <div class="row align-items-center">
          <div class="col-md-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">หน้าบ้าน</a></li>
              <li class="breadcrumb-item" aria-current="page">ตารางอีเมล์</li>
            </ul>
          </div>
          <div class="col-md-12">
            <div class="page-header-title">
              <h2 class="mb-0">ตารางข้อมูลอีเมล์</h2>
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
            <div
              class="max-w-full lg:max-w-10xl mx-auto my-5 p-4 bg-gray-100 rounded-lg"
            >
              <h1 class="text-center text-3xl md:text-3xl font-bold py-3">
                ตารางข้อมูลอีเมล์ที่บันทึกแล้ว
              </h1>

              <div class="flex justify-center items-center pb-2">
                <!-- Button with Icon and Text Centered -->
                <button
                  @click="openAddEmailPopup"
                  class="flex items-center gap-2 py-3 px-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                  <i class="ph-duotone ph-first-aid text-3xl"></i>
                  <span>เพิ่มอีเมล์</span>
                </button>
              </div>
              <!-- ตารางข้อมูล -->
              <div class="overflow-x-auto">
                <div
                  v-if="isLoading"
                  class="flex flex-col items-center justify-center py-10"
                >
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
                  <p class="text-gray-500 text-lg">
                    กำลังโหลดข้อมูลกรุณารอสักครู่...
                  </p>
                </div>

                <table
                  v-else
                  class="table-auto w-full border-collapse border border-gray-300 rounded-lg"
                >
                  <thead class="bg-gray-200">
                    <tr>
                      <!--<th class="border border-gray-300 px-6 py-4 text-center">ลำดับที่</th>-->
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        อีเมล์
                      </th>
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        รหัสผ่าน
                      </th>
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        หมวดหมู่
                      </th>
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        สถานะ
                      </th>
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        อัพเดต
                      </th>
                      <th class="border border-gray-300 px-6 py-4 text-center">
                        เพิ่มเติม
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in filteredData.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )"
                      :key="item.id"
                    >
                      <!--<td class="border border-gray-300 px-6 py-4 text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>-->
                      <td class="border border-gray-300 px-6 py-4 text-center">
                        {{ item.email }}
                      </td>
                      <td class="border border-gray-300 px-6 py-4 text-center">
                        {{ item.password }}
                      </td>
                      <td class="border border-gray-300 px-6 py-4 text-center">
                        {{ item.category }}
                      </td>
                      <td class="border border-gray-300 px-6 py-4 text-center">
                        {{ item.status }}
                      </td>
                      <td class="border border-gray-300 px-6 py-4 text-center">
                        {{
                          item.update_at
                            ? formatDateTime(item.update_at)
                            : "..."
                        }}
                      </td>

                      <td class="border border-gray-300 px-6 py-4 text-center">
                        <div class="flex justify-center items-center pb-2">
                          <button
                            class="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-700 flex items-center"
                            @click="openEditPopup(item)"
                          >
                            <i class="ph-duotone ph-pencil-line text-3xl"></i>
                            <span>แก้ไข</span>
                          </button>
                          <button
                            class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 ml-2 flex items-center"
                            @click="confirmDelete(item)"
                          >
                            <i class="ph-duotone ph-trash text-3xl"></i>
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <EditPopup
                  v-if="isEditPopupVisible"
                  :id="selectedItem.id"
                  :email="selectedItem.email"
                  :password="selectedItem.password"
                  :category="selectedItem.category"
                  @close="isEditPopupVisible = false"
                  @save="updateData"
                />
              </div>

              <div class="flex justify-center items-center mt-5 gap-2">
                <!-- ปุ่มไปหน้าแรก -->
                <button
                  @click="goToPage(1)"
                  :disabled="currentPage === 1"
                  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
                  :class="{
                    'cursor-not-allowed opacity-50': currentPage === 1,
                  }"
                >
                  < &lt;
                </button>

                <!-- แสดงช่วงหน้า -->
                <button
                  v-for="(page, index) in paginationRange"
                  :key="index"
                  @click="goToPage(page)"
                  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
                  :class="{
                    'bg-purple-500 text-red-500 ': currentPage === page,
                  }"
                >
                  {{ page }}
                </button>

                <!-- ปุ่มไปหน้าสุดท้าย -->
                <button
                  @click="goToPage(totalPages)"
                  :disabled="currentPage === totalPages"
                  class="py-2 px-4 rounded border border-gray-300 bg-white hover:bg-purple-100"
                  :class="{
                    'cursor-not-allowed opacity-50': currentPage === totalPages,
                  }"
                >
                  > &gt;
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
                <img
                  :src="popupImage"
                  alt="Popup Image"
                  class="max-w-full max-h-98 object-contain mx-auto"
                />
                <button
                  class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  @click="closePopup"
                >
                  ✖
                </button>
              </div>
            </div>

            <!-- Popup ยืนยันการลบ -->
            <div
              v-if="showConfirmPopup"
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              @click.self="showConfirmPopup = false"
            >
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-lg font-semibold mb-4">
                  คุณต้องการลบรายการที่มี Email:
                  {{ itemToDelete?.email }} ใช่หรือไม่?
                </h2>
                <div class="flex justify-end gap-4">
                  <button
                    class="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
                    @click="showConfirmPopup = false"
                  >
                    ยกเลิก
                  </button>
                  <button
                    class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                    @click="deleteItem"
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
              @click.self="showSuccessPopup = false"
            >
              <div
                class="bg-white rounded shadow-lg p-6 w-96 text-center space-y-4"
              >
                <h2 class="text-lg font-semibold text-green-600 mb-4">
                  ลบข้อมูล {{ itemToDelete?.email }} สำเร็จ!
                </h2>
                <button
                  class="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                  @click="showSuccessPopup = false"
                >
                  ตกลง
                </button>
              </div>
            </div>

            <AddPopupEmail
              v-if="isAddEmailPopupVisible"
              @close="closeAddEmailPopup"
            />
          </div>
          <div class="card-body"></div>
        </div>
      </div>
      <!-- [ sample-page ] end -->
    </div>
    <!-- [ Main Content ] end -->
  </div>
</template>

<script setup>
const items = ref([]);
useHead({
  title: "ตารางข้อมูลอีเมล์",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "keywords", content: "" },
    { name: "description", content: " เพิ่ม ลบ แก้ไข อีเมล์ได้ที่นี่ " },
  ],
});

definePageMeta({
  middleware: "auth",
});

import { ref, computed, onMounted } from "vue";
import axios from "axios";
import AddPopupEmail from "/components/AddPopupEmail.vue";

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
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      // รีไดเรกต์ไปหน้าเข้าสู่ระบบ
      window.location.href = "/login-page/login";
    }
    return Promise.reject(error);
  }
);

const isAddEmailPopupVisible = ref(false);

function openAddEmailPopup() {
  isAddEmailPopupVisible.value = true; // เปิด Popup
}

function closeAddEmailPopup() {
  isAddEmailPopupVisible.value = false; // ปิด Popup
}

const isEditPopupVisible = ref(false);
const selectedItem = ref({ id: null, email: "", password: "", category: "" });
const data = ref([
  {
    id: 1,
    email: "test1@example.com",
    password: "pass123",
    category: "Category1",
    status: "status1",
  },
  {
    id: 2,
    email: "test2@example.com",
    password: "pass456",
    category: "Category2",
    status: "status2",
  },
]);

function openEditPopup(item) {
  selectedItem.value = { ...item }; // เก็บข้อมูลของรายการที่เลือก
  isEditPopupVisible.value = true; // เปิด Popup
}

function updateData(updatedItem) {
  const index = data.value.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    data.value[index] = updatedItem; // อัปเดตข้อมูลในตาราง
  }
  isEditPopupVisible.value = false;
}

const showConfirmPopup = ref(false);
const showSuccessPopup = ref(false);
const itemToDelete = ref(null);

const search = ref("");

const isLoading = ref(false);

const token = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(6);

const showPopup = ref(false);
const popupImage = ref("");

function confirmDelete(item) {
  itemToDelete.value = item; // เก็บข้อมูลของรายการที่ต้องการลบ
  showConfirmPopup.value = true; // เปิด Popup ยืนยัน
}

function openImage(imageUrl) {
  popupImage.value = imageUrl; // ตั้งค่าภาพที่ต้องการแสดง
  showPopup.value = true; // เปิด Popup
}

function closePopup() {
  showPopup.value = false; // ปิด Popup
  popupImage.value = ""; // ล้าง URL ของภาพ
}

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / itemsPerPage.value)
);
const paginationRange = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const maxPages = 5; // จำนวนปุ่มสูงสุดที่แสดงใน Pagination
  const range = [];

  const half = Math.floor(maxPages / 2);

  let start = Math.max(current - half, 1);
  let end = Math.min(current + half, total);

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
  return data.value.filter((item) => {
    const matchesSearch =
      item.email.toLowerCase().includes(search.value.toLowerCase()) ||
      item.category.toLowerCase().includes(search.value.toLowerCase());
    return matchesSearch;
  });
});

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await axios.get(
      "https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/email-list",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    data.value = response.data; // อัปเดตข้อมูล
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    console.log("Changing to page:", page);
    currentPage.value = page;
  } else {
    console.log("Invalid page:", page);
  }
}

onMounted(() => {
  fetchData();
});

async function deleteItem() {
  if (!itemToDelete.value) return;

  try {
    // โหลด Token จาก localStorage
    if (!token.value) {
      token.value = localStorage.getItem("access_token");
    }

    // ตรวจสอบว่า Token มีค่า
    if (!token.value) {
      alert("คุณไม่มีสิทธิ์ในการลบข้อมูล กรุณาเข้าสู่ระบบ!");
      return;
    }

    const response = await axios.delete(
      `https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/delete-email-list/${itemToDelete.value.id}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Data deleted successfully"
    ) {
      console.log("ลบข้อมูลสำเร็จ:", response.data);
      data.value = data.value.filter(
        (item) => item.id !== itemToDelete.value.id
      );
      showConfirmPopup.value = false;
      showSuccessPopup.value = true;
    } else {
      alert("ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง!");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("Token หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่!");
      console.error("Unauthorized:", error.response.data);
    } else {
      console.error("Error deleting item:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล!");
    }
  }
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleString("th-TH", options).replace(",", " เวลา");
}
</script>
