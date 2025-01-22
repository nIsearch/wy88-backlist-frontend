<template>
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
      v-if="isVisible"
      @click.self="closePopup" 
    >
      <div class="text-center w-[360px] mx-auto bg-[#252525] p-6 rounded">
        
        <p v-if="!isSuccess" class="text-l font-bold mb-4 text-center ">
          <span class="text-xl text-center font-bold mb-4">ยืนยันการลบ</span> <br><br>
          คุณต้องการลบพนักงาน <span class="font-semibold text-red-600">  {{ username  }}</span> ใช่หรือไม่?
        </p>
        
        <p v-else class="text-l font-bold mb-4 text-center ">
          <span class="text-xl text-center font-bold mb-4 text-white">ลบข้อมูลสำเร็จ!</span> <br><br>
           ลบพนักงาน ID: <span class="font-semibold text-red-600">{{ username  }} </span> สำเร็จ 
        </p>
        <div class="flex justify-center items-center mb-4">
          <img src="assets\images\Group 43.png" alt="" class="w-20 h-20 mb-4" />
        </div>
        <div class="flex justify-center gap-4">

          <button
            v-if="!isSuccess"
            @click="cancelDelete"
            class="px-8 py-2 bg-gray-400 text-white rounded-[8px] hover:bg-gray-600"
          >
            ยกเลิก
          </button>
          <button
            v-if="!isSuccess"
            @click="confirmDelete"
            class="px-8 py-2 bg-[#BA0101] text-white rounded-[8px] hover:bg-[#771a1a]"
          >
            ยืนยัน
          </button>
          <button
            v-else
            @click="closePopup"
            class="px-10 py-2 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded hover:bg-blue-700"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: [Number, null],
    required: true,
  },
  username: {
    type: String, // เพิ่ม username เป็น props
    required: true,
  },
});


  
  const emits = defineEmits(["confirm", "cancel", "close"]);
  
  const isSuccess = ref(false); // ควบคุมสถานะสำเร็จ
  
  const confirmDelete = () => {
    emits("confirm");
    isSuccess.value = true; // แสดงข้อความสำเร็จ
  };
  
  const cancelDelete = () => {
    emits("cancel");
    
  };
  
  const closePopup = () => {
    isSuccess.value = false; // รีเซ็ตสถานะสำเร็จ
    emits("close");
    window.location.reload(); // รีเฟรชหน้า
  };
  </script>
  
  <style scoped>
  /* เพิ่ม CSS ถ้าจำเป็น */
  </style>
  