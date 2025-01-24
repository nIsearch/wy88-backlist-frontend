<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    @click.self="closePopup"
  >
    <div
      class="bg-[#252525] p-6 rounded-lg mx-3 shadow-lg w-full md:w-2/3 lg:w-1/3"
    >
      <div v-if="!isSubmitted">
        <div class="card-header text-center mb-4">
          <h2 class="text-white">เพิ่มโปรเจค</h2>

          <p class="text-white text-left">
            ฟอร์มเพิ่มข้อมูล <span class="text-lg text-[#009C12]">โปรเจค</span>
          </p>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="projectName" class="block text-sm font-bold mb-2"
              >ชื่อโปรเจค :</label
            >
            <input
              id="projectName"
              v-model="projectName"
              class="w-full p-2 border bg-[#8D8D8D] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="py-2 px-10 bg-[#8D8D8D] text-white rounded-[8px] hover:bg-gray-600"
              @click="closePopup"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="py-2 px-10 bg-[#009C12] text-white rounded-[8px] hover:bg-[#268327]"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>

      <div
        v-else
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
      >
      <div class="text-center w-[300px] mx-auto bg-[#252525] p-6 rounded-[15px]">
        <h2 class="text-4xl font-bold text-white mb-4">เพิ่มโปรเจคสำเร็จ</h2>
        <div class="flex justify-center items-center mb-4">
          <img src="assets/images/Group 41.png" alt="" class="w-20 h-20 mb-4" />
        </div>
        <button
          class="py-2 mb-4 px-12 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded-[8px] hover:bg-blue-600"
          @click="closePopup"
        >
          ตกลง
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// ประกาศ emit
const emit = defineEmits(["close", "project-added"]);

const projectName = ref("");
const isSubmitted = ref(false);

const closePopup = () => {
  emit("close"); // ใช้ emit เพื่อส่ง event 'close' กลับไปยังหน้าหลัก
  isSubmitted.value = false;
};

const handleSubmit = async () => {
  const verifyAdmin = localStorage.getItem("full_name")?.replace(/^"|"$/g, ""); // เอาค่าจาก localStorage
  const accessToken = localStorage.getItem("access_token");

  if (!verifyAdmin || !accessToken) {
    alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลการตรวจสอบในระบบ");
    return;
  }

  try {
    // เรียก API เพื่อเพิ่มโปรเจค
    const response = await fetch(
      `http://127.0.0.1:8000/black-list-user/back-end/add-project-list?project_name=${encodeURIComponent(
        projectName.value
      )}`,
      {
        method: "POST",
        headers: {
          verify_admin: verifyAdmin,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("เพิ่มโปรเจคสำเร็จ:", result);
      isSubmitted.value = true;

      // แจ้งให้หน้าหลักรู้ว่ามีการเพิ่มโปรเจคสำเร็จ
      emit("project-added", projectName.value);
    } else {
      const errorResult = await response.json();
      alert(`เกิดข้อผิดพลาด: ${JSON.stringify(errorResult)}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
};
</script>
