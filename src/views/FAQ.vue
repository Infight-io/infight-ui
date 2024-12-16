<script setup>
import { h } from 'vue';

</script>

<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="offset-lg-1 col-lg-4">

                    <h2 class="mt-5">Infight Rules</h2>

                    <img src="/img/GoalBlock.png" class="float-end" alt="The Goal Square" style="width:120px; margin-left:18px;">
                    <p>The object of the game is to hold the goal square in the middle of the board. If you're alive and standing
                        on the goal square at the end of the cycle, you'll get a point. The first player to 5 points wins.
                    </p>

                    <p>All players start along the edge of the grid.</p>

                    <p>Every <strong>game interval</strong>, everyone will receive <strong>2
                            Action Points</strong> (AP).</p>
                    <img src="/img/pixelCrown.png" class="float-end" alt="a pretty red heart" style="width:120px;">

                    <p>At any time you like, you can do one of the following actions:</p>
                    <ul>
                        <li>Move to an adjacent, unoccupied square (1 AP)</li>
                        <li>Shoot someone who is within your range (1 AP). Shooting someone removes 1 heart from their
                            health.</li>
                        <li>Heal, to add 1 heart (3 AP)</li>
                        <li>Upgrade your range (3 AP) At the start of the game, everyone has a range of 2. That is, they
                            can shoot or trade with somehow within 2 squares of them. Upgrading your shooting range
                            increases this by 1 square each time.</li>
                        <li>Send gifts of hearts or actions points to any player currently within their range.</li>
                        <li>Shove a player away one square. (1 AP)</li>
                    </ul>

                    <p>If a player is reduced to zero (0) hearts, then they are dead. Any action points the dead player
                        had are transferred to the player who killed them. Dead players respawn next cycle.</p>

                    <img src="/img/pixelSkull.png" class="float-start" alt="skull and crossbones" style="width:120px;">
                    <p>Dead players can have a heart sent to them. This will revive that player who will have 1 heart
                        and 0 AP.</p>

                    <p>Dead players can either start a fire or give another player an extra AP while they're dead.</p>

                    <h4>Notes</h4>

                    <img src="/img/pixelHeart.png" class="float-end" alt="a pretty red heart" style="width:120px;">
                    <p>Every cycle, hearts and bolts will appear on the field. Pick them up to gain a heart or 2-4 AP.</p>

                    <p>The game ends when someone reaches five points, or one player kills all other players.</p>

                    <p>You can't win this game without making some friends and stabbing some backs. Probably.</p>

                </div>
                <div class="offset-lg-1 col-lg-6">
                    <h2 class="mt-5">FAQs</h2>
                    <h4>What's infight?</h4>
                    <p>Infight is a cooperative/combative tactics game played alongside Discord. You team up with your
                        friends to defeat others and vie to be the last player standing! Players periodically receive
                        action points to use to move, shoot, upgrade their firing range, or to trade with other players.
                        Cooperation and subterfuge is a must!
                    </p>

                    <img src="/img/explosion.gif" class="float-end" alt="big bada boom" style="width:120px;">
                    <h4>How do I get started?</h4>
                    <p>Follow our <RouterLink to="/adminGuide">Server Admin Guide</RouterLink> when you add Infight to
                        your Discord server.</p>
                    <p>You need to add Infight to your favorite Discord server from the <RouterLink to="/">Games
                        </RouterLink> page.
                        You'll need to be an adminstrator to do this. Once added, there'll be a new
                        <code>#infight</code>
                        channel on your server. Head in there and use the command <code>/infight-join</code> to be part
                        of the next game.
                    </p>

                    <div class="alert alert-primary" role="alert">
                        A <strong>Discord server admin</strong> needs to <RouterLink to="/adminGuide">add infight
                        </RouterLink>. Ask your administrator very nicely.
                    </div>

                    <h4>How many players do I need?</h4>
                    <p>The more the merrier! Infight is a game of coordination and intrigue. Games really start getting
                        good at a dozen or more players and can be played with many dozens of players.
                    </p>

                    <h4>You mean I can't move again for <em>a whole day?</em></h4>


                    <p><img src="/img/lightningAnimLoop.webp" class="float-start" alt="a pretty red heart"
                            style="width:120px;">
                        Action points do come slowly. The trick is, the timer's not the only thing with action points.
                        Talk to the other players on discord and coordinate how you can use your points together to
                        achieve big things quickly! Remember, you can share AP and HP with others.
                    </p>


                    <h4>Is this Tank Turn Tactics?</h4>
                    <p>Good eye! Infight's gameplay is very much inspired by <a href="https://lukemuscat.com/"
                            target="_blank">Luke Muskat's</a>
                        banned <a href="https://www.youtube.com/watch?v=t9WMNuyjm4w" target="_blank">pen and paper
                            tabletop game.</a> Infight is
                        built from scratch to make this game concept real on the internet!
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
