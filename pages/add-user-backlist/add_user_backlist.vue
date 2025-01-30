<template>
  <div class="flex space-x-1 text-white">
    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector1.png)] bg-cover bg-no-repeat pl-2 pr-[40px]"
    >
      AddUserName
    </p>

    <p
      class="text-[#ffffff] text-xl bg-[url(/images/Vector2.png)] bg-contain bg-no-repeat pl-5 pr-[25px]"
    >
      <span class="text-[#990002]">Home </span> > AddUser
    </p>
  </div>
  <div class="container mx-auto p-4">
    <div class="content">
      <!-- [ Main Content ] start -->
      <div class="grid grid-cols-1 gap-4">
        <!-- [ sample-page ] start -->
        <div class="col-span-1">
          <div class="rounded-lg">
            <div class="p-4">
              <div class="py-10 text-white">
                <div class="px-0 lg:px-10">
                  <h2 class="text-white text-center">
                    Users can be added via file upload.
                  </h2>
                  <p class="text-2xl">
                    Can only be uploaded as an
                    <code class="text-2xl text-[#ED9200]">Excel</code> file.
                  </p>
                  <!-- ฟอร์มอัปโหลดไฟล์ -->
                  <!-- ฟอร์มอัปโหลดไฟล์ -->
                  <form
                    id="excelForm"
                    @submit.prevent="openConfirmationModal"
                    class="flex items-center"
                  >
                    <!-- ปุ่มเลือกไฟล์ -->
                    <label
                      for="fileInput"
                      class="bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white px-5 lg:px-[50px] hover:bg-red-800 py-2 mr-2 lg:mr-4 cursor-pointer"
                    >
                      Select File</label
                    >
                    <input
                      id="fileInput"
                      ref="fileInputRef"
                      type="file"
                      class="hidden"
                      accept=".xlsx, .xls"
                      @change="onFileSelected"
                      required
                    />
                    <!-- แสดงชื่อไฟล์ -->
                    <span
                      v-if="uploadedFileName"
                      class="flex-grow bg-[url(/images/Hud.png)] bg-contain bg-no-repeat text-white px-6 py-4"
                      >{{ uploadedFileName }}</span
                    >
                    <span
                      v-else
                      class="flex-grow bg-[url(/images/Hud.png)] bg-contain bg-no-repeat text-white px-6 py-4"
                      >File not selected</span
                    >
                    <!-- ปุ่มบันทึก -->
                    <button
                      type="submit"
                      class="bg-[url(/images/Cc.png)] ml-2 bg-cover bg-no-repeat text-white px-[59px] hover:bg-red-700 py-2"
                    >
                      Upload
                    </button>
                  </form>

                  <!-- Popup ยืนยันการอัปโหลด -->
                  <div
                    v-if="showConfirmationModal"
                    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                  >
                    <div
                      class="bg-[url(/images/bgpop.png)] bg-cover bg-no-repeat px-4 py-6 w-[470px] mx-auto border-[2px] border-red-700"
                    >
                      <h2 class="text-white text-center font-bold mt-4">
                        Confirm file upload
                      </h2>
                      <p class="text-[#009C12] text-center mt-2">
                        File Name: {{ uploadedFileName }}
                      </p>
                      <div class="flex justify-center items-center mb-4">
                        <img
                          src="assets/images/cloud-computing 1.png"
                          alt="Cloud Icon"
                          class="w-20 h-20 mb-4"
                        />
                      </div>
                      <div class="flex justify-center mt-4 gap-2 mb-4">
                        <button
                          class="py-2 px-[61px] bg-[url(/images/C.png)] bg-cover bg-no-repeat text-white hover:bg-blue-600"
                          @click="cancelUpload"
                        >
                          Cansel
                        </button>
                        <button
                          class="py-2 px-[71px] bg-[url(/images/Cc.png)] bg-cover bg-no-repeat text-white hover:bg-blue-600"
                          @click="confirmUpload"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="container text-white bg-[url(/images/b2.png)] bg-cover bg-no-repeat py-8 border-2 border-red-900"
              >
                <div class="px-5 pb-2">
                  <h2 class="text-white text-center">Add User Form</h2>
                  <span class="text-2xl text-white">
                    Add User

                    <span class="text-[#ED9200]">Blaclist</span>
                  </span>
                </div>
                <div class="text-white px-5">
                  <div class="row">
                    <div class="col-md-12">
                      <form
                        id="dataForm"
                        @submit.prevent="handleDataFormSubmit"
                      >
                        <div class="form-group">
                          <div class="text-white">
                            <label class="mb-1">UserName : </label>
                          </div>

                          <input
                            class="form-control"
                            type="text"
                            v-model="usernameRef"
                            required
                            style="
                              background-color: #000;
                              color: #fff;
                              border-color: #ee1212;
                            "
                          />
                        </div>
                        <div class="form-group">
                          <label class="block mb-1">Project :</label>
                          <div v-if="isLoading" class="text-gray-500">
                            Loading...
                          </div>
                          <div v-else class="flex flex-wrap gap-2">
                            <div
                              v-for="project in projects"
                              :key="project.id"
                              class="flex items-center gap-2 bg-transition pr-4 py-1 pl-1 rounded-lg shadow-sm transition duration-300"
                            >
                              <!-- Checkbox -->
                              <input
                                type="checkbox"
                                :id="'project-' + project.id"
                                :value="project.name"
                                v-model="selectedProjects"
                                class="hidden peer"
                              />
                              <!-- Label -->
                              <label
                                :for="'project-' + project.id"
                                class="flex items-center justify-center w-10 h-10 rounded-md border-2 transition duration-300 peer-checked:bg-red-700 peer-checked:border-red-700 bg-[#000] border-red-700 hover:border-green-700"
                              >
                                <!-- Icon -->
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="4"
                                  stroke="white"
                                  class="w-8 h-8 hidden peer-checked:block"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </label>
                              <!-- Project Name -->
                              <span class="text-sm text-white font-medium">{{
                                project.name
                              }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="form-group text-white">
                          <label class="">Details :</label>
                          <textarea
                            class="form-control"
                            rows="5"
                            v-model="detailRef"
                            required
                            style="
                              background-color: #000;
                              color: #fff;
                              border-color: #ee1212;
                            "
                          ></textarea>
                        </div>
                        <div class="text-center">
                          <button
                            type="submit"
                            class="bg-[url(/images/Cc.png)] ml-2 bg-cover bg-no-repeat text-white px-[66px] hover:bg-red-700 py-2 mb-4 text-center"
                            :disabled="isLoading"
                          >
                            Save
                          </button>
                        </div>
                      </form>

                      <!-- Popup Modal -->
                      <div
                        v-if="showModal"
                        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                      >
                        <div
                          class="bg-[url(/images/bgpop.png)] bg-cover bg-no-repeat px-4 py-6 w-[470px] mx-auto border-[2px] border-red-700"
                        >
                          <div v-if="isLoading">
                            <div
                              class="flex items-center justify-center space-x-2 mb-4"
                            >
                              <svg
                                class="animate-spin h-6 w-6 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  class="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  stroke-width="4"
                                ></circle>
                                <path
                                  class="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                ></path>
                              </svg>
                              <span class="text-white font-bold"
                                >Sending data...</span
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div class="text-green-500 mb-4">
                              <h2 class="text-white text-center font-bold mt-4">
                                Saved successfully
                              </h2>
                            </div>
                            <div
                              v-if="!isFormSubmission"
                              class="text-center text-[#009C12] text-sm"
                            >
                              File:

                              <span class="font-bold">
                                {{ uploadedFileName }}
                              </span>
                            </div>

                            <br />
                            <div
                              class="flex justify-center items-center h-full"
                            >
                              <span
                                class="text-[#009C12] text-sm whitespace-pre-wrap text-center"
                              >
                                {{ apiResponse }}
                              </span>
                            </div>

                            <div class="flex justify-center items-center mb-4">
                              <img
                                src="assets\images\check 1.png"
                                alt="Cloud Icon"
                                class="w-20 h-20"
                              />
                            </div>

                            <div
                              class="flex justify-center items-center h-full pb-3"
                            >
                              <button
                                class="py-2 px-[71px] bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white hover:bg-red-600"
                                @click="closeModal"
                              >
                                Ok
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- [ sample-page ] end -->
      </div>
      <!-- [ Main Content ] end -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx";
import axios from "axios";

axios.interceptors.response.use(
  (response) => response, // หากไม่มีปัญหา
  (error) => {
    // ตรวจสอบข้อความข้อผิดพลาด
    if (
      error.message.includes("setRequestHeader") ||
      error.response?.status === 401
    ) {
      console.error(
        "Redirecting to login due to invalid token or 401 Unauthorized."
      );
      // ลบ Token และเวลาหมดอายุ
      //localStorage.removeItem('access_token');
      //localStorage.removeItem('token_expiry');
      localStorage.clear();
      // รีไดเรกต์ไปหน้าเข้าสู่ระบบ
      window.location.href = "/login-page/login";
    }
    return Promise.reject(error);
  }
);
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Add User Blacklist",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "keywords", content: "" },
    { name: "description", content: "AddUserBlacklist" },
  ],
});

const apiResponse = ref("");
const isLoading = ref(false);
const showModal = ref(false);
const isSuccess = ref(false);
const fileInputRef = ref(null);
const usernameRef = ref("");
const detailRef = ref("");
const selectedProjects = ref([]);
const projects = ref([]);
const accessToken = ref(null);

onMounted(async () => {
  accessToken.value = localStorage.getItem("access_token");
  if (!accessToken.value) {
    console.error("Access token is missing.");
    window.location.href = "/login-page/login";
  }
  await loadProjects();
});

const loadProjects = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(
      "https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/back-end/project-list"
    );
    const data = await response.json();
    projects.value = data?.result_data?.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    isLoading.value = false;
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resetForm = () => {
  usernameRef.value = "";
  detailRef.value = "";
  selectedProjects.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const isFormSubmission = ref(false); // true สำหรับฟอร์ม, false สำหรับไฟล์

const uploadedFileName = ref(""); // ตัวแปรสำหรับชื่อไฟล์ที่เลือก

const handleExcelFormSubmit = async () => {
  // ลบ event.preventDefault();

  const file = fileInputRef.value?.files[0];
  if (!file) {
    apiResponse.value = "กรุณาเลือกไฟล์ก่อนอัปโหลด.";
    return;
  }

  uploadedFileName.value = file.name; // เก็บชื่อไฟล์ที่อัปโหลด

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const domains = json
      .slice(1)
      .map((row) => ({
        username: row[0],
        detail: row[1],
        project_name: row[2],
      }))
      .filter((domain) => domain.username);

    isLoading.value = true;
    showModal.value = true;

    const verifyAdmin = (() => {
      let fullName = localStorage.getItem("full_name") || "unknown";
      if (fullName.startsWith('"') && fullName.endsWith('"')) {
        fullName = fullName.slice(1, -1);
      }
      return fullName;
    })();

    try {
      for (let i = 0; i < domains.length; i += 1000) {
        const batch = domains.slice(i, i + 1000);
        const is_last_batch = i + 1000 >= domains.length;

        const response = await fetch(
          "https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/fontend/upload-file-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.value}`,
              verify_admin: verifyAdmin,
            },
            body: JSON.stringify({ ListDomains: batch, is_last_batch }),
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        apiResponse.value =
          result.result_data?.message || "ไม่สามารถดึงข้อความได้.";
        await delay(1000);
      }
      isSuccess.value = true;
    } catch (error) {
      console.error("Error:", error);
      apiResponse.value = "เกิดข้อผิดพลาดในการส่งข้อมูล.";
      isSuccess.value = false;
    } finally {
      isLoading.value = false;
      resetForm();
    }
  };

  reader.readAsBinaryString(file);
};

const handleDataFormSubmit = async (event) => {
  event.preventDefault();
  isFormSubmission.value = true; // กำหนดว่าเป็นการกรอกฟอร์ม

  if (
    !usernameRef.value ||
    !detailRef.value ||
    selectedProjects.value.length === 0
  ) {
    apiResponse.value = "กรุณากรอกข้อมูลให้ครบถ้วน.";
    return;
  }

  const data = {
    ListDomains: [
      {
        username: usernameRef.value,
        detail: detailRef.value,
        project_name: selectedProjects.value.join(", "),
      },
    ],
    is_last_batch: true,
  };

  isLoading.value = true;
  showModal.value = true;

  const verifyAdmin = (() => {
    let fullName = localStorage.getItem("full_name") || "unknown";
    if (fullName.startsWith('"') && fullName.endsWith('"')) {
      fullName = fullName.slice(1, -1);
    }
    return fullName;
  })();

  try {
    const response = await fetch(
      "https://backlist-user-235021042402.asia-southeast1.run.app/black-list-user/fontend/upload-file-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.value}`,
          verify_admin: verifyAdmin,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    // Extract the message
    apiResponse.value =
      result.result_data?.message || "ไม่สามารถดึงข้อความได้.";
    isSuccess.value = true;
  } catch (error) {
    console.error("Error:", error);
    apiResponse.value = "เกิดข้อผิดพลาดในการส่งข้อมูล.";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
    resetForm();
  }
};

const closeModal = () => {
  showModal.value = false;
  window.location.reload();
};

// ยืนยันการส่ง ฟอร์ม อัพโหลด
const showConfirmationModal = ref(false); // ควบคุมการแสดงผล Popup ยืนยัน

const onFileSelected = () => {
  const file = fileInputRef.value?.files[0]; // รับไฟล์ที่เลือก
  uploadedFileName.value = file ? file.name : ""; // เก็บชื่อไฟล์
};

const openConfirmationModal = () => {
  if (!uploadedFileName.value) {
    alert("กรุณาเลือกไฟล์ก่อน!");
    return;
  }
  showConfirmationModal.value = true; // แสดง Popup ยืนยัน
};

const confirmUpload = async () => {
  showConfirmationModal.value = false; // ซ่อน Popup
  await handleExcelFormSubmit(); // ส่งไฟล์
};

const cancelUpload = () => {
  showConfirmationModal.value = false; // ซ่อน Popup
};
</script>

<style>
/* Add custom styles here if necessary */
/* สำหรับการจัดรูปแบบเพิ่มเติม */

label {
  cursor: pointer;
}

input[type="file"] {
  display: none;
}

input[type="checkbox"] {
  display: none; /* ซ่อน checkbox */
}

label {
  cursor: pointer;
}

/* เมื่อ checkbox ถูกเลือก */
input[type="checkbox"]:checked + label {
  background-color: #009c12; /* สีเขียว */
  border-color: #009c12; /* สีเขียว */
}

/* แสดงไอคอนเมื่อ checkbox ถูกเลือก */
input[type="checkbox"]:checked + label svg {
  display: block;
}

input::placeholder {
  color: white !important;
}

textarea::placeholder {
  color: white !important;
}
</style>
