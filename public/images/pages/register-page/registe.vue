<template>
  <div class="auth-main v1">
    <div class="auth-wrapper">
      <div class="auth-form">
        <div class="card my-5">
          <div class="card-body">
            <div class="flex items-center justify-center">
                <img src="/assets/images/authentication/img-auth-register.png" alt="images" class="img-fluid mb-3">
            </div>
            <div class="text-center ">
              <h4 class="f-w-500 mb-1">Register with your email</h4>
              <p class="mb-3">Already have an Account? <a href="../pages/login-v1.html" class="link-primary">Log in</a></p>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <input type="text" class="form-control" placeholder="First Name">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <input type="text" class="form-control" placeholder="Last Name">
                </div>
              </div>
            </div>
            <div class="form-group mb-3">
              <input type="email" class="form-control" placeholder="Email Address">
            </div>
            <div class="form-group mb-3">
              <input type="number" class="form-control" placeholder="Phone number">
            </div>
            <div class="form-group mb-3">
              <input type="password" class="form-control" placeholder="Password">
            </div>
            <div class="form-group mb-3">
              <input type="password" class="form-control" placeholder="Confirm Password">
            </div>
            <div class="d-flex mt-1 justify-content-between">
              <div class="form-check">
                <input class="form-check-input input-primary" type="checkbox" id="customCheckc1" checked="">
                <label class="form-check-label text-muted" for="customCheckc1">I agree to all the Terms & Condition</label>
              </div>
            </div>
            <div class="d-grid mt-4">
              <button type="button" class="btn btn-primary">Create Account</button>
            </div>
             <div class="saprator my-3">
              <span>Or continue with</span>
            </div>
            <div class="text-center">
              <ul class="list-inline mx-auto mt-3 mb-0">
                <li class="list-inline-item">
                  <a href="https://www.facebook.com/" class="avtar avtar-s rounded-circle bg-facebook" target="_blank">
                    <i class="fab fa-facebook-f text-white"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="https://twitter.com/" class="avtar avtar-s rounded-circle bg-twitter" target="_blank">
                    <i class="fab fa-twitter text-white"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="https://myaccount.google.com/" class="avtar avtar-s rounded-circle bg-googleplus" target="_blank">
                    <i class="fab fa-google text-white"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-sidefooter">  
        <hr class="mb-3 mt-4" />
        <div class="row">
          <div class="col my-1">
            <p class="m-0">Made with ♥ by Team <a href="https://themeforest.net/user/phoenixcoded" target="_blank"> Phoenixcoded</a></p>
          </div>
          <div class="col-auto my-1">
            <ul class="list-inline footer-link mb-0">
              <li class="list-inline-item"><a href="../index.html">Home</a></li>
              <li class="list-inline-item"><a href="https://pcoded.gitbook.io/light-able/" target="_blank">Documentation</a></li>
              <li class="list-inline-item"><a href="https://phoenixcoded.support-hub.io/" target="_blank">Support</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank', // กำหนดให้ใช้ Layout 'blank'
});
</script>

<style lang="scss" scoped>

</style>