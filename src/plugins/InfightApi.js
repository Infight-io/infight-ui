import axios from 'axios';
import { useSessionStore } from '../stores/SessionStore'

export default {
    install: (app, options) => {

        const store = useSessionStore()
        const apiRoot = app.config.globalProperties.$apiHostname

        app.config.globalProperties.$api = {
            getMyGames: async function () {
                return await axios({
                    url: apiRoot + '/myTeams',
                    headers: { 'Authorization': store.jwt }
                })
            },
            createGame: async function (teamId, cycleMinutes, boardSize) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/new',
                    method: 'post',
                    headers: { 'Authorization': store.jwt },
                    data: {
                        cycleMinutes: cycleMinutes,
                        boardSize: boardSize
                    }
                })
            },
            getGame: async function (teamId, gameId) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/' + gameId,
                    method: 'get'
                })
            },
            getGuild: async function (teamId) {
                return await axios({
                    url: apiRoot + '/guild/' + teamId,
                    method: 'get'
                })
            },
            saveGuildSettings: async function (id, boardSize, minimumPlayerCount, actionTimerMinutes) {
                return await axios({
                    url: apiRoot + '/guild/' + id + '/settings',
                    method: 'post',
                    headers: { 'Authorization': store.jwt },
                    data: {
                        boardSize: boardSize,
                        minimumPlayerCount: minimumPlayerCount,
                        actionTimerMinutes: actionTimerMinutes
                    }
                })
            },
            postGuildOptIn: async function (teamId, optIn) {
                return await axios({
                    url: apiRoot + '/guild/' + teamId + '/optIn',
                    method: 'post',
                    headers: { 'Authorization': store.jwt },
                    data: {
                        optIn: optIn
                    }
                })
            },
            tickGame: async function (teamId, gameId) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/' + gameId + '/tick',
                    method: 'post'
                })
            },
            deleteGame: async function (teamId, gameId) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/' + gameId,
                    method: 'delete'
                })
            },
            startGame: async function (teamId, gameId) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/' + gameId + '/start',
                    method: 'post'
                })
            },
            connectToGameEvents: async function (teamId, gameId) {
                const sse = new EventSource(apiRoot + '/games/' + teamId + '/' + gameId + '/events');
                return sse;
                sse.addEventListener("message", ({ data }) => {
                    console.log(JSON.parse(data));
                })
            },
            actInGame: async function (teamId, gameId, action, targetX, targetY) {
                return await axios({
                    url: apiRoot + '/games/' + teamId + '/' + gameId + '/act',
                    method: 'post',
                    headers: { 'Authorization': store.jwt },
                    data: {
                        action: action,
                        targetX: targetX,
                        targetY: targetY
                    }
                })
            }
        }

    }
}