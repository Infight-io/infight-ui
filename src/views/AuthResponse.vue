<script>
import { useSessionStore } from '../stores/SessionStore'
const store = useSessionStore()

let urlParams = new URLSearchParams(window.location.search);

const jwt = urlParams.get('jwt')
store.login(jwt)
//router.push('/')

</script>

<template>
    <main>
        Thanks for logging in!
    </main>
</template>
