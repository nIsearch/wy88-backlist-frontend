<template>
  <div class="bg-[#252525] shadow py-4">
    <div class="container">
      <div class="mb-6 rounded-md">
        <h2 class="text-2xl font-bold text-white">เพิ่มข้อมูลผู้ใช้แบล็คลีส</h2>
        <p class="text-[#ED9200]">หน้าแรก</p>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-4">
    <div class="content">
      <!-- [ Main Content ] start -->
      <div class="grid grid-cols-1 gap-4">
        <!-- [ sample-page ] start -->
        <div class="col-span-1 ">
          <div class=" rounded-lg ">
            <div class="p-4 py-5">
              <div class="py-10 text-white" style="background-color: #2B2B2B;">
                <div class="card-header ">
                  <h2 class="text-white text-center">
                    สามารถเพิ่มข้อมูลโดยการ อัพโหลดเป็นไฟล์
                  </h2>
                  <p class="text-lg ">
                    สามารถอักโหลดเป็นไฟล์
                    <code class="text-lg text-[#ED9200]">Excel</code> เท่านั้น
                  </p>
                  <form id="excelForm" @submit.prevent="handleExcelFormSubmit">
                    <div class="input-group rounded-full">
                      <input
                        type="file"
                        style="background-color: #8D8D8D;"
                        class="form-control "
                        accept=".xlsx, .xls"
                        ref="fileInputRef"
                        required
                        
                      />
                      <button
                        class="bg-[#009C12] rounded-lg px-4 "
                        type="submit"
                        id=""
                      >
                        บันทึกข้อมูล
                      </button>
                    </div>
                  </form>
                  <form
    id="excelForm"
    @submit.prevent="handleExcelFormSubmit"
    class="flex items-center justify-between bg-gray-800 p-2 rounded-lg"
  >
    <!-- ปุ่มเลือกไฟล์ -->
    <label
      for="file-upload"
      class="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
    >
      เลือกไฟล์
    </label>
    <input
      id="file-upload"
      type="file"
      class="hidden"
      accept=".xlsx, .xls"
      ref="fileInputRef"
      @change="handleFileUpload"
      required
    />

    <!-- แสดงชื่อไฟล์ -->
    <div class="flex-1 mx-2 text-gray-300 bg-gray-500 px-4 py-2 rounded-lg">
      {{ fileName || "ไม่ได้เลือกไฟล์" }}
    </div>

    <!-- ปุ่มบันทึกข้อมูล -->
    <button
      class="bg-[#009C12] text-white px-4 py-2 rounded-lg hover:bg-green-700"
      type="submit"
      :disabled="!fileSelected"
    >
      บันทึกข้อมูล
    </button>
  </form>
                </div>
              </div>

              <div class="container text-white" style="background-color: #252525; padding-top: 25px;">
                <div class=" px-5">
                  <h2 class="text-white text-center">ฟอร์มแบบกรอกข้อมูล</h2>
                  <p>ฟอร์มกรอกข้อมูล <code class="text-lg text-[#ED9200]">ผู้ใช้</code></p>
                </div>
                <div class=" text-white px-5">
                  <div class="row">
                    <div class="col-md-12 ">
                      <form
                        id="dataForm"
                        @submit.prevent="handleDataFormSubmit"
                      >
                        <div class="form-group ">
                          <div class="text-white"><label>ชื่อผู้ใช้ : </label></div>
                          
                          <input
                            class="form-control"
                            placeholder="กรอกชื่อผู้ใช้"
                            type="text"
                            v-model="usernameRef"
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label class="block text-sm font-bold mb-2"
                            >โปรเจ็ค :</label
                          >
                          <div v-if="isLoading" class="text-gray-500">
                            Loading...
                          </div>
                          <div v-else class="flex flex-wrap gap-4">
                            <div
                              v-for="project in projects"
                              :key="project.id"
                              class="flex items-center gap-2 bg-gray-100 p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300"
                            >
                              <input
                                type="checkbox"
                                :id="'project-' + project.id"
                                :value="project.name"
                                v-model="selectedProjects"
                                class="form-checkbox h-5 w-5 text-blue-500 border-gray-300 focus:ring-blue-500 rounded transition duration-200"
                              />
                              <label
                                :for="'project-' + project.id"
                                class="text-sm text-gray-700 font-medium"
                              >
                                {{ project.name }}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="form-label">รายละเอียด</label>
                          <textarea
                            class="form-control"
                            placeholder="กรอกรายละเอียด"
                            rows="3"
                            v-model="detailRef"
                            required
                          ></textarea>
                        </div>
                        <div class="text-center">
                          <button
                            type="submit"
                            class="btn btn-primary mb-4 text-center"
                            :disabled="isLoading"
                          >
                            <span v-if="isLoading">กำลังบันทึก...</span>
                            <span v-else>บันทึกข้อมูล</span>
                          </button>
                        </div>
                      </form>

                      <!-- Popup Modal -->
                      <div
                        v-if="showModal"
                        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                      >
                        <div
                          class="bg-white px-20 py-6 rounded-lg shadow-lg text-center"
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
                              <span class="text-blue-500 font-bold"
                                >กำลังส่งข้อมูล...</span
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div class="text-green-500 mb-4">
                              <svg
                                class="h-6 w-6 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span class="text-lg font-bold"
                                >ส่งข้อมูลสำเร็จ</span
                              >
                            </div>
                            <p
                              v-if="!isFormSubmission"
                              class="text-gray-500 text-sm mt-2"
                            >
                              ไฟล์ :
                              <span class="font-bold">{{
                                uploadedFileName
                              }}</span>
                            </p>
                            <p
                              class="text-gray-700 text-sm whitespace-pre-wrap"
                            >
                              {{ apiResponse }}
                            </p>
                            <button class="btn btn-primary" @click="closeModal">
                              ตกลง
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
  title: "Black-List",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "keywords", content: "" },
    { name: "description", content: "" },
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

const uploadedFileName = ref(""); // ตัวแปรสำหรับเก็บชื่อไฟล์ที่อัปโหลด

const handleExcelFormSubmit = async (event) => {
  event.preventDefault();
  isFormSubmission.value = false; // กำหนดว่าเป็นการอัปโหลดไฟล์

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
          "http://127.0.0.1:8000/black-list-user/fontend/upload-file-user",
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
      "http://127.0.0.1:8000/black-list-user/fontend/upload-file-user",
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
};
</script>

<style>
/* Add custom styles here if necessary */
</style>
