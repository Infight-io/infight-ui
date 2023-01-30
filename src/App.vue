<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

import { useSessionStore } from './stores/SessionStore'
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped>

</style>
