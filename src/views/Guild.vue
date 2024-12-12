<script>
import { useSessionStore } from '../stores/SessionStore'
import DiscordServerIcon from '../components/DiscordServerIcon.vue'
import { useToast } from "vue-toastification"
import GamePiece from '../components/GamePiece.vue'
import { RouterLink } from 'vue-router';

export default {
    setup() {
        const toast = useToast()
        console.log(import.meta.env)
        return { toast }
    },
    async created() {
        this.$api.getGuild(this.$route.params.teamId)
            .then(res => {
                console.log('got guild n stuff', res.data)
                this.guild = res.data
            })
            .catch(err => {
                console.log(`Couldn't get guild`, err)
                this.toast.error(`Couldn't get guild`);
            })
    },
    data() {
        const store = useSessionStore()
        return {
            sessionStore: store,
            guild: {}
        }
    },
    methods: {
        saveGuildSettings() {
            const { id, boardSize, minimumPlayerCount, actionTimerMinutes } = this.guild
            this.$api.saveGuildSettings(id, boardSize, minimumPlayerCount, actionTimerMinutes)
                .then(res => {
                    console.log('Saved guild settings!', res.data)
                    this.toast.success('Saved guild settings')
                })
                .catch(err => {
                    console.log(`Couldn't save guild settings`, err)
                    this.toast.error(`Couldn't save guild settings`);
                })
        },
        placeToEmoji(place) {
            switch (place) {
                case 1:
                    return '🥇'
                case 2:
                    return '🥈'
                case 3:
                    return '🥉'
                default:
                    return ''
            }

        },
        stateToBootstrapFlavor(status) {
            switch (status) {
                case 'new':
                    return 'info'
                case 'active':
                    return 'primary'
                case 'cancelled':
                    return 'warning'
                case 'won':
                    return 'success'
                case 'tied':
                    return 'secondary'
                default:
                    return 'info'
            }
        },
        isLoggedInUserAdminOfGuild() {
            if (!this.sessionStore.id) return false;
            const playerGuilds = this.guild.Players.map(a => a.PlayerGuild)
            for (const playerGuild of playerGuilds) {
                if (playerGuild.isAdmin === true && playerGuild.GuildId === this.guild.id) {
                    return true
                }
            }
            return false
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
                <div class="col-lg-6">
                    <h1 class="mt-5">
                        <DiscordServerIcon :serverId="guild.id" :icon="guild.icon" :name="guild.name" />{{ guild.name }}
                    </h1>
                </div>
                <div class="col-lg-6 mt-5" v-if="isLoggedInUserAdminOfGuild()">
                    <h3>Server Settings</h3>
                    <p>
                        <small>These settings only affect <span class="badge text-bg-info">new</span> and future games.</small>
                    </p>
                    <div class="container" v-if="false">
                        <div class="row">
                            <div class="col-4">
                                <div class="form-floating mb-3">
                                    <input type="time" class="form-control" id="startHour" placeholder="Start Hour"
                                        v-model="guild.activeHoursStart">
                                    <label for="startHour">Start Hour</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-floating mb-3">
                                    <input type="time" class="form-control" id="endHour" placeholder="End Hour"
                                        v-model="guild.activeHoursEnd">
                                    <label for="endHour">End Hour</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-floating mb-3">
                                    <select class="form-control" id="timezone" placeholder="Timezone"
                                        v-model="guild.activeHoursTimezone">
                                        <option v-for="zone in Intl.supportedValuesOf('timeZone')">{{ zone }}</option>
                                    </select>

                                    <label for="timezone">Timezone</label>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <div class="form-floating mb-4">
                                    <input type="number" class="form-control" id="delayPerActionPoint" min="5" max="1440"
                                        v-model="guild.actionTimerMinutes" placeholder="Minutes / Action"
                                        v-tooltip="`The number of minutes between when Infight hands out more Action Points to all living players.`">
                                    <label for="delayPerActionPoint">Minutes per Action</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-floating mb-2">
                                    <input type="number" class="form-control" id="boardSize" v-model="guild.boardSize" min="5" max="30"
                                        placeholder="Board Size">
                                    <label for="boardSize">Board Size</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control" id="minimumPlayers" min="2" max="20"
                                        v-model="guild.minimumPlayerCount" placeholder="Minimum Players">
                                    <label for="minimumPlayers">Minimum Players</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-floating mb-3">
                                    <button class="btn btn-primary" @click="saveGuildSettings">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="row roundedGameBox" v-for="game in guild.Games">
                <div class="col-lg-3">
                    <h3>
                        <RouterLink :to="`/games/${guild.id}/${game.id}`">Game {{ game.id }}</RouterLink> <span
                            :class="'badge text-bg-' + stateToBootstrapFlavor(game.status)">{{ game.status }}</span>
                    </h3>
                    <p>{{ game.createdAt }}</p>

                </div>
                <div class="col-lg-9">
                    <div v-for="gamePlayer in game.GamePlayers" class="playerDood">
                        <strong v-if="!['active', 'new'].includes(game.status)">{{ placeToEmoji(gamePlayer.winPosition)
                            + gamePlayer.winPosition }}.</strong><br />
                        <img :src="'https://cdn.discordapp.com/avatars/' + gamePlayer.Player.id + '/' + gamePlayer.Player.avatar + '.png'"
                            class="playerPic" v-tooltip="gamePlayer.Player.name" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.playerDood {
    display: inline-block;
    text-align: center;
}

.playerPic {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: inline-block;
    margin: 3px 6px;
}

.roundedGameBox {
    border: 1px solid #40474f;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 20px 0;
}
</style>
