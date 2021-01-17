'use strict'

/******************************************************************************/
// import area
import request from 'request'
// import requestPromise from 'request-promise-native'

/******************************************************************************/
// variables area

class RequestHandler {
    constructor() {
        this.className = this.constructor.name
        this.promiseGET = this.promiseGET.bind(this)
        this.promisePOST = this.promisePOST.bind(this)
    }

    promiseGET(options) {
        let promise = new Promise((resolve, reject) => {
            request.get(options, (error, response, body) => {
                if (response.statusCode != 200)
                    reject(response)
                else
                    resolve(response)
            })
        })

        return promise
    }

    promisePOST(options) {
        console.log(`[${this.className}] send post to ${options.url}`)

        let promise = new Promise((resolve, reject) => {
            request.post(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log(`[${this.className}] post response received`)
                    // console.log(response)

                    resolve(response)
                }
                else {
                    console.log('post response error')
                    console.log(response.statusCode)
                    console.error(error)
                    reject(error)
                }
            })
        })

        return promise
    }
}

export default new RequestHandler()
