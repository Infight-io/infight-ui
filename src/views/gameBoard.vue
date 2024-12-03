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
    async created() {
        this.refreshGame()
        const sse = await this.$api.connectToGameEvents(this.$route.params.teamId, this.$route.params.gameId)
        sse.addEventListener("message", ({ data }) => {
            console.log(JSON.parse(data));
            this.refreshGame()
        })
    },

    data() {
        const store = useSessionStore()
        return {
            game: {},
            sessionStore: store,
            targetSquares: [],
            queuedAction: null,
            loggedInPlayerId: null
        }
    },
    methods: {
        refreshGame() {
            console.log('getting game', this.$route.params.gameId)
            this.$api.getGame(this.$route.params.teamId, this.$route.params.gameId)
                .then(res => {
                    console.log('got game', res.data)
                    this.game = res.data
                    const lip = this.getLoggedInGamePlayer()
                    this.loggedInPlayerId = lip.PlayerId
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
        setupHeal(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            if (confirm("Are you sure you want to add a heart?")) {
                this.queuedAction = 'heal'
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
                    if (this.queuedAction == 'shoot') {
                        this.$refs.explosion.style.display = 'inline'
                        this.$refs.explosion.style.gridColumnStart = parseInt(targetX) + 1
                        this.$refs.explosion.style.gridRowStart = parseInt(targetY) + 1
                        setTimeout(() => {
                            this.$refs.explosion.style.display = ''
                        }, 1000)
                    }
                    this.toast.success(res.data);
                    this.cancelMove()
                    this.refreshGame()
                }).catch(err => {
                    this.cancelMove()
                    console.log("Error with actInGame", err)
                    this.toast.error(err.response.data);
                })
        },
        isCurrentUserPartOfThisGame() {
            return this.getLoggedInGamePlayer() != null
        },
        hoursUntil(targetTime) {
            const now = new Date()
            const targetDate = new Date(targetTime)

            const timeDifference = targetDate.getTime() - now.getTime()
            const hoursDifference = timeDifference / (1000 * 60 * 60)

            return hoursDifference.toFixed(1)
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
        },
        genGameboardStyle() {
            if (this.game.status == 'new') {
                return { backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' };
            } else {
                return { gridTemplateColumns: 'repeat(' + this.game.boardWidth + ', 1fr)', gridTemplateRows: 'repeat(' + this.game.boardHeight + ', 1fr)' }
            }

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

            <div class="gameBar">
                <h3 class="mt-5">
                    <DiscordServerIcon v-if="game.Guild" :serverId="game.GuildId" :icon="game.Guild.icon"
                        :name="game.Guild.name" />{{ game.Guild.name }}
                </h3>
                <h5 v-if="game.id != game.Guild.currentGameId" style="color:orange">Not current game</h5>
                <h6>Game is <strong>{{ game.status }}</strong> with
                    <strong>{{ game.GamePlayers.length }}</strong><span v-if="game.status == 'new'"><strong>/{{ game.minimumPlayerCount }}</strong></span> players</h6>
                <div v-if="game.status == 'new'">
                    <div v-if="game.minimumPlayerCount > game.GamePlayers.length" style="color:orange;">
                        There aren't enough players opted into play yet! 
                    </div>
                    <div v-if="game.startTime != null" style="color:lime;">
                        Game starts in: ~{{ hoursUntil(game.startTime) }} hour
                    </div>
                    <div>
                        Invite a friend to join with the Discord command <code>/infight-join</code> in
                        <a :href="'discord://discord.com/channels/' + game.Guild.id + '/' + game.Guild.gameChannelId">the #infight channel</a>!
                    </div>
                </div>
                <div v-if="game.status == 'active'">
                    Next AP assigned in: ~{{ hoursUntil(game.nextTickTime) }} hours
                </div>

                <div class="actionPanel" v-if="isCurrentUserPartOfThisGame() && game.status == 'active'">
                    <div>You have <strong>{{ getLoggedInGamePlayer().actions }} Action Points (AP)</strong></div>

                    <input type="button" value="🏃 Move (1 AP)" @click="setupMove"
                        :disabled="getLoggedInGamePlayer().actions < 1" />

                    <input type="button" value="💥 Shoot (1 AP)" @click="setupShoot"
                        :disabled="getLoggedInGamePlayer().actions < 1">

                    <input type="button" value="🤝 Give AP (1 AP)" @click="setupGiveAP"
                        :disabled="getLoggedInGamePlayer().actions < 1">

                    <input type="button" value="💌 Give HP (1 HP)" @click="setupGiveHP"
                        :disabled="getLoggedInGamePlayer().health < 2">

                    <input type="button" value="❤️ Heal (3 AP)" @click="setupHeal"
                        :disabled="getLoggedInGamePlayer().actions < 3">

                    <input type="button" value="🔧 Upgrade (3 AP)" @click="setupUpgrade"
                        :disabled="getLoggedInGamePlayer().actions < 3">

                    <input type="button" value="❌ Cancel" @click="cancelMove" v-if="queuedAction != null" />
                </div>


                <div>
                    <h5 style="padding-top:20px;">Dev Tools</h5>
                    <button @click="startGame" v-if="game.status == 'new'">Start Game</button>
                    <button @click="tickGame" v-if="game.status == 'active'">Tick Game</button>
                    <button @click="deleteGame">Delete Game</button>
                </div>
            </div>

            <div class="gameBoard" :style="genGameboardStyle()">

                <template v-for="gp in game.GamePlayers">
                    <GamePiece :GamePlayer="gp" :isCurrentPlayer="loggedInPlayerId == gp.PlayerId" />
                </template>

                <template v-for="heartLocation in game.boardHeartLocations">
                    <div class="heartContainer"
                        :style="{ gridColumnStart: heartLocation[0] + 1, gridRowStart: heartLocation[1] + 1 }"
                        v-tooltip="'Move here to gain a heart!'"></div>
                </template>

                <template v-for="x in game.boardWidth">
                    <template v-for="y in game.boardHeight">
                        <div class="gameBoardCell" :style="{ gridRowStart: x, gridColumnStart: y }"></div>
                    </template>
                </template>

                <template v-for="target in targetSquares">
                    <div :class="'highlightCell highlight_' + queuedAction"
                        :style="{ gridColumnStart: target[0] + 1, gridRowStart: target[1] + 1 }"
                        @click="actionTargetClick" :data-x="target[0]" :data-y="target[1]"></div>
                </template>
                <div class="explosion" ref="explosion"></div>
            </div>
            <!-- 
            <div class="moveList">
                <h3>Moves Made</h3>
                <table>
                    <thead>
                        <tr>
                            <td>Time</td>
                            <td>Player</td>
                            <td>Move</td>
                            <td>At</td>
                            <td>Target</td>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="move in this.game.Moves.reverse()">
                            <tr>
                                <td>{{ move.createdAt }}</td>
                                <td>{{ move.actingGamePlayerId }}</td>
                                <td>{{ move.action }}</td>
                                <td>{{ move.targetPositionX }}, {{ move.targetPositionY }}</td>
                                <td>{{ move.targetGamePlayerId }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
             -->
        </div>
    </main>
</template>

<style scoped>
.gameBar {
    width: 300px;
    /* background-color: #2b2b2b; */
    position: fixed;
    height: 100%;
    overflow: auto;
}

.gameBoard {
    margin-left: 300px;
    display: grid;
    transition: 300ms;
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    background-color: #40474f;
    border: 2px solid #40474f;
    max-width: 1000px;
}

@media screen and (max-width: 900px) {
    .gameBar {
        width: 100%;
        height: auto;
        position: relative;
    }

    .gameBoard {
        margin-left: 0;
    }
}

@media screen and (max-width: 400px) {}

.explosion {
    background-image: url(/public/explosion.gif);
    background-size: cover;
    width: 1fr;
    height: 1fr;
    z-index: 30;
    display: none;
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

.heartContainer {
    animation: heartBounce 1s infinite alternate ease-in;
    z-index: 20;
    width: 1fr;
    height: 1fr;
    background-image: url(/public/pixelHeart.png);
    background-repeat:no-repeat;
    background-position-x:0;
    background-size: cover;
}

@keyframes heartBounce {
  from {
    background-position-y: -2px;
  }
  to {
    background-position-y: 2px;
  }
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