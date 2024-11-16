<script setup>
import { h } from 'vue';

</script>

<template>
    <main>
        <div class="container">
            <h1 class="mt-5">Frequently Asked Questions</h1>
            <div class="faqContainer">

                <div class="faqItem">
                    <h4>What's infight?</h4>
                    <p>Infight is a cooperative/combative tactics game played on Discord. You team up with your
                        friends to defeat others and vie to be the last player standing! Players periodically receive
                        action points to use to move, shoot, upgrade their firing range, or to trade with other players.
                    </p>
                </div>
                <div class="faqItem">
                    <h4>How do I play?</h4>
                    <p>You need to add Infight to your favorite Discord server from the <a href="/games">Games</a> page.
                        You'll need to be an adminstrator to do this. Once added, there'll be a new <code>#infight</code>
                        channel on your server. Head in there and use the command <code>/infight-join</code> to be part of
                        the next game.
                    </p>
                </div>
            </div>

        </div>
    </main>
</template>

<style scoped>
.faqContainer {
    display: flex;
    flex-direction: row;
}

.faqItem {
    display: inline;
    /* width: 200px; */
    padding: 30px;
    flex-grow: 1;
}
</style>
