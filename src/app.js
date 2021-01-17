'use strict'

import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Server from 'socket.io'

import Store from './store/store'
import System from './routes/system'
import Bindings from './bindings/bindings'
import Events from './api/events/events'

import config from './../config.json'

const port = config.project.server.port
const app = express()
const httpServer = http.createServer(app)
const io = new Server()

class Application {
    constructor() {
        this.className = this.constructor.name
        this.portHandler = this.portHandler.bind(this)

        this.store = new Store()
    }

    init() {
        console.log(`[${this.className}] initialising`)

        // TODO: init the store
        this.store.init()

            // NOTE: do some general stuff
            .then(() => {

                // app.use(this.customRequestHeader)
                app.use(cors())
                app.use(cookieParser())
                // attach the websocket server to the http server
                io.attach(httpServer)

                return
            })

            // NOTE: initialise the events as api
            .then(() => {
                return Events.init(io, config, this.store)
            })

            // NOTE: initialise the bindings
            .then(() => {
                return Bindings.init(app, this.store)
            })

            // NOTE: initialise the system and it's routes
            .then(() => {

                // append the routes to the app
                return System.init(app, this.store)
            })

            // NOTE: let the server listen to the specific port
            .then(() => {
                return httpServer.listen(port, this.portHandler)
            })

            .catch(error => {
                console.error(error)
            })
    }

    portHandler(error) {
        if (error)
            console.log(`[${this.className}] ${error}`)
        else
            console.log(`[${this.className}] listening on ${port}`)
    }

    /***********************************************
    *                 help functions
    ************************************************/

    // customRequestHeader(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //
    //     next();
    // }

}

new Application().init()
