'use strict'

// import area
import Events         from './events/events'
import EventConstants from './events/eventConstants'

import Bindings       from './../bindings/bindings'

// variables area

/**
*   This class contains all functions for the DisplayAPI
*
*   Available functions:
*       - init(store)

**/
class DisplayAPI {
    constructor() {
        this.className         = this.constructor.name
        this.store             = undefined

        this.addSocketListener = this.addSocketListener.bind(this)
        this.onRegister        = this.onRegister.bind(this)
        this.onSendTrack       = this.onSendTrack.bind(this)
    }

    init(store) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] initialise`)

            this.store = store

            Events.on(EventConstants.NEW_CONNECTION, this.addSocketListener)

            resolve()
        })

        return promise
    }

    addSocketListener(event) {
        let socketHandler = event

        socketHandler.addListener(EventConstants.REGISTER, (event) => {
            this.onRegister(socketHandler, event)
        })
    }

    onSendTrack(source, event) {
        console.log(`[${this.className}] onSendTrack`)
        // console.log(source)
        console.log(event)

        source.sendMessage(EventConstants.SEND_TRACK, event)
    }

    /**************************************************************************
    *
    *                            help functions
    *
    **************************************************************************/

    onRegister(source, event) {
        let type  = event.message.type
        let state = {}

        if(type != EventConstants.ROLE_DISPLAY)
            return

        console.log(`[${this.className}] registering event received`)
        console.log(event)

        let availableBindings = this.store.getBindings()

        state.displayState = this.store.getState()
        state.playlist     = this.store.getPlaylist()
        state.bindings     = this.reduceBindingInformation(availableBindings)

        Events.on(EventConstants.SEND_TRACK, (event) => {
            console.log(`[${this.className}] on send_track`)
            console.log(event)

            this.onSendTrack(source, event)
        })

        source.joinRoom(EventConstants.ROOM_DISPLAY)
        source.sendMessage(EventConstants.REGISTER_RESPONSE, state)
    }

    reduceBindingInformation(list) {
        let reducedBindings = []

        for(let [key, value] of list.entries()) {
            let reduced = {}
            reduced.name  = value.name
            reduced.icon  = value.params.icon
            reduced.token = value.params.access_token

            reducedBindings.push(reduced)
        }

        return reducedBindings
    }
}

export default new DisplayAPI()
