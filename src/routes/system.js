'use strict'

// import area
import express from 'express'

import User from './user'

import Events from './../api/events/events'
import EventConstants from './../api/events/eventConstants'

// variables area
const router = express.Router()

class System {
    constructor() {
        this.className = this.constructor.name
        this.app = undefined

        this.requestLogger = this.requestLogger.bind(this)
        this.registerRouter = this.registerRouter.bind(this)
    }

    init(app, store) {
        let promise = new Promise((resolve, reject) => {
            this.app = app
            this.store = store

            router.use(this.requestLogger)

            // TODO: remove this
            router.get('/', (req, res) => {
                res.header('Content-type', 'text/html')
                return res.end('<h1>Hello, this will be the configurator in a few days!</h1>')
            })

            this.registerRouter('/', router)
            // TODO: end

            User.init(app, this.store)
            // Playlist.init(app)
            // Configurator.init(app)

            resolve()
        })

        return promise
    }

    requestLogger(req, res, next) {
        console.log(`[${this.className}] request received: ${req.url} ${req.method}`)

        next()
    }

    registerRouter(path, route) {
        console.log(`[${this.className}] register router for ${path}`)
        this.app.use(path, route)
    }

    /***********************************************
    *                 help functions
    ************************************************/

}

export default new System()
