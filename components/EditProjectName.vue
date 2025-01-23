<script setup>
import { ref } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const isSaving = ref(false); // สถานะบันทึกข้อมูล
const apiResponse = ref(""); // ข้อความตอบกลับจาก API
const isSuccessPopupVisible = ref(false); // สถานะแสดง Popup สำเร็จ

const handleSave = async () => {
  isSaving.value = true;
  let verifyAdmin = localStorage.getItem("full_name");
  const accessToken = localStorage.getItem("access_token");

  if (verifyAdmin && verifyAdmin.startsWith('"') && verifyAdmin.endsWith('"')) {
    verifyAdmin = verifyAdmin.slice(1, -1); // ลบเครื่องหมายคำพูดออก
  }

  if (!verifyAdmin || !accessToken) {
    apiResponse.value = "เกิดข้อผิดพลาด: ไม่พบข้อมูลการตรวจสอบในระบบ";
    isSaving.value = false;
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/black-list-user/back-end/edit-project-list", {
      method: "PUT",
      headers: {
        "verify_admin": verifyAdmin,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.project.id,
        name: props.project.name,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      apiResponse.value = "บันทึกสำเร็จ!";
      isSuccessPopupVisible.value = true; // แสดง Popup สำเร็จ
    } else {
      const errorResult = await response.json();
      apiResponse.value = `เกิดข้อผิดพลาด: ${errorResult.message}`;
    }
  } catch (error) {
    apiResponse.value = `เกิดข้อผิดพลาด: ${error.message}`;
  } finally {
    isSaving.value = false;
  }
};

const handleClose = () => {
  emit("close"); // ปิด Popup
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};

const closeSuccessPopup = () => {
  isSuccessPopupVisible.value = false; // ซ่อน Popup สำเร็จ
  emit("close"); // ปิด Popup หลัก
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black  bg-opacity-30 z-50 flex justify-center items-center"
    @click="handleOverlayClick"
  >
    <div class="bg-[#252525] p-6 rounded-[15px] mx-3 shadow-lg w-full md:w-2/3 lg:w-1/3">
      <h2 class="font-bold mb-4 text-white">แก้ไขโปรเจค</h2>
      <div>
        <label class="block text-left mb-2">ชื่อโปรเจค:</label>
        <input
          v-model="project.name"
          type="text"
          class="w-full p-2 border rounded-lg bg-[#8D8D8D]"
        />
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button
          class="py-2 px-10 bg-[#8D8D8D] text-white rounded-[8px] hover:bg-gray-600"
          @click="handleClose"
          :disabled="isSaving"
        >
          ยกเลิก
        </button>
        <button
          class="py-2 px-10 bg-[#009C12] text-white rounded-[8px] hover:bg-[#268327]"
          @click="handleSave"
          :disabled="isSaving"
        >
          <span v-if="isSaving">กำลังบันทึก...</span>
          <span v-else>บันทึก</span>
        </button>
      </div>
      <div v-if="apiResponse" class="mt-4 text-sm text-center">
        <p :class="{'text-green-500': apiResponse === 'บันทึกสำเร็จ!', 'text-red-500': apiResponse.includes('เกิดข้อผิดพลาด')}">
          {{ apiResponse }}
        </p>
      </div>
    </div>
  </div>

  <!-- Popup สำเร็จ -->
  <div
    v-if="isSuccessPopupVisible"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
  >
    <div class="text-center w-[300px] mx-auto bg-[#252525] p-6 rounded-[15px]">
      <h2 class="text-2xl text-white mb-4">แก้ไขโปรเจคสำเร็จ</h2>
      <div class="flex justify-center items-center mb-4">
          <img src="assets\images\Edit_Success_Icon.png" alt="" class="w-20 h-20 mb-4" />
        </div>
      <button
        class="mb-4 px-10 py-2 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded-[8px]"
        @click="closeSuccessPopup"
      >
        ตกลง
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
