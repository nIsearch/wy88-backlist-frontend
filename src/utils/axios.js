import axios from 'axios';

// เพิ่ม Interceptor
axios.interceptors.response.use(
  (response) => response, // หากไม่มีปัญหา
  (error) => {
    if (error.message.includes('setRequestHeader') || error.response?.status === 401) {
      console.error('Redirecting to login due to invalid token or 401 Unauthorized.');
      localStorage.clear(); // ล้างข้อมูลทั้งหมดใน LocalStorage
      window.location.href = '/login-page/login'; // Redirect ไปหน้า Login
    }
    return Promise.reject(error); // ส่งข้อผิดพลาดกลับ
  }
);

export default axios;
