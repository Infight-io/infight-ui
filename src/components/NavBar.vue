<script>
import { routerKey } from 'vue-router'
import { useSessionStore } from '../stores/SessionStore'
import router from '../router'
import DiscordBtn from '../components/DiscordBtn.vue'

export default {
  data() {
    const store = useSessionStore()

    if (!store.isLoggedIn) {
      const localStorageJWT = localStorage.getItem('jwt')
      if (localStorageJWT) {
        store.login(localStorageJWT)
      }
    }
    return {
      store
    }
  },
  components: {
    DiscordBtn
  }
}
</script>

<template>

  <header class="p-3 text-bg-dark ifNavbar">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <div class="text-start">
          <RouterLink to="/"><img src="/infightLogoSmall.png" class="navLogo" alt="infight.io logo" /></RouterLink>
        </div>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/games">My Games</RouterLink>
          </li>
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/leaderboards">Leaderboards</RouterLink>
          </li>
        </ul>

        <div class="text-end" v-if="!store.isLoggedIn">
          <!-- <a type="button" :href="this.$loginUrl" class="btn btn-outline-light me-2">Login</a> -->
          <DiscordBtn :url="this.$loginUrl">Log In</DiscordBtn>
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
.ifNavbar {
  background-color: #1a1d21 !important;
}
.navLogo {
  --picSize: 40px;
  height: var(--picSize);
  width: var(--picSize);
  border-radius: 20%;
  margin-right: 10px;
}

.discordPic {
  --picSize: 40px;
  height: var(--picSize);
  width: var(--picSize);
  border-radius: 100%;
  margin-right: 10px;
}

.discordName {
  margin-right:10px;
}

.router-link-active {
  font-weight: bold;
  color:white !important;
}
</style>
