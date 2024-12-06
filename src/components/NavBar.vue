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
      <div class="d-flex flex-wrap">

        <ul class="nav col-9">
          <li>
            <RouterLink to="/"><img src="/img/infightLogoSmall.png" class="navLogo" alt="infight.io logo" /></RouterLink>
          </li>
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/">My Games</RouterLink>
          </li>
          <!-- <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/leaderboards">Leaderboards</RouterLink>
          </li> -->
          <li>
            <RouterLink class="nav-link px-2 text-secondary" to="/FAQ">Rules &amp; FAQ</RouterLink>
          </li>
        </ul>

        <div class="text-end col-3" v-if="!store.isLoggedIn">
          <DiscordBtn :url="this.$loginUrl">Log In</DiscordBtn>
        </div>

        <div class="text-end col-3" v-if="store.isLoggedIn">
          <div class="dropdown">
            <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="'https://cdn.discordapp.com/avatars/' + store.id + '/' + store.avatar + '.png'" class="discordPic" />
              <strong class="discordName d-none d-lg-inline">{{ store.name }}</strong>
            </button>
            <ul class="dropdown-menu">
              <li><a @click="store.logout()" class="dropdown-item">Logout</a></li>
            </ul>
          </div>
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
  --picSize: 24px;
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
