'use strict'

// import area
import EventEmitter from 'events'
import EventConstants from './eventConstants'
import SocketHandler from './socketHandler'

// import UserAPI from './../userAPI'
import DisplayAPI from './../displayAPI'

// variables area


class Events extends EventEmitter {
    constructor() {
        super()

        this.className = this.constructor.name
        this.eventNamespace = undefined
        this.connections = new Map()

        this.onConnection = this.onConnection.bind(this)
    }

    init(websocket, config, store) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] initialising`)

            this.websocket = websocket
            this.config = config
            this.store = store
            this.eventNamespace = websocket.of(this.config.project.server.api)

            DisplayAPI.init(store)
                // .then(() => { return DisplayAPI.init(store) })

                .then(() => {
                    this.eventNamespace.on(EventConstants.CONNECTION, this.onConnection)
                    return
                })

                .then(() => {
                    resolve()
                })

                .catch(error => {
                    reject(error)
                })

        })

        return promise
    }

    onConnection(socket) {
        console.log(`[${this.className}] connection established with ${socket.id}`)
        let eventHandler = new SocketHandler(this.store, this, socket)

        this.registerConnection(socket.id, eventHandler)
        this.emitEvent(EventConstants.NEW_CONNECTION, eventHandler)
    }

    registerConnection(id, socket) {
        console.log(`[${this.className}] registerConnection ${id}`)

        this.connections.set(id, socket)
    }

    removeConnection(id) {
        console.log(`[${this.className}] removeConnection ${id}`)
        this.connections.delete(id)
    }

    emitEvent(name, value) {
        this.emit(name, value)
    }

    /***********************************************
    *                 help functions
    ************************************************/


}

export default new Events()
