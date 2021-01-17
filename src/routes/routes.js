'use strict'

// import area
import express from 'express'
import System from './system'

// variables area
const router = express.Router()

/**
 * This class serves as abstract class for route handler.
 * For example the user.js registers his queries via the
 * listed functions.
 */
class Routes {
    constructor(name, baseUrl) {
        this.className = name
        this.baseUrl = baseUrl

        // NOTE: find another way for this...
        this.publicPath = `${__dirname}/../public`
    }

    /**
     * Registers a handler for a certain get path.
     * 
     * @param {string} path 
     * @param {function} handler 
     */
    get = (path, handler) => {
        console.log(`[${this.className}] add get-handler for ${this.base}${path}`)
        router.get(path, handler)
    }

    /**
     * Registers a handler for a certain post path.
     * 
     * @param {string} path 
     * @param {function} handler 
     */
    post = (path, handler) => {
        console.log(`[${this.className}] add post-handler for ${this.base}${path}`)
        router.post(path, handler)
    }

    /**
     * Registers the router with his get/post/put listeners at the express
     * server.
     * 
     * @param {string} path 
     * @param {function} handler 
     */
    registerRouter = () => {
        System.registerRouter(`/${this.baseUrl}`, router)
    }

    /**
     * Registers static file pathes.
     * 
     * @param {string} path 
     * @param {function} handler 
     */
    registerStaticFiles = (path) => {
        if (this.app)
            this.app.use(express.static(path))
        else
            console.warn('this.app is not available, make sure it will be passed to your class.')
    }

    /***********************************************
    *                 help functions
    ************************************************/
}

export default Routes
