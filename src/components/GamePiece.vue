<script>
export default {
    props: {
        GamePlayer: Object,
        isCurrentPlayer: Boolean
    },
    computed: {
        hasIcon() {
            console.log()
            return this.GamePlayer.Player.icon != null && this.icon != 'null'
        },
        playerAcronym() {
            return this.name.split(' ').map(str => str[0]).join('')
        }
    },
    methods: {
        currentGamePieceClass(isCurrent) {
            console.log('isCurrentPiece', this.isCurrentPlayer)
            return this.isCurrentPlayer ? ' currentPlayerGamePiece' : ''
        },
        genStyleProps() {
            if (this.GamePlayer.positionX == null) return {}
            return {
                gridColumnStart: this.GamePlayer.positionX + 1,
                gridRowStart: this.GamePlayer.positionY + 1
            }
        }
    },
    created() {
        // props are exposed on `this`
        console.log('Piece ', this.GamePlayer)
    }
}
</script>

<template>
    <VDropdown :distance="6" :triggers="['hover']" :class="'gamePiece'"
        :style="genStyleProps()">
        <div :class="'avatarBg' + currentGamePieceClass()"
            :style="{ backgroundImage: 'url(https://cdn.discordapp.com/avatars/' + GamePlayer.Player.id + '/' + GamePlayer.Player.avatar + '.png)' }">
        </div>
        
        <div class="deathContainer" v-if="GamePlayer.health == 0"> ☠️ </div>
        <!-- <div>{{ GamePlayer.Player.name }}</div> -->
        <!-- <div class="apDot" v-if="GamePlayer.actions">{{ GamePlayer.actions }}</div> -->
        <!-- <div class="heartContainer">
            <template v-for="n in GamePlayer.health" v-if="GamePlayer.health <4"> ❤️ </template>
<template v-if="GamePlayer.health >= 4"> <strong class="bigHearts">{{GamePlayer.health}} ❤️</strong></template>
</div> -->

        <template #popper v-GamePlayer="{ GamePlayer }">
            <div class="playerPopup">
                <div style="text-align: center;">
                    <strong>{{ GamePlayer.Player.name }}</strong>
                    <strong v-if="this.isCurrentPlayer"> (you)</strong>
                </div>
                <div class="playerStat">
                    <div class="playerStat">❤️ {{ GamePlayer.health }} HP </div>
                    <div class="playerStat">⚡ {{ GamePlayer.actions }} AP </div>
                    <div class="playerStat">🎯 {{ GamePlayer.range }} Range</div>
                </div>


            </div>
        </template>
    </VDropdown>

</template>

<style scoped>
.currentPlayerGamePiece {
    animation: currentPlayerGlow 1s infinite alternate ease-out;
}

@keyframes currentPlayerGlow {
  from {
    box-shadow: 0 0 0px 0px rgba(255, 255, 255, 0.3);
  }
  to {
    box-shadow: 0 0 0px 3px rgba(255, 255, 255, 0.3);
  }
}

.bigHearts {
    text-shadow: 0px 0px 4px black;
    font-weight: bold;
}

.playerPopup {
    padding: 6px;
    font-size: larger;
}

.playerStat {
    font-size: small;
    padding: 6px;
    display: inline;
    font-weight: bold;
}

.gamePiece {
    /* background-color: #212529; */
    aspect-ratio: 1;
    margin: 5px;
    z-index: 20;
    transition: 300ms;
}

.avatarBg {
    border-radius: 100%;
    background-color: gray;
    background-size: cover;
    display: inline-block;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 50px;
    margin-right: 10px;
    position: absolute;
}

.apDot {
    width: 20px;
    height: 20px;
    color: white;
    background: rgb(255, 0, 0);
    background: linear-gradient(149deg, rgba(255, 0, 0, 1) 0%, rgba(193, 45, 45, 1) 100%);
    font-size: small;
    text-align: center;
    font-weight: bold;
    border-radius: 100%;
    margin-left: 80%;
    padding-top: 0;
    box-shadow: 2px 2px solid black;
    /* position: absolute; */
    text-shadow: 0px 0px 4px black;
}

.heartContainer {
    text-align: center;
    font-size: normal;
    ;
    position: absolute;
    padding-top: 55%;
    width: 100%;
    text-shadow: 0px 0px 4px black;
}

.deathContainer {
    text-align: center;
    font-size: 35pt;
    position: absolute;
    padding-top: 15%;
    width: 100%;
    text-shadow: 0px 0px 20px black;
}


.rangeContainer {
    text-align: center;
    font-size: x-small;
    font-weight: bold;
    color: white;
    text-shadow: 0px 0px 4px black;
    position: absolute;
    padding-top: 85%;
    width: 100%;
}
</style>