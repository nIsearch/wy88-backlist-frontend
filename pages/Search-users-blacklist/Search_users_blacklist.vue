<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Popup Error -->
      <div 
        v-if="showError" 
        class="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 text-xl rounded shadow-lg flex items-center space-x-2">
        <i class="ph-duotone ph-x-circle text-4xl"></i>
        <span>{{ errorMessage }}</span>
      </div>
  
      <!-- Header -->
      <header class="shadow">
        <div class="container mx-auto p-4">
          <h1 class="text-2xl font-bold text-gray-900">ค้นหาผู้ใช้ที่ถูกแบน</h1>
        </div>
      </header>
  
      <!-- Breadcrumbs -->
      <nav class="bg-gray-50 py-0 border-b">
        <div class="container mx-auto px-4">
          <ol class="flex space-x-2 text-sm text-gray-500">
            <li><router-link to="/" class="hover:text-gray-700">หน้าแรก</router-link></li>
            <li>&gt;</li>
            <li>ค้นหาผู้ใช้ที่ถูกแบน</li>
          </ol>
        </div>
      </nav>
  
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-6">
        <!-- Search Bar -->
        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-grow">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search a Keyword" 
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="searchTerm"
                @keydown.enter="performSearch"
              />
              <span class="absolute right-2 top-2 text-gray-400">
                <i class="ti ti-search"></i>
              </span>
            </div>
          </div>
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            @click="performSearch"
          >Search</button>
        </div>
  
        <!-- Contacts List -->
        <div v-if="filteredContacts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="contact in filteredContacts" 
            :key="contact.id" 
            class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="p-4 text-start">
              <img 
                src="assets\images\user\avatar-3.jpg" 
                alt="User Avatar" 
                class="w-20 h-20 mx-auto rounded-full border"
              />
              <h3 class="mt-4 text-center text-xl font-semibold">ชื่อผู้ใช้ : {{ contact.username }}</h3>
              <!--<p class="text-l text-gray-800">ชื่อโปรเจ็ค : {{ contact.project_name }}</p>-->
              <p class="text-l text-gray-800">รายละเอียด : {{ contact.detail }}</p>
              <p class="text-l text-gray-800">ข้อมูลเมื่อ : {{ contact.date }}</p>
              <p class="text-l text-gray-800">สถานะปัจจุบัน : 
                <span :class="{
                'text-red-800': contact.status_name === 'ติดแบน',
                'text-green-800': contact.status_name === 'ปลดแบน'}">
                {{ contact.status_name }}
                </span>
              </p>

            </div>
            <!--<div class="flex justify-between px-4 py-3">
              <button 
                class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                @click="acceptContact(contact.id)"
              >Accept</button>
              <button 
                class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                @click="declineContact(contact.id)"
              >Decline</button>
            </div>-->
          </div>
        </div>
        <div v-else class="text-center text-gray-600">
          <p>กรอกชื่อผู้ใช้ และ กดปุ่ม ค้นหา หรือ Enter ที่คีย์บอร์ด</p>
        </div>
      </main>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        searchTerm: "",
        contacts: [],
        showError: false, // สถานะ Popup ข้อผิดพลาด
        errorMessage: "", // ข้อความแสดงข้อผิดพลาด
      };
    },
    computed: {
      filteredContacts() {
        return this.contacts.filter(contact =>
          contact.username.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
    },
    methods: {
      async performSearch() {
        const accessToken = localStorage.getItem('access_token') || '';
        let projectName = localStorage.getItem('project_name') || 'all';
  
        if (projectName.startsWith('"') && projectName.endsWith('"')) {
          projectName = projectName.slice(1, -1); // ตัด " ออก
        }
  
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/black-list-user/back-end/user-list`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );
  
          const data = await response.json();
  
          if (response.ok && data.result_data.data) {
            if (data.result_data.data.length > 0) {
              this.contacts = data.result_data.data; // แสดงข้อมูลที่พบ
            } else {
              this.triggerError("ไม่พบผู้ใช้งานในระบบ");
            }
          } else {
            this.triggerError(data.detail || "เกิดข้อผิดพลาด");
          }
        } catch (error) {
          this.triggerError(error.message || "เกิดข้อผิดพลาด");
        }
      },
      triggerError(message) {
        this.errorMessage = message;
        this.showError = true;
        setTimeout(() => {
          this.showError = false; // ซ่อน Popup หลังจาก 1 วินาที
        }, 1000);
      },
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
  </style>
  