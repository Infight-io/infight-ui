<script>
import { h } from 'vue';
import { useSessionStore } from '../stores/SessionStore'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'
import { useToast } from "vue-toastification"
import GamePiece from '../components/GamePiece.vue'

export default {
    setup() {
        const toast = useToast()
        return { toast }
    },
    created() {
        this.refreshGame()
    },

    data() {
        const store = useSessionStore()
        return {
            game: {},
            sessionStore: store
        }
    },
    methods: {
        refreshGame() {
            console.log('getting game game', this.$route.params.gameId)
            this.$api.getGame(this.$route.params.teamId, this.$route.params.gameId)
                .then(res => {
                    console.log('got game', res.data)
                    this.game = res.data
                })
                .catch(err => {
                    console.log('game get error', err)
                    this.toast.error("Could not load game", { timeout: false });
                })
        },
        tickGame(event) {
            const router = this.$router
            //alert(`teamid ${this.teamId}!`)
            this.$api.tickGame(this.game.GuildId, this.game.id)
                .then(res => {
                    console.log("ticked game", res)
                    this.refreshGame()
                }).catch(err => {
                    console.log("Error with tickGame", err)
                    this.toast.error("Error ticking game.");
                })
        },
        deleteGame(event) {
            if (!confirm('Really Delete Game?')) {
                return
            }
            const router = this.$router
            //alert(`teamid ${this.teamId}!`)
            this.$api.deleteGame(this.game.GuildId, this.game.id)
                .then(res => {
                    console.log("deleted game", res)
                    router.push('/games/')
                }).catch(err => {
                    console.log("Error with createGame", err)
                    this.toast.error("Error creating game.");
                })
        },
        startGame(event) {
            if (!confirm('Really Begin Game? player list will be locked.')) {
                return
            }
            const router = this.$router
            //alert(`teamid ${this.teamId}!`)
            this.$api.startGame(this.game.GuildId, this.game.id)
                .then(res => {
                    console.log("started game", res)
                    this.toast.success("Game started!");
                    this.refreshGame()
                }).catch(err => {
                    console.log("Error with startGame", err)
                    this.toast.error("Error creating game.");
                })
        },
        setupMove(event) {
            //identify the logged in player and its position
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            this.toast.info(this.sessionStore.id);
            //loop around surrounding squares, adding move highlights
        },
        isCurrentUserPartOfThisGame() {
            return this.getLoggedInGamePlayer() != null
        },
        getLoggedInGamePlayer() {
            if (!this.sessionStore.id) return null

            try {
                for (let i = 0; i < this.game.GamePlayers.length; i++) {
                    const gp = this.game.GamePlayers[i];
                    if (gp.PlayerId == this.sessionStore.id) {
                        return gp
                    }
                }
            } catch (error) {
                return null
            }
            return null
        }
    },
    components: {
        DiscordServerIcon,
        GamePiece
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div>
                <h1 class="mt-5">
                    <DiscordServerIcon v-if="game.Guild" :serverId="game.GuildId" :icon="game.Guild.icon"
                        :name="game.Guild.name" />{{ game.Guild.name }}
                </h1>
                <h5 v-if="game.id == game.Guild.currentGameId" style="color:green">This is the current Active Game</h5>
                <h6>Game is: {{ game.status }}, with {{ game.GamePlayers.length }} players</h6>
                <div v-if="game.status == 'new'">
                    <input type="button" value="Start Game" @click="startGame" />
                </div>
            </div>


            <div class="actionPanel" v-if="isCurrentUserPartOfThisGame()">
                You have {{ getLoggedInGamePlayer().actions }} Action Points (AP)
                <input type="button" value="🏃 Move" @click="setupMove">
                <input type="button" value="💥 Shoot">
                <input type="button" value="🔧 Upgrade">
                <input type="button" value="🎁 Gift AP">
            </div>

            <div class="gameBoard"
                :style="{ gridTemplateColumns: 'repeat(' + this.game.boardWidth + ', 1fr)', gridTemplateRows: 'repeat(' + this.game.boardHeight + ', 1fr)' }">

                <GamePiece v-for="gp in game.GamePlayers" :GamePlayer="gp" />

                <template v-for="x in game.boardWidth">
                    <template v-for="y in game.boardHeight">
                        <div class="gameBoardCell" :style="{ gridRowStart: x, gridColumnStart: y }"></div>
                    </template>
                </template>
            </div>

            <div class="moveList">
                <h3>Moves Made</h3>
            </div>
            <div>
                <button @click="tickGame">Tick Game</button>
                <button @click="deleteGame">Delete Game</button>
            </div>
        </div>
    </main>
</template>

<style scoped>
.gameBoard {
    display: grid;
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    background-color: #40474f;
    border: 2px solid #40474f;
}

.gameBoardCell {
    /* box-shadow: inset 0 0 10px #4848488b; */
    background-color: #212529;
    width: 1fr;
    height: 1fr;
    z-index: 10;
}

.actionPanel {

    input {
        margin: 5px;
    }
}
</style>