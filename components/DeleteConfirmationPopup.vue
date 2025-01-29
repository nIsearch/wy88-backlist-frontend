<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center "
    v-if="isVisible"
    @click.self="closePopup"
  >
    <div class="text-center w-[450px] mx-auto bg-[url(/images/bgpop.png)] bg-cover bg-no-repeat p-12 border-2 border-red-800">
      <p v-if="!isSuccess" class="text-l font-bold text-center">
        <span class="text-4xl text-center font-bold">Confirm Deletion</span> <br />
        Delete an Employee <span class="font-semibold text-red-600">{{ username }}</span> ?
      </p>

      <p v-else class="text-l font-bold mb-4 text-center">
        <span class="text-4xl text-center font-bold mb-4 text-white"> Deleted Successfully</span> <br />
        Delete Name <span class="font-semibold text-red-600">{{ username }}</span> Successfully
      </p>

      <!-- เงื่อนไขแสดงรูปภาพ -->
      <div class="flex justify-center items-center mb-4">
        <img
          v-if="!isSuccess"
          src="assets\images\Group 43.png"
          alt="Confirm Delete"
          class="w-20 h-20 mb-4"
        />
        <img
          v-else
          src="assets\images\Admember_Success.png"
          alt="Delete Success"
          class="w-20 h-20 mb-4"
        />
      </div>

      <div class="flex justify-center gap-2">
        <button 
          v-if="!isSuccess"
          @click="cancelDelete"
          class="py-2 px-[61px] bg-[url(/images/C.png)] bg-cover bg-no-repeat text-white  hover:bg-blue-600"
        >
          Cancel
        </button>
        <button
          v-if="!isSuccess"
          @click="confirmDelete"
          class="py-2 px-[71px] bg-[url(/images/d.png)] bg-cover bg-no-repeat text-white  hover:bg-blue-600"
        >
          OK
        </button>
        <button
          v-else
          @click="closePopup"
          class="py-2 px-[71px] bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white hover:bg-red-600"
        >
          Ok
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
  