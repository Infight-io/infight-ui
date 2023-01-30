<script>
import { routerKey } from 'vue-router'
import { useSessionStore } from '../stores/SessionStore'

export default {
  data() {
    const store = useSessionStore()

    if (!store.isLoggedIn) {
      const localStorageJWT = localStorage.getItem('jwt')
      if (localStorageJWT) {
        store.login(localStorageJWT)
      }
    }

    console.log("isLogged: " + store.isLoggedIn)
    return {
      store
    }
  }
}
</script>

<template>

  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">


        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink class="nav-link px-2 text-white" to="/about">About</RouterLink>
          </li>
        </ul>

        <div class="text-end" v-if="!store.isLoggedIn">
          <a type="button" :href="this.$loginUrl" class="btn btn-outline-light me-2">Login</a>
        </div>

        <div class="text-end" v-if="store.isLoggedIn">
          <img :src="'https://cdn.discordapp.com/avatars/' + store.id + '/' + store.avatar + '.png'" class="discordPic" />
          <strong class="discordName">{{ store.name }}</strong>
          <a type="button" @click="store.logout()" class="btn btn-outline-light me-2">Logout</a>
        </div>
        
      </div>
    </div>
  </header>
</template>

<style scoped>
.discordPic {
  height: 50px;
  width:50px;
  border-radius: 100%;
  margin-right: 10px;
}

.discordName {
  margin-right:10px;
}
</style>
