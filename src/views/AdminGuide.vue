<script setup>
import { h } from 'vue';

</script>

<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="mt-5">Server Admin Guide</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-5">
                    <h2 class="mt-4">Installing into your Discord Server</h2>
                    <p>
                        Infight is a board game played with your friends from Discord. Moves made in the game are
                        announced in the Discord channel of your choice.
                        In this guide, you'll add Infight to your discord server, and give it a channel to post in.
                    </p>
                    <ol class="list-group list-group-flush list-group-numbered">
                        <li class="list-group-item">To get started, you first need to log in to Infight.io with your
                            Discord account.</li>
                        <li class="list-group-item">On your <RouterLink to="/"> My Games</RouterLink> list, locate your
                            server and click the Add button.
                            This will prompt you to authorize Infight to <strong>add its bot, and create
                                <code>/commands</code></strong>.</li>
                        <li class="list-group-item">Now that the bot is added, you need a place for it to post. We
                            suggest you create an <strong>#infight</strong> channel on your server.</li>
                        <li class="list-group-item">
                            Tell Infight that this is its channel using the <code>/infight-setting</code> Discord slash
                            command. Run something like <br />
                            <code>
                                    /infight-setting set-channel:#infight
                                </code>
                            <br />
                            Infight should send you a hello message, and start a game for you.
                        </li>
                        <li class="list-group-item">Now the game needs to have the minimum number of players opt in to
                            play with either <code>/infight-join</code>, or they can opt in from the infight.io website.
                        </li>
                    </ol>

                </div>

                <div class="col-lg-5 offset-lg-1">
                    <h2 class="mt-4">Slash Commands</h2>
                    There are a number of Infight Slash Commands that you can use to interact with the game.
                    <ul>
                        <li><code>/infight-join</code> - adds a user to the server's opted in player list</li>
                        <li><code>/infight-leave</code> - removes a user to the server's opted in player list</li>
                        <li><code>/infight-designateadmin</code> - sets a user to be a game admin. Game admins can use
                            the website to change infight game settings</li>
                        <li><code>/infight-setting</code> - allows admins to change tick rate, board size, min players
                            and designated Discord channel</li>
                        <li><code>/infight-rebootgame</code> - <span class="badge text-bg-danger">warning</span> Will
                            cancel the current game and begin a new one</li>
                    </ul>
                </div>
            </div>

        </div>
    </main>
</template>

<style scoped></style>
