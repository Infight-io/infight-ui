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
      sessionStore: store,
      devMode: import.meta.env.DEV,
      botAppId: import.meta.env.VITE_DISCORD_BOT_APP_ID,
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

      <div class="row">
        <div class="col-sm-7">
          <h2 class="mt-5">My Games</h2>
          <p class="lead">Each Discord can have one game at a time. Be there or be square!</p>

          <div v-if="!sessionStore.isLoggedIn">
            <div class="alert alert-primary" role="alert">
              You need to log in with Discord above to see your servers.
            </div>
          </div>
          <div v-else>
            <div class="serverContainer">
              <div v-for="team in teams" class="serverItem">
                <DiscordServerIcon :serverId="team.id" :icon="team.icon" :name="team.name" />
                <strong class="display-6">{{ team.name }}</strong>
                <div class="discordBtnContainer" v-if="team.isConnected">
                  <div v-if="team.currentGameId">
                    <RouterLink :to="'/games/' + team.id + '/' + team.currentGameId">
                      <button class="btn btn-primary">Play Now</button>
                    </RouterLink>
                  </div>
                </div>
                <div class="discordBtnContainer" v-if="!team.isConnected">
                  <DiscordBtn
                    :url="`https://discord.com/api/oauth2/authorize?client_id=${botAppId}&permissions=275951650832&scope=bot%20applications.commands`"
                    target="_blank">Add to Discord</DiscordBtn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-5">
          <h1 class="mt-5">Betray your Discord Pals!</h1>
          <p class="lead"></p>
          <p>Infight.io is a board game you play alongside your favorite discord servers.
            To win an infight, you need to team up with other players, share resources and
            edge out you friends.
          </p>

          <p><RouterLink to="/FAQ">Check out the rules</RouterLink> and invite your friends!</p>

          <img src="/img/homepageSplash.png" class="img-fluid" alt="an Infight game board">
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
