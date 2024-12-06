<script>
import { h } from 'vue';
import { useSessionStore } from '../stores/SessionStore'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'
import { useToast } from "vue-toastification"
import GamePiece from '../components/GamePiece.vue'

export default {
    setup() {
        const toast = useToast()
        console.log(import.meta.env)
        return { toast }
    },
    async created() {
        this.refreshGame()
        const sse = await this.$api.connectToGameEvents(this.$route.params.teamId, this.$route.params.gameId)
        sse.addEventListener("message", ({ data }) => {
            console.log(JSON.parse(data));
            this.refreshGame()
        })
        window.addEventListener("resize", this.windowResize);
        this.windowResize()
    },
    data() {
        const store = useSessionStore()
        return {
            game: {},
            sessionStore: store,
            targetSquares: [],
            queuedAction: null,
            loggedInPlayerId: null,
            devMode: import.meta.env.DEV,
            actnBtnClass: 'btn-group-vertical'
        }
    },
    methods: {
        windowResize(){
            if(window.innerWidth > 575) {
                this.actnBtnClass = 'btn-group-vertical'
            } else {
                this.actnBtnClass = 'btn-group'
            }
        },
        getAPContainerClass(){
            const lp = this.getLoggedInGamePlayer();
            if (lp.status == 'alive') {
                return lp.actions > 0 ? 'btn-success' : 'btn-warning'
            } else {
                return lp.juryVotesToSpend > 0 ? 'btn-success' : 'btn-warning'
            }
            
        },
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
        setupJuryVote(event) {
            if (!this.isCurrentUserPartOfThisGame) {
                return
            }
            const currentPlayer = this.getLoggedInGamePlayer()
            this.showMoveOptions(30)
            this.queuedAction = 'juryVote'
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
            <div class="row">

                <div class="col-sm-3">
                    

                    <div class="gameBar">
                        <p>
                            <RouterLink :to="`/guild/${ game.GuildId }`">
                                <DiscordServerIcon v-if="game.Guild" :serverId="game.GuildId" :icon="game.Guild.icon"
                                :name="game.Guild.name" />
                            </RouterLink>
                        </p>
                        <div v-if="game.id != game.Guild.currentGameId">
                            <div class="alert alert-success" role="alert">
                                This game is over, thanks for playing. gg
                            </div>
                        </div>

                        <div class="actionPanel" v-if="isCurrentUserPartOfThisGame() && game.status == 'active'">

                            <div ref="actionButtonDiv" :class="actnBtnClass" role="group" aria-label="Vertical button group">

                                <button :class="'btn btn-success ' + this.getAPContainerClass()"
                                    style="cursor: default;"
                                    v-tooltip="'You currently have ' + getLoggedInGamePlayer().actions + ' AP to spend on things like movement and healing!'">
                                    <strong v-if="getLoggedInGamePlayer().status == 'alive'"><span class="actionBtnDetail">You have </span>{{ getLoggedInGamePlayer().actions }} AP</strong>
                                    <strong v-if="getLoggedInGamePlayer().status == 'dead'"><span class="actionBtnDetail">You have </span>{{ getLoggedInGamePlayer().juryVotesToSpend }} JP</strong>
                                    <br />
                                    <span v-if="game.status == 'active'" class="apCountdown">
                                        <vue-countdown :time="(new Date(game.nextTickTime)).getTime() - (new Date).getTime()" v-slot="{ days, hours, minutes, seconds }">
                                            <span class="actionBtnDetail">Next AP in </span>~{{ hours?hours+':':'' }}{{ minutes?String(minutes).padStart(2, '0')+' min ':'' }}
                                        </vue-countdown>
                                    </span>
                                </button>
                                
                                <button type="button" @click="setupJuryVote" v-if="getLoggedInGamePlayer().status == 'dead'" :disabled="getLoggedInGamePlayer().juryVotesToSpend < 1" class="btn btn-secondary" v-tooltip="`Vote to haunt a player. Player with most votes get no AP next cycle.`">
                                    🗳️ <span class="actionBtnDetail">Haunt (1 JP)</span>
                                </button>
                                
                                <button type="button" @click="setupMove" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().actions < 1" class="btn btn-secondary" v-tooltip="`Move your piece one space`">
                                    🏃 <span class="actionBtnDetail">Move (1 AP)</span>
                                </button>

                                <button type="button" @click="setupShoot" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().actions < 1" class="btn btn-secondary" v-tooltip="`Shoot another player, destroying one of their hearts`">
                                    💥 <span class="actionBtnDetail">Shoot (1 AP)</span>
                                </button>

                                <button type="button" @click="setupGiveAP" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().actions < 1" class="btn btn-secondary" v-tooltip="`Give a player in range one of your AP`">
                                    🤝 <span class="actionBtnDetail">Give AP (1 AP)</span>
                                </button>

                                <button type="button" @click="setupGiveHP" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().health < 2" class="btn btn-secondary" v-tooltip="`Give a player in range one of your HP`">
                                    💌 <span class="actionBtnDetail">Give HP (1 HP)</span>
                                </button>

                                <button type="button" @click="setupHeal" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().actions < 3" class="btn btn-secondary" v-tooltip="`Add one heart for three AP`">
                                    ❤️ <span class="actionBtnDetail">Heal (3 AP)</span>
                                </button>

                                <button type="button" @click="setupUpgrade" v-if="getLoggedInGamePlayer().status == 'alive'" :disabled="getLoggedInGamePlayer().actions < 3" class="btn btn-secondary" v-tooltip="`Increase your range by one`">
                                    🔧 <span class="actionBtnDetail">Upgrade (3 AP)</span>
                                </button>

                                <button type="button" @click="cancelMove" v-if="queuedAction != null" class="btn btn-danger" aria-label="Close">
                                    🔙 <span class="actionBtnDetail">Cancel</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-sm-9">
                    
                    <div class="rosterHeader" v-if="game.status == 'new'">
                        <h1>Player Roster</h1>
                        <p>These fine folks are opted into the game. You can join with the Discord slash command <code>/infight-join</code> in the game's
                            <a :href="'discord://discord.com/channels/' + game.Guild.id + '/' + game.Guild.gameChannelId">
                            #infight channel</a>! Hurry, if you miss this game, you'll have to wait for the next one. Invite a 
                            friend while you're at it!
                        </p>
                        <div v-if="game.startTime != null">
                            <div class="alert alert-success" role="alert">
                                <vue-countdown :time="(new Date(game.startTime)).getTime() - (new Date).getTime()" v-slot="{ days, hours, minutes, seconds }">
                                    Game starts in: ~{{ hours?hours+':':'' }}{{ minutes?String(minutes).padStart(2, '0')+':':'' }}{{ String(seconds).padStart(2, '0') }}
                                </vue-countdown>
                            </div>
                        </div>

                        <div class="alert alert-warning" v-if="game.minimumPlayerCount > game.GamePlayers.length">
                            The game cannot start. There aren't enough players ({{ game.minimumPlayerCount }}) opted into play yet! Invite a friend, or join yourself!
                        </div>
                    </div>
                    <div class="gameBoard" :style="genGameboardStyle()">

                        <template v-for="gp in game.GamePlayers">
                            <GamePiece :GamePlayer="gp" :isCurrentPlayer="loggedInPlayerId == gp.PlayerId"
                                :isWinner="gp.id == game.winningPlayerId" />
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

                </div>

                <div>
                    <button @click="startGame" class="btn btn-success" v-if="devMode && game.status == 'new'">
                        🏎️ <span class="actionBtnDetail">Start Game</span>
                    </button>
                    <button @click="tickGame" class="btn btn-primary" v-if="devMode && game.status == 'active'">
                        ⏰ <span class="actionBtnDetail">Tick Game</span>
                    </button>
                    <button @click="deleteGame" class="btn btn-danger" v-if="devMode">
                        💀 <span class="actionBtnDetail">Delete Game</span>
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.gameBar {
    text-align: center;
}

.rosterHeader {
    padding-top:20px;
}

.gameBoard {
    display: grid;
    transition: 300ms;
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    background-color: #40474f;
    border: 2px solid #40474f;
    max-width: 1000px;
    /* grid-auto-rows: 1fr; */
    margin-top:4px;
    margin-bottom:50px;
}


@media screen and (max-height: 1070px) {
    .gameBoard {
        max-width: 750px; /* this is actually used to control the height of the gameBoard. setting the height makes cells squish?  */
    }
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

    .actionBtnDetail {
        display: none;
    }
}

@media screen and (max-width: 400px) {

}
.explosion {
    background-image: url(/img/explosion.gif);
    background-size: cover;
    width: 1fr;
    height: 1fr;
    z-index: 30;
    display: none;
}
.apCountdown {
    font-size: x-small;;
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
    background-image: url(/img/pixelHeart.png);
    background-repeat: no-repeat;
    background-position-x: 0;
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

.highlight_juryVote {
    background-color: rgba(255, 123, 0, 0.4);
}

.highlight_juryVote:hover {
    background-color: rgba(255, 123, 0, 0.709);
}
</style>