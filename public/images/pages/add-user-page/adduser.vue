<template>
    <div class="pc-content">
        <!-- [ breadcrumb ] start -->
        <div class="page-header">
            <div class="page-block">
            <div class="row align-items-center">
                <div class="col-md-12">
                <ul class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">หน้าแรก</a></li>
                    <li class="breadcrumb-item"><a href="javascript: void(0)">ผู้ใช้งาน</a></li>
                    <li class="breadcrumb-item" aria-current="page">เพิ่มผู้ใช้ใช้งาน</li>
                </ul>
                </div>
                <div class="col-md-12">
                <div class="page-header-title">
                    <h2 class="mb-0">Add User Page</h2>
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




    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <form
      @submit.prevent="submitForm"
      class="w-full max-w-md bg-white shadow-md rounded px-8 py-6 space-y-4"
    >
      <h2 class="text-2xl font-bold text-gray-700 text-center">เพิ่มผู้ใช้งานระบบ</h2>

      <div class="space-y-2">
        <label for="text" class="block text-gray-600 font-medium">ชื่อผู้ใช้:</label>
        <input
          type="text"
          id="text"
          v-model="email"
          required
          placeholder="เช่น admin12..."
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="block text-gray-600 font-medium">รหัสผ่าน :</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="เช่น 12345gergr"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        บันทึก
      </button>
    </form>

    <!-- Popup -->
    <div v-if="isPopupVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded shadow-lg p-6 w-96 text-center space-y-4">
        <div v-if="isLoading">
          <svg class="animate-spin h-6 w-6 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="text-gray-600">กำลังบันทึกข้อมูล...</p>
        </div>
        <div v-else>
          <p class="text-green-600 font-bold">บันทึกสำเร็จ</p>
          <button
            @click="closePopup"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  </div>




                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth'
});

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

import axios from "axios";
import { ref, onMounted } from 'vue';

const email = ref('');
const password = ref('');
const isPopupVisible = ref(false);
const isLoading = ref(false);
const popupMessage = ref(''); // เพิ่มตัวแปรสำหรับข้อความใน Popup
const token = ref('');



onMounted(() => {
  if (process.client) {
    token.value = localStorage.getItem('access_token');
  }
});

const submitForm = async () => {
  isPopupVisible.value = true;
  isLoading.value = true;

  setTimeout(async () => {
    try {
      const response = await fetch(
        'https://trend-tiktok-235021042402.asia-southeast1.run.app/trend-new/back-end/add-backend-user/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`, // ใช้ token หากจำเป็น
          },
          body: JSON.stringify({
            username: email.value,
            pwd: password.value,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        popupMessage.value = 'บันทึกข้อมูลสำเร็จ'; // ตั้งค่าข้อความเมื่อสำเร็จ
      } else {
        const error = await response.json();
        console.error('Error:', error);
        popupMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'; // ตั้งค่าข้อความเมื่อเกิดข้อผิดพลาด
      }
    } catch (err) {
      console.error('Request failed:', err);
      popupMessage.value = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'; // ตั้งค่าข้อความเมื่อเชื่อมต่อไม่ได้
    } finally {
      isLoading.value = false;
    }
  }, 1000);
};

const closePopup = () => {
  isPopupVisible.value = false;
  if (popupMessage.value === 'บันทึกข้อมูลสำเร็จ') {
    if (process.client) {
      window.location.reload(); // รีโหลดหน้าเมื่อสำเร็จ
    }
  }
};
</script>


<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
