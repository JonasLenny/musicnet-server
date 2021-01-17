'use strict'

/******************************************************************************/
// import area
import xhr     from 'xhr'
import request from 'request'

/******************************************************************************/
// variables area

class XhrHandler {
    constructor() {

    }

    promiseGET(path, file) {
        let promise = new Promise((resolve, reject) => {
            let endpoint   = `${path}/${file}`
            let xhrOptions = {
                json: true
            }

            xhr.get(endpoint, xhrOptions, (error, response, body) => {
                if(response.statusCode >= 400)
                    reject(response)
                else
                    resolve(response)
            })
        })

        return promise
    }

    promisePOST(options) {
        console.log(`[${this.className}] promisePOST`)
        console.log(`[${this.className}] send post to ${options.url}`)

        let promise = new Promise((resolve, reject) => {
            request.post(options, (error, response, body) => {
                if(!error && response.statusCode === 200) {
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

export default new XhrHandler()
