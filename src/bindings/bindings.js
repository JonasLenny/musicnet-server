'use strict'

// import area
import Utils          from './../utils/utils'
import Events         from './../api/events/events'
import EventConstants from './../api/events/eventConstants'

// TODO: import spotify
import Spotify        from './spotify/spotify'

// variables area
const bindings = [
    {
        name     : 'spotify',
        instance : Spotify
    }
]

class Bindings {
    constructor() {
        this.className         = this.constructor.name
        this.app               = undefined
        this.store             = undefined

        this.initBindings      = this.initBindings.bind(this)
        this.addSocketListener = this.addSocketListener.bind(this)
        this.onRegister        = this.onRegister.bind(this)
        this.search            = this.search.bind(this)
    }

    init(app, store) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] initialise the following bindings`)

            this.app    = app
            this.store  = store

            this.initBindings(store.getBindings(), app, store)

            .then(() => {
                Events.on(EventConstants.NEW_CONNECTION, this.addSocketListener)
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

    addSocketListener(event) {
        let socketHandler = event

        socketHandler.addListener(EventConstants.REGISTER, (event) => {
            this.onRegister(socketHandler, event)
        })
    }

    /**
    *   sources - Array<String>: list with the names of bindings which shall be included
    *   query   - String: the input to look for
    **/
    search(event) {
        let promise = new Promise((resolve, reject) => {
            console.log(event)

            let sources = ['spotify']
            let query   = event.message.query

            console.log(`[${this.className}] looking for - ${query} - in ${JSON.stringify(sources)}`)

            let resultList = []

            for(let entry of sources) {
                let binding  = bindings.find(x => x.name === entry)
                let instance = binding.instance

                resultList.push(instance.search(query))
            }

            Promise.all(resultList)
            .then(results => {
                let mergedResults = Utils.flatten2DArray(results)

                resolve(mergedResults)
            })

            .catch(error => {
                reject(`Bindings - search > ${error}`)
            })
        })

        return promise
    }

    /***********************************************
    *                 help functions
    ************************************************/

    initBindings(data, app, store) {
        let promise = new Promise((resolve, reject) => {
            let promiseList = []

            for(let entry of bindings) {
                console.log(`[${this.className}] initialise ${entry.name}`)
                // console.log(data)

                let storedData = data.get(entry.name)
                let instance   = entry.instance

                promiseList.push(instance.init(storedData, app, store))
            }

            Promise.all(promiseList)
            .then(promisedList => {
                resolve()
            })
            .catch(error => {
                console.error(error)
                reject()
            })
        })

        return promise
    }

    onRegister(source, event) {
        let type  = event.message.type
        let state = {}

        // IDEA: maybe the configurator needs this too?
        if(type != EventConstants.ROLE_CONFIGURATOR)
            return

        console.log(`[${this.className}] registering event received`)
        console.log(event)

        state.bindings = this.store.getBindings()

        // source.joinRoom(EventConstants.ROOM_USER)
        source.sendMessage(EventConstants.REGISTER_RESPONSE, state)
    }
}

export default new Bindings()
