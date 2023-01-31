<script>
import { useSessionStore } from '../stores/SessionStore'

export default {
  data() {
    const store = useSessionStore()
    return {
      teams: [],
      sessionStore: store
    }
  },
  created() {
    if (this.sessionStore.isLoggedIn) {
      this.$api.getMyGames()
        .then(servers => {
          console.log("filled servers", servers.data)
          this.teams = servers.data
        }).catch(err => {
          console.log("Error with getMyGames", err)
        })
    }
  }
}
</script>

<template>
  <main>
    <div class="container">
      <h1 class="mt-5">My Games</h1>
      <p class="lead">Every Discord server can have one game.</p>
      <p>Invite infight to all of your servers!</p>
      <div v-if="!sessionStore.isLoggedIn">
        <h2>Log in to see your teams</h2>
      </div>
      <div v-else>
        <h2>Here're your teams!</h2>
        <ul>
          <li v-for="team in teams">
            {{ team.name }}
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {}
}
</style>
