<template>
  <div class="auth-main v1 bg-[#2B2B2B] min-h-screen flex flex-col">
    <div class="auth-wrapper flex flex-col items-center justify-center flex-1">
      <!-- Login Card -->
      <div class="auth-form max-w-md w-full">
        <div class="text-center w-[560px] mx-auto bg-[url(/images/bgpop.png)] bg-cover bg-center bg-no-repeat p-6 rounded-lg">
          <div class="p-6">
            <div class="text-center">
              <img
                src="assets\images\Logo 1.png"
                alt="Authentication"
                class="img-fluid mb-4 w-24 mx-auto rounded-md"
              />
              <h4 class="font-semibold text-white text-lg mb-8">
                Log in with your username.
              </h4>
            </div>

            <!-- Email Input -->
            <div class="form-group mb-4">
              <input
                v-model="email"
                type="text"
                class="form-control block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary custom-placeholder"
                placeholder="Username"
                @keydown.enter="handleLogin"
                style="background-color: #000; color: #fff;border-color: red"
              />
            </div>

            <!-- Password Input -->
            <div class="form-group mb-4 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary custom-placeholder"
                placeholder="Password"
                @keydown.enter="handleLogin"
                style="background-color: #000; color: #fff; border-color: red;"
              />
              <div class="mt-10">
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center"
                  @click="togglePasswordVisibility"
                >
                  <i
                    :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                    aria-hidden="true"
                    class="text-white"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <div class="mt-4 mb-3">
              <button
                type="button"
                @click="handleLogin"
                class="py-2 mb-4 px-[64px] bg-[url(/images/S.png)] bg-cover bg-no-repeat text-white hover:bg-red-900"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup -->
    <div
      v-if="showSuccessPopup"
      class="fixed inset-0 bg-[#2B2B2B] bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-[#252525] p-6 rounded-md shadow-lg text-center border border-red-800">
        <h2 class="text-lg font-semibold mb-4 text-white">ล็อคอินสำเร็จ</h2>
        <p class="text-lg font-semibold mb-4 text-white">
          กำลังพาคุณไปยังหน้าแรก...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "blank", // กำหนดให้ใช้ Layout 'blank'
});

const email = ref("");
const password = ref("");
const showPassword = ref(false); // ใช้สำหรับควบคุมการแสดง/ซ่อนรหัสผ่าน
const showSuccessPopup = ref(false); // ควบคุมการแสดง Popup
const router = useRouter();
let intervalId = null; // เก็บ ID ของ setInterval

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// ฟังก์ชันสำหรับล็อกอินและบันทึก Token พร้อมเวลา
const handleLogin = async () => {
  try {
    const response = await axios.post("https://backlist-user-235021042402.asia-southeast1.run.app/auth/login", {
      username: email.value,
      password: password.value,
    });

    if (response.data && response.data.access_token) {
      const currentTime = Date.now();
      const expiresIn = 30 * 60 * 1000; // 30 นาที

      // บันทึกค่าลงใน localStorage เป็นคีย์แยก
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("full_name", response.data.full_name);
      localStorage.setItem(
        "user_rule",
        JSON.stringify(response.data.user_rule)
      ); // แปลง Array เป็น JSON
      localStorage.setItem("project_name", response.data.project_name);
      localStorage.setItem("token_expiry", currentTime + expiresIn); // เพิ่ม token_expiry

      // แสดง Popup สำเร็จ
      showSuccessPopup.value = true;

      // Redirect ไปหน้าแรกหลัง 2 วินาที
      setTimeout(() => {
        showSuccessPopup.value = false;
        router.push("/");
      }, 1200);
    } else {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert("การเข้าสู่ระบบล้มเหลว โปรดตรวจสอบข้อมูลประจำตัวของคุณ");
  }
};

// ฟังก์ชันสำหรับตรวจสอบ Token ว่ายังใช้ได้อยู่หรือไม่
const checkTokenValidity = () => {
  const tokenExpiry = localStorage.getItem("token_expiry");

  if (!tokenExpiry || Date.now() > Number(tokenExpiry)) {
    // Token หมดอายุแล้ว
    //localStorage.removeItem('access_token');
    //localStorage.removeItem('token_expiry');
    localStorage.clear();
    router.push("/login-page/login"); // Redirect to login page
  }
};

// เรียกใช้การตรวจสอบ Token เป็นระยะ ๆ
onMounted(() => {
  checkTokenValidity(); // ตรวจสอบทันทีเมื่อเปิดหน้า

  // ตั้งค่า setInterval ให้ตรวจสอบ Token ทุก ๆ 1 นาที
  intervalId = setInterval(() => {
    checkTokenValidity();
  }, 60000); // 60000 ms = 1 นาที
});

// ล้าง setInterval เมื่อออกจากคอมโพเนนต์
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId); // ลบ interval เพื่อป้องกัน memory leak
  }
});
</script>

<style>
/* Add TailwindCSS in your project */
  .custom-placeholder::placeholder {
    color: rgb(116, 116, 116); /* กำหนดสีเป็นสีแดง */
    opacity: 2; /* ปรับความโปร่งใส (1 = ชัดเจน) */
  }
</style>
