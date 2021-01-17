'use strict'

// import area
import uuidv1 from 'uuid/v1'

// variables area

class Utils {
    constructor() {
        this.className = this.constructor.name
    }

    getUID() {
        return uuidv1()
    }

    extendMap(source, name, value) {
        // console.log(`[${this.className}] extending map`)
        let extendedMap = undefined

        if(!source || !name || !value) {
            console.warn(`[${this.className}] one of your passed arguments is undefined`)
            console.warn(arguments)

            return
        }

        extendedMap = new Map(source)

        let nameList = source.get(name)

        // if it's empty, start a new array with listeners
        if(!nameList)
            extendedMap.set(name, [value])

        // if the list contains already listeners, than just append the new
        // one
        else {
            nameList.push(value)
            extendedMap.set(name, nameList)
        }

        return extendedMap
    }

    flatten2DArray(list) {
        let mergedList = []

        for(let row of list)
            for(let column of row)
                mergedList.push(column)

        return mergedList
    }
}

export default new Utils()
