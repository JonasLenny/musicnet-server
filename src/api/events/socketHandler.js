'use strict'

// import area
import EventConstants from './eventConstants'
import Utils from './../../utils/utils'

// variables area

class SocketHandler {
    constructor(store, events, socket) {
        this.className = this.constructor.name
        this.store = store
        this.events = events
        this.socket = socket
        this.eventListeners = new Map()

        this.onDisconnecting = this.onDisconnecting.bind(this)
        this.onTestHandler = this.onTestHandler.bind(this)

        this.init()
    }

    init() {
        console.log(`[${this.socket.id}] initialising SocketHandler`)

        this.socket.on(EventConstants.DISCONNECTING, this.onDisconnecting)
        // this.socket.on(EventConstants.REGISTER, this.onRegister)

        // TODO: remove this
        this.socket.on('test', this.onTestHandler)
    }

    onDisconnecting(reason) {
        console.log(`[${this.className}] disconnecting ${reason}`)
        this.events.removeConnection(this.socket.id)
    }

    onTestHandler(message) {
        console.log(`[${this.className}] test call received:`)
        console.log(message)
    }

    addListener(eventName, callback) {
        console.log(`[${this.socket.id}] add listener for: ${eventName}`)
        this.socket.on(eventName, callback)

        this.eventListeners = Utils.extendMap(this.eventListeners, eventName, callback)
    }

    sendMessage(eventName, value) {
        console.log(`[${this.socket.id}] sendMessage: ${eventName}`)
        console.log(value)
        console.log(this.socket.id)
        this.socket.emit(eventName, value)
    }

    joinRoom(name) {
        this.socket.join(name)
    }


    /***********************************************
    *                 help functions
    ************************************************/

}

export default SocketHandler
