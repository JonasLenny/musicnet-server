'use strict'

// import area
import express from 'express'
import Routes from './routes'

import UserAPI from './../api/userAPI'

// variables area

/**
 * This class registers routes to get relevant files
 * for users. Like the path where the client app can be found.
 */
class User extends Routes {
    constructor() {
        super('User', 'user')

        this.app = undefined
    }

    init = (app, store) => {
        console.log(`[${this.className}] initialising`)

        this.app = app
        this.store = store

        // register static files
        this.registerStaticFiles(`${this.publicPath}/${this.baseUrl}`)
        this.registerStaticFiles(`${this.publicPath}/assets/images`)

        // register routes
        this.get('/', this.onRoot)

        // init user api
        UserAPI.init(store, this)
        .then(() => { })
        .finally(() => {
            // register everything at the server
            this.registerRouter()
        })
    }

    /**
     * Sends the users application.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    onRoot = (req, res, next) => {
        console.log(`[${this.className}] sending user view`)

        let options = {
            root: `${this.publicPath}/${this.baseUrl}`
        }

        res.sendFile('index.html', options, (error) => {
            if (error)
                next(error)
            else
                console.log(`[${this.className}] user view sent`)
        })
    }

    /***********************************************
    *                 help functions
    ************************************************/
}

export default new User()
