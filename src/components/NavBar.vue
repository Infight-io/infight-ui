<script setup>
defineProps({
  currentTab: {
    type: String,
    required: true
  }
})
</script>

<template>
  
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><RouterLink class="nav-link px-2 text-secondary" to="/">Home</RouterLink></li>
          <li><RouterLink class="nav-link px-2 text-white" to="/about">About</RouterLink></li>
        </ul>

        <div class="text-end">
          <button type="button" class="btn btn-outline-light me-2">Login</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .butt { color:brown }
</style>
