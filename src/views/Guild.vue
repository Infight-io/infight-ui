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
            guild: {}
        }
    },
    methods: {
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
                default:
                    return 'info'
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
                <div class="col-lg-6">
                    <h1 class="mt-5">
                        <DiscordServerIcon :serverId="guild.id" :icon="guild.icon" :name="guild.name" />{{ guild.name }}
                    </h1>
                </div>
                <div class="col-lg-6 mt-5" v-if="false">
                    <h3>Settings</h3>
                    <div class="form-floating mb-3" data-bs-theme="dark">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                        <label for="floatingInput">Email address</label>
                    </div>
                </div>
            </div>
            <div class="row roundedGameBox" v-for="game in guild.Games">
                <div class="col-lg-3">
                    <h3><RouterLink :to="`/games/${guild.id}/${game.id}`">Game {{ game.id }}</RouterLink> <span :class="'badge text-bg-' + stateToBootstrapFlavor(game.status)">{{ game.status }}</span></h3>
                    <p>{{ game.startTime }}</p>
                    
                </div>
                <div class="col-lg-9">
                    <div v-for="gamePlayer in game.GamePlayers" class="playerDood">
                        <strong v-if="game.status != 'active'">{{ placeToEmoji(gamePlayer.winPosition) + gamePlayer.winPosition }}.</strong><br />
                        <img :src="'https://cdn.discordapp.com/avatars/' + gamePlayer.Player.id + '/' + gamePlayer.Player.avatar + '.png'" class="playerPic" v-tooltip="gamePlayer.Player.name " />
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
    display:inline-block;
}
.roundedGameBox{
    border: 1px solid #40474f;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 20px 0;
}
</style>
