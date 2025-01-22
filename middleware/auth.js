export default defineNuxtRouteMiddleware((to) => { 
  if (process.client) {
    const token = localStorage.getItem('access_token');
    const tokenExpiry = localStorage.getItem('token_expiry');
    const currentTime = Date.now();

    if (to.path === '/login-page/login') {
      return;
    }

    if (!token || (tokenExpiry && currentTime > tokenExpiry)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiry');
      window.location.href = '/login-page/login';
      return;
    }

    // ตรวจสอบ 401 Unauthorized ผ่าน window fetch interceptor (ถ้า API ส่ง 401)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        // หาก 401 Unauthorized ให้รีไดเรกต์ไปหน้า Login
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login-page/login';
      }
      return response;
    };
  }
});
