'use strict'

// require area
// const chalk   = require('chalk')
// let Utils     = require('./../utils/utils')
import Datastore from 'nedb'
import path      from 'path'

// variables area
const dataStores = [
    {
        name: 'bindings',
        filename: 'bindings.db',
        parse: [],
        entry: {
            name: '',
            type: '',
            description: {}
        }
    },
    {
        name: 'state',
        filename: 'state.db',
        parse: [],
        entry: {
            name: '',
            source: {},
            target: {}
        }
    }
]

const databaseOptions = {
    // autoload: true,
    // onload: this.loadHandler
}

/**
*   All available functions are listed below and only these functions should
*   be used to ensure a usage without any problems. You can find a short
*   description at each function.
*
*   Available functions:
*     - init()
*     - loadDatabase()
*     - loadDataStore(store)
*     - save(target, file)
*     - delete(target, id, parameter)
*     - getEntry(target, parameter)
*
*   @author:  Jonas Lenny Rook
**/
class Database {
    constructor() {
        this.className = this.constructor.name
        this.db        = {}

        // console.log(`[${this.className}] `)
    }

    /**
    *   This function initialises each component of the database and calls
    *   the resolve function after it.
    *
    *   @see    loadDatabase
    *   @this   {Database}
    *   @return {Promise}
    **/
    init() {
        console.log(`[${this.className}] init`)

        let promise = new Promise((resolve, reject) => {
            this.loadDatabase()

            // init done
            .then(() => {
                console.log(`[${this.className}] initialised`)
                resolve()
            })
            .catch(error => {
                reject(error)
            })
        })

        return promise
    }

    /**
    *   This function iterates over the variable 'datastores' and calls for
    *   each listed store the 'loadDataStore'-function.
    *
    *   @see    loadDataStore
    *   @this   {Database}
    *   @return {Promise}
    **/
    loadDatabase() {
        let promises = []

        for(let store of dataStores)
            promises.push(this.loadDataStore(store))

        return Promise.all(promises)
    }

    /**
    *   This function creates for the passed 'store' object a new 'Datastore'
    *   and loads the data. The data are stored in the *.db-files in the db
    *   folder. At least, the created datastore will be added to the db-entries.
    *
    *   @this   {Database}
    *   @param  {Object} store - An Object with all informations for the store.
    *   @return {Promise} - The resolve function will be called when the data are loaded.
    **/
    loadDataStore(store) {
        let promise = new Promise((resolve, reject) => {

            let options = Object.assign(
                { filename: `${__dirname}\\${store.filename}` },
                databaseOptions
            )

            let datastore = new Datastore(options)
            datastore.loadDatabase(error => {
                if(!error)
                    resolve()
                else
                    reject(`loadDataStore > ${error}`)
            })

            this.db[store.name] = datastore
        })

        return promise
    }

    /**
    *   This function saves the passed 'file' in the store with the name 'target'.
    *   It returns the newly created file because it contains additional informartions.
    *   To make the usage easier, the update- and insert-function of the database are
    *   combined to this function. It checks if the given file exists already and updates
    *   this file with the given new file otherwise, it creates a new entry.
    *
    *   @this   {Database}
    *   @param  {string} target - The name of the store, where the data will be saved.
    *   @param  {Object} file - The object which will be saved.
    *   @return {Promise} - The resolve function returns the saved file.
    **/
    save(target, file) {
        let promise = new Promise((resolve, reject) => {
            let db = this.db[target]

            // check if file exists
            this.getEntry(target, { name: file.name })

            // first, check if you found more than one
            .then(entries => {
                switch (entries.length) {
                    case 0:
                        db.insert(file, (error, newFile) => {
                            if(!error)
                                resolve(newFile)
                            else
                                reject(error)
                        })
                        break;
                    case 1:
                        db.update(
                            { _id: entries[0]._id },
                            file,
                            { returnUpdatedDocs: true },
                            ( error, numReplaced, affectedDocuments ) => {
                                if(!error) {
                                    resolve(affectedDocuments)
                                }
                                else
                                    reject(error)
                        })
                        break;
                    default:
                        reject(`this would override more than one file`)
                }
            })
        })

        return promise
    }

    /**
    *   Deletes the entry with the given 'id' in the given 'target'-store.
    *
    *   @this   {Database}
    *   @param  {string} target - The name of the store, where the data are stored.
    *   @param  {string} id - The id of the entry.
    *   @param  {Object} parameter - An object with additional informartions for the db. [optional]
    *   @return {Promise} - The resolve function is called when the file is deleted.
    **/
    delete(target, id, parameter = {}) {
        let promise = new Promise((resolve, reject) => {
            let db = this.db[target]

            db.remove({ _id: id }, parameter, (error, numRemoved) => {
                if(!error)
                    resolve()
                else
                    reject(error)
            })
        })

        return promise
    }

    /**
    *   With this function you can receive the entries in the 'target'-store.
    *   The 'parameter'-object allows you to define filters for the returned entries.
    *   e.g. with {binding: 'gatt'} you will receive all stored things which have a
    *   property 'binding' with the value 'gatt'.
    *
    *   @this   {Database}
    *   @param  {string} target - The name of the store, where the data are stored.
    *   @param  {Object} parameter - An object with properties to filter the entries. [optional]
    *   @return {Promise} - The resolve function returns the found docs.
    **/
    getEntry(target, parameter) {
        let promise = new Promise((resolve, reject) => {
            let db = this.db[target]

            db.find(parameter, (error, docs) => {
                if(error)
                    reject(error)

                resolve(docs)
            })
        })

        return promise
    }
}

export default Database
