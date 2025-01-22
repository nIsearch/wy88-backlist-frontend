<template>
    <div v-if="visible" class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
      {{ message }}
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const visible = ref(false);
  const message = ref('');
  
  export function showNotification(msg) {
    message.value = msg;
    visible.value = true;
    setTimeout(() => (visible.value = false), 3000); // ซ่อนข้อความหลัง 3 วินาที
  }
  </script>
  
  <style scoped>
  /* Custom CSS (ถ้าจำเป็น) */
  </style>
  