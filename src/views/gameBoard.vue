<script>
import { h } from 'vue';
import { useSessionStore } from '../stores/SessionStore'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'


export default {
    created() {
        console.log('getting game game', this.$route.params.gameId)
        this.$api.getGame(this.$route.params.teamId, this.$route.params.gameId)
            .then(res => {
                console.log('got game', res.data)
                this.game = res.data
            })
            .catch(err => {
                console.log('game get error', err)
            })
    },

    data() {
        const store = useSessionStore()
        return {
            game: {},
            sessionStore: store
        }
    },
  components: {
    DiscordServerIcon
  },
}
</script>

<template>
    <main>
        <div class="container">
            <h1 class="mt-5">Game</h1>
            <div>
                <DiscordServerIcon v-if="game.Guild" :serverId="game.GuildId" :icon="game.Guild.icon" :name="game.Guild.name" />
                Game basics
                - guild logo, name and link
                - action distro countdown
                - game roster
            </div>

            <div class="gameBoard"
                :style="{ gridTemplateColumns: 'repeat(' + this.game.boardWidth + ', 1fr)', gridTemplateRows: 'repeat(' + this.game.boardHeight + ', 1fr)'}">
                <div>
                    I'm a cell
                </div>
            </div>

            <div class="actionPanel">
                Player action panel
                - modes: move, shoot, upgrade, trade
            </div>

        </div>
    </main>
</template>

<style scoped>
.gameBoard {

    display: grid;
    grid-column-gap: 2px;
    grid-row-gap: 2px;
}
</style>