<template> 
  <div class="auth-main v1 bg-gray-100 min-h-screen flex flex-col">
    <div class="auth-wrapper flex flex-col items-center justify-center flex-1">
      <!-- Login Card -->
      <div class="auth-form max-w-md w-full">
        <div class="card bg-white shadow-lg rounded-lg">
          <div class="card-body p-6">
            <div class="text-center">
              <img
                src="/image/TikTok-Logo.png"
                alt="Authentication"
                class="img-fluid mb-4 w-24 mx-auto"
              />
              <h4 class="font-semibold text-lg  mb-8">ล็อคอินเข้าสู่ระบบด้วยชื่อผู้ใช้</h4>

            </div>

            <!-- Email Input -->
            <div class="form-group mb-4">
              <input
                v-model="email"
                type="email"
                class="form-control block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ชื่อผู้ใช้"
                @keydown.enter="handleLogin"
              />
            </div>

            <!-- Password Input -->
            <div class="form-group mb-4 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="รหัสผ่าน"
                @keydown.enter="handleLogin"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'" aria-hidden="true"></i>
              </button>
            </div>



            <!-- Login Button -->
            <div class="mt-4 mb-3">
              <button
                type="button"
                @click="handleLogin"
                class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-200"
              >
                เข้าสู่ระบบ
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup> 
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'blank', // กำหนดให้ใช้ Layout 'blank'
});

const email = ref('');
const password = ref('');
const showPassword = ref(false); // ใช้สำหรับควบคุมการแสดง/ซ่อนรหัสผ่าน
const router = useRouter();
let intervalId = null; // เก็บ ID ของ setInterval

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};


// ฟังก์ชันสำหรับล็อกอินและบันทึก Token พร้อมเวลา
const handleLogin = async () => {
  try {
    const response = await axios.post('https://trend-tiktok-235021042402.asia-southeast1.run.app/auth/login', {
      username: email.value,
      password: password.value,
    });

    if (response.data && response.data.access_token) {
      const currentTime = Date.now(); // เวลาปัจจุบัน
      const expiresIn = 30 * 60 * 1000; // ตั้งค่าให้ Token หมดอายุใน 1 ชั่วโมง (60 นาที)

      // บันทึก Token และข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('token_expiry', currentTime + expiresIn);
      localStorage.setItem('full_name', response.data.full_name); // บันทึก full_name ใน localStorage
      localStorage.setItem('username', response.data.username); // บันทึก username ใน localStorage

      // แสดง Alert แจ้งเตือนสำเร็จและปิดอัตโนมัติ
      const alertMessage = document.createElement('div');
      alertMessage.textContent = 'เข้าสู่ระบบสำเร็จ!';
      alertMessage.style.position = 'fixed';
      alertMessage.style.top = '20px';
      alertMessage.style.right = '20px';
      alertMessage.style.backgroundColor = 'green';
      alertMessage.style.color = 'white';
      alertMessage.style.padding = '10px 20px';
      alertMessage.style.borderRadius = '5px';
      document.body.appendChild(alertMessage);

      setTimeout(() => {
        document.body.removeChild(alertMessage); // ลบ Alert ออกจาก DOM
        router.push('/'); // Redirect to homepage or dashboard
      }, 1000); // 1000 ms = 1 วินาที
    } else {
      alert('Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    alert('การเข้าสู่ระบบล้มเหลว. โปรดตรวจสอบข้อมูลประจำตัวของคุณหรือลองอีกครั้งในภายหลัง');
  }
};



// ฟังก์ชันสำหรับตรวจสอบ Token ว่ายังใช้ได้อยู่หรือไม่
const checkTokenValidity = () => {
  const tokenExpiry = localStorage.getItem('token_expiry');

  if (!tokenExpiry || Date.now() > Number(tokenExpiry)) {
    // Token หมดอายุแล้ว
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    
    router.push('/login-page/login'); // Redirect to login page
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
</style>
