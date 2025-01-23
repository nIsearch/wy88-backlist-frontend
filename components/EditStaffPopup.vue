<template> 
  <div
    class="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center"
    v-if="isVisible"
    @click.self="closePopup"
  >
    <div
      class="bg-[#252525] p-6 rounded-lg mx-3 shadow-lg w-full md:w-2/3 lg:w-2/3"
    >
      <!-- แสดงข้อความสำเร็จ -->
      <div
        v-if="isSuccess"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center rounded-[15px]"
      >
        <div class="text-center w-[400px] mx-auto bg-[#252525] p-6 rounded-[15px]">
          <h2 class="text-white">แก้ไขพนักงาน สำเร็จ</h2>
          <h2 class="text-lg font-bold mb-6 text-white">
            การแก้ไขพนักงานชื่อ
            <span class="font-semibold text-red-600">{{
              formData.username
            }}</span
            > สำเร็จ
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

      <!-- แสดงฟอร์มแก้ไข -->
      <div v-else>
        <h2 class="text-2xl font-bold mb-4 text-center text-white">
          แก้ไขข้อมูลพนักงาน :
          <span class="font-semibold text-red-600">{{
            formData.username
          }}</span>
        </h2>
        <div class="text-left mb-2">
          <span class="text-xl">
            ฟอร์มแก้ไขข้อมูล <span class="text-xl text-[#ED9200]">พนักงาน</span>
          </span>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4 text-left">
            <label for="username" class="block font-bold text-lg mb-2"
              >ชื่อผู้ใช้ :</label
            >
            <input
              id="username"
              v-model="formData.username"
              class="w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#8D8D8D]"
            />
          </div>
          <div class="mb-4 text-left">
            <label for="pwd" class="block font-bold text-lg mb-2"
              >รหัสผ่าน :</label
            >
            <input
              id="pwd"
              v-model="formData.pwd"
              class="w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#8D8D8D]"
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
                  'bg-[#8A8a8A]': formData.project_ids.includes(project.id),
                  'bg-[#8D8D8D] text-white': !formData.project_ids.includes(
                    project.id
                  ),
                }"
                @click="toggleProjectSelection(project.id)"
              >
                <!-- Label -->
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-md border-2 transition duration-300"
                  :class="{
                    'bg-[#009C12] border-[#009C12]': formData.project_ids.includes(project.id),
                    'bg-[#cbcbcb] border-gray-500': !formData.project_ids.includes(project.id),
                  }"
                >
                  <!-- Icon -->
                  <svg
                    v-if="formData.project_ids.includes(project.id)"
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
          <div class="flex justify-center gap-4 mt-8">
            <button
              type="button"
              class="px-10 py-2 bg-[#8A8A8A] text-white rounded-[10px] hover:bg-gray-600"
              @click="cancelEdit"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-10 py-2 bg-[#009C12] text-white rounded-[10px] hover:bg-[#1d7527]"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  staffId: { type: [Number, null], required: true },
  staffData: { type: Object, required: true },
});

const emits = defineEmits(["close", "save"]);

const formData = ref({
  username: "",
  pwd: "",
  project_ids: [],
});

const isLoading = ref(true);
const isSuccess = ref(false);
const projects = ref([]);

// ดึงข้อมูลโปรเจค
const fetchProjects = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/black-list-user/back-end/project-list",
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch projects");

    const data = await response.json();
    projects.value = data.result_data.data;
    syncSelectedProjects();
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการดึงข้อมูลโปรเจค");
  } finally {
    isLoading.value = false;
  }
};

const syncSelectedProjects = () => {
  if (!props.staffData || !props.staffData.project_name) return;

  const projectNames = props.staffData.project_name
    .split(" , ")
    .map((name) => name.trim());

  formData.value.project_ids = projects.value
    .filter((project) => projectNames.includes(project.name))
    .map((project) => project.id);
};

const toggleProjectSelection = (projectId) => {
  if (formData.value.project_ids.includes(projectId)) {
    formData.value.project_ids = formData.value.project_ids.filter(
      (id) => id !== projectId
    );
  } else {
    formData.value.project_ids.push(projectId);
  }
};

watch(
  () => props.staffData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
      syncSelectedProjects();
    }
  },
  { immediate: true }
);

onMounted(fetchProjects);

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("access_token");
    let verifyAdmin = localStorage.getItem("full_name");

    if (!token || !verifyAdmin) {
      alert("Access Token หรือข้อมูล verify_admin ไม่พบ");
      return;
    }

    const projectNames = formData.value.project_ids
      .map((id) => {
        const project = projects.value.find((p) => p.id === id);
        return project ? project.name : null;
      })
      .filter((name) => name !== null)
      .join(" , ");

    const response = await fetch(
      "http://127.0.0.1:8000/black-list-user/back-end/edit-staff",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          verify_admin: verifyAdmin,
        },
        body: JSON.stringify({
          id: props.staffId,
          username: formData.value.username,
          pwd: formData.value.pwd,
          project_name: projectNames,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("API Error Response:", errorData);
      alert(
        `เกิดข้อผิดพลาด: ${errorData.message || "ไม่สามารถบันทึกข้อมูลได้"}`
      );
      return;
    }

    isSuccess.value = true;
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
  }
};

const closePopup = () => {
  isSuccess.value = false;
  emits("close");
  window.location.reload();
};

const cancelEdit = () => {
  emits("close");
};
</script>

<style scoped>
/* เพิ่ม CSS หากต้องการ */
</style>
