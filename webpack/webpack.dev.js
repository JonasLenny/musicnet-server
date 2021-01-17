'use strict'

/*****************************************************************************/
// require area

const path = require('path')
const webpack = require('webpack')
const resolve = require('path').resolve

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require("webpack-merge")

// EPERM error on windows (if not running the prompt in admin mode)
// const CleanWebpackPlugin = require('clean-webpack-plugin')

const rootDir = resolve(__dirname, '../')
const projectConfigPath = `${rootDir}/config.json`

const webpackConfig = require('./webpack.common.js')
const projectConfig = require(projectConfigPath)
const packageJSON = require(rootDir + '/package.json')

/*****************************************************************************/
// variables area

function appendDevSettings(env) {
    const development = projectConfig.development
    const version = packageJSON.version

    const buildPath = development.dev.buildTarget
    const serverPath = development.dev.reactServerPath
    const serverPort = development.dev.reactServerPort

    // the name for the bundled file with the .js ending
    // IDEA: remove the 'hardcoded' assets path
    const outputName = `${projectConfig.project.bundleName}.js`
    const configOutput = `${rootDir}/${buildPath}`

    // the path to the assets folder within the 'src'
    const assetsFolder = `${rootDir}/src/data/assets`
    const assetsOutput = `${rootDir}/${buildPath}/assets`

    let devSettings = {
        output: {
            filename: outputName,
            path: `${rootDir}/${buildPath}`
        },
        // devtool: 'source-map',
        watch: true,
        watchOptions: {
            ignored: /node_modules/
        },
        target: 'node',
        plugins: [
            // new webpack.NamedModulesPlugin(),
            // new webpack.HotModuleReplacementPlugin(),
            // new ManifestPlugin(),
            new CopyWebpackPlugin([

                // // 1. copy assets
                // {
                //     from   : assetsFolder,
                //     to     : assetsOutput,
                // },
                //
                // // 2. copy the config file
                // {
                //     from : projectConfigPath,
                //     to   : configOutput
                // }
            ])
        ]
    }

    return devSettings
}

function mergeSettings(env) {
    let devSettings = appendDevSettings(env)

    return merge(webpackConfig, devSettings)
}

module.exports = mergeSettings
