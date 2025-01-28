<template>
  <div
    class="fixed inset-0  bg-black bg-opacity-50 z-50 flex justify-center items-center"
    @click.self="closePopup"
  >
    <div
      class="bg-[url(/images/bgpu.png)] bg-cover bg-no-repeat px-4 py-6 w-[870px] "
    >
      <div v-if="!isSubmitted">
        <div class="card-header text-center mb-4">
          <h2 class="text-white">AddProject</h2>

          <p class="text-white text-left">
            Form Add <span class="text-lg text-[#009C12]">Project</span>
          </p>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="projectName" class="block text-sm font-bold mb-2"
              >ProjectName :</label
            >
            <input
              id="projectName"
              v-model="projectName"
              class="w-full p-2 border border-red-900 bg-[#000000] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="py-2 px-[61px] bg-[url(/images/C.png)] bg-cover bg-no-repeat text-white  hover:bg-blue-600"
              @click="closePopup"
            > 
            Cancel
            </button>
            <button
              type="submit"
              class="py-2 px-[67px] bg-[url(/images/Cc.png)] bg-cover bg-no-repeat text-white  hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div
        v-else
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center "
      >
      <div class="text-center w-[300px] mx-auto bg-[url(/images/bgpop.png)] bg-contain bg-no-repeat p-6">
        <h2 class="text-4xl font-bold text-white mb-4">เพิ่มโปรเจคสำเร็จ</h2>
        <div class="flex justify-center items-center mb-4">
          <img src="assets/images/Group 41.png" alt="" class="w-20 h-20 mb-4" />
        </div>
        <button
          class="py-2 mb-4 px-[72px] bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white hover:bg-blue-600"
          @click="closePopup"
        >
          Ok
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
