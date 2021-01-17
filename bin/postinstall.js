'use strict'

let fs      = require('fs')
let resolve = require('path').resolve

// get src path
let rootDir    = resolve(__dirname, '../')
let sourceFile = `${rootDir}/config.template.json`
let targetFile = `${rootDir}/config.json`

console.log(`[Postinstall] copying ${sourceFile} to ${targetFile}`)
fs.copyFileSync(sourceFile, targetFile)

// TODO: get the client files
