'use strict'

// import area
import querystring from 'querystring'

import System from './../abstracts/System'
import Utils from './../../utils/utils'
import RequestHandler from './../../utils/requestHandler'

// variables area
const clientId = '86e10ebdb02e4d7a8cef24cfa77a59b2'
const clientSecret = 'd9341e0adf2b40a48356c87c8ddfdd14'
const clientScope = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private']
const tokenEndpoint = 'https://accounts.spotify.com/api/token'
const authorisationEndpoint = 'https://accounts.spotify.com/authorize'
const searchEndpoint = 'https://api.spotify.com/v1/search'

class Spotify extends System {
    constructor() {
        super('Spotify')

        this.className = this.constructor.name
        this.redirectUri = undefined

        this.onLogin = this.onLogin.bind(this)
        this.onLoginResponse = this.onLoginResponse.bind(this)
        this.search = this.search.bind(this)
        this.refreshToken = this.refreshToken.bind(this)
    }

    init(storedData, app, store) {
        let promise = new Promise((resolve, reject) => {
            // console.log(`[${this.className}] initialise`)
            // console.log(storedData)

            this.storedData = storedData
            this.app = app
            this.store = store

            this.get('/login', this.onLogin)
            this.get('/loginResponse', this.onLoginResponse)

            this.registerRouter('/spotify')

            resolve()
        })

        return promise
    }

    authorise() {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] authenticate with spotify`)
        })

        return promise
    }

    search(param) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] start search with ${param}`)
            console.log(this.storedData)

            let params = this.storedData.params
            let tokenType = params.token_type
            let accessToken = params.access_token
            let query = {
                q: param,
                type: 'track',
                market: 'from_token'
            }

            let options = {
                url: `${searchEndpoint}?${querystring.stringify(query)}`,
                headers: { 'Authorization': `${tokenType} ${accessToken}` },
                json: true
            }

            RequestHandler.promiseGET(options)
                .then(response => {
                    let list = response.body.tracks.items
                    let parsedList = this.parseSearchList(list)

                    resolve(parsedList)
                })
                .catch(error => {
                    console.log(`[${this.className}] search response error`)
                    console.log(error.body)
                    let message = error.body.error
                    console.log(message)

                    if (message.status && message.status === 401) {
                        this.refreshToken()
                            .then(() => {
                                resolve(this.search(param))
                            })
                            .catch(error => {
                                resolve(error)
                            })
                    }
                    else {
                        reject(`Spotify - search > ${error}`)
                    }
                })
        })

        return promise
    }

    checkTokenState() {

    }

    refreshToken() {
        let promise = new Promise((resolve, reject) => {
            let clientPair = `${clientId}:${clientSecret}`
            let authorizationHeader = `Basic ${new Buffer(clientPair).toString('base64')}`
            let storedParams = this.storedData.params

            let options = {
                url: tokenEndpoint,
                headers: { 'Authorization': authorizationHeader },
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: storedParams.refresh_token
                },
                json: true
            }

            RequestHandler.promisePOST(options)
                .then(response => {
                    let body = response.body
                    let storedDataParams = this.storedData.params

                    storedDataParams.access_token = body.access_token
                    this.storedData.params = storedDataParams

                    this.store.updateBinding('spotify', storedDataParams)

                    resolve()
                })
                .catch(error => {
                    reject(`refreshToken() > ${error}`)
                })
        })

        return promise
    }

    onLogin(req, res, next) {
        // console.log(`[${this.className}] login requested`)

        let redirectUri = `http://${req.headers.host}/spotify/loginResponse`
        let state = Utils.getUID()
        let stateKey = 'spotify_auth_state'
        let scope = clientScope
        let query = {
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            state: state,
            scope: scope
        }
        let stringifiedQuery = querystring.stringify(query)


        res.cookie(stateKey, state)


        res.redirect(`${authorisationEndpoint}?${stringifiedQuery}`)
    }

    onLoginResponse(req, res, next) {
        let redirectUri = `http://${req.headers.host}/spotify/loginResponse`
        let clientPair = `${clientId}:${clientSecret}`
        let authorizationHeader = `Basic ${new Buffer(clientPair).toString('base64')}`
        let authOptions = {
            url: tokenEndpoint,
            form: {
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            },
            headers: {
                'Authorization': authorizationHeader
            },
            json: true
        }

        RequestHandler.promisePOST(authOptions)
            .then(response => {
                let bindingData = response.body
                bindingData.icon = 'Spotify_Icon_RGB_Green.png'

                return this.store.addBinding('spotify', bindingData)
            })
            .then(() => {
                next()
            })
            .catch(error => {
                console.log(`onLoginResponse > ${error}`)
            })

    }


    /***********************************************
    *                 help functions
    ************************************************/

    parseSearchList(list) {
        let parsedList = []

        for (let entry of list) {
            let parsedEntry = {}

            parsedEntry.artists = entry.artists
            parsedEntry.trackName = entry.name
            parsedEntry.uri = entry.uri

            parsedList.push(parsedEntry)
        }

        return parsedList
    }

}

export default new Spotify()
