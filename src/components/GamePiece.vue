<script>
export default {
    props: {
        GamePlayer: Object
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
    created() {
        // props are exposed on `this`
        console.log('Piece ', this.GamePlayer)
    }
}
</script>

<template>
    <div class="gamePiece" :style="{gridColumnStart: GamePlayer.positionX + 1, gridRowStart: GamePlayer.positionY+ 1}">
        <div class="avatarBg" :style="{backgroundImage:'url(https://cdn.discordapp.com/avatars/' + GamePlayer.Player.id + '/' + GamePlayer.Player.avatar + '.png)'}">

        </div>
        <div class="apDot">{{ GamePlayer.actions }}</div>
        <div class="heartContainer">
            <template v-for="n in GamePlayer.health"> ❤️ </template>
        </div>
        <div class="rangeContainer">
            Range: {{GamePlayer.range}}
        </div>
    </div>
</template>

<style scoped>
.gamePiece {
    /* background-color: #212529; */
    aspect-ratio: 1;
    margin:5px;
    z-index: 20;
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
    background: rgb(255,0,0);
    background: linear-gradient(149deg, rgba(255,0,0,1) 0%, rgba(193,45,45,1) 100%);
    font-size: small;
    text-align: center;
    font-weight: bold;
    border-radius: 100%;
    margin-left:80%;
    padding-top:0;
    box-shadow: 2px 2px solid black;
    position: absolute;
    text-shadow: 0px 0px 4px black;
}

.heartContainer {
    text-align: center;
    font-size: normal;;
    position: absolute;
    padding-top:55%;
    width:100%;
    text-shadow: 0px 0px 4px black;
}


.rangeContainer {
    text-align: center;
    font-size: x-small;
    font-weight: bold;
    color:white;
    text-shadow: 0px 0px 4px black;
    position: absolute;
    padding-top:85%;
    width:100%;
}


</style>