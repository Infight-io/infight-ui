<script>
import { h } from 'vue';
import { useToast } from "vue-toastification";

export default {
    setup() {
      const toast = useToast()
      return { toast }
    },
    data() {
        return {
            cycle: 60,
            size: 10,
            teamId: this.$route.params.teamId
        }
    },
    methods: {
        startGame(event) {
            const router = this.$router
            //alert(`teamid ${this.teamId}!`)
            this.$api.createGame(this.teamId, this.cycle, this.size)
                .then(game => {
                    console.log("created game", game.data)
                    router.push('/games/' + game.data.GuildId + '/' + game.data.id)
                }).catch(err => {
                    console.log("Error with createGame", err)
                    this.toast.error("Error creating game.");
                })
        }
    }
}

</script>

<template>
    <main>
        <div class="container">
            <h1 class="mt-5">New Game</h1>
            <p class="lead">This is it, you're instigating a fight! Pick how often players get new actions,
                and how much room they'll have to move.</p>

            <h2>Cycle Time</h2>
            <p>Every cycle, all living players are given an action point to either move, attack, trade or increase
                their range.</p>
            <div class="optionContainer">
                <div class="optionItem">
                    <input type="radio" name="cycle" value="1440" id="cycle24" v-model="cycle"> <label for="cycle24">24
                        Hours</label>
                </div>
                <div class="optionItem">
                    <input type="radio" name="cycle" value="480" id="cycle8" v-model="cycle"> <label for="cycle8">8
                        Hours</label>
                </div>
                <div class="optionItem">
                    <input type="radio" name="cycle" value="60" id="cycle1" v-model="cycle"> <label for="cycle1">1
                        Hour</label>
                </div>
                <div class="optionItem">
                    <input type="radio" name="cycle" value="1" id="cycle1" v-model="cycle"> <label for="cycle1">1 Minutes</label>
                </div>
            </div>



            <h2>Map Size</h2>
            <div class="optionContainer">
                <div class="optionItem">
                    <input type="radio" name="mapsize" value="5" id="mapsize5" v-model="size"> <label
                        for="mapsize5">Tiny:
                        5 x
                        5</label>
                </div>
                <div class="optionItem">
                    <input type="radio" name="mapsize" value="10" id="mapsize10" v-model="size"> <label
                        for="mapsize10">Small:
                        10 x
                        10</label>
                </div>
                <div class="optionItem">
                    <input type="radio" name="mapsize" value="20" id="mapsize20" v-model="size"> <label
                        for="mapsize20">Large: 20 x
                        20</label>
                </div>
            </div>
            <div style="text-align: center;">
                <input type="button" value="Create Game" @click="startGame" />
            </div>
        </div>
    </main>
</template>

<style scoped>
.optionContainer {
    display: flex;
    flex-direction: row;
}

.optionItem {
    display: inline;
    text-align: center;
    margin: 30px;
    padding: 30px;
    flex-grow: 1;
    border: 1px solid gray;
    font-size: x-large;

}
</style>