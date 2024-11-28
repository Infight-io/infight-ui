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
            sessionStore: store,
            targetSquares: [],
            queuedAction: null
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
        cancelMove() {
            this.queuedAction = null
            this.targetSquares = []
        },
        showMoveOptions(range) {

            const currentPlayer = this.getLoggedInGamePlayer()
            const originPoint = [currentPlayer.positionX, currentPlayer.positionY]
            const boardWidth = this.game.boardWidth
            const boardHeight = this.game.boardHeight

            this.targetSquares = []

            //loop around surrounding squares, adding move highlights
            //const range = 1;
            const negativeRangeExtent = range * -1;
            for (let x = negativeRangeExtent; x <= range; x++) {
                for (let y = negativeRangeExtent; y <= range; y++) {
                    //make a highlight square
                    const targetX = originPoint[0] + x
                    const targetY = originPoint[1] + y
                    if (targetX < 0 || targetX > boardWidth - 1) continue
                    if (targetY < 0 || targetY > boardHeight - 1) continue
                    if (x == 0 && y == 0) continue
                    this.targetSquares.push([targetX, targetY])
                }
            }
        },
        setupMove(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            this.showMoveOptions(1)
            this.queuedAction = 'move'
        },
        setupUpgrade(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            if (confirm("Are you sure you want to upgrade your range?")) {
                this.queuedAction = 'upgrade'
                this.actionTargetClick(event)
            }
        },
        setupShoot(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            const currentPlayer = this.getLoggedInGamePlayer()
            this.showMoveOptions(currentPlayer.range)
            this.queuedAction = 'shoot'
        },
        setupGiveAP(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            const currentPlayer = this.getLoggedInGamePlayer()
            this.showMoveOptions(currentPlayer.range)
            this.queuedAction = 'giveAP'
        },
        setupGiveHP(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            const currentPlayer = this.getLoggedInGamePlayer()
            this.showMoveOptions(currentPlayer.range)
            this.queuedAction = 'giveHP'
        },
        actionTargetClick(event) {
            console.log('action tgt', event)
            const src = event.srcElement
            const targetX = src.dataset.x
            const targetY = src.dataset.y

            // this.toast.info(this.queuedAction + ' targeted ' + targetX + ', ' + targetY)

            this.$api.actInGame(this.game.GuildId, this.game.id, this.queuedAction, targetX, targetY)
                .then(res => {
                    console.log("Acted!", res)
                    this.toast.success("Action Made!");
                    this.cancelMove()
                    this.refreshGame()
                }).catch(err => {
                    console.log("Error with actInGame", err)
                    this.toast.error(err.response.data);
                })
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
                <input type="button" value="💥 Shoot" @click="setupShoot">
                <input type="button" value="🤝 Give AP" @click="setupGiveAP">
                <input type="button" value="💌 Give HP" @click="setupGiveHP">
                <input type="button" value="🔧 Upgrade" @click="setupUpgrade" v-if="getLoggedInGamePlayer().range < 3">
                <input type="button" value="❌ Cancel" @click="cancelMove" v-if="queuedAction != null" />
            </div>

            <div class="gameBoard"
                :style="{ gridTemplateColumns: 'repeat(' + this.game.boardWidth + ', 1fr)', gridTemplateRows: 'repeat(' + this.game.boardHeight + ', 1fr)' }">

                <template v-for="gp in game.GamePlayers">
                    <GamePiece :GamePlayer="gp" v-if="gp.status == 'alive'" />
                </template>

                <template v-for="x in game.boardWidth">
                    <template v-for="y in game.boardHeight">
                        <div class="gameBoardCell" :style="{ gridRowStart: x, gridColumnStart: y }"></div>
                    </template>
                </template>

                <template v-for="target in targetSquares">
                    <div :class="'highlightCell highlight_' + queuedAction"
                        :style="{ gridColumnStart: target[0] + 1, gridRowStart: target[1] + 1 }" @click="actionTargetClick"
                        :data-x="target[0]" :data-y="target[1]"></div>
                </template>
            </div>

            <!-- <div class="moveList">
                <h3>Moves Made</h3>
            </div> -->
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
    max-width: 1000px;
}

.gameBoardCell {
    /* box-shadow: inset 0 0 10px #4848488b; */
    background-color: #212529;
    width: 1fr;
    height: 1fr;
    z-index: 10;
}

.highlightCell {
    z-index: 30;
    width: 1fr;
    height: 1fr;
    cursor: pointer;
}

.highlight_move {
    background-color: rgba(0, 119, 255, 0.6);
}

.highlight_move:hover {
    background-color: rgba(0, 119, 255, 0.8);
}

.highlight_shoot {
    background-color: rgba(255, 0, 0, 0.4);
}

.highlight_shoot:hover {
    background-color: rgba(255, 0, 0, 0.6);
}

.highlight_giveAP {
    background-color: rgba(0, 255, 17, 0.4);
}

.highlight_giveAP:hover {
    background-color: rgba(0, 255, 17, 0.6);
}

.highlight_giveHP {
    background-color: rgba(238, 0, 255, 0.4);
}

.highlight_giveHP:hover {
    background-color: rgba(238, 0, 255, 0.6);
}

.actionPanel {

    input {
        margin: 5px;
    }
}
</style>