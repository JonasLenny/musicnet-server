'use strict'

// import area
import Database from './database'

// variables area

class Store {
    constructor() {
        this.className = this.constructor.name
        this.bindings = new Map()
        this.state = undefined
        this.playlist = []
        this.database = new Database()

        this.initBindings = this.initBindings.bind(this)
        this.initState = this.initState.bind(this)
        this.getBindings = this.getBindings.bind(this)
        this.updateBinding = this.updateBinding.bind(this)
        this.addBinding = this.addBinding.bind(this)

        this.getPlaylist = this.getPlaylist.bind(this)
        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
    }

    init() {
        let promise = new Promise((resolve, reject) => {

            this.database.init()
                .then(() => {
                    return this.initBindings()
                })
                .then(() => {
                    return this.initState()
                })
                .then(() => {
                    resolve()
                })
                .catch(error => {
                    console.error(error)
                })
        })

        return promise
    }

    /**
    *   TODO: update the array with the saved db entry
    *
    *
    **/
    addBinding(name, params) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.className}] addBinding for ${name}`)

            let dbEntry = {
                name: name,
                params: params
            }

            this.addBindingMap(dbEntry)
            this.database.save('bindings', dbEntry)
                .then(entry => {
                    console.log(`[${this.className}] Binding ${entry.name} saved`)
                    this.updateBindingMap(entry)

                    resolve()
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
        })

        return promise
    }

    updateBinding(name, data) {
        // console.log(`[${this.className}] update ${name}`)

        let dbEntry = {
            name: name,
            params: data
        }

        let newEntry = this.updateBindingMap(dbEntry)

        this.database.save('bindings', newEntry)
            .then(entry => {
                // console.log(`[${this.className}] Binding ${entry.name} updated`)
                this.updateBindingMap(entry)
            })
            .catch(error => {
                console.error(error)
            })
    }

    getState() {
        return this.state
    }

    getBindings() {
        return this.bindings
    }

    getPlaylist() {
        return this.playlist
    }

    addTrack(track) {
        let promise = new Promise((resolve, reject) => {
            this.playlist.push(track)

            resolve()
        })

        return promise
    }

    removeTrack(track) {
        let promise = new Promise((resolve, reject) => {
            let index = this.playlist.indexOf(track)

            if (!!index) {
                this.playlist.splice(index, 1)
                resolve()
            }
            else {
                reject()
            }
        })
    }

    /***********************************************
    *                 help functions
    ************************************************/

    initBindings() {
        let promise = new Promise((resolve, reject) => {
            this.database.getEntry('bindings', {})
                .then(entries => {

                    for (let entry of entries)
                        this.bindings.set(entry.name, entry)

                    resolve()
                })
                .then(() => {
                    resolve()
                })
        })

        return promise
    }

    initState() {
        this.state = {
            play: false,
            fullscreen: false,
            volume: 50,
        }
    }

    addBindingMap(entry) {
        this.bindings.set(entry.name, entry)
    }

    updateBindingMap(entry) {
        let currentEntry = this.bindings.get(entry.name)
        let newEntry = {}

        newEntry.name = entry.name
        newEntry.params = Object.assign(currentEntry.params, entry.params)

        this.bindings.set(entry.name, newEntry)

        return newEntry
    }
}

export default Store
