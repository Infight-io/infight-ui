<script setup>
import { useSessionStore } from '../stores/SessionStore'
import router from '../router'
const store = useSessionStore()
let urlParams = new URLSearchParams(window.location.search);

const jwt = urlParams.get('jwt')
store.login(jwt)
router.push('/')

</script>

<template>
    <main>
        Thanks for logging in!
    </main>
</template>
