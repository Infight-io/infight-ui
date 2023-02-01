<script>
export default {
    props: {
        serverId: String,
        icon: String,
        name: String,
        size: Number
    },
    computed: {
        hasIcon() {
            console.log()
            return this.icon != null && this.icon != 'null'
        },
        serverAcronym() {
            return this.name.split(' ').map(str => str[0]).join('')
        }
    }
}
</script>

<template>
    <div class="serverIcon">
        <img v-if="hasIcon" :src="'https://cdn.discordapp.com/icons/' + serverId + '/' + icon + '.webp?size=128'" />
        <div v-else>
            {{ serverAcronym }}
        </div>
    </div>
</template>

<style scoped>
.serverIcon {
    border-radius: 100%;
    background-color:gray;
    display:inline-block;
    height:96px;
    width:96px;
    text-align: center;
    font-size: 50px;
    margin-right: 10px;
}
.serverIcon img {
    height:96px;
    width:96;
    border-radius: 100%;
}
</style>