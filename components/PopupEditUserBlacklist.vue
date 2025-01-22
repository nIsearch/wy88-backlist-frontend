<template>
  <!-- Popup หลักสำหรับแก้ไขข้อมูล -->
  <div
    v-if="isPopupVisible"
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    @click.self="closeEditPopup"
  >
    <div
      class="bg-[#252525] p-6 rounded-lg mx-3 shadow-lg w-full md:w-2/3 lg:w-1/3"
    >
      <div class="text-center mb-4">
        <p class="text-2xl font-bold">ฟอร์มแก้ไขข้อมูลผู้ใช้</p>
        <p class="text-white text-left">
          ฟอร์มแก้ไขข้อมูล <code class="text-lg text-[#ED9200]">แบล็คลีส</code>
        </p>
      </div>
      <div v-if="Object.keys(userData).length > 0" class="card-body">
        <form id="dataForm" @submit.prevent="handleDataFormSubmit">
          <div class="form-group mb-4">
            <label class="block text-left mb-1">ชื่อผู้ใช้:</label>
            <input
              class="form-control w-full p-2 border rounded"
              placeholder="กรอกชื่อผู้ใช้"
              type="text"
              v-model="userData.username"
              required
              style="background-color: #8a8a8a; color: #fff"
            />
          </div>
          <div class="form-group mb-4">
            <label class="block text-left mb-1">รายละเอียด:</label>
            <textarea
              class="form-control w-full p-2 border rounded"
              placeholder="กรอกรายละเอียด"
              rows="5"
              v-model="userData.detail"
              required
              style="background-color: #8a8a8a; color: #fff"
            ></textarea>
          </div>
          <div class="form-group mb-4">
            <div class="input-group mb-3">
              <label class="input-group-text" for="inputGroupSelect01"
                >สถานะ</label
              >
              <select
                v-model="userData.status"
                class="form-select"
                id="inputGroupSelect01"
                style="background-color: #8a8a8a; color: #fff"
              >
                <option
                  v-for="status in statusOptions"
                  :key="status.id"
                  :value="status.id"
                >
                  {{ status.status_name }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-end mt-8">

            <button
              type="button"
              class=" px-4 py-2 mr-4 bg-gray-500 text-white rounded hover:bg-gray-700"
              @click="handleClose"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class=" px-4 py-2 bg-[#009C12] text-white rounded hover:bg-[#1c8b29]"
              :disabled="isLoading"
            >
              <span v-if="isLoading">กำลังบันทึก...</span>
              <span v-else>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Popup แสดงข้อความสำเร็จ -->
  <div
    v-if="isSuccessPopupVisible"
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    @click.self="closeSuccessPopup"
  >
    <div class="text-center w-[300px] mx-auto bg-[#252525] p-6 rounded-lg">
      <h2 class=" font-semibold text-white mb-4">บันทึกข้อมูลสำเร็จ</h2>
      <div class="flex justify-center items-center mb-4">
                        <img
                          src="assets\images\check 1.png"
                          alt="Cloud Icon"
                          class="w-20 h-20 mb-4"
                        />
                      </div>
      <button
        class="mb-4 px-10 py-2 bg-gradient-to-b from-[#Ed9200] to-[#FC6900] text-white rounded hover:bg-blue-700"
        @click="closeSuccessPopup"
      >
        ตกลง
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  userId: Number,
  userData: Object,
});

const emit = defineEmits(["close"]);
const isPopupVisible = ref(true);
const isSuccessPopupVisible = ref(false);
const isLoading = ref(false);
const statusOptions = ref([]);

const handleClose = () => {
  emit("close");
  isPopupVisible.value = false;
};

const fetchStatusOptions = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/black-list-user/back-end/status-user"
    );
    if (!response.ok) throw new Error("Failed to fetch status options");
    const data = await response.json();
    statusOptions.value = data.result_data.data;
  } catch (error) {
    alert(`Error fetching status options: ${error.message}`);
  }
};

const handleDataFormSubmit = async () => {
  isLoading.value = true;

  const verifyAdmin = (() => {
    let fullName = localStorage.getItem("full_name") || "unknown";
    if (fullName.startsWith('"') && fullName.endsWith('"')) {
      fullName = fullName.slice(1, -1);
    }
    return fullName;
  })();
  try {
    const token = localStorage.getItem("access_token"); // ดึง Token จาก localStorage
    if (!token) throw new Error("Token not found. Please log in again.");

    const response = await fetch(
      "http://127.0.0.1:8000/black-list-user/back-end/edit-user-list",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ใช้ตัวแปร token ที่ถูกต้อง
          verify_admin: verifyAdmin,
        },
        body: JSON.stringify({
          id: props.userId,
          username: props.userData.username,
          detail: props.userData.detail,
          status: props.userData.status,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please check your credentials.");
      }
      throw new Error("Failed to update user data");
    }

    const responseData = await response.json();

    // แสดง Popup สำเร็จ
    isSuccessPopupVisible.value = true;
    isPopupVisible.value = false;
  } catch (error) {
    alert(`Error updating user data: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

const closeEditPopup = () => {
  // ตรวจสอบและตั้งค่าสถานะให้แน่ใจว่า Popup ถูกปิด
  if (isPopupVisible.value) {
    isPopupVisible.value = false; // ปิด Popup
    emit("close"); // ส่ง event ไปยังหน้าหลัก (หากต้องการ)
  }
};

const openPopup = () => {
  // ฟังก์ชันสำหรับเปิด Popup
  isPopupVisible.value = true;
};

const closeSuccessPopup = () => {
  isSuccessPopupVisible.value = false;
  window.location.reload(); // รีเฟรชหน้า
};
onMounted(fetchStatusOptions);
</script>
<style scoped>
label.input-group-text {
    background: #0e0e0e;
    color: white;
}
</style>