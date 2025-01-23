<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    v-if="isVisible"
    @click.self="closePopup"
  >
    <div
      class="bg-[#252525] p-6 rounded-lg mx-3 shadow-lg w-full md:w-2/3 lg:w-2/3"
    >
      <div v-if="!isSuccess">
        <div class="card-header text-center mb-4">
          <h2 class="font-bold text-white">เพิ่มพนักงาน</h2>
          <p class="text-white text-left">
            ฟอร์มแก้ไขข้อมูล
            <code class="text-lg text-[#ED9200]">พนักงาน</code>
          </p>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="username" class="block text-sm font-bold mb-2"
              >ชื่อผู้ใช้ :</label
            >
            <input
              id="username"
              v-model="formData.username"
              class="w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#8D8D8D] placeholder-white"
              required
              placeholder="ชื่อผู้ใช้"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-bold mb-2"
              >รหัสผ่าน :</label
            >
            <input
              id="password"
              v-model="formData.password"
              type="text"
              class="w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#8D8D8D] placeholder-white"
              required
              placeholder="รหัสผ่าน"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2 text-left mt-10"
              >โปรเจค :</label
            >
            <div v-if="isLoading" class="text-white">Loading...</div>
            <div v-else class="flex flex-wrap gap-4 text-white">
              <div
                v-for="project in projects"
                :key="project.id"
                class="flex items-center gap-2 px-2 py-1 rounded-lg shadow-sm text-white hover:bg-[#8D8D8D] transition duration-300 cursor-pointer"
                :class="{
                  'bg-[#8A8a8A]': selectedProjects.includes(project.id),
                  'bg-[#8D8D8D] text-white': !selectedProjects.includes(
                    project.id
                  ),
                }"
                @click="toggleProjectSelection(project.id)"
              >
                <!-- Label -->
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-md border-2 transition duration-300"
                  :class="{
                    'bg-[#009C12] border-[#009C12]': selectedProjects.includes(
                      project.id
                    ),
                    'bg-[#cbcbcb] border-gray-500': !selectedProjects.includes(
                      project.id
                    ),
                  }"
                >
                  <!-- Icon -->
                  <svg
                    v-if="selectedProjects.includes(project.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="4"
                    stroke="white"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <!-- Project Name -->
                <span class="text-sm text-white font-medium">{{
                  project.name
                }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-2 mt-8">
            <button
              @click="closePopup"
              type="button"
              class="py-2 px-10 bg-[#8D8D8D] text-white rounded-[8px] hover:bg-gray-600"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="py-2 px-10 bg-[#009C12] text-white rounded-[10px] hover:bg-[#259e34]"
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
        <div class="text-center w-[400px] mx-auto bg-[#252525] p-6 rounded-[15px]">
          <h2 class="text-white">เพิ่มพนักงานสำเร็จ</h2>
          <h2 class="text-lg font-bold mb-6 text-white">
            การเพิ่มพนักงานสำเร็จ
          </h2>
          <div class="flex justify-center items-center mb-4">
            <img
              src="assets\images\Admember_Success.png"
              alt=""
              class="w-20 h-20 mb-4"
            />
          </div>
          <div class="text-center">
            <button
              class="py-2 px-10 text-center mb-5 items-center bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded-[10px] hover:bg-blue-600"
              @click="closePopup"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["close", "save"]);

const formData = ref({
  username: "",
  password: "",
  role: "",
});

const projects = ref([]);
const selectedProjects = ref([]);
const isLoading = ref(true);
const isSuccess = ref(false);

const loadProjects = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/black-list-user/back-end/project-list"
    );
    const data = await response.json();
    projects.value = data?.result_data?.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  const selectedProjectNames = projects.value
    .filter((project) => selectedProjects.value.includes(project.id))
    .map((project) => project.name);

  emits("save", {
    ...formData.value,
    role: selectedProjectNames.join(" ,  "), // แปลงเป็นชื่อโปรเจค
  });

  formData.value = { username: "", password: "", role: "" };
  selectedProjects.value = [];
  isSuccess.value = true;
};

const closePopup = () => {
  isSuccess.value = false;
  emits("close");
  window.location.reload();
};

onMounted(() => {
  loadProjects();
});

const toggleProjectSelection = (projectId) => {
  if (selectedProjects.value.includes(projectId)) {
    selectedProjects.value = selectedProjects.value.filter(
      (id) => id !== projectId
    );
  } else {
    selectedProjects.value.push(projectId);
  }
};
</script>

<style scoped>
/* เพิ่ม Transition และการ Hover สำหรับ Checkbox */
</style>
