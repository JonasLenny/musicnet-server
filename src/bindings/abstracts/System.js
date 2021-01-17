'use strict'

// import area
import express    from 'express'

import Utils      from './../../utils/utils'
import XhrHandler from './../../utils/xhrHandler'
import Routes     from './../../routes/routes'

// variables area
const router = express.Router()

class System {
    constructor(name) {
        // super(name)
        this.className = name
        // this.storedData = undefined
        // this.app        = undefined
        // this.store      = undefined

        console.log(`[${this.className}] abstract System`)
    }

    authenticate() {
        let promise = new Promise((resolve, reject) => {
            reject(`[${this.className}] authenticate not implemented`)
        })

        return promise
    }

    search(query) {
        let promise = new Promise((resolve, reject) => {
            reject(`[${this.className}] search not implemented`)
        })

        return promise
    }

    registerRouter(path) {
        this.app.use(path, router)
    }

    get(path, handler) {
        console.log(`[${this.className}] add get handler for ${path}`)
        router.get(path, handler)
    }
}

export default System
