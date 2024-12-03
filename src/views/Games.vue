<script>
import { useSessionStore } from '../stores/SessionStore'
import DiscordBtn from '../components/DiscordBtn.vue'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'
import { RouterLink } from 'vue-router';

export default {
  data() {
    const store = useSessionStore()
    return {
      teams: [],
      sessionStore: store
    }
  },
  components: {
    DiscordBtn, DiscordServerIcon
  },
  created() {
    if (this.sessionStore.isLoggedIn) {
      this.$api.getMyGames()
        .then(servers => {
          console.log("filled servers", servers.data)
          servers.data.sort((a, b) => {

            if (a.isConnected && !b.isConnected) {
              return -1;
            } else if (!a.isConnected && b.isConnected) {
              return 1;
            } else {
              // If boolean values are equal, sort by the string property
              return a.name.localeCompare(b.name);
            }

          })
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

      <div v-if="!sessionStore.isLoggedIn">
        <h2>Log in to see your teams</h2>
      </div>
      <div v-else>
        <div class="serverContainer">
          <div v-for="team in teams" class="serverItem">
            <DiscordServerIcon :serverId="team.id" :icon="team.icon" :name="team.name" />
            <strong class="display-6">{{ team.name }}</strong>
            <div class="discordBtnContainer" v-if="team.isConnected">
              <div v-if="team.currentGameId">
                <RouterLink :to="'/games/' + team.id + '/' + team.currentGameId">Go to game</RouterLink>
              </div>
              <div v-if="!team.currentGameId">
                <RouterLink :to="'/games/' + team.id + '/new'">Create game</RouterLink>
              </div>
            </div>
            <div class="discordBtnContainer" v-if="!team.isConnected">
              <DiscordBtn
                url="https://discord.com/api/oauth2/authorize?client_id=1068711122556948490&permissions=275951650832&scope=bot%20applications.commands"
                target="_blank">Add to Discord</DiscordBtn><!-- TODO: bind that client_id to a config setting -->
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.serverContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.serverItem {
  flex: 60%;
  flex-wrap: nowrap;
  border-radius: 20px;
  border: solid 1px #36393f;
  padding: 20px;
  /* margin-left:20%; */
  margin-bottom: 30px;
}

.discordBtnContainer {
  float: right !important;
  margin-top: 18px;
}
</style>
