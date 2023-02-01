<script>
import { useSessionStore } from '../stores/SessionStore'
import AddToDiscordBtn from '../components/AddToDiscordBtn.vue'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'

export default {
  data() {
    const store = useSessionStore()
    return {
      teams: [],
      sessionStore: store
    }
  },
  components: {
    AddToDiscordBtn, DiscordServerIcon
  },
  created() {
    if (this.sessionStore.isLoggedIn) {
      this.$api.getMyGames()
        .then(servers => {
          console.log("filled servers", servers.data)
          servers.data.sort((a, b) => a.name.localeCompare(b.name))
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
          <div v-for="team in teams" class="">
            <h2><DiscordServerIcon :serverId="team.id" :icon="team.icon" :name="team.name" />{{ team.name }}
              <AddToDiscordBtn :serverId="team.id" />
            </h2>
          </div>
          <!-- https://cdn.discordapp.com/icons/880974616754012220/a_08d8e37712f1c7fa1383b162cf79cb3a.webp?size=96 -->
      </div>880974616754012220
    </div>
  </main>
</template>

<style scoped>
</style>

